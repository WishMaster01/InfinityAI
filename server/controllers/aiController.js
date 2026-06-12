// server/controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse";
import FormData from "form-data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// === GENERATE ARTICLE ===
export const generateArticle = async (req, res) => {
  console.log("✅ generateArticle controller triggered");
  console.log("BODY:", req.body);
  try {
    const userId = req.userId;
    const { prompt, length } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated." });
    }

    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to Premium to continue.",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("Error in generateArticle:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// === GENERATE BLOG TITLE ===
export const generateBlogTitle = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt, publish } = req.body;

    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated." });
    }

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to Premium to continue.",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title', ${
      publish ?? false
    })
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("Error in generateBlogTitle:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// === GENERATE IMAGE ===
export const generateImage = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({ success: false, message: "Premium feature only." });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, secure_url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// === REMOVE IMAGE BACKGROUND ===
export const removeImageBackground = async (req, res) => {
  try {
    const userId = req.userId;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({ success: false, message: "Premium feature only." });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove Background from Image', ${secure_url}, 'image')
    `;

    res.json({ success: true, secure_url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// === REMOVE OBJECT FROM IMAGE ===
export const removeImageObject = async (req, res) => {
  try {
    const userId = req.userId;
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({ success: false, message: "Premium feature only." });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imageURL = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from Image`}, ${imageURL}, 'image')
    `;

    res.json({ success: true, imageURL });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// === RESUME REVIEW ===
export const resumeReview = async (req, res) => {
  try {
    const userId = req.userId;
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({ success: false, message: "Premium feature only." });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "File size exceeds 5MB limit.",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following Resume:\n\n${pdfData.text}`;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume Review', ${content}, 'resume-review')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
