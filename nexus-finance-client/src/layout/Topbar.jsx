import { useState } from "react"
import { Navbar, Button, Badge, Dropdown } from "react-bootstrap"
import { BsList, BsBell, BsBoxArrowRight } from "react-icons/bs"
import { useAuthStore } from "../store/authStore"
import { useNotificationStore } from "../store/notificationStore"
import { logoutAPI } from "../api/auth.api"
import { useNavigate } from "react-router-dom"

export default function Topbar({ setIsOpen }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore()
  const [showNotifs, setShowNotifs] = useState(false)

  const handleLogout = async () => {
    try {
      await logoutAPI()
    } catch {
      // ignore
    }
    logout()
    navigate("/login")
  }

  return (
    <Navbar bg="white" className="topbar shadow-sm px-3 py-2 d-flex justify-content-between">
      <Button
        variant="light"
        className="d-md-none border-0"
        onClick={() => setIsOpen(true)}
      >
        <BsList size={22} />
      </Button>

      <div className="ms-auto d-flex align-items-center gap-3">
        <Dropdown show={showNotifs} onToggle={setShowNotifs} align="end">
          <Dropdown.Toggle variant="light" className="border-0 position-relative" id="notif-dropdown">
            <BsBell size={18} />
            {unreadCount > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: "0.65rem" }}
              >
                {unreadCount}
              </Badge>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ width: "320px", maxHeight: "400px", overflow: "auto" }}>
            <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
              <strong>Notifications</strong>
              {unreadCount > 0 && (
                <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={markAllRead}>
                  Mark all read
                </Button>
              )}
            </div>
            {notifications.length === 0 ? (
              <Dropdown.ItemText className="text-muted text-center py-3">
                No notifications
              </Dropdown.ItemText>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <Dropdown.Item
                  key={n._id}
                  onClick={() => markRead(n._id)}
                  className={!n.isRead ? "bg-light" : ""}
                >
                  <small className={!n.isRead ? "fw-semibold" : "text-muted"}>
                    {n.message}
                  </small>
                </Dropdown.Item>
              ))
            )}
          </Dropdown.Menu>
        </Dropdown>

        <span className="text-muted small d-none d-md-inline">
          {user?.name || user?.email}
        </span>

        <Button variant="dark" size="sm" onClick={handleLogout}>
          <BsBoxArrowRight className="me-1" />
          Logout
        </Button>
      </div>
    </Navbar>
  )
}
