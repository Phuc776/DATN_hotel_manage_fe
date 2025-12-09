import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, message,Tag } from "antd";
import api from "../../api/axios";

export default function StaffDetail() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState(null);

    const getDetail = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await api.get(`/chu-khach-san/nhan-vien/${id}`);
            setStaff(res.data.data);
        } catch (e) {
            message.error("Không thể tải chi tiết nhân viên");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDetail();
    }, [id]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Chi tiết nhân viên</h1>
            <Card loading={loading}>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="ID">{staff?.id}</Descriptions.Item>
                    <Descriptions.Item label="Chức vụ">{staff?.chucVu}</Descriptions.Item>

                    <Descriptions.Item label="Khách sạn">
                        <div className="font-semibold">{staff?.khachSan?.tenKhachSan}</div>
                        <div className="text-sm text-gray-500">{staff?.khachSan?.diaChi}</div>
                        <div className="mt-1">Trạng thái: <Tag color={staff?.khachSan?.trangThai ? 'green' : 'red'}>{staff?.khachSan?.trangThai}</Tag></div>
                        <div className="mt-1">Chủ khách sạn: {staff?.khachSan?.chuKhachSan?.email}</div>
                    </Descriptions.Item>

                    <Descriptions.Item label="Họ tên">{staff?.taiKhoan?.hoTen}</Descriptions.Item>
                    <Descriptions.Item label="Email">{staff?.taiKhoan?.email}</Descriptions.Item>
                    <Descriptions.Item label="SĐT">{staff?.taiKhoan?.soDienThoai}</Descriptions.Item>
                    <Descriptions.Item label="Vai trò">{staff?.taiKhoan?.vaiTro}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{staff?.taiKhoan?.ngayTao}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{staff?.taiKhoan?.trangThai ? 'Hoạt động' : 'Bị khóa'}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    )
}