import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Core middleware ──────────────────────────────────────────────────────────
app.use(express.json());

// ─── Static serving ──────────────────────────────────────────────────────────
// Maps GET /uploads/<filename> → reads the file from the uploads/ folder.
// Without this line the route returns a URL that always 404s in the browser.
app.use("/uploads", express.static("uploads"));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/api", uploadRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Threadbase upload server is running" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`  POST /auth/login       → get a JWT`);
  console.log(`  POST /api/upload       → upload an avatar (requires Bearer token)`);
  console.log(`  GET  /uploads/<file>   → view an uploaded file`);
});
