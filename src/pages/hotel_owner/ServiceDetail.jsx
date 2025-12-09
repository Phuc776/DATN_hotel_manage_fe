import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Spin, message, Button } from "antd";
import api from "../../api/axios";

export default function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState(null);

    useEffect(() => {
        if (!id) return;
        api.get(`/chu-khach-san/dich-vu/${id}`)
            .then((res) => setService(res.data.data))
            .catch(() => message.error("Lỗi tải chi tiết dịch vụ"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Spin className="m-10" />;
    if (!service) return <p>Không tìm thấy dịch vụ</p>;

    return (
        <div>
            <Button onClick={() => navigate(-1)} className="mb-4">← Quay lại</Button>
            <h1 className="text-2xl font-bold mb-4">Chi tiết: {service.tenDichVu}</h1>

            <Card>
                <Descriptions column={1}>
                    <Descriptions.Item label="Tên">{service.tenDichVu}</Descriptions.Item>
                    <Descriptions.Item label="Đơn Giá">{service.donGia}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">{service.moTa}</Descriptions.Item>
                    <Descriptions.Item label="Khách sạn">
                        <div className="font-semibold">{service.khachSan?.tenKhachSan}</div>
                        <div className="text-sm text-gray-500">{service.khachSan?.diaChi}</div>
                        <div className="mt-1">Chủ: {service.khachSan?.chuKhachSan?.email}</div>
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    )
}