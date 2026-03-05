import { useState, useEffect } from "react"
import { Card, Form, Button, Row, Col, Badge, Alert, Spinner } from "react-bootstrap"
import { BsPlus, BsX } from "react-icons/bs"
import { useAuthStore } from "../store/authStore"
import { getProfileAPI, updateProfileAPI } from "../api/auth.api"

export default function Settings() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name || "")
  const [currency, setCurrency] = useState(user?.currency || "INR")
  const [categories, setCategories] = useState(user?.categories || [])
  const [newCat, setNewCat] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfileAPI()
        if (res.data.success) {
          const p = res.data.data
          setName(p.name)
          setCurrency(p.currency)
          setCategories(p.categories || [])
          setUser(p)
        }
      } catch {
        // use local data
      }
    }
    load()
  }, [])

  const addCategory = () => {
    const trimmed = newCat.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed])
      setNewCat("")
    }
  }

  const removeCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat))
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage("")
    try {
      const res = await updateProfileAPI({ name, currency, categories })
      if (res.data.success) {
        setUser(res.data.data)
        setMessage("Settings updated successfully!")
      } else {
        setMessage(res.data.message || "Update failed")
      }
    } catch {
      setMessage("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h4 className="fw-bold mb-3">Settings</h4>

      {message && (
        <Alert variant={message.includes("success") ? "success" : "danger"} dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6 className="fw-bold mb-3">Profile</h6>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Currency Preference</Form.Label>
                <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6 className="fw-bold mb-3">Expense Categories</h6>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {categories.map((cat) => (
                  <Badge key={cat} bg="dark" className="d-flex align-items-center gap-1 px-3 py-2">
                    {cat}
                    <BsX size={16} role="button" onClick={() => removeCategory(cat)} />
                  </Badge>
                ))}
              </div>
              <div className="d-flex gap-2">
                <Form.Control
                  size="sm"
                  placeholder="New category"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                />
                <Button variant="outline-dark" size="sm" onClick={addCategory}>
                  <BsPlus />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-3">
        <Button variant="dark" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
