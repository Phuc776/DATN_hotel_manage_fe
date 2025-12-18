import { useEffect, useState } from "react";
import { Card, Descriptions, Button, Tag, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const trangThaiMap = {
  CHO_XAC_NHAN: { color: "gold", label: "Chờ xác nhận" },
  DA_XAC_NHAN: { color: "blue", label: "Đã xác nhận" },
  DANG_O: { color: "green", label: "Đang ở" },
  CHO_TRA: { color: "orange", label: "Chờ trả phòng" },
  CHO_HUY: { color: "volcano", label: "Chờ hủy" },
  DA_HUY: { color: "red", label: "Đã hủy" },
  DA_TRA_PHONG: { color: "default", label: "Đã trả phòng" }
};

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBookingDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/khach-hang/booking/${id}`);
      setBooking(res.data.data);
    } catch {
      message.error("Không lấy được chi tiết booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const yeuCauTraPhong = async () => {
    try {
      await api.post(`/khach-hang/booking/${id}/confirm`);
      message.success("Đã gửi yêu cầu trả phòng");
      fetchBookingDetail();
    } catch {
      message.error("Không thể yêu cầu trả phòng");
    }
  };

  const yeuCauHuyBooking = async () => {
    try {
      await api.post(`/khach-hang/booking/${id}/cancel`);
      message.success("Đã gửi yêu cầu hủy booking");
      fetchBookingDetail();
    } catch {
      message.error("Không thể hủy booking");
    }
  };

  if (!booking) return null;

  const trangThaiInfo = trangThaiMap[booking.trangThai] || {};

  return (
    <Card
      title="Chi tiết booking"
      loading={loading}
      extra={
        <Button onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã booking">
          {booking.id}
        </Descriptions.Item>

        <Descriptions.Item label="Tên phòng">
          {booking.phong?.soPhong}
        </Descriptions.Item>

        <Descriptions.Item label="Khách sạn">
          {booking.phong?.khachSan?.tenKhachSan}
        </Descriptions.Item>

        <Descriptions.Item label="Địa chỉ">
          {booking.phong?.khachSan?.diaChi}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày nhận">
          {booking.ngayNhan}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày trả">
          {booking.ngayTra}
        </Descriptions.Item>

        <Descriptions.Item label="Số người lớn">
          {booking.soNguoiLon}
        </Descriptions.Item>

        <Descriptions.Item label="Số trẻ em">
          {booking.soTreEm}
        </Descriptions.Item>

        <Descriptions.Item label="Ghi chú">
          {booking.ghiChu || "—"}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <Tag color={trangThaiInfo.color}>
            {trangThaiInfo.label || booking.trangThai}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      {/* ACTIONS */}
      <div style={{ marginTop: 24 }}>
        {booking.trangThai === "DANG_O" && (
          <Button
            type="primary"
            onClick={yeuCauTraPhong}
          >
            Yêu cầu trả phòng
          </Button>
        )}

        {(booking.trangThai === "CHO_XAC_NHAN" ||
          booking.trangThai === "DA_XAC_NHAN") && (
          <Button
            danger
            style={{ marginLeft: 8 }}
            onClick={yeuCauHuyBooking}
          >
            Hủy booking
          </Button>
        )}
      </div>
    </Card>
  );
}
