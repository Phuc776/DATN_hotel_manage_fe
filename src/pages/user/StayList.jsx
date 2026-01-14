import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, Tag, Empty, Spin, message } from "antd";
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

const formatDateTime = (iso) => {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleString("vi-VN");
    } catch {
        return iso;
    }
};

export default function StayList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);

    const fetchList = async () => {
        setLoading(true);
        try {
            const res = await api.get("/khach-hang/phien");
            const data = res?.data?.data ?? [];
            setList(data);
        } catch (err) {
            message.error("Không lấy được danh sách phiên lưu trú");
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const columns = [
        {
            title: "Mã phiên",
            render: (_, __, idx) => idx + 1
        },
        {
            title: "Khách sạn",
            dataIndex: "tenKhachSan",
            key: "tenKhachSan"
        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: "batDau",
            key: "batDau",
            render: (v) => (v ? formatDateTime(v) : "Chưa bắt đầu ở")
        },
        {
            title: "Thời gian kết thúc",
            dataIndex: "ketThuc",
            key: "ketThuc",
            render: (v) => (v ? formatDateTime(v) : "Đang lưu trú")
        },
        {
            title: "Trạng thái",
            dataIndex: "trangThai",
            key: "trangThai",
            render: (v) => {
                const info = trangThaiMap[v] || { color: "default", label: v };
                return <Tag color={info.color}>{info.label}</Tag>;
            }
        }
    ];

    if (loading) return <Spin />;

    if (!list || list.length === 0) {
        return (
            <div style={{ padding: 24 }}>
                <Empty description="Không có phiên lưu trú" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Card title="Danh sách phiên lưu trú">
                <Table
                    rowKey={(record) => record.id}
                    columns={columns}
                    dataSource={list}
                    pagination={{ pageSize: 10 }}
                    onRow={(record) => ({
                        onClick: () => navigate(`/user/stay/${record.id}`),
                        style: { cursor: "pointer" }
                    })}
                />
            </Card>
        </div>
    );
}