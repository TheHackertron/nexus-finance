import { useEffect, useState } from "react"
import { Button, Row, Col, Alert } from "react-bootstrap"
import { BsPlus } from "react-icons/bs"
import {
  getBudgetsAPI,
  createBudgetAPI,
  updateBudgetAPI,
  deleteBudgetAPI,
} from "../api/budgets.api"
import BudgetCard from "../components/budgets/BudgetCard"
import BudgetForm from "../components/budgets/BudgetForm"

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState("")

  const fetchBudgets = async () => {
    try {
      const res = await getBudgetsAPI()
      if (res.data.success) setBudgets(res.data.data)
    } catch (err) {
      console.error("Failed to fetch budgets:", err)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  const handleSubmit = async (data) => {
    setError("")
    try {
      const res = editing
        ? await updateBudgetAPI(editing._id, data)
        : await createBudgetAPI(data)

      if (res.data.success) {
        setIsOpen(false)
        setEditing(null)
        fetchBudgets()
      } else {
        setError(res.data.message || "Failed to save budget")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save budget. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await deleteBudgetAPI(id)
      if (!res.data.success) setError(res.data.message)
      fetchBudgets()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete budget")
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Budgets</h4>
        <Button variant="dark" size="sm" onClick={() => { setError(""); setIsOpen(true) }}>
          <BsPlus size={18} /> Add Budget
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="py-2">
          {error}
        </Alert>
      )}

      {budgets.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>No budgets created yet.</p>
          <Button variant="dark" size="sm" onClick={() => setIsOpen(true)}>
            Create your first budget
          </Button>
        </div>
      ) : (
        <Row className="g-3">
          {budgets.map((budget) => (
            <Col md={4} key={budget._id}>
              <BudgetCard
                budget={budget}
                onEdit={(b) => { setError(""); setEditing(b); setIsOpen(true) }}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      )}

      <BudgetForm
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        initialData={editing}
      />
    </div>
  )
}
