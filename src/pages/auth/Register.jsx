import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

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
      const res = await api.post("/auth/register", {
        email: form.email,
        matKhau: form.matKhau,
        vaiTro: form.vaiTro,
        hoTen: form.hoTen,
        soDienThoai: form.soDienThoai || null,
      });

      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">Hotel Management</h1>
        <p className="text-center text-gray-600 mb-6">Tạo tài khoản mới</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              value={form.hoTen}
              onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              value={form.matKhau}
              onChange={(e) => setForm({ ...form, matKhau: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              value={form.soDienThoai}
              onChange={(e) => setForm({ ...form, soDienThoai: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              value={form.vaiTro}
              onChange={(e) => setForm({ ...form, vaiTro: e.target.value })}
            >
              <option value="KHACH_HANG">Khách hàng</option>
              <option value="CHU_KHACH_SAN">Chủ khách sạn</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}
