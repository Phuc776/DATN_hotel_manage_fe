import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Tag, Button, Spin, Empty, Descriptions, message } from "antd";
import dayjs from "dayjs";
import api from "../../api/axios";
import { downloadBlob } from "../../utils/downloadFile";

const TYPE_MAP = {
    TIEN_PHONG: { color: "blue", label: "Tiền phòng" },
    DICH_VU: { color: "green", label: "Dịch vụ" }
};

const formatVND = (value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

export default function InvoiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [downloading, setDownloading] = useState(false);

    const fetchInvoice = async (invoiceId) => {
        setLoading(true);
        try {
            const res = await api.get(`/khach-hang/hoa-don/${invoiceId}`);
            const data = res?.data?.data ?? null;
            setInvoice(data);
        } catch (err) {
            message.error("Không lấy được chi tiết hóa đơn");
            setInvoice(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchInvoice(id);
    }, [id]);

    if (loading) return <Spin />;

    if (!invoice) {
        return (
            <div style={{ padding: 24 }}>
                <Empty description="Không tìm thấy hóa đơn" />
                <div style={{ marginTop: 16 }}>
                    <Button onClick={() => navigate(-1)}>Quay lại</Button>
                </div>
            </div>
        );
    }

    const details = invoice.chiTietHoaDons || [];

    const columns = [
        {
            title: "Loại",
            dataIndex: "loai",
            key: "loai",
            render: (v) => {
                const info = TYPE_MAP[v] || { color: "default", label: v };
                return <Tag color={info.color}>{info.label}</Tag>;
            }
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
            dataIndex: "soLuong",
            key: "soLuong"
        },
        {
            title: "Thành tiền",
            key: "thanhTien",
            render: (_, record) => formatVND((record.donGia || 0) * (record.soLuong || 0))
        }
    ];

    const total = typeof invoice.tongTien === "number"
        ? invoice.tongTien
        : details.reduce((s, d) => s + ((d.donGia || 0) * (d.soLuong || 0)), 0);

    const handleDownload = async () => {
        if (!id) return;
        setDownloading(true);
        try {
            const res = await api.get(`/khach-hang/hoa-don/${id}/pdf`, { responseType: 'blob' });
            downloadBlob(res.data, `hoa-don-${id}.pdf`);
            message.success('Bắt đầu tải xuống');
        } catch (err) {
            console.error('Lỗi khi tải PDF (user):', err);
            message.error('Tải PDF thất bại');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Chi tiết hóa đơn"
                extra={<>
                    <Button type="primary" onClick={handleDownload} loading={downloading} style={{ marginRight: 8 }}>Tải PDF</Button>
                    <Button onClick={() => navigate(-1)}>Quay lại</Button>
                </>}
            >
                <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
                    <Descriptions.Item label="Mã hóa đơn">{invoice.id}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{invoice.ngayTao ? dayjs(invoice.ngayTao).format("DD/MM/YYYY HH:mm") : "-"}</Descriptions.Item>
                    <Descriptions.Item label="Nội dung" span={2}>{invoice.noiDung || "-"}</Descriptions.Item>
                </Descriptions>

                <Table
                    rowKey={(r) => r.id}
                    columns={columns}
                    dataSource={details}
                    pagination={false}
                />

                <div style={{ textAlign: "right", marginTop: 16, fontSize: 18, fontWeight: 700 }}>
                    Tổng tiền: {formatVND(total)}
                </div>
            </Card>
        </div>
    );
}