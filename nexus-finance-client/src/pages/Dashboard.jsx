import { useEffect } from "react"
import { Row, Col, Card, Spinner, Alert } from "react-bootstrap"
import {
  BsWallet2,
  BsArrowUpCircle,
  BsArrowDownCircle,
  BsPiggyBank,
} from "react-icons/bs"
import { useAnalyticsStore } from "../store/analyticsStore"
import IncomeExpenseBar from "../components/charts/IncomeExpenseBar"
import CategoryDonut from "../components/charts/CategoryDonut"
import CashFlowArea from "../components/charts/CashFlowArea"
import BudgetRadial from "../components/charts/BudgetRadial"

const insightVariant = {
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "primary",
}

export default function Dashboard() {
  const {
    summary,
    monthlyTrend,
    categoryBreakdown,
    cashFlow,
    budgetUsage,
    insights,
    loading,
    fetchAll,
  } = useAnalyticsStore()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="text-muted mt-2">Loading dashboard...</p>
      </div>
    )
  }

  const stats = [
    {
      label: "Total Balance",
      value: summary?.totalBalance ?? 0,
      icon: BsWallet2,
      color: "primary",
    },
    {
      label: "Monthly Income",
      value: summary?.monthIncome ?? 0,
      icon: BsArrowUpCircle,
      color: "success",
    },
    {
      label: "Monthly Expenses",
      value: summary?.monthExpense ?? 0,
      icon: BsArrowDownCircle,
      color: "danger",
    },
    {
      label: "Net Savings",
      value: summary?.netSavings ?? 0,
      icon: BsPiggyBank,
      color: "info",
    },
  ]

  return (
    <div>
      <h4 className="fw-bold mb-3">Dashboard Overview</h4>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        {stats.map((s) => (
          <Col md={3} sm={6} key={s.label}>
            <Card className="stat-card shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center gap-3">
                <div className={`bg-${s.color} bg-opacity-10 rounded-3 p-3`}>
                  <s.icon size={24} className={`text-${s.color}`} />
                </div>
                <div>
                  <div className="text-muted small">{s.label}</div>
                  <div className="fw-bold fs-5">
                    ${Math.abs(s.value).toLocaleString()}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row 1 */}
      <Row className="g-3 mb-4">
        <Col lg={7}>
          <IncomeExpenseBar data={monthlyTrend} />
        </Col>
        <Col lg={5}>
          <CategoryDonut data={categoryBreakdown} />
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="g-3 mb-4">
        <Col lg={7}>
          <CashFlowArea data={cashFlow} />
        </Col>
        <Col lg={5}>
          <BudgetRadial data={budgetUsage} />
        </Col>
      </Row>

      {/* Insights Panel */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h6 className="fw-bold mb-3">Smart Insights</h6>
          {insights.length === 0 ? (
            <p className="text-muted">No insights available yet. Add transactions to get started.</p>
          ) : (
            <Row className="g-3">
              {insights.map((insight, i) => (
                <Col md={6} key={i}>
                  <Alert
                    variant={insightVariant[insight.type] || "secondary"}
                    className="insight-card insight-${insight.type} mb-0"
                  >
                    <Alert.Heading as="h6" className="mb-1 fs-6">
                      {insight.title}
                    </Alert.Heading>
                    <small>{insight.message}</small>
                  </Alert>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}
