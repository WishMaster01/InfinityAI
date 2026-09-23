import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../configs/db.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import FormData from "form-data";
import { createHash } from "crypto";
import { consumeCredits, refundCredits } from "../utils/credits.js";
import { LruCache } from "../utils/dsa/lruCache.js";
import { PriorityQueue } from "../utils/dsa/priorityQueue.js";
import {
  chunkText,
  repeatedPhrases,
  tokenize,
  wordFrequency,
} from "../utils/dsa/textAnalysis.js";
import { formatAtsReport, scoreResume } from "../utils/dsa/scoring.js";
import {
  assertAllowedMime,
  requireText,
  sanitizeText,
} from "../utils/validators.js";
import { withProviderReliability } from "../services/aiProvider.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const resultCache = new LruCache({ capacity: 100, ttlMs: 30 * 60 * 1000 });

const hashValue = (...values) => {
  const hash = createHash("sha256");
  for (const value of values) hash.update(value);
  return hash.digest("hex");
};

const getContentAnalysis = (content) => ({
  wordCount: tokenize(content).length,
  topKeywords: [...wordFrequency(content).entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count })),
  repeatedPhrases: repeatedPhrases(content, 3, 2)
    .slice(0, 5)
    .map(([phrase, count]) => ({ phrase, count })),
});

const rankGeneratedTitles = (content, prompt) => {
  const keywords = new Set(tokenize(prompt));
  const heap = new PriorityQueue();
  const titles = String(content || "")
    .split("\n")
    .map((title) => title.trim())
    .filter(Boolean);
  for (const [index, title] of titles.entries()) {
    const cleanTitle = title.replace(/^[-*\d.)\s]+/, "");
    const lengthScore = Math.max(0, 30 - Math.abs(cleanTitle.length - 55));
    const keywordScore =
      tokenize(cleanTitle).filter((word) => keywords.has(word)).length * 12;
    heap.enqueue({
      title: cleanTitle,
      priority: lengthScore + keywordScore - index * 0.01,
    });
  }
  const ranked = [];
  while (heap.size)
    ranked.push(`${ranked.length + 1}. ${heap.dequeue().title}`);
  return ranked.join("\n") || content;
};

const requireEnv = (key, label) => {
  if (!process.env[key]) {
    const error = new Error(`${label} is not configured on the server.`);
    error.statusCode = 500;
    error.code = "MISSING_PROVIDER_CONFIG";
    throw error;
  }
};

const normalizeProviderError = (error, provider) => {
  if (error?.status === 404 && provider === "Gemini") {
    const modelError = new Error(
      `Gemini model "${GEMINI_MODEL}" is not available for generateContent. Set GEMINI_MODEL to a supported model such as "gemini-2.5-flash" or "gemini-3.5-flash".`,
    );
    modelError.statusCode = 502;
    modelError.code = "AI_MODEL_UNAVAILABLE";
    return modelError;
  }

  if (error?.response?.status === 401 || error?.response?.status === 403) {
    const authError = new Error(
      `${provider} rejected the API key or account permissions. Check the server .env provider key.`,
    );
    authError.statusCode = 502;
    authError.code = "AI_PROVIDER_AUTH_FAILED";
    return authError;
  }

  if (error?.http_code === 401 || error?.http_code === 403) {
    const authError = new Error(
      `${provider} rejected the API key, account permissions, or enabled feature set.`,
    );
    authError.statusCode = 502;
    authError.code = "AI_PROVIDER_AUTH_FAILED";
    return authError;
  }

  return error;
};

export const generateGeminiText = async (prompt) => {
  requireEnv("GEMINI_API_KEY", "Gemini API key");

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await withProviderReliability(() =>
      model.generateContent(prompt),
    );
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw normalizeProviderError(error, "Gemini");
  }
};

export const generateGeminiMultimodal = async (prompt, buffer, mimeType) => {
  requireEnv("GEMINI_API_KEY", "Gemini API key");
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await withProviderReliability(() =>
      model.generateContent([
        prompt,
        {
          inlineData: {
            data: Buffer.from(buffer).toString("base64"),
            mimeType,
          },
        },
      ]),
    );
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw normalizeProviderError(error, "Gemini");
  }
};

const requireCloudinaryConfig = () => {
  requireEnv("CLOUDINARY_CLOUD_NAME", "Cloudinary cloud name");
  requireEnv("CLOUDINARY_API_KEY", "Cloudinary API key");
  requireEnv("CLOUDINARY_API_SECRET", "Cloudinary API secret");
};

const uploadImageBufferToCloudinary = async (
  buffer,
  mimeType = "image/png",
) => {
  requireCloudinaryConfig();

  const base64Image = `data:${mimeType};base64,${Buffer.from(buffer).toString(
    "base64",
  )}`;

  return cloudinary.uploader.upload(base64Image).catch((error) => {
    throw normalizeProviderError(error, "Cloudinary");
  });
};

