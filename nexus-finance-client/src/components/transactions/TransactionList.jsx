import { Table, Form, Button, Badge } from "react-bootstrap"
import { BsPencil, BsTrash } from "react-icons/bs"

export default function TransactionList({
  transactions,
  selected,
  setSelected,
  onEdit,
  onDelete,
  onBulkDelete,
}) {
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selected.length === transactions.length) {
      setSelected([])
    } else {
      setSelected(transactions.map((t) => t._id))
    }
  }

  return (
    <div className="bg-white rounded-3 shadow-sm">
      {selected.length > 0 && (
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <span className="text-muted small">{selected.length} selected</span>
          <Button variant="danger" size="sm" onClick={() => onBulkDelete(selected)}>
            <BsTrash className="me-1" /> Delete Selected
          </Button>
        </div>
      )}
      <Table responsive hover className="mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: 40 }}>
              <Form.Check
                checked={transactions.length > 0 && selected.length === transactions.length}
                onChange={toggleAll}
              />
            </th>
            <th>Title</th>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
            <th style={{ width: 80 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-muted py-4">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t._id}>
                <td>
                  <Form.Check
                    checked={selected.includes(t._id)}
                    onChange={() => toggleSelect(t._id)}
                  />
                </td>
                <td className="fw-medium">{t.title}</td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>
                  <Badge bg="secondary" className="fw-normal">{t.category}</Badge>
                </td>
                <td className="fw-semibold">
                  {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                </td>
                <td>
                  <Badge bg={t.type === "income" ? "success" : "danger"}>
                    {t.type}
                  </Badge>
                </td>
                <td>
                  <Button variant="link" size="sm" className="p-0 me-2 text-dark" onClick={() => onEdit(t)}>
                    <BsPencil />
                  </Button>
                  <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => onDelete(t._id)}>
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}
