"use client"

import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function StaffLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-green-600">Hotel Staff</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.userData?.email}</p>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <Link to="/staff" className="px-4 py-2 rounded-lg hover:bg-green-50 text-green-600 font-medium">
            Dashboard
          </Link>
          <Link to="/staff/bookings" className="px-4 py-2 rounded-lg hover:bg-green-50">
            Quản lý Đặt Phòng
          </Link>
          <Link to="/staff/check-in" className="px-4 py-2 rounded-lg hover:bg-green-50">
            Check In/Out
          </Link>
          <Link to="/staff/rooms" className="px-4 py-2 rounded-lg hover:bg-green-50">
            Tình Trạng Phòng
          </Link>
          <Link to="/staff/services" className="px-4 py-2 rounded-lg hover:bg-green-50">
            Dịch Vụ Thêm
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
          >
            Đăng Xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Quản lý Nhân viên</h1>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
