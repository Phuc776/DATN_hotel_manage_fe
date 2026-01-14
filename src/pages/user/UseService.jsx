import { useEffect, useState } from "react";
import { Card, Table, InputNumber, Button, message, Spin, Empty, Space } from "antd";
import api from "../../api/axios";

const formatVND = (value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

export default function UseService() {
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [noSession, setNoSession] = useState(false);
    const [quantities, setQuantities] = useState({});
    const [using, setUsing] = useState({});

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get("/khach-hang/dich-vu");
            const data = res?.data ?? res?.data?.data; // handle different shapes
            // If backend returns { data: null } when no session
            if (res?.data?.data === null) {
                setNoSession(true);
                setServices([]);
            } else {
                const list = Array.isArray(data) ? data : res?.data?.data || [];
                setServices(list);
                const init = {};
                list.forEach((s) => (init[s.id] = 1));
                setQuantities(init);
                setNoSession(false);
            }
        } catch (err) {
            message.error("Không lấy được danh sách dịch vụ");
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleQtyChange = (id, value) => {
        setQuantities((prev) => ({ ...prev, [id]: value }));
    };

    const handleUse = async (serviceId) => {
        const soLuong = quantities[serviceId] || 1;
        setUsing((prev) => ({ ...prev, [serviceId]: true }));
        try {
            await api.post("/khach-hang/dich-vu/use", { dichVuId: serviceId, soLuong });
            message.success("Sử dụng dịch vụ thành công");
            setQuantities((prev) => ({ ...prev, [serviceId]: 1 }));
        } catch (err) {
            message.error("Không thể sử dụng dịch vụ");
        } finally {
            setUsing((prev) => ({ ...prev, [serviceId]: false }));
        }
    };

    const columns = [
        {
            title: "Tên dịch vụ",
            dataIndex: "tenDichVu",
            key: "tenDichVu"
        },
        {
            title: "Mô tả",
            dataIndex: "moTa",
            key: "moTa"
        },
        {
            title: "Đơn giá",
            dataIndex: "donGia",
            key: "donGia",
            render: (v) => formatVND(v)
        },
        {
            title: "Số lượng",
            key: "soLuong",
            render: (_, record) => (
                <InputNumber min={1} value={quantities[record.id] || 1} onChange={(v) => handleQtyChange(record.id, v)} />
            )
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleUse(record.id)} loading={!!using[record.id]}>
                        Sử dụng
                    </Button>
                </Space>
            )
        }
    ];

    if (loading) return <Spin />;

    if (noSession) {
        return (
            <div style={{ padding: 24 }}>
                <Empty description="Bạn chưa có phiên lưu trú để sử dụng dịch vụ" />
            </div>
        );
    }

    if (!services || services.length === 0) {
        return (
            <div style={{ padding: 24 }}>
                <Empty description="Không có dịch vụ khả dụng" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Card title="Sử dụng dịch vụ">
                <Table rowKey={(r) => r.id} columns={columns} dataSource={services} pagination={{ pageSize: 8 }} />
            </Card>
        </div>
    );
}