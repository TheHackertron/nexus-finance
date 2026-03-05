import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap"
import { registerAPI } from "../api/auth.api"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await registerAPI(form)
      if (res.data.success) {
        navigate("/login")
      } else {
        setError(res.data.message || "Registration failed")
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
              <h3 className="fw-bold">Create Account</h3>
              <p className="text-muted small">Get started with Nexus Finance</p>
            </div>

            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Form.Group>

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
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                />
              </Form.Group>

              <Button type="submit" variant="dark" className="w-100" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : "Create Account"}
              </Button>
            </Form>

            <p className="text-center text-muted small mt-3 mb-0">
              Already have an account?{" "}
              <Link to="/login" className="text-dark fw-semibold">
                Sign In
              </Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
