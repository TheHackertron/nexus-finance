import { Card } from "react-bootstrap"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function CashFlowArea({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-sm border-0 h-100">
        <Card.Body className="text-center text-muted py-5">
          No cash flow data available
        </Card.Body>
      </Card>
    )
  }

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }))

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <h6 className="fw-bold mb-3">Cash Flow Over Time</h6>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{ borderRadius: 8, border: "1px solid #eee" }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#0d6efd"
              fill="url(#balanceGradient)"
              strokeWidth={2}
              name="Running Balance"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  )
}
