import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import 'antd/dist/reset.css';
import { Card, Input, Button, Select, Typography, Alert } from 'antd';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    matKhau: "",
    confirm: "",
    hoTen: "",
    soDienThoai: "",
    vaiTro: "KHACH_HANG",
    cccd: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.matKhau !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: form.email,
        matKhau: form.matKhau,
        vaiTro: form.vaiTro,
        hoTen: form.hoTen,
        soDienThoai: form.soDienThoai || null,
      };

      if (form.vaiTro === 'KHACH_HANG') {
        payload.cccd = form.cccd || null;
      }

      const res = await api.post("/auth/register", payload);

      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card style={{ width: '100%', maxWidth: 480, borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Typography.Title level={3} style={{ margin: 0, color: '#1e3a8a' }}>
            Hotel Management
          </Typography.Title>
          <Typography.Text type="secondary">Tạo tài khoản mới</Typography.Text>
        </div>

        {error && (
          <div style={{ marginBottom: 12 }}>
            <Alert type="error" message={error} showIcon />
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom: 12 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <Input
              value={form.hoTen}
              onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
              required
              placeholder="Họ và tên"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="email@example.com"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <Input.Password
              value={form.matKhau}
              onChange={(e) => setForm({ ...form, matKhau: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <Input.Password
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <Input
              type="tel"
              value={form.soDienThoai}
              onChange={(e) => setForm({ ...form, soDienThoai: e.target.value })}
              placeholder="Số điện thoại"
            />
          </div>

          {form.vaiTro === 'KHACH_HANG' && (
            <div style={{ marginBottom: 12 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">CCCD</label>
              <Input
                value={form.cccd}
                onChange={(e) => setForm({ ...form, cccd: e.target.value })}
                placeholder="Số CCCD (nếu có)"
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <Select
              value={form.vaiTro}
              onChange={(value) => setForm({ ...form, vaiTro: value })}
              style={{ width: '100%' }}
            >
              <Select.Option value="KHACH_HANG">Khách hàng</Select.Option>
              <Select.Option value="CHU_KHACH_SAN">Chủ khách sạn</Select.Option>
            </Select>
          </div>

          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
