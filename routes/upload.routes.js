import express from "express";
import multer from "multer";
import upload from "../config/upload.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/upload
 *
 * Middleware order:
 *   1. verifyToken  — rejects unauthenticated requests with 401 BEFORE multer touches the file
 *   2. upload.single("avatar") — parses multipart file from "avatar" field, runs fileFilter, checks size limit
 *   3. handler — checks req.file, responds with status 201 and { url: "/uploads/<filename>" }
 */
router.post(
  "/upload",
  verifyToken,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large. Maximum size is 5 MB." });
          }
          return res.status(400).json({ error: `Upload error: ${err.message}` });
        }
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Send a file in the 'avatar' field." });
    }

    const url = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      url,
      filename: req.file.filename,
    });
  }
);

export default router;
