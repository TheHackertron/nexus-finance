const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');

// Monthly income vs expense trend (last 6 months)
exports.getMonthlyTrend = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const result = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });

      const income = result.find(
        r => r._id.year === year && r._id.month === month && r._id.type === 'income'
      );
      const expense = result.find(
        r => r._id.year === year && r._id.month === month && r._id.type === 'expense'
      );

      months.push({
        label,
        month,
        year,
        income: income ? income.total : 0,
        expense: expense ? expense.total : 0
      });
    }

    res.json({ success: true, data: months });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Spending breakdown by category (current month)
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { month, year } = req.query;
    const m = month ? Number(month) : new Date().getMonth() + 1;
    const y = year ? Number(year) : new Date().getFullYear();

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const result = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const data = result.map(r => ({
      category: r._id,
      amount: r.total,
      count: r.count
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Cash flow / running balance over time (last 6 months, daily granularity collapsed to weekly)
exports.getCashFlow = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const result = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
      { $sort: { date: 1 } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            week: { $isoWeek: '$date' }
          },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          },
          firstDate: { $first: '$date' }
        }
      },
      { $sort: { firstDate: 1 } }
    ]);

    let runningBalance = 0;
    const data = result.map(r => {
      const net = r.income - r.expense;
      runningBalance += net;
      return {
        date: r.firstDate,
        income: r.income,
        expense: r.expense,
        net,
        balance: runningBalance
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Overview summary cards
exports.getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [allTime, thisMonth, goals] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' }
          }
        }
      ]),
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' }
          }
        }
      ]),
      SavingsGoal.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalSaved: { $sum: '$currentAmount' },
            totalTarget: { $sum: '$targetAmount' }
          }
        }
      ])
    ]);

    const totalIncome = allTime.find(a => a._id === 'income')?.total || 0;
    const totalExpense = allTime.find(a => a._id === 'expense')?.total || 0;
    const monthIncome = thisMonth.find(a => a._id === 'income')?.total || 0;
    const monthExpense = thisMonth.find(a => a._id === 'expense')?.total || 0;
    const goalData = goals[0] || { totalSaved: 0, totalTarget: 0 };

    res.json({
      success: true,
      data: {
        totalBalance: totalIncome - totalExpense,
        monthIncome,
        monthExpense,
        netSavings: monthIncome - monthExpense,
        totalSaved: goalData.totalSaved,
        savingsTarget: goalData.totalTarget
      }
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Budget usage per category (for radial chart)
exports.getBudgetUsage = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const budgets = await Budget.find({ user: req.userId, month, year });

    const spending = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' }
        }
      }
    ]);

    const spendingMap = {};
    spending.forEach(s => { spendingMap[s._id] = s.spent; });

    const data = budgets.map(b => ({
      category: b.category,
      budgeted: b.amount,
      spent: spendingMap[b.category] || 0,
      percentage: Math.round(((spendingMap[b.category] || 0) / b.amount) * 100)
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Smart insights
exports.getInsights = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [thisMonthData, lastMonthData, topCategory, budgets] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]),
      Budget.find({ user: req.userId, month: now.getMonth() + 1, year: now.getFullYear() })
    ]);

    const insights = [];

    const thisExpense = thisMonthData.find(d => d._id === 'expense')?.total || 0;
    const lastExpense = lastMonthData.find(d => d._id === 'expense')?.total || 0;
    const thisIncome = thisMonthData.find(d => d._id === 'income')?.total || 0;

    if (lastExpense > 0) {
      const change = ((thisExpense - lastExpense) / lastExpense * 100).toFixed(0);
      if (thisExpense > lastExpense) {
        insights.push({
          type: 'warning',
          title: 'Spending Up',
          message: `Your spending is up ${change}% compared to last month.`
        });
      } else {
        insights.push({
          type: 'success',
          title: 'Spending Down',
          message: `Great job! Spending is down ${Math.abs(change)}% from last month.`
        });
      }
    }

    if (topCategory.length > 0) {
      insights.push({
        type: 'info',
        title: 'Top Spending Category',
        message: `${topCategory[0]._id} is your biggest expense this month at $${topCategory[0].total.toLocaleString()}.`
      });
    }

    if (thisIncome > 0) {
      const savingsRate = (((thisIncome - thisExpense) / thisIncome) * 100).toFixed(0);
      insights.push({
        type: savingsRate >= 20 ? 'success' : 'warning',
        title: 'Savings Rate',
        message: `Your savings rate this month is ${savingsRate}%.`
      });
    }

    const overBudget = budgets.filter(b => b.spent > b.amount);
    if (overBudget.length > 0) {
      insights.push({
        type: 'danger',
        title: 'Budget Alert',
        message: `You've exceeded ${overBudget.length} budget${overBudget.length > 1 ? 's' : ''}: ${overBudget.map(b => b.category).join(', ')}.`
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Getting Started',
        message: 'Add some transactions to see personalized insights here.'
      });
    }

    res.json({ success: true, data: insights });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