const safeUnlink = (filePath) => {
  if (filePath) fs.unlink(filePath, () => {});
};

export const sendError = async (res, error, consumed) => {
  if (consumed?.user?.id && consumed?.tool) {
    try {
      await refundCredits({
        userId: consumed.user.id,
        tool: consumed.tool,
        usageId: consumed.toolUsage?.id,
        reason: error.message,
      });
    } catch (refundError) {
      console.error("Credit refund failed:", refundError);
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    code: error.code,
    requiredCredits: error.requiredCredits,
    availableCredits: error.availableCredits,
  });
};

export const generateImageAsset = async (prompt) => {
  const cacheKey = `image:${hashValue(prompt.trim().toLowerCase())}`;
  let asset = resultCache.get(cacheKey);
  const cacheHit = Boolean(asset);
  if (!asset) {
    requireEnv("CLIPDROP_API_KEY", "Clipdrop API key");
    requireCloudinaryConfig();
    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios
      .post("https://clipdrop-api.co/text-to-image/v1", formData, {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
        timeout: Number(process.env.AI_PROVIDER_TIMEOUT_MS) || 45000,
      })
      .catch((error) => {
        throw normalizeProviderError(error, "Clipdrop");
      });
    const uploaded = await uploadImageBufferToCloudinary(data, "image/png");
    asset = { secureUrl: uploaded.secure_url, publicId: uploaded.public_id };
    resultCache.set(cacheKey, asset);
  }
  return { ...asset, cacheHit };
};

const createCreation = async ({ userId, prompt, content, type, publish }) => {
  return prisma.creation.create({
    data: {
      userId,
      prompt,
      content,
      type,
      publish: publish ?? false,
    },
  });
};

export const generateArticle = async (req, res) => {
  let consumed;

  try {
    const prompt = requireText(req.body.prompt, "Article prompt", 4000);

    consumed = await consumeCredits({
      user: req.user,
      toolSlug: "ai-article-writer",
      metadata: { length: req.body.length },
    });

    const content = await generateGeminiText(prompt);

    await createCreation({
      userId: req.userId,
      prompt,
      content,
      type: "article",
    });

    res.json({
      success: true,
      content,
      analysis: getContentAnalysis(content),
      credits: consumed.user.availableCredits,
    });
  } catch (error) {
    console.error("Error in generateArticle:", error);
    await sendError(res, error, consumed);
  }
};

export const generateBlogTitle = async (req, res) => {
  let consumed;

  try {
    const prompt = requireText(req.body.prompt, "Blog title prompt", 1000);
    const publish = req.body.publish;

    consumed = await consumeCredits({
      user: req.user,
      toolSlug: "blog-title-generator",
    });

    const generatedContent = await generateGeminiText(prompt);
    const content = rankGeneratedTitles(generatedContent, prompt);

    await createCreation({
      userId: req.userId,
      prompt,
      content,
      type: "blog-title",
      publish,
    });

    res.json({
      success: true,
      content,
      analysis: getContentAnalysis(content),
      credits: consumed.user.availableCredits,
    });
  } catch (error) {
    console.error("Error in generateBlogTitle:", error);
    await sendError(res, error, consumed);
  }
};

export const generateImage = async (req, res) => {
  let consumed;

  try {
    const prompt = requireText(req.body.prompt, "Image prompt", 1000);
    const publish = req.body.publish;
    requireEnv("CLIPDROP_API_KEY", "Clipdrop API key");
    requireCloudinaryConfig();

    consumed = await consumeCredits({
      user: req.user,
      toolSlug: "ai-image-generator",
    });

    const { secureUrl: secure_url, cacheHit } =
      await generateImageAsset(prompt);

    await createCreation({
      userId: req.userId,
      prompt,
      content: secure_url,
      type: "image",
      publish,
    });

    res.json({
      success: true,
      secure_url,
      cacheHit,
      credits: consumed.user.availableCredits,
    });
  } catch (error) {
    console.error("Error in generateImage:", error);
    await sendError(res, error, consumed);
  }
};

