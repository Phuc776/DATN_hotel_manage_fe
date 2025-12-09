export default function OwnerDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Chủ Khách sạn</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Khách sạn Của Tôi</p>
          <p className="text-3xl font-bold text-blue-600">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Phòng Trống</p>
          <p className="text-3xl font-bold text-green-600">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Đơn Đặt Hôm Nay</p>
          <p className="text-3xl font-bold text-yellow-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Doanh Thu Tháng</p>
          <p className="text-3xl font-bold text-purple-600">$12,450</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Khách sạn</h3>
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 rounded">Sunrise Beach Hotel - 45 phòng</div>
          <div className="p-3 bg-blue-50 rounded">Downtown Plaza Hotel - 32 phòng</div>
          <div className="p-3 bg-blue-50 rounded">Mountain Resort - 28 phòng</div>
        </div>
      </div>
    </div>
  )
}
