import { useState, useEffect, useCallback } from "react"
import { Row, Col, Button, Alert } from "react-bootstrap"
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
  const [error, setError] = useState("")

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
    setError("")
    try {
      const res = editing
        ? await updateGoalAPI(editing._id, data)
        : await createGoalAPI(data)

      if (res.data.success) {
        setIsFormOpen(false)
        setEditing(null)
        fetchGoals()
      } else {
        setError(res.data.message || "Failed to save goal")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save goal. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await deleteGoalAPI(id)
      if (!res.data.success) setError(res.data.message)
      fetchGoals()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete goal")
    }
  }

  const handleContribute = async (data) => {
    setError("")
    try {
      const res = await addContributionAPI(contributing._id, data)
      if (res.data.success) {
        if (res.data.data.isCompleted) {
          import("canvas-confetti").then((mod) => {
            const confetti = mod.default
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
          })
        }
        setContributing(null)
        fetchGoals()
      } else {
        setError(res.data.message || "Failed to add contribution")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add contribution. Please try again.")
    }
  }

  const activeGoals = goals.filter((g) => !g.isCompleted)
  const completedGoals = goals.filter((g) => g.isCompleted)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Savings Goals</h4>
        <Button variant="dark" size="sm" onClick={() => { setError(""); setIsFormOpen(true) }}>
          <BsPlus size={18} /> New Goal
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="py-2">
          {error}
        </Alert>
      )}

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
                      onEdit={(g) => { setError(""); setEditing(g); setIsFormOpen(true) }}
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
                      onEdit={(g) => { setError(""); setEditing(g); setIsFormOpen(true) }}
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
