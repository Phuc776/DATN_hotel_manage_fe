import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import { useAuth } from "../../auth/AuthContext"
import 'antd/dist/reset.css';
import { Card, Input, Button, Typography, Alert } from 'antd'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Card style={{ width: '100%', maxWidth: 560, borderRadius: 12, padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Typography.Title level={2} style={{ margin: 0, color: '#1e3a8a' }}>
            Hotel Management
          </Typography.Title>
          <Typography.Text type="secondary">Đăng nhập vào hệ thống</Typography.Text>
        </div>

        {error && (
          <div style={{ marginBottom: 12 }}>
            <Alert type="error" message={error} showIcon />
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              placeholder="email@example.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              size="large"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <Input.Password
              value={form.matKhau}
              onChange={(e) => setForm({ ...form, matKhau: e.target.value })}
              required
              placeholder="••••••••"
              size="large"
            />
          </div>

          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
