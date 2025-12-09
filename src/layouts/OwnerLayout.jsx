import { Outlet, Link } from "react-router-dom"
import Header from "../components/Header"

export default function OwnerLayout() {

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1">

        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
          <nav className="flex flex-col p-4 space-y-2">
            <Link to="/owner" className="px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/owner/hotels" className="px-4 py-2 rounded-lg hover:bg-blue-50">
              Quản lý Khách sạn
            </Link>
            <Link to="/owner/staff" className="px-4 py-2 rounded-lg hover:bg-blue-50">
              Quản lý Nhân viên
            </Link>
            <Link to="/owner/room-posts" className="px-4 py-2 rounded-lg hover:bg-blue-50">
              Quản lý Bài Đăng Phòng
            </Link>
            <Link to="/owner/roomtypes" className="px-4 py-2 rounded-lg hover:bg-blue-50">
              Quản lý Loại Phòng
            </Link>
            <Link to="/owner/services" className="px-4 py-2 rounded-lg hover:bg-blue-50">
              Quản lý Dịch Vụ
            </Link>
            <Link to="/owner/rooms" className="px-4 py-2 rounded-lg hover:bg-blue-50">
              Quản lý Phòng
            </Link>
            <Link to="/owner/bookings" className="px-4 py-2 rounded-lg hover:bg-blue-50">
              Đơn Đặt Phòng
            </Link>
            <Link to="/owner/notif" className="px-4 py-2 rounded-lg hover:bg-blue-50">
              Thông Báo
            </Link>
            <Link to="/owner/reports" className="px-4 py-2 rounded-lg hover:bg-blue-50">
              Báo Cáo
            </Link>
          </nav>
        </aside>

        {/* Phần nội dung */}
        <main className="flex-1 overflow-auto p-6 bg-gray-200">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
