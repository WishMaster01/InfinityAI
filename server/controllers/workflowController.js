import { createHash } from "crypto";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { v2 as cloudinary } from "cloudinary";
import prisma from "../configs/db.js";
import {
  getWorkflow,
  imagePromptForTool,
} from "../config/toolWorkflows.js";
import { consumeCredits } from "../utils/credits.js";
import { getToolOrThrow } from "../utils/accessControl.js";
import { assertAllowedMime, requireText, sanitizeText } from "../utils/validators.js";
import { analyzeCode, formatCodeAnalysis } from "../utils/dsa/codeIntelligence.js";
import {
  buildTopicMap,
  prepareDocumentContext,
  retrieveRelevantChunks,
} from "../utils/dsa/documentIntelligence.js";
import { LruCache } from "../utils/dsa/lruCache.js";
import { scoreResume, formatAtsReport } from "../utils/dsa/scoring.js";
import { lcsSimilarity } from "../utils/dsa/similarity.js";
import { buildReviewSchedule } from "../utils/dsa/spacedRepetition.js";
import { chunkText, repeatedPhrases, tokenize, wordFrequency } from "../utils/dsa/textAnalysis.js";
import {
  generateGeminiMultimodal,
  generateGeminiText,
  generateImageAsset,
  sendError,
} from "./aiController.js";

const responseCache = new LruCache({ capacity: 200, ttlMs: 20 * 60 * 1000 });
const CODE_ANALYSIS_TOOLS = new Set([
  "ai-code-reviewer",
  "ai-bug-fixer",
  "ai-api-documentation-generator",
  "code-explainer",
  "unit-test-generator",
]);
const IMAGE_FORMATS = {
  "ai-logo-generator": "1:1",
  "ai-thumbnail-generator": "16:9",
  "ai-poster-flyer-generator": "4:5",
  "ai-avatar-generator": "1:1",
};

const hashKey = (...values) => {
  const hash = createHash("sha256");
  for (const value of values) hash.update(String(value || ""));
  return hash.digest("hex");
};

const safeUnlink = (filePath) => {
  if (filePath) fs.unlink(filePath, () => {});
};

const saveCreation = ({ userId, tool, prompt, content }) =>
  prisma.creation.create({
    data: {
      userId,
      prompt: String(prompt || tool.name).slice(0, 4000),
      content,
      type: tool.slug,
      publish: false,
    },
  });

const getTextMetrics = (text) => ({
  wordCount: tokenize(text).length,
  topKeywords: [...wordFrequency(text).entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count })),
  repeatedPhrases: repeatedPhrases(text, 3, 2)
    .slice(0, 5)
    .map(([phrase, count]) => ({ phrase, count })),
});

const runTextWorkflow = async ({ req, tool, workflow }) => {
  const input = requireText(req.body.input, "Input", 50000);
  const context = sanitizeText(req.body.context, 20000);
  const chunks = chunkText(input, { maxCharacters: 6500, overlapCharacters: 250 }).slice(0, 7);
  let deterministicReport = "";
  let analysis = getTextMetrics(input);

  if (CODE_ANALYSIS_TOOLS.has(tool.slug)) {
    const codeAnalysis = analyzeCode(input);
    deterministicReport = formatCodeAnalysis(codeAnalysis);
    analysis = { ...analysis, code: codeAnalysis };
  }

  const prompt = [
    workflow.instruction,
    context ? `Additional context or target:\n${context}` : "",
    deterministicReport ? `Static analysis that must inform the response:\n${deterministicReport}` : "",
    `User input:\n${chunks.join("\n\n--- INPUT CHUNK ---\n\n")}`,
  ].filter(Boolean).join("\n\n");

  const cacheKey = `text:${hashKey(req.userId, tool.slug, input, context)}`;
  let generated = responseCache.get(cacheKey);
  const cacheHit = Boolean(generated);
  if (!generated) {
    generated = await generateGeminiText(prompt);
    responseCache.set(cacheKey, generated);
  }

  let content = deterministicReport ? `${deterministicReport}\n\n## AI analysis\n${generated}` : generated;
  if (["ai-paragraph-rewriter", "ai-grammar-checker"].includes(tool.slug)) {
    analysis.similarityPercentage = Math.round(lcsSimilarity(input, generated) * 100);
    content += `\n\n---\n**Original-to-result LCS similarity:** ${analysis.similarityPercentage}%`;
  }
  if (tool.slug === "flashcard-generator") {
    const schedule = buildReviewSchedule({ cards: Math.max(5, Math.min(30, Math.round(tokenize(input).length / 25))) });
    analysis.reviewSchedule = schedule;
    content += `\n\n## Spaced-repetition schedule\n${schedule.map((item) => `- Round ${item.round}: ${item.reviewAt} (${item.intervalDays}-day interval)`).join("\n")}`;
  }
  if (["ai-mind-map-generator", "ai-notes-generator", "ai-study-assistant"].includes(tool.slug)) {
    analysis.topicMap = buildTopicMap(input);
  }
  return { content, input, analysis, cacheHit };
};

