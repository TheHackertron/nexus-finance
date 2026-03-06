import { useState, useEffect } from "react"
import { Button, Alert } from "react-bootstrap"
import { BsPlus, BsDownload } from "react-icons/bs"
import {
  getTransactionsAPI,
  createTransactionAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
  bulkDeleteTransactionsAPI,
  exportCSVAPI,
} from "../api/transactions.api"
import TransactionList from "../components/transactions/TransactionList"
import TransactionForm from "../components/transactions/TransactionForm"
import FilterBar from "../components/transactions/FilterBar"

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [filters, setFilters] = useState({})
  const [selected, setSelected] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState("")

  const fetchTransactions = async (overrideFilters) => {
    try {
      const res = await getTransactionsAPI(overrideFilters !== undefined ? overrideFilters : filters)
      if (res.data.success) {
        setTransactions(res.data.data)
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleSubmit = async (data) => {
    setError("")
    try {
      const res = editing
        ? await updateTransactionAPI(editing._id, data)
        : await createTransactionAPI(data)

      if (res.data.success) {
        setIsOpen(false)
        setEditing(null)
        fetchTransactions()
      } else {
        setError(res.data.message || "Failed to save transaction")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save transaction. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await deleteTransactionAPI(id)
      if (!res.data.success) setError(res.data.message)
      fetchTransactions()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete transaction")
    }
  }

  const handleBulkDelete = async (ids) => {
    try {
      const res = await bulkDeleteTransactionsAPI(ids)
      if (!res.data.success) setError(res.data.message)
      setSelected([])
      fetchTransactions()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete transactions")
    }
  }

  const handleExportCSV = async () => {
    try {
      const res = await exportCSVAPI()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "transactions.csv")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError("CSV export failed")
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Transactions</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-dark" size="sm" onClick={handleExportCSV}>
            <BsDownload className="me-1" /> CSV
          </Button>
          <Button variant="dark" size="sm" onClick={() => { setError(""); setIsOpen(true) }}>
            <BsPlus size={18} /> Add Transaction
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="py-2">
          {error}
        </Alert>
      )}

      <FilterBar filters={filters} setFilters={setFilters} onApply={fetchTransactions} />

      <TransactionList
        transactions={transactions}
        selected={selected}
        setSelected={setSelected}
        onEdit={(t) => { setError(""); setEditing(t); setIsOpen(true) }}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
      />

      <TransactionForm
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        initialData={editing}
      />
    </div>
  )
}
