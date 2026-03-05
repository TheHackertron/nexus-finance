import { Card, ProgressBar, Button } from "react-bootstrap"
import { BsPencil, BsTrash } from "react-icons/bs"

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const percentage = budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0
  const variant = percentage >= 100 ? "danger" : percentage >= 70 ? "warning" : "success"

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="fw-bold mb-1">{budget.category}</h6>
            <small className="text-muted">
              {budget.month}/{budget.year}
            </small>
          </div>
          <div className="d-flex gap-1">
            <Button variant="light" size="sm" onClick={() => onEdit(budget)}>
              <BsPencil size={14} />
            </Button>
            <Button variant="light" size="sm" className="text-danger" onClick={() => onDelete(budget._id)}>
              <BsTrash size={14} />
            </Button>
          </div>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span className="small text-muted">Spent</span>
          <span className="small fw-semibold">
            ${budget.spent?.toLocaleString() || 0} / ${budget.amount.toLocaleString()}
          </span>
        </div>

        <ProgressBar
          now={Math.min(percentage, 100)}
          variant={variant}
          style={{ height: 10 }}
          className="mb-2"
        />

        <small className={`text-${variant}`}>
          {percentage}% used
          {percentage >= 100 && " — Over budget!"}
        </small>
      </Card.Body>
    </Card>
  )
}
