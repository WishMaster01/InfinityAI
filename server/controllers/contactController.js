import prisma from "../configs/db.js";
import { requireText } from "../utils/validators.js";

export const submitContactMessage = async (req, res) => {
  try {
    const name = requireText(req.body.name, "Name", 120);
    const email = requireText(req.body.email, "Email", 254).toLowerCase();
    const subject = requireText(req.body.subject, "Subject", 180);
    const message = requireText(req.body.message, "Message", 5000);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address." });
    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });
    return res
      .status(201)
      .json({ success: true, message: "Your message was received." });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Unable to send your message.",
      });
  }
};
