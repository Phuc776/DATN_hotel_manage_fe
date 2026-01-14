import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Descriptions, Table, Tag, Empty, Spin, Button, Space, message } from "antd";
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

const formatVND = (value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

const formatDateTime = (iso) => {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleString("vi-VN");
    } catch {
        return iso;
    }
};

export default function StayDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [phien, setPhien] = useState(null);

    const fetchPhien = async (phienId) => {
        setLoading(true);
        try {
            const res = await api.get(`/khach-hang/phien/${phienId}`);
            const data = res?.data?.data ?? null;
            setPhien(data);
        } catch (err) {
            message.error("Không lấy được dữ liệu phiên lưu trú");
            setPhien(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchPhien(id);
    }, [id]);

    const datPhongsColumns = [
        {
            title: "Số phòng",
            key: "soPhong",
            render: (_, record) => record.soPhong || record.phong?.soPhong || "-"
        },
        {
            title: "Ngày nhận",
            dataIndex: "ngayNhan",
            key: "ngayNhan",
            render: (value) => formatDateTime(value)
        },
        {
            title: "Ngày trả",
            dataIndex: "ngayTra",
            key: "ngayTra",
            render: (value) => formatDateTime(value)
        }
    ];

    const suDungDichVusColumns = [
        {
            title: "Tên dịch vụ",
            key: "tenDichVu",
            render: (_, record) => record.tenDichVu || record.dichVu?.tenDichVu || "-"
        },
        {
            title: "Số lượng",
            dataIndex: "soLuong",
            key: "soLuong"
        },
        {
            title: "Đơn giá",
            dataIndex: "donGiaTaiThoiDiem",
            key: "donGia",
            render: (value) => formatVND(value)
        },
        {
            title: "Thành tiền",
            key: "thanhTien",
            render: (_, record) => formatVND((record.soLuong || 0) * (record.donGiaTaiThoiDiem || 0))
        }
    ];

    if (loading) return <Spin />;

    if (!phien) {
        return (
            <div style={{ padding: 24 }}>
                <Empty description="Không tìm thấy phiên lưu trú" />
                <div style={{ marginTop: 16 }}>
                    <Button onClick={() => navigate(-1)}>Quay lại</Button>
                </div>
            </div>
        );
    }

    const statusInfo = trangThaiMap[phien.trangThai] || { color: "default", label: phien.trangThai };

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Chi tiết phiên lưu trú"
                extra={
                    <Space>
                        <Button onClick={() => navigate(-1)}>Quay lại</Button>
                    </Space>
                }
            >
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="Mã phiên">{`PH-${phien.id}`}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian bắt đầu">{phien.batDau ? formatDateTime(phien.batDau) : "Chưa bắt đầu ở"}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian kết thúc">{phien.ketThuc ? formatDateTime(phien.ketThuc) : "Đang lưu trú"}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền tạm tính">{formatVND(phien.tongTienTamTinh)}</Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 24 }}>
                    <h3>Danh sách phòng</h3>
                    <Table
                        rowKey={(record) => record.id}
                        columns={datPhongsColumns}
                        dataSource={phien.datPhongs || []}
                        pagination={false}
                    />
                </div>

                <div style={{ marginTop: 24 }}>
                    <h3>Dịch vụ đã dùng</h3>
                    <Table
                        rowKey={(record) => record.id}
                        columns={suDungDichVusColumns}
                        dataSource={phien.suDungDichVus || []}
                        pagination={false}
                    />
                </div>
            </Card>
        </div>
    );
}