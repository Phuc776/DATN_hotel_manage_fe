export default function StaffDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Nhân Viên</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Check In Hôm Nay</p>
          <p className="text-3xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Check Out Hôm Nay</p>
          <p className="text-3xl font-bold text-orange-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Phòng Cần Vệ Sinh</p>
          <p className="text-3xl font-bold text-red-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Yêu Cầu Dịch Vụ</p>
          <p className="text-3xl font-bold text-blue-600">3</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Công Việc Hôm Nay</h3>
        <div className="space-y-2">
          <div className="p-3 bg-green-50 rounded flex items-center justify-between">
            <span>Check In Phòng 301</span>
            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">Hoàn Thành</button>
          </div>
          <div className="p-3 bg-green-50 rounded flex items-center justify-between">
            <span>Vệ Sinh Phòng 205</span>
            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">Hoàn Thành</button>
          </div>
          <div className="p-3 bg-green-50 rounded flex items-center justify-between">
            <span>Kiểm Tra Dịch Vụ Phòng 410</span>
            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">Hoàn Thành</button>
          </div>
        </div>
      </div>
    </div>
  )
}
