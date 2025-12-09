export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Khách Hàng</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Đặt Phòng Sắp Tới</p>
          <p className="text-3xl font-bold text-purple-600">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Tổng Đặt Phòng</p>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-pink-500">
          <p className="text-gray-600 text-sm">Khách sạn Yêu Thích</p>
          <p className="text-3xl font-bold text-pink-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Điểm Thành Viên</p>
          <p className="text-3xl font-bold text-green-600">2,450</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Đặt Phòng Sắp Tới</h3>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded">
              <p className="font-medium">Sunrise Beach Hotel</p>
              <p className="text-sm text-gray-600">15 Dec - 18 Dec 2024</p>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <p className="font-medium">Downtown Plaza Hotel</p>
              <p className="text-sm text-gray-600">25 Dec - 28 Dec 2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Khách sạn Gần Đây</h3>
          <div className="space-y-3">
            <div className="p-3 bg-pink-50 rounded">
              <p className="font-medium">Mountain Resort</p>
              <p className="text-sm text-gray-600">Lần truy cập: 2 ngày trước</p>
            </div>
            <div className="p-3 bg-pink-50 rounded">
              <p className="font-medium">Beach Paradise Hotel</p>
              <p className="text-sm text-gray-600">Lần truy cập: 5 ngày trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
