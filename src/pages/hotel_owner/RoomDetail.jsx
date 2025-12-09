import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Spin, message, Button, Tag } from "antd";
import api from "../../api/axios";

export default function OwnerRoomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState(null);

    const statusLabel = {
        TRONG: "Trống",
        DA_DAT: "Đã đặt",
        CHUA_DEN: "Chưa đến",
        CO_KHACH: "Có khách",
        CHUA_DI: "Chưa đi",
        DA_TRA: "Đã trả",
    };
    const statusColor = {
        TRONG: "green",
        DA_DAT: "orange",
        CHUA_DEN: "blue",
        CO_KHACH: "red",
        CHUA_DI: "purple",
        DA_TRA: "gray",
    };

    useEffect(() => {
        if (!id) return;
        api.get(`/chu-khach-san/phong/${id}`)
            .then((res) => setRoom(res.data.data))
            .catch(() => message.error("Lỗi tải chi tiết phòng"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Spin className="m-10" />;
    if (!room) return <p>Không tìm thấy phòng</p>;

    return (
        <div>
            <Button onClick={() => navigate(-1)} className="mb-4">← Quay lại</Button>
            <h1 className="text-2xl font-bold mb-4">Chi tiết phòng: {room.soPhong}</h1>

            <Card>
                <Descriptions column={1}>
                    <Descriptions.Item label="Số phòng">{room.soPhong}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái"><Tag color={statusColor[room.trangThaiPhong]}>{statusLabel[room.trangThaiPhong]}</Tag></Descriptions.Item>
                        <Descriptions.Item label="Loại phòng">{room.loaiPhongId?.tenLoaiPhong}</Descriptions.Item>
                        <Descriptions.Item label="Khách sạn">{room.khachSan?.tenKhachSan || room.khachSanId?.tenKhachSan}</Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">{room.khachSan?.diaChi || room.khachSanId?.diaChi}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    )
}