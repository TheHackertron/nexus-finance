import { Card, ProgressBar, Button, Badge } from "react-bootstrap"
import { BsPencil, BsTrash, BsPlusCircle, BsCheckCircleFill } from "react-icons/bs"

export default function GoalCard({ goal, onEdit, onDelete, onContribute }) {
  const percentage = goal.targetAmount > 0
    ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
    : 0

  const remaining = goal.targetAmount - goal.currentAmount
  const daysLeft = goal.deadline
    ? Math.max(0, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
    : null

  const projectedDate = () => {
    if (goal.contributions?.length < 2 || goal.currentAmount >= goal.targetAmount) return null
    const sorted = [...goal.contributions].sort((a, b) => new Date(a.date) - new Date(b.date))
    const first = new Date(sorted[0].date)
    const last = new Date(sorted[sorted.length - 1].date)
    const daysBetween = Math.max(1, (last - first) / (1000 * 60 * 60 * 24))
    const rate = goal.currentAmount / daysBetween
    if (rate <= 0) return null
    const daysNeeded = remaining / rate
    const projected = new Date()
    projected.setDate(projected.getDate() + daysNeeded)
    return projected.toLocaleDateString()
  }

  return (
    <Card className={`shadow-sm border-0 h-100 ${goal.isCompleted ? "border-success border-2" : ""}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
              {goal.title}
              {goal.isCompleted && <BsCheckCircleFill className="text-success" />}
            </h6>
            <small className="text-muted">{goal.category}</small>
          </div>
          <div className="d-flex gap-1">
            {!goal.isCompleted && (
              <Button variant="outline-success" size="sm" onClick={() => onContribute(goal)}>
                <BsPlusCircle size={14} />
              </Button>
            )}
            <Button variant="light" size="sm" onClick={() => onEdit(goal)}>
              <BsPencil size={14} />
            </Button>
            <Button variant="light" size="sm" className="text-danger" onClick={() => onDelete(goal._id)}>
              <BsTrash size={14} />
            </Button>
          </div>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span className="small text-muted">Progress</span>
          <span className="small fw-semibold">
            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
          </span>
        </div>

        <ProgressBar
          now={Math.min(percentage, 100)}
          variant={goal.isCompleted ? "success" : percentage >= 75 ? "info" : "primary"}
          style={{ height: 10 }}
          className="mb-2"
        />

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">{percentage}% complete</small>
          <div>
            {goal.isCompleted ? (
              <Badge bg="success">Completed!</Badge>
            ) : (
              <>
                {daysLeft !== null && (
                  <Badge bg={daysLeft < 30 ? "warning" : "secondary"} className="me-1">
                    {daysLeft}d left
                  </Badge>
                )}
                {projectedDate() && (
                  <Badge bg="info" text="dark">
                    Est. {projectedDate()}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}
