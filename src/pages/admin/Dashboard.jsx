export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Bảng Điều Khiển Quản Trị</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Tổng Người Dùng</p>
          <p className="text-3xl font-bold text-red-600">156</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Khách sạn</p>
          <p className="text-3xl font-bold text-blue-600">42</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Đơn Đặt Phòng</p>
          <p className="text-3xl font-bold text-green-600">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Doanh Thu</p>
          <p className="text-3xl font-bold text-purple-600">$45,321</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Hoạt Động Gần Đây</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-gray-700">Khách sạn mới được thêm: Sunrise Hotel</span>
            <span className="text-gray-500 text-sm">2 giờ trước</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-gray-700">Người dùng đã đăng ký: John Doe</span>
            <span className="text-gray-500 text-sm">5 giờ trước</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Bài đăng được phê duyệt</span>
            <span className="text-gray-500 text-sm">1 ngày trước</span>
          </div>
        </div>
      </div>
    </div>
  )
}
