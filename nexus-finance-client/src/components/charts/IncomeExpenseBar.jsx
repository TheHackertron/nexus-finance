import { Card } from "react-bootstrap"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function IncomeExpenseBar({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-sm border-0 h-100">
        <Card.Body className="text-center text-muted py-5">
          No trend data available
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <h6 className="fw-bold mb-3">Income vs Expense (6 Months)</h6>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{ borderRadius: 8, border: "1px solid #eee" }}
            />
            <Legend />
            <Bar dataKey="income" fill="#198754" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#dc3545" name="Expense" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  )
}
