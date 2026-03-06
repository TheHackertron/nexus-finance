import { Row, Col, Form, Button } from "react-bootstrap"
import { BsSearch } from "react-icons/bs"

export default function FilterBar({ filters, setFilters, onApply }) {
  return (
    <div className="bg-white p-3 rounded-3 shadow-sm mb-3">
      <Row className="g-2 align-items-end">
        <Col md={2}>
          <Form.Label className="small text-muted mb-1">From</Form.Label>
          <Form.Control
            type="date"
            size="sm"
            value={filters.startDate || ""}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </Col>
        <Col md={2}>
          <Form.Label className="small text-muted mb-1">To</Form.Label>
          <Form.Control
            type="date"
            size="sm"
            value={filters.endDate || ""}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </Col>
        <Col md={2}>
          <Form.Label className="small text-muted mb-1">Type</Form.Label>
          <Form.Select
            size="sm"
            value={filters.type || ""}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label className="small text-muted mb-1">Category</Form.Label>
          <Form.Control
            size="sm"
            placeholder="Filter by category"
            value={filters.category || ""}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />
        </Col>
        <Col md={3} className="d-flex gap-2">
          <Button variant="dark" size="sm" className="flex-grow-1" onClick={onApply}>
            <BsSearch className="me-1" /> Apply
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              setFilters({})
              onApply({})
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </div>
  )
}
