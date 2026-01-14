import { useEffect, useState } from "react";
import { Card, Descriptions, Table, Tag, Empty, Spin, message } from "antd";
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

export default function CurrentStay() {
    const [loading, setLoading] = useState(false);
    const [phien, setPhien] = useState(null);

    // Fetch current session, then fetch full detail by id (current may not include rooms/services)
    const fetchCurrent = async () => {
        setLoading(true);
        try {
            const res = await api.get("/khach-hang/phien/current");
            const current = res?.data?.data ?? null;
            if (!current) {
                setPhien(null);
                return;
            }
            // If backend provides only minimal current info, fetch full detail by id
            if (current.id) {
                try {
                    const detailRes = await api.get(`/khach-hang/phien/${current.id}`);
                    const detail = detailRes?.data?.data ?? current;
                    setPhien(detail);
                } catch {
                    // fallback to current if detail call fails
                    setPhien(current);
                }
            } else {
                setPhien(current);
            }
        } catch (err) {
            message.error("Không lấy được phiên lưu trú hiện tại");
            setPhien(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrent();
    }, []);

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
        },
        {
            title: "Đơn giá",
            dataIndex: "donGiaTaiThoiDiem",
            key: "donGia",
            render: (_, record) => formatVND(record.phong?.loaiPhong?.gia)
        },
        {
            title: "Tình trạng",
            key: "tinhTrang",
            render: (_, record) => {
                const status = trangThaiMap[record.trangThai] || { color: "default", label: record.trangThai };
                return <Tag color={status.color}>{status.label}</Tag>;
            }
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
                <Empty description="Bạn hiện không có phiên lưu trú đang diễn ra" />
            </div>
        );
    }

    const statusInfo = trangThaiMap[phien.trangThai] || { color: "default", label: phien.trangThai };

    return (
        <div style={{ padding: 24 }}>
            <Card title="Phiên lưu trú hiện tại">
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="Mã phiên">{phien.id}</Descriptions.Item>
                    <Descriptions.Item label="Thời gian bắt đầu">{formatDateTime(phien.batDau)}</Descriptions.Item>
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