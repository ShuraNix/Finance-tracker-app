import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"; // Use env in production

const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 20, // 20 attempts per window
  message: { message: "Too many attempts, please try again later." }
});

const strongPassword = body("password")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
  .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
  .matches(/[0-9]/).withMessage("Password must contain a digit")
  .matches(/[^A-Za-z0-9]/).withMessage("Password must contain a special character");

// Signup
router.post(
  "/signup",
  authLimiter,
  [
    body("email").isEmail().withMessage("Invalid email"),
    strongPassword
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array().map(e => e.msg).join(", ") });
    }
    const { email, password } = req.body;
    try {
      if (!email || !password) return res.status(400).json({ message: "Email and password required" });
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: "Email already registered" });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hash });
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      res.status(201).json({ token, email: user.email });
    } catch (err) {
      next(err);
    }
  }
);

// Login
router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array().map(e => e.msg).join(", ") });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, email: user.email });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
