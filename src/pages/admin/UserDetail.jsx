import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, message, Modal, Descriptions, Tag } from "antd";
import api from "../../api/axios";

export default function AdminUserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const roleLabelMap = {
        ADMIN: "Admin",
        CHU_KHACH_SAN: "Chủ khách sạn",
        NHAN_VIEN: "Nhân viên",
        KHACH_HANG: "Khách hàng",
    };

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDetail = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await api.get(`/admin/tai-khoan/${id}`);
            setUser(res.data.data);
        } catch (error) {
            message.error("Lỗi tải chi tiết tài khoản");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const confirmChangeStatus = () => {
        Modal.confirm({
            title: "Xác nhận đổi trạng thái",
            onOk: async () => {
                try {
                    const res = await api.post(`/admin/tai-khoan/${id}/change-status`);
                    message.success(res.data.message || "Đã đổi trạng thái");
                    navigate("/admin/users");
                } catch (error) {
                    message.error(error.response?.data?.message || "Lỗi đổi trạng thái");
                }
            },
        });
    };

    if (loading || !user) return <Spin className="m-10" />;

    return (
        <div className="p-4">
            <Button onClick={() => navigate(-1)} className="mb-4">
                ← Quay lại
            </Button>

            <Card title={user.email}>
                <Descriptions column={1}>
                    <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="Họ tên">{user.hoTen}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{user.soDienThoai}</Descriptions.Item>
                    <Descriptions.Item label="Vai trò">{roleLabelMap[user.vaiTro] || user.vaiTro}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{new Date(user.ngayTao).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={user.trangThai ? 'green' : 'red'}>
                            {user.trangThai ? 'Hoạt động' : 'Bị khóa'}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>

                <div className="mt-4 flex gap-3">
                    <Button type="primary" onClick={confirmChangeStatus}>
                        Đổi trạng thái
                    </Button>
                </div>
            </Card>
        </div>
    );
}