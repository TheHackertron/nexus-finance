const SavingsGoal = require('../models/SavingsGoal');
const Notification = require('../models/Notification');

// Create goal
exports.createGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.create({ ...req.body, user: req.userId });
    res.json({ success: true, data: goal });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get all goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get single goal
exports.getGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.userId });
    if (!goal) return res.json({ success: false, message: 'Goal not found' });
    res.json({ success: true, data: goal });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Update goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!goal) return res.json({ success: false, message: 'Goal not found' });
    res.json({ success: true, data: goal });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!goal) return res.json({ success: false, message: 'Goal not found' });
    res.json({ success: true, data: 'Goal deleted' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Add contribution to a goal
exports.addContribution = async (req, res) => {
  try {
    const { amount, note } = req.body;
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.userId });
    if (!goal) return res.json({ success: false, message: 'Goal not found' });

    goal.contributions.push({ amount, note, date: new Date() });
    goal.currentAmount += amount;

    if (goal.currentAmount >= goal.targetAmount && !goal.isCompleted) {
      goal.isCompleted = true;
      goal.completedAt = new Date();

      await Notification.create({
        user: req.userId,
        message: `Congratulations! You've reached your savings goal: "${goal.title}"!`,
        type: 'goal'
      });
    }

    await goal.save();
    res.json({ success: true, data: goal });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
