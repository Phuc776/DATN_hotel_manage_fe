import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, Button, Spin, Empty, message } from "antd";
import dayjs from "dayjs";
import api from "../../api/axios";

const formatDate = (iso) => {
    if (!iso) return "-";
    return dayjs(iso).format("DD/MM/YYYY HH:mm");
};

const formatVND = (value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

export default function InvoiceHistory() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await api.get("/khach-hang/hoa-don/history");
            const data = res?.data?.data ?? [];
            setInvoices(Array.isArray(data) ? data : []);
        } catch (err) {
            message.error("Không lấy được lịch sử hóa đơn");
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const columns = [
        {
            title: "Mã hóa đơn",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Ngày tạo",
            dataIndex: "ngayTao",
            key: "ngayTao",
            render: (v) => formatDate(v)
        },
        {
            title: "Tổng tiền",
            dataIndex: "tongTien",
            key: "tongTien",
            render: (v) => formatVND(v)
        },
        {
            title: "Nội dung",
            dataIndex: "noiDung",
            key: "noiDung"
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button onClick={() => navigate(`/user/invoice/${record.id}`)}>Xem chi tiết</Button>
            )
        }
    ];

    if (loading) return <Spin />;

    if (!invoices || invoices.length === 0) {
        return (
            <div style={{ padding: 24 }}>
                <Empty description="Chưa có hóa đơn nào" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Card title="Lịch sử hóa đơn">
                <Table rowKey={(r) => r.id} columns={columns} dataSource={invoices} pagination={{ pageSize: 10 }} />
            </Card>
        </div>
    );
}