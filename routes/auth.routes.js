import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * POST /auth/login
 * Demo account: Ada / password
 * Returns a JWT the client can use with verifyToken-protected routes.
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "Ada" && password === "password") {
    const token = jwt.sign(
      { id: 1, username: "Ada" },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

export default router;
