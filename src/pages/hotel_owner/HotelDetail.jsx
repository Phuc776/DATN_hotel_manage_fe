import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Tag, Spin, message } from "antd";
import api from "../../api/axios";

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const statusLabelMap = {
    CHO_DUYET: "Chờ duyệt",
    DA_DUYET: "Đã duyệt",
    CAP_NHAT_THONG_TIN: "Chờ duyệt cập nhật",
    TU_CHOI: "Từ chối",
    NGUNG_HOAT_DONG: "Ngừng hoạt động",
  };
  const statusColorMap = {
    CHO_DUYET: "orange",
    DA_DUYET: "green",
    CAP_NHAT_THONG_TIN: "blue",
    TU_CHOI: "red",
    NGUNG_HOAT_DONG: "gray",
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
      <h1 className="text-2xl font-bold mb-4">
        Chi tiết khách sạn: {hotel.tenKhachSan}
      </h1>

      <Card title="Thông tin khách sạn" className="mb-4">
        <Descriptions column={1}>
          <Descriptions.Item label="Tên khách sạn">{hotel.tenKhachSan}</Descriptions.Item>

          <Descriptions.Item label="Địa chỉ">{hotel.diaChi}</Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={statusColorMap[hotel.trangThai]}>
              {statusLabelMap[hotel.trangThai]}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Chủ khách sạn">
            {hotel.chuKhachSan?.email}
          </Descriptions.Item>

          <Descriptions.Item label="Số phòng kinh doanh">
            {hotel.soPhongKinhDoanh}
          </Descriptions.Item>

          <Descriptions.Item label="Số nhân viên">
            {hotel.soNhanVien}
          </Descriptions.Item>

          <Descriptions.Item label="Số bài đăng phòng">
            {hotel.soBaiDangPhong}
          </Descriptions.Item>

          <Descriptions.Item label="Điểm đánh giá trung bình">
            {hotel.danhGiaTrungBinh.toFixed(1)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
