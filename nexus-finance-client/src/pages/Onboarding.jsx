import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Card, Form, Button, Alert, Spinner, Badge } from "react-bootstrap"
import { onboardAPI } from "../api/auth.api"
import { useAuthStore } from "../store/authStore"

const defaultCategories = [
  "Food", "Transport", "Shopping", "Bills", "Entertainment",
  "Health", "Education", "Travel", "Rent", "Other",
]

export default function Onboarding() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)
  const [step, setStep] = useState(1)
  const [currency, setCurrency] = useState("INR")
  const [income, setIncome] = useState("")
  const [categories, setCategories] = useState(defaultCategories.slice(0, 7))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleFinish = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await onboardAPI({ income: Number(income), currency, categories })
      if (res.data.success) {
        setUser({ ...user, ...res.data.data })
        navigate("/")
      } else {
        setError(res.data.message || "Onboarding failed")
      }
    } catch {
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <Container style={{ maxWidth: 480 }}>
        <Card className="shadow border-0">
          <Card.Body className="p-4">
            <h4 className="fw-bold mb-1">Setup Your Account</h4>
            <p className="text-muted small mb-4">Step {step} of 3</p>

            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

            {step === 1 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Preferred Currency</Form.Label>
                  <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="dark" className="w-100" onClick={() => setStep(2)}>
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Monthly Income</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g. 50000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" className="w-50" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button variant="dark" className="w-50" onClick={() => setStep(3)}>
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Form.Label className="mb-2">Select Expense Categories</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {defaultCategories.map((cat) => (
                    <Badge
                      key={cat}
                      bg={categories.includes(cat) ? "dark" : "light"}
                      text={categories.includes(cat) ? "white" : "dark"}
                      className="border px-3 py-2"
                      role="button"
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" className="w-50" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button variant="dark" className="w-50" onClick={handleFinish} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Finish Setup"}
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