const runAtsWorkflow = async (req) => {
  const input = requireText(req.body.input, "Resume text", 50000);
  const context = requireText(req.body.context, "Job description", 30000);
  const analysis = scoreResume(input, context);
  const prompt = [
    "Provide an ATS-focused resume review. Do not invent qualifications. Prioritize changes that improve relevance to the supplied job description.",
    formatAtsReport(analysis),
    `Job description:\n${context}`,
    `Resume:\n${input}`,
  ].join("\n\n");
  const generated = await generateGeminiText(prompt);
  return {
    input,
    analysis,
    content: `${formatAtsReport(analysis)}\n\n## AI recommendations\n${generated}`,
  };
};

const readPdf = async (file) => {
  assertAllowedMime(file, ["application/pdf"], "PDF");
  const parsed = await pdf(await fs.promises.readFile(file.path));
  if (!parsed.text?.trim()) {
    const error = new Error("No readable text was found in this PDF.");
    error.statusCode = 422;
    throw error;
  }
  return parsed.text;
};

const runDocumentWorkflow = async ({ req, workflow }) => {
  const text = await readPdf(req.file);
  const question = sanitizeText(req.body.input || req.body.question, 4000);
  if (workflow.kind === "file-chat" && !question) {
    const error = new Error("A question about the file is required.");
    error.statusCode = 400;
    throw error;
  }

  if (workflow.kind === "file-chat") {
    const conversationContext = sanitizeText(req.body.context, 12000);
    const retrievalQuery = conversationContext ? `${conversationContext}\n${question}` : question;
    const matches = retrieveRelevantChunks(text, retrievalQuery, 4);
    const sourceContext = matches.map((match, index) => `[Chunk ${index + 1}, relevance ${Math.round(match.priority * 100)}%]\n${match.chunk}`).join("\n\n");
    const content = await generateGeminiText(
      `Answer the latest question only from the supplied document chunks. Use the conversation only to resolve references. If the answer is absent, say so.\n\nConversation: ${conversationContext || "None"}\n\nLatest question: ${question}\n\n${sourceContext}`,
    );
    return { content, input: question, analysis: { retrievedChunks: matches.map((match) => ({ index: match.index, relevance: Math.round(match.priority * 100) })) } };
  }

  const intelligence = prepareDocumentContext(text);
  const task = workflow.kind === "pdf-summary"
    ? "Create a document intelligence report with executive summary, ranked key points, topics, Markdown mind map, five quiz questions with answers, and ten concise flashcards."
    : "Analyze the document for purpose, structure, central claims, evidence, risks, contradictions, topics, and recommended actions.";
  const content = await generateGeminiText(
    `${task}\nDo not invent facts beyond the extracted document.\n\nDetected topic map: ${intelligence.topicMap.breadthFirst.join(" > ")}\n\nImportant source sentences:\n${intelligence.context}`,
  );
  return { content, input: req.file.originalname, analysis: intelligence };
};

