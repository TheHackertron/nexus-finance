import { Card } from "react-bootstrap"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = [
  "#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1",
  "#0dcaf0", "#fd7e14", "#20c997", "#d63384", "#6c757d",
]

export default function CategoryDonut({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-sm border-0 h-100">
        <Card.Body className="text-center text-muted py-5">
          No spending data this month
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <h6 className="fw-bold mb-3">Spending by Category</h6>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              label={({ category, percent }) =>
                `${category} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  )
}
