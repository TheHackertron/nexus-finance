import { useState, useEffect } from "react"
import { Modal, Form, Button, Row, Col } from "react-bootstrap"
import { useAuthStore } from "../../store/authStore"

export default function TransactionForm({ isOpen, onClose, onSubmit, initialData }) {
  const user = useAuthStore((s) => s.user)
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    tags: "",
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        amount: initialData.amount || "",
        category: initialData.category || "",
        type: initialData.type || "expense",
        date: initialData.date ? initialData.date.split("T")[0] : "",
        notes: initialData.notes || "",
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : "",
      })
    } else {
      setForm({
        title: "",
        amount: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
        notes: "",
        tags: "",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      amount: Number(form.amount),
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    })
  }

  const categories = user?.categories || [
    "Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other",
  ]

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit" : "Add"} Transaction</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="e.g. Grocery shopping"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
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
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Tags <small className="text-muted">(comma separated)</small></Form.Label>
            <Form.Control
              placeholder="e.g. groceries, weekly"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Optional notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
          <Button variant="dark" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