const runImageUnderstanding = async ({ req, workflow }) => {
  assertAllowedMime(req.file, ["image/jpeg", "image/png", "image/webp"], "image");
  const buffer = await fs.promises.readFile(req.file.path);
  const prompt = workflow.kind === "ocr"
    ? "Extract all visible text exactly, preserving reading order and useful layout. Then provide a short structured summary. Mark uncertain characters explicitly."
    : "Describe this image accurately, then provide five accessible caption variants, concise alt text, visible text, key objects, and relevant keywords.";
  const content = await generateGeminiMultimodal(prompt, buffer, req.file.mimetype);
  return { content, input: req.file.originalname, analysis: { mimeType: req.file.mimetype, bytes: req.file.size } };
};

const runUpscale = async (req) => {
  assertAllowedMime(req.file, ["image/jpeg", "image/png", "image/webp"], "image");
  const uploaded = await cloudinary.uploader.upload(req.file.path);
  if (uploaded.width * uploaded.height >= 4_200_000) {
    await cloudinary.uploader.destroy(uploaded.public_id).catch(() => {});
    const error = new Error("AI upscale supports source images smaller than 4.2 megapixels.");
    error.statusCode = 400;
    throw error;
  }
  const imageUrl = cloudinary.url(uploaded.public_id, {
    secure: true,
    resource_type: "image",
    transformation: [{ effect: "upscale" }, { quality: "auto", fetch_format: "auto" }],
  });
  return {
    imageUrl,
    content: imageUrl,
    input: req.file.originalname,
    analysis: {
      originalWidth: uploaded.width,
      originalHeight: uploaded.height,
      outputWidth: uploaded.width * 4,
      outputHeight: uploaded.height * 4,
    },
  };
};

export const executeToolWorkflow = async (req, res) => {
  let consumed;
  try {
    const tool = getToolOrThrow(req.params.toolSlug);
    const workflow = getWorkflow(tool);
    let result;

    if (["pdf-summary", "document-analysis", "file-chat"].includes(workflow.kind)) {
      assertAllowedMime(req.file, ["application/pdf"], "PDF");
    } else if (["image-upscale", "image-caption", "ocr"].includes(workflow.kind)) {
      assertAllowedMime(req.file, ["image/jpeg", "image/png", "image/webp"], "image");
    } else {
      requireText(req.body.input, "Input", 50000);
      if (workflow.kind === "ats") requireText(req.body.context, "Job description", 30000);
    }

    consumed = await consumeCredits({
      user: req.user,
      toolSlug: tool.slug,
      metadata: { workflow: workflow.kind },
    });

    if (workflow.kind === "image-generation") {
      const input = requireText(req.body.input, "Image description", 2000);
      const generated = await generateImageAsset(imagePromptForTool(tool.slug, input));
      const aspectRatio = IMAGE_FORMATS[tool.slug];
      const imageUrl = generated.publicId && aspectRatio
        ? cloudinary.url(generated.publicId, {
            secure: true,
            transformation: [{ aspect_ratio: aspectRatio, crop: "fill", gravity: "auto" }],
          })
        : generated.secureUrl;
      result = { imageUrl, content: imageUrl, input, cacheHit: generated.cacheHit };
    } else if (workflow.kind === "image-upscale") result = await runUpscale(req);
    else if (["image-caption", "ocr"].includes(workflow.kind)) result = await runImageUnderstanding({ req, workflow });
    else if (["pdf-summary", "document-analysis", "file-chat"].includes(workflow.kind)) result = await runDocumentWorkflow({ req, workflow });
    else if (workflow.kind === "ats") result = await runAtsWorkflow(req);
    else result = await runTextWorkflow({ req, tool, workflow });

    await saveCreation({ userId: req.userId, tool, prompt: result.input, content: result.content });
    res.json({
      success: true,
      content: result.content,
      imageUrl: result.imageUrl,
      analysis: result.analysis,
      cacheHit: result.cacheHit || false,
      credits: consumed.user.availableCredits,
    });
  } catch (error) {
    console.error(`Error in workflow ${req.params.toolSlug}:`, error);
    await sendError(res, error, consumed);
  } finally {
    safeUnlink(req.file?.path);
  }
};
