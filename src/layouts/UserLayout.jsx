import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import Header from "../components/Header"

export default function UserLayout() {
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
            <h2 className="text-2xl font-bold text-purple-600">My Account</h2>
            <p className="text-sm text-gray-600 mt-1">{user?.userData?.email}</p>
          </div>
          <nav className="flex flex-col p-4 space-y-2">
            <Link to="/user" className="px-4 py-2 rounded-lg hover:bg-purple-50 text-purple-600 font-medium">
              Dashboard
            </Link>
            <Link to="/user/bookings" className="px-4 py-2 rounded-lg hover:bg-purple-50">
              Đặt Phòng Của Tôi
            </Link>
            {/* <Link to="/user/favorites" className="px-4 py-2 rounded-lg hover:bg-purple-50">
              Khách sạn Yêu Thích
            </Link> */}
            <Link to="/user/profile" className="px-4 py-2 rounded-lg hover:bg-purple-50">
              Hồ Sơ Cá Nhân
            </Link>
            <Link to="/user/stay-current" className="px-4 py-2 rounded-lg hover:bg-purple-50">
              Phiên Lưu Trú Hiện Tại
            </Link>
            <Link to="/user/stay-list" className="px-4 py-2 rounded-lg hover:bg-purple-50">
              Danh sách phiên Lưu Trú
            </Link>
            <Link to="/user/use-service" className="px-4 py-2 rounded-lg hover:bg-purple-50">
              Sử Dụng Dịch Vụ
            </Link>
            <Link to="/user/invoice-history" className="px-4 py-2 rounded-lg hover:bg-purple-50">
              Lịch Sử Hóa Đơn
            </Link>
            <Link to="/user/reviews" className="px-4 py-2 rounded-lg hover:bg-purple-50">
              Đánh Giá Của Tôi
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
