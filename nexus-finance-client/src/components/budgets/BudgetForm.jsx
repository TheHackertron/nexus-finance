import { useState, useEffect } from "react"
import { Modal, Form, Button, Row, Col } from "react-bootstrap"
import { useAuthStore } from "../../store/authStore"

export default function BudgetForm({ isOpen, onClose, onSubmit, initialData }) {
  const user = useAuthStore((s) => s.user)
  const now = new Date()

  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category || "",
        amount: initialData.amount || "",
        month: initialData.month || now.getMonth() + 1,
        year: initialData.year || now.getFullYear(),
      })
    } else {
      setForm({
        category: "",
        amount: "",
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, amount: Number(form.amount) })
  }

  const categories = user?.categories || [
    "Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other",
  ]

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Budget" : "Create Budget"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Budget Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 5000"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              min="1"
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2024, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  min="2020"
                  max="2030"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
          <Button variant="dark" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
