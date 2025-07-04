import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["income", "expense"], required: true }
});

export default mongoose.model("Transaction", TransactionSchema);