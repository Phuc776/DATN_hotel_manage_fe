import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../api/axios"
import { Row, Col, Card, Spin, Tag, Button, Empty } from "antd"
import SearchAvailable from "../user/SearchAvailable"

export default function Home() {
  const [hotels, setHotels] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false);


  const RoomPostStatusMap = {
    CHO_DUYET: "Chờ duyệt",
    DA_DUYET: "Đã duyệt",
    TU_CHOI: "Từ chối",
  }
  const HotelStatusMap = {
    CHO_DUYET: "Chờ duyệt",
    DA_DUYET: "Đã duyệt",
    CAP_NHAT_THONG_TIN: "Chờ duyệt cập nhật",
    TU_CHOI: "Từ chối",
    NGUNG_HOAT_DONG: "Ngừng hoạt động",
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get("/khach-san/public"),
      api.get("/bai-dang-phong/public")
    ])
      .then(([hRes, pRes]) => {
        setHotels(hRes?.data?.data || [])
        setPosts(pRes?.data?.data || [])
      })
      .catch(() => {
        // silent for now; other pages show messages elsewhere
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center p-8"><Spin size="large" /></div>

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 rounded-lg">
        <div className="max-w-2xl px-6">
          <h1 className="text-4xl font-bold mb-4">Chào mừng đến Hotel Management</h1>
          <p className="text-lg mb-6">Tìm và đặt khách sạn tốt nhất cho kỳ nghỉ của bạn</p>
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Đăng Nhập Ngay
          </Link>
        </div>
      </section>

      <Button
        type="primary"
        size="large"
        onClick={() => setShowSearch(true)}
      >
        Đặt phòng / Tìm phòng
      </Button>

      {showSearch && (
        <section className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            Tìm phòng trống
          </h2>

          <SearchAvailable
            onSelect={(data) => {
              navigate(`/search/${data.baiDangPhongId}`, {
                state: data
              });
            }}
          />
        </section>
      )}



      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Khách sạn hiện tại</h2>
        {hotels.length === 0 ? (
          <Empty description="Chưa có khách sạn" />
        ) : (
          <Row gutter={[16, 16]}>
            {hotels.map((h) => (
              <Col key={h.id} xs={24} sm={12} lg={8}>
                <Card hoverable>
                  <div className="h-40 bg-gray-200 mb-4 rounded" />
                  <h3 className="text-xl font-semibold">{h.tenKhachSan}</h3>
                  <p className="text-gray-600 text-sm mb-2">{h.diaChi}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <Tag color={h.trangThai === "DA_DUYET" ? "green" : "orange"}>{HotelStatusMap[h.trangThai]}</Tag>
                    </div>
                    <div className="flex gap-2">
                      <Button type="primary">
                        <a href={`/hotels/${h.id}`} className="text-white">Xem chi tiết</a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Bài đăng phòng đã duyệt</h2>
        {posts.length === 0 ? (
          <Empty description="Chưa có bài đăng" />
        ) : (
          <Row gutter={[16, 16]}>
            {posts.map((p) => (
              <Col key={p.id} xs={24} sm={12} lg={8}>
                <Card hoverable>
                  <div className="h-40 bg-gray-200 mb-4 rounded" />
                  <h3 className="text-lg font-semibold">{p.tieuDe || `Bài đăng ${p.id}`}</h3>
                  <p className="text-gray-600 text-sm mb-1">Khách sạn: {p.khachSan?.tenKhachSan || p.khachSanId?.tenKhachSan}</p>
                  <p className="text-gray-600 text-sm mb-2">Giá: {p.loaiPhong.gia?.toLocaleString() || "—"} VNĐ</p>
                  <div className="flex items-center justify-between">
                    <Tag color={p.trangThaiBaiDang === "DA_DUYET" ? "green" : "orange"}>{RoomPostStatusMap[p.trangThaiBaiDang]}</Tag>
                    <Button type="link">
                      <a href={`/room-posts/${p.id}`}>Xem chi tiết</a>
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </div>
  )
}
