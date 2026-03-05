import { useEffect, useState } from "react"
import { Button, Row, Col } from "react-bootstrap"
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
    try {
      if (editing) {
        await updateBudgetAPI(editing._id, data)
      } else {
        await createBudgetAPI(data)
      }
      setIsOpen(false)
      setEditing(null)
      fetchBudgets()
    } catch (err) {
      console.error("Failed to save budget:", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteBudgetAPI(id)
      fetchBudgets()
    } catch (err) {
      console.error("Failed to delete budget:", err)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Budgets</h4>
        <Button variant="dark" size="sm" onClick={() => setIsOpen(true)}>
          <BsPlus size={18} /> Add Budget
        </Button>
      </div>

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
                onEdit={(b) => { setEditing(b); setIsOpen(true) }}
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
