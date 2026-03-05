import { useState } from "react"
import { Modal, Form, Button, Spinner } from "react-bootstrap"

export default function ContributionModal({ isOpen, onClose, onSubmit, goal }) {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ amount: Number(amount), note })
      setAmount("")
      setNote("")
    } finally {
      setLoading(false)
    }
  }

  const remaining = goal ? goal.targetAmount - goal.currentAmount : 0

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Contribution</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {goal && (
            <div className="bg-light rounded p-3 mb-3">
              <div className="fw-semibold">{goal.title}</div>
              <small className="text-muted">
                ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()} saved
                &bull; ${remaining.toLocaleString()} remaining
              </small>
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter contribution amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              max={remaining > 0 ? remaining : undefined}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Note <small className="text-muted">(optional)</small></Form.Label>
            <Form.Control
              placeholder="e.g. Monthly savings"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Add Contribution"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
