import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Onboarding from "./pages/Onboarding"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Budgets from "./pages/Budgets"
import Goals from "./pages/Goals"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import ProtectedRoute from "./routes/ProtectedRoute"
import Layout from "./layout/Layout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
