import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import { useAuth } from "../../auth/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", matKhau: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await api.post("/auth/login", form)
      
      login(res.data)

      const redirectMap = {
        ADMIN: "/admin",
        CHU_KHACH_SAN: "/owner",
        NHAN_VIEN: "/staff",
        KHACH_HANG: "/user",
      }
      navigate(redirectMap[res.data.vaiTro] || "/")
    } catch (err) {
      setError(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">Hotel Management</h1>
        <p className="text-center text-gray-600 mb-6">Đăng nhập vào hệ thống</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              placeholder="email@example.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              type="password"
              placeholder="••••••••"
              value={form.matKhau}
              onChange={(e) => setForm({ ...form, matKhau: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  )
}
