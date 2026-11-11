import multer from "multer";

// ─── diskStorage ────────────────────────────────────────────────────────────
// destination: relative path uploads/ (no leading slash so it resolves inside project)
// filename   : unique name using Date.now() and a random number, preserving file extension
//              e.g. avatar-1718050123456-874320198.jpg
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // relative path — no leading slash
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `avatar-${unique}.${ext}`);
  },
});

// ─── fileFilter ──────────────────────────────────────────────────────────────
// Accept only image MIME types (image/jpeg, image/png, image/webp, image/gif)
// via the callback and reject everything else.
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true); // accept
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, webp, gif)"), false); // reject
  }
};

// ─── multer instance ────────────────────────────────────────────────────────
// limits.fileSize is in bytes; 5 * 1024 * 1024 = 5 MB.
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB in bytes
  },
});

export default upload;
