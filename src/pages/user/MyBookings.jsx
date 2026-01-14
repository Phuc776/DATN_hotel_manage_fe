import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Tag, message, Space } from "antd";
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

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/khach-hang/booking");
      setBookings(res.data.data || []);
    } catch (err) {
      message.error("Không lấy được danh sách booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const yeuCauTraPhong = async (bookingId) => {
    try {
      await api.post(`/khach-hang/booking/${bookingId}/confirm`);
      message.success("Đã gửi yêu cầu trả phòng");
      fetchBookings();
    } catch {
      message.error("Không thể yêu cầu trả phòng");
    }
  };

  const yeuCauHuyBooking = async (bookingId) => {
    try {
      await api.post(`/khach-hang/booking/${bookingId}/cancel`);
      message.success("Đã gửi yêu cầu hủy booking");
      fetchBookings();
    } catch {
      message.error("Không thể hủy booking");
    }
  };

  const columns = [
    {
      title: "Mã booking",
      render: (_, __, idx) => `${idx + 1}`,
      key: "id"
    },
    {
      title: "Tên phòng",
      render : (_, record) => record.phong?.soPhong,
      key: "tenPhong"
    },
    {
      title: "Ngày nhận",
      dataIndex: "ngayNhan",
      key: "ngayNhan"
    },
    {
      title: "Ngày trả",
      dataIndex: "ngayTra",
      key: "ngayTra"
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (value) => {
        const info = trangThaiMap[value] || {};
        return <Tag color={info.color}>{info.label || value}</Tag>;
      }
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button size="middle" onClick={() => navigate(`/user/bookings/${record.id}`)}>Chi tiết</Button>

          {record.trangThai === "DANG_O" && (
            <Button type="primary" size="middle" onClick={() => yeuCauTraPhong(record.id)}>Trả phòng</Button>
          )}

          {(record.trangThai === "CHO_XAC_NHAN" || record.trangThai === "DA_XAC_NHAN") && (
            <Button danger size="middle" onClick={() => yeuCauHuyBooking(record.id)}>Hủy booking</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={bookings}
      loading={loading}
    />
  );
}