export const removeImageBackground = async (req, res) => {
  let consumed;
  const image = req.file;

  try {
    requireEnv("CLIPDROP_API_KEY", "Clipdrop API key");
    requireCloudinaryConfig();
    assertAllowedMime(
      image,
      ["image/jpeg", "image/png", "image/webp"],
      "image",
    );

    consumed = await consumeCredits({
      user: req.user,
      toolSlug: "background-remover",
    });

    const imageBuffer = await fs.promises.readFile(image.path);
    const cacheKey = `remove-bg:${hashValue(imageBuffer)}`;
    let secure_url = resultCache.get(cacheKey);
    const cacheHit = Boolean(secure_url);
    if (!secure_url) {
      const formData = new FormData();
      formData.append("image_file", fs.createReadStream(image.path), {
        filename: image.originalname || "image.png",
        contentType: image.mimetype,
      });

      const { data, headers } = await axios
        .post("https://clipdrop-api.co/remove-background/v1", formData, {
          headers: {
            ...formData.getHeaders(),
            "x-api-key": process.env.CLIPDROP_API_KEY,
            accept: "image/png",
          },
          responseType: "arraybuffer",
          timeout: Number(process.env.AI_PROVIDER_TIMEOUT_MS) || 45000,
        })
        .catch((error) => {
          throw normalizeProviderError(error, "Clipdrop");
        });
      ({ secure_url } = await uploadImageBufferToCloudinary(
        data,
        headers["content-type"] || "image/png",
      ));
      resultCache.set(cacheKey, secure_url);
    }

    await createCreation({
      userId: req.userId,
      prompt: "Remove Background from Image",
      content: secure_url,
      type: "image",
    });

    res.json({
      success: true,
      secure_url,
      cacheHit,
      credits: consumed.user.availableCredits,
    });
  } catch (error) {
    console.error("Error in removeImageBackground:", error);
    await sendError(res, error, consumed);
  } finally {
    safeUnlink(image?.path);
  }
};

export const removeImageObject = async (req, res) => {
  let consumed;
  const image = req.file;

  try {
    const object = sanitizeText(req.body.object, 120);
    requireCloudinaryConfig();

    assertAllowedMime(
      image,
      ["image/jpeg", "image/png", "image/webp"],
      "image",
    );

    if (!object) {
      return res
        .status(400)
        .json({ success: false, message: "Object name is required." });
    }

    consumed = await consumeCredits({
      user: req.user,
      toolSlug: "object-remover",
      metadata: { object },
    });

    const imageBuffer = await fs.promises.readFile(image.path);
    const cacheKey = `remove-object:${hashValue(imageBuffer, object.toLowerCase())}`;
    let imageURL = resultCache.get(cacheKey);
    const cacheHit = Boolean(imageURL);
    if (!imageURL) {
      const { public_id } = await cloudinary.uploader
        .upload(image.path)
        .catch((error) => {
          throw normalizeProviderError(error, "Cloudinary");
        });
      imageURL = cloudinary.url(public_id, {
        transformation: [{ effect: `gen_remove:${object}` }],
        resource_type: "image",
      });
      resultCache.set(cacheKey, imageURL);
    }

    await createCreation({
      userId: req.userId,
      prompt: `Removed ${object} from Image`,
      content: imageURL,
      type: "image",
    });

    res.json({
      success: true,
      imageURL,
      cacheHit,
      credits: consumed.user.availableCredits,
    });
  } catch (error) {
    console.error("Error in removeImageObject:", error);
    await sendError(res, error, consumed);
  } finally {
    safeUnlink(image?.path);
  }
};

export const resumeReview = async (req, res) => {
  let consumed;

  try {
    const resume = req.file;
    assertAllowedMime(resume, ["application/pdf"], "resume");

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "File size exceeds 5MB limit.",
      });
    }

    consumed = await consumeCredits({
      user: req.user,
      toolSlug: "resume-review-ai",
    });

    const dataBuffer = await fs.promises.readFile(resume.path);
    const pdfData = await pdf(dataBuffer);
    const jobDescription = sanitizeText(req.body.jobDescription, 20000);
    const analysis = scoreResume(pdfData.text, jobDescription);
    const resumeChunks = chunkText(pdfData.text, {
      maxCharacters: 6000,
      overlapCharacters: 250,
    }).slice(0, 4);
    const prompt = [
      "Review this resume. Prioritize specific, actionable improvements and do not invent facts.",
      jobDescription ? `Target job description:\n${jobDescription}` : "",
      `Resume (safely chunked):\n${resumeChunks.join("\n\n--- CHUNK ---\n\n")}`,
    ]
      .filter(Boolean)
      .join("\n\n");
    const aiReview = await generateGeminiText(prompt);
    const content = `${formatAtsReport(analysis)}\n\n## AI review\n${aiReview}`;

    await createCreation({
      userId: req.userId,
      prompt: "Resume Review",
      content,
      type: "resume-review",
    });

    res.json({
      success: true,
      content,
      analysis,
      credits: consumed.user.availableCredits,
    });
  } catch (error) {
    console.error("Error in resumeReview:", error);
    await sendError(res, error, consumed);
  } finally {
    safeUnlink(req.file?.path);
  }
};
