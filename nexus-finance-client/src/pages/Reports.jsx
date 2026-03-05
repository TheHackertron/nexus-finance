import { useState, useRef } from "react"
import { Card, Row, Col, Form, Button, Table, Badge, Spinner } from "react-bootstrap"
import { BsDownload, BsFilePdf, BsPrinter } from "react-icons/bs"
import { getTransactionsAPI, exportCSVAPI } from "../api/transactions.api"

export default function Reports() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    category: "",
    minAmount: "",
    maxAmount: "",
    tags: "",
  })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const reportRef = useRef(null)

  const fetchFiltered = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate) params.endDate = filters.endDate
      if (filters.type) params.type = filters.type
      if (filters.category) params.category = filters.category
      params.limit = 500

      const res = await getTransactionsAPI(params)
      if (res.data.success) {
        let data = res.data.data

        if (filters.minAmount) {
          data = data.filter((t) => t.amount >= Number(filters.minAmount))
        }
        if (filters.maxAmount) {
          data = data.filter((t) => t.amount <= Number(filters.maxAmount))
        }
        if (filters.tags) {
          const tagList = filters.tags.split(",").map((t) => t.trim().toLowerCase())
          data = data.filter((t) =>
            t.tags?.some((tag) => tagList.includes(tag.toLowerCase()))
          )
        }

        setTransactions(data)
      }
    } catch (err) {
      console.error("Failed to fetch report data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCSV = async () => {
    try {
      const res = await exportCSVAPI()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "nexus-transactions.csv")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error("CSV export failed:", err)
    }
  }

  const handlePDF = async () => {
    const element = reportRef.current
    if (!element) return
    try {
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).default
      const canvas = await html2canvas(element, { scale: 2 })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const width = pdf.internal.pageSize.getWidth()
      const height = (canvas.height * width) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 0, width, height)
      pdf.save("nexus-report.pdf")
    } catch (err) {
      console.error("PDF export failed:", err)
    }
  }

  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += t.amount
      else acc.expense += t.amount
      return acc
    },
    { income: 0, expense: 0 }
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Reports</h4>
        <div className="d-flex gap-2 no-print">
          <Button variant="outline-dark" size="sm" onClick={handleCSV}>
            <BsDownload className="me-1" /> CSV
          </Button>
          <Button variant="outline-dark" size="sm" onClick={handlePDF}>
            <BsFilePdf className="me-1" /> PDF
          </Button>
          <Button variant="outline-dark" size="sm" onClick={() => window.print()}>
            <BsPrinter className="me-1" /> Print
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card className="shadow-sm border-0 mb-3 no-print">
        <Card.Body>
          <h6 className="fw-bold mb-3">Filters</h6>
          <Row className="g-2">
            <Col md={2}>
              <Form.Label className="small text-muted mb-1">From</Form.Label>
              <Form.Control
                type="date"
                size="sm"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Form.Label className="small text-muted mb-1">To</Form.Label>
              <Form.Control
                type="date"
                size="sm"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Form.Label className="small text-muted mb-1">Type</Form.Label>
              <Form.Select
                size="sm"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label className="small text-muted mb-1">Category</Form.Label>
              <Form.Control
                size="sm"
                placeholder="Category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              />
            </Col>
            <Col md={1}>
              <Form.Label className="small text-muted mb-1">Min $</Form.Label>
              <Form.Control
                type="number"
                size="sm"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              />
            </Col>
            <Col md={1}>
              <Form.Label className="small text-muted mb-1">Max $</Form.Label>
              <Form.Control
                type="number"
                size="sm"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              />
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="dark" size="sm" className="w-100" onClick={fetchFiltered} disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : "Generate Report"}
              </Button>
            </Col>
          </Row>
          <Row className="g-2 mt-2">
            <Col md={4}>
              <Form.Label className="small text-muted mb-1">Tags (comma separated)</Form.Label>
              <Form.Control
                size="sm"
                placeholder="e.g. groceries, rent"
                value={filters.tags}
                onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Report Content (printable) */}
      <div ref={reportRef}>
        {transactions.length > 0 && (
          <>
            {/* Summary Cards */}
            <Row className="g-3 mb-3">
              <Col md={4}>
                <Card className="border-0 bg-success bg-opacity-10 text-center py-3">
                  <h6 className="text-muted small mb-1">Total Income</h6>
                  <h5 className="fw-bold text-success mb-0">${totals.income.toLocaleString()}</h5>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 bg-danger bg-opacity-10 text-center py-3">
                  <h6 className="text-muted small mb-1">Total Expenses</h6>
                  <h5 className="fw-bold text-danger mb-0">${totals.expense.toLocaleString()}</h5>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 bg-primary bg-opacity-10 text-center py-3">
                  <h6 className="text-muted small mb-1">Net</h6>
                  <h5 className="fw-bold text-primary mb-0">
                    ${(totals.income - totals.expense).toLocaleString()}
                  </h5>
                </Card>
              </Col>
            </Row>

            {/* Transaction Table */}
            <Card className="shadow-sm border-0">
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Tags</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t._id}>
                        <td>{new Date(t.date).toLocaleDateString()}</td>
                        <td>{t.title}</td>
                        <td><Badge bg="secondary" className="fw-normal">{t.category}</Badge></td>
                        <td><Badge bg={t.type === "income" ? "success" : "danger"}>{t.type}</Badge></td>
                        <td>
                          {t.tags?.map((tag) => (
                            <Badge key={tag} bg="light" text="dark" className="me-1">{tag}</Badge>
                          ))}
                        </td>
                        <td className="text-end fw-semibold">
                          {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            <small className="text-muted mt-2 d-block">
              Showing {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
            </small>
          </>
        )}

        {transactions.length === 0 && !loading && (
          <div className="text-center text-muted py-5">
            <p>Use the filters above and click "Generate Report" to view transaction data.</p>
          </div>
        )}
      </div>
    </div>
  )
}
