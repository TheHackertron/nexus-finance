const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
  addContribution
} = require('../controllers/goals.controller');

router.use(authenticate);

router.get('/', getGoals);
router.post('/', createGoal);
router.get('/:id', getGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.post('/:id/contribute', addContribution);

module.exports = router;
