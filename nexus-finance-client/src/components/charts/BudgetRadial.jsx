import { Card } from "react-bootstrap"
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const COLORS = [
  "#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1",
  "#0dcaf0", "#fd7e14", "#20c997",
]

export default function BudgetRadial({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-sm border-0 h-100">
        <Card.Body className="text-center text-muted py-5">
          No budget data this month
        </Card.Body>
      </Card>
    )
  }

  const chartData = data.map((d, i) => ({
    name: d.category,
    value: Math.min(d.percentage, 100),
    fill: COLORS[i % COLORS.length],
    spent: d.spent,
    budgeted: d.budgeted,
  }))

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body>
        <h6 className="fw-bold mb-3">Budget Usage by Category</h6>
        <ResponsiveContainer width="100%" height={280}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              background
              dataKey="value"
              cornerRadius={5}
              label={{ position: "insideStart", fill: "#fff", fontSize: 11 }}
            />
            <Tooltip
              formatter={(value, name, props) =>
                `${value}% ($${props.payload.spent} / $${props.payload.budgeted})`
              }
            />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: 12 }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  )
}
