import { Outlet, Link } from "react-router-dom"
import Header from "../components/Header"

export default function AdminLayout() {

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1">

        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
          <nav className="flex flex-col p-4 space-y-2">
            <Link to="/admin" className="px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium">
              Dashboard
            </Link>
            <Link to="/admin/users" className="px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600">
              Quản lý Người dùng
            </Link>
            <Link to="/admin/hotels" className="px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600">
              Danh sách khách sạn
            </Link>
            <Link to="/admin/pending-hotels" className="px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600">
              Duyệt khách sạn
            </Link>
            <Link to="/admin/notif" className="px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600">
              Thông Báo
            </Link>
            <Link to="/admin/room-posts" className="px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600">
              Quản lý bài đăng phòng
            </Link>
            <Link to="/admin/room-types" className="px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600">
              Quản lý loại phòng
            </Link>
            <Link to="/admin/services" className="px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600">
              Quản lý dịch vụ
            </Link>


          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-6 bg-gray-200">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
