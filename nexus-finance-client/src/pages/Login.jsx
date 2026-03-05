import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap"
import { useAuthStore } from "../store/authStore"
import { loginAPI } from "../api/auth.api"

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await loginAPI(form)
      if (res.data.success) {
        login(res.data.data.user, res.data.data.accessToken)
        navigate("/")
      } else {
        setError(res.data.message || "Login failed")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <Container style={{ maxWidth: 420 }}>
        <Card className="shadow border-0">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <h3 className="fw-bold">Nexus Finance</h3>
              <p className="text-muted small">Sign in to your account</p>
            </div>

            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="dark" className="w-100" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : "Sign In"}
              </Button>
            </Form>

            <p className="text-center text-muted small mt-3 mb-0">
              Don't have an account?{" "}
              <Link to="/register" className="text-dark fw-semibold">
                Register
              </Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
