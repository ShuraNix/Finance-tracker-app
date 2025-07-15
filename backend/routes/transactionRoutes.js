import express from "express";
import Transaction from "../models/Transaction.js";
import auth from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.use(auth);

// Add a new transaction
router.post(
  "/",
  [
    body("description").notEmpty().withMessage("Description is required"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense")
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array().map(e => e.msg).join(", ") });
    }
    try {
      const newTransaction = new Transaction({
        ...req.body,
        user: req.user.id
      });
      await newTransaction.save();
      res.status(201).json(newTransaction);
    } catch (error) {
      next(error);
    }
  }
);

// Get all transactions
router.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// Update a transaction
router.put(
  "/:id",
  [
    body("description").notEmpty().withMessage("Description is required"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense")
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array().map(e => e.msg).join(", ") });
    }
    try {
      const updated = await Transaction.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ message: "Transaction not found" });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// Delete a transaction
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;  // 👈 Default export