import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import { useNotificationStore } from "../store/notificationStore"

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false)
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications)

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return (
    <div className="d-flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="main-content bg-light">
        <Topbar setIsOpen={setIsOpen} />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
