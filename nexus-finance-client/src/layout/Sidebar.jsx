import { Link, useLocation } from "react-router-dom"
import { Nav } from "react-bootstrap"
import {
  BsGrid1X2Fill,
  BsReceipt,
  BsWallet2,
  BsBullseye,
  BsFileBarGraph,
  BsGearFill,
} from "react-icons/bs"

const navItems = [
  { path: "/", label: "Dashboard", icon: BsGrid1X2Fill },
  { path: "/transactions", label: "Transactions", icon: BsReceipt },
  { path: "/budgets", label: "Budgets", icon: BsWallet2 },
  { path: "/goals", label: "Savings Goals", icon: BsBullseye },
  { path: "/reports", label: "Reports", icon: BsFileBarGraph },
  { path: "/settings", label: "Settings", icon: BsGearFill },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={`sidebar bg-dark p-3 d-flex flex-column ${isOpen ? "show" : ""}`}>
        <h4 className="text-white fw-bold mb-4 px-2">
          <BsWallet2 className="me-2" />
          Nexus Finance
        </h4>
        <Nav className="flex-column flex-grow-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Nav.Link
              key={path}
              as={Link}
              to={path}
              onClick={() => setIsOpen(false)}
              className={location.pathname === path ? "active" : ""}
            >
              <Icon className="me-2" />
              {label}
            </Nav.Link>
          ))}
        </Nav>
      </div>
    </>
  )
}
