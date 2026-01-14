import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Tag, Spin, message, Row, Col } from "antd";
import ImageGallery from "../../components/ImageGallery";
import api from "../../api/axios";

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const statusMap = {
    CHO_DUYET: { label: "Chờ duyệt" , color: "orange" },
    DA_DUYET: { label: "Đã duyệt", color: "green" },
    CAP_NHAT_THONG_TIN: { label: "Chờ duyệt cập nhật", color: "blue" },
    TU_CHOI: { label: "Từ chối", color: "red" },
    NGUNG_HOAT_DONG: { label: "Ngừng hoạt động", color: "gray" },
  };

  useEffect(() => {
    api
      .get(`/chu-khach-san/khach-san/${id}`)
      .then((res) => {
        if (res.data.success) {
          setHotel(res.data.data);
        } else {
          message.error(res.data.message || "Không thể tải dữ liệu");
        }
      })
      .catch(() => {
        message.error("Lỗi tải chi tiết khách sạn");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spin size="large" className="mt-10" />;
  if (!hotel) return <p>Không tìm thấy khách sạn</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chi tiết khách sạn: {hotel.tenKhachSan}</h1>

      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <Card title="Thông tin khách sạn" className="mb-4">
            <Descriptions column={1}>
              <Descriptions.Item label="Tên khách sạn">{hotel.tenKhachSan}</Descriptions.Item>

              <Descriptions.Item label="Địa chỉ">{hotel.diaChi}</Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <Tag color={statusMap[hotel.trangThai].color}>{statusMap[hotel.trangThai].label}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Chủ khách sạn">{hotel.chuKhachSan?.email}</Descriptions.Item>

              <Descriptions.Item label="Số phòng kinh doanh">{hotel.soPhongKinhDoanh}</Descriptions.Item>

              <Descriptions.Item label="Số nhân viên">{hotel.soNhanVien}</Descriptions.Item>

              <Descriptions.Item label="Số bài đăng phòng">{hotel.soBaiDangPhong}</Descriptions.Item>

              <Descriptions.Item label="Điểm đánh giá trung bình">{hotel.danhGiaTrungBinh.toFixed(1)}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <ImageGallery images={hotel.hinhAnh || []} />
        </Col>
      </Row>
    </div>
  );
}
