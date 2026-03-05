const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  getMonthlyTrend,
  getCategoryBreakdown,
  getCashFlow,
  getSummary,
  getBudgetUsage,
  getInsights
} = require('../controllers/analytics.controller');

router.use(authenticate);

router.get('/summary', getSummary);
router.get('/monthly-trend', getMonthlyTrend);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/cash-flow', getCashFlow);
router.get('/budget-usage', getBudgetUsage);
router.get('/insights', getInsights);

module.exports = router;
