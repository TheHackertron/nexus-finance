import { useState, useEffect, useCallback } from "react"
import { Row, Col, Button } from "react-bootstrap"
import { BsPlus } from "react-icons/bs"
import {
  getGoalsAPI,
  createGoalAPI,
  updateGoalAPI,
  deleteGoalAPI,
  addContributionAPI,
} from "../api/goals.api"
import GoalCard from "../components/goals/GoalCard"
import GoalForm from "../components/goals/GoalForm"
import ContributionModal from "../components/goals/ContributionModal"

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [contributing, setContributing] = useState(null)

  const fetchGoals = useCallback(async () => {
    try {
      const res = await getGoalsAPI()
      if (res.data.success) setGoals(res.data.data)
    } catch (err) {
      console.error("Failed to fetch goals:", err)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateGoalAPI(editing._id, data)
      } else {
        await createGoalAPI(data)
      }
      setIsFormOpen(false)
      setEditing(null)
      fetchGoals()
    } catch (err) {
      console.error("Failed to save goal:", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteGoalAPI(id)
      fetchGoals()
    } catch (err) {
      console.error("Failed to delete goal:", err)
    }
  }

  const handleContribute = async (data) => {
    try {
      const res = await addContributionAPI(contributing._id, data)
      if (res.data.success && res.data.data.isCompleted) {
        import("canvas-confetti").then((mod) => {
          const confetti = mod.default
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
        })
      }
      setContributing(null)
      fetchGoals()
    } catch (err) {
      console.error("Failed to add contribution:", err)
    }
  }

  const activeGoals = goals.filter((g) => !g.isCompleted)
  const completedGoals = goals.filter((g) => g.isCompleted)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Savings Goals</h4>
        <Button variant="dark" size="sm" onClick={() => setIsFormOpen(true)}>
          <BsPlus size={18} /> New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>No savings goals yet.</p>
          <Button variant="dark" size="sm" onClick={() => setIsFormOpen(true)}>
            Create your first goal
          </Button>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <>
              <h6 className="text-muted mb-3">Active Goals ({activeGoals.length})</h6>
              <Row className="g-3 mb-4">
                {activeGoals.map((goal) => (
                  <Col md={4} key={goal._id}>
                    <GoalCard
                      goal={goal}
                      onEdit={(g) => { setEditing(g); setIsFormOpen(true) }}
                      onDelete={handleDelete}
                      onContribute={setContributing}
                    />
                  </Col>
                ))}
              </Row>
            </>
          )}

          {completedGoals.length > 0 && (
            <>
              <h6 className="text-muted mb-3">Completed ({completedGoals.length})</h6>
              <Row className="g-3">
                {completedGoals.map((goal) => (
                  <Col md={4} key={goal._id}>
                    <GoalCard
                      goal={goal}
                      onEdit={(g) => { setEditing(g); setIsFormOpen(true) }}
                      onDelete={handleDelete}
                      onContribute={setContributing}
                    />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}

      <GoalForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        initialData={editing}
      />

      <ContributionModal
        isOpen={!!contributing}
        onClose={() => setContributing(null)}
        onSubmit={handleContribute}
        goal={contributing}
      />
    </div>
  )
}
