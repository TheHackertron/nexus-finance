const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { _id: true });

const savingsGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  category: { type: String, default: 'General' },
  contributions: [contributionSchema],
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
