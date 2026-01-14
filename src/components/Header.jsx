import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function Header() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Hotel Management
      </Link>

      <nav className="flex items-center space-x-4">
        {user ? (
          <>
            {/* Dashboard link based on role */}
            {(() => {
              const role = user.role || user?.userData?.vaiTro;
              let path = "/";
              if (role === "ADMIN") path = "/admin";
              else if (role === "CHU_KHACH_SAN") path = "/owner";
              else if (role === "NHAN_VIEN") path = "/staff";
              else if (role === "KHACH_HANG") path = "/user";
              return (
                <Link to={path} className="text-blue-600 hover:text-blue-800 font-medium">
                  Dashboard
                </Link>
              );
            })()}

            <span className="text-gray-700">{user.userData?.hoTen}</span>
            <button
              onClick={handleLogout}
              className=" text-white px-4 py-2 rounded transition"
            >
              Đăng Xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Đăng nhập
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
              Đăng ký
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
