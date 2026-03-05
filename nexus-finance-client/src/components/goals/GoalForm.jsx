import { useState, useEffect } from "react"
import { Modal, Form, Button, Row, Col } from "react-bootstrap"

export default function GoalForm({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    category: "General",
    deadline: "",
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        targetAmount: initialData.targetAmount || "",
        category: initialData.category || "General",
        deadline: initialData.deadline ? initialData.deadline.split("T")[0] : "",
      })
    } else {
      setForm({ title: "", targetAmount: "", category: "General", deadline: "" })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      targetAmount: Number(form.targetAmount),
      deadline: form.deadline || undefined,
    })
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit Goal" : "Create Savings Goal"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Goal Title</Form.Label>
            <Form.Control
              placeholder="e.g. Emergency Fund"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Target Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 10000"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                  required
                  min="1"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>General</option>
                  <option>Emergency Fund</option>
                  <option>Vacation</option>
                  <option>Education</option>
                  <option>Gadget</option>
                  <option>Home</option>
                  <option>Vehicle</option>
                  <option>Investment</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Deadline <small className="text-muted">(optional)</small></Form.Label>
            <Form.Control
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
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
