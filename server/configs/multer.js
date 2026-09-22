import multer from "multer";

const storage = multer.diskStorage({});
const allowed = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024, files: 1 }, fileFilter: (req, file, callback) => {
  callback(null, allowed.has(file.mimetype));
} });
