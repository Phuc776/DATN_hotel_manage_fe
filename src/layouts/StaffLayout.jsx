import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import Header from "../components/Header"

export default function StaffLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
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
            <Link to="/staff/rooms" className="px-4 py-2 rounded-lg hover:bg-green-50">
              Tình Trạng Phòng
            </Link>
            <Link to="/staff/services" className="px-4 py-2 rounded-lg hover:bg-green-50">
              Dịch Vụ Thêm
            </Link>
            {/* <Link to="/staff/users" className="px-4 py-2 rounded-lg hover:bg-green-50">
              Quản Lý Người Dùng
            </Link> */}
            <Link to="/staff/invoices" className="px-4 py-2 rounded-lg hover:bg-green-50">
              Hóa Đơn
            </Link>
            <Link to="/staff/notif" className="px-4 py-2 rounded-lg hover:bg-green-50">
              Thông Báo
            </Link>
          </nav>

          <div className="mt-auto p-4">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
            >
              Đăng Xuất
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6 bg-gray-200">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
