import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Spin, message, Button } from "antd";
import api from "../../api/axios";

export default function RoomtypeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomtype, setRoomtype] = useState(null);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/chu-khach-san/loai-phong/${id}`)
      .then((res) => setRoomtype(res.data.data))
      .catch(() => message.error("Lỗi tải chi tiết loại phòng"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin className="m-10" />;
  if (!roomtype) return <p>Không tìm thấy loại phòng</p>;

  return (
    <div>
      <Button onClick={() => navigate(-1)} className="mb-4">← Quay lại</Button>
      <h1 className="text-2xl font-bold mb-4">Chi tiết: {roomtype.tenLoaiPhong}</h1>

      <Card>
        <Descriptions column={1}>
          <Descriptions.Item label="Tên">{roomtype.tenLoaiPhong}</Descriptions.Item>
          <Descriptions.Item label="Giá">{roomtype.gia}</Descriptions.Item>
          <Descriptions.Item label="Số lượng còn">{roomtype.soLuongCon}</Descriptions.Item>
          <Descriptions.Item label="Số người lớn">{roomtype.soNguoiLon}</Descriptions.Item>
          <Descriptions.Item label="Số trẻ em">{roomtype.soTreEm}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{roomtype.moTa}</Descriptions.Item>
          <Descriptions.Item label="Khách sạn">
            <div className="font-semibold">{roomtype.khachSan?.tenKhachSan}</div>
            <div className="text-sm text-gray-500">{roomtype.khachSan?.diaChi}</div>
            <div className="mt-1">Chủ: {roomtype.khachSan?.chuKhachSan?.email}</div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}