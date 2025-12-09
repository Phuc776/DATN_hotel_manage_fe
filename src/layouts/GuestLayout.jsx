import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import Header from "../components/Header"

export default function GuestLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <>
      <Header />

      <main className="p-6 bg-gray-200 flex-1 overflow-auto">
        <Outlet />
      </main>
    </>
  )
}
