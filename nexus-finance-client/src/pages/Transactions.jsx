import { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
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

  const fetchTransactions = async () => {
    try {
      const res = await getTransactionsAPI(filters)
      if (res.data.success) setTransactions(res.data.data)
    } catch (err) {
      console.error("Failed to fetch transactions:", err)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateTransactionAPI(editing._id, data)
      } else {
        await createTransactionAPI(data)
      }
      setIsOpen(false)
      setEditing(null)
      fetchTransactions()
    } catch (err) {
      console.error("Failed to save transaction:", err)
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
      console.error("CSV export failed:", err)
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
          <Button variant="dark" size="sm" onClick={() => setIsOpen(true)}>
            <BsPlus size={18} /> Add Transaction
          </Button>
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} onApply={fetchTransactions} />

      <TransactionList
        transactions={transactions}
        selected={selected}
        setSelected={setSelected}
        onEdit={(t) => { setEditing(t); setIsOpen(true) }}
        onDelete={async (id) => { await deleteTransactionAPI(id); fetchTransactions() }}
        onBulkDelete={async (ids) => { await bulkDeleteTransactionsAPI(ids); setSelected([]); fetchTransactions() }}
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
