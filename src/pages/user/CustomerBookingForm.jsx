import { useState } from "react";
import { Card, Form, InputNumber, Input, Button, message, Row, Col } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const { TextArea } = Input;

export default function CustomerBookingForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const selected = location.state || {};

    if (!selected) {
        return <div>Không có dữ liệu đặt phòng</div>;
    }

    const [submitting, setSubmitting] = useState(false);

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            await api.post("/khach-hang/booking", {
                baiDangPhongId: selected.baiDangPhongId,
                ngayNhan: selected.ngayNhan,
                ngayTra: selected.ngayTra,
                soLuongPhongDat: values.soLuongPhongDat,
                soNguoiLon: values.soNguoiLon,
                soTreEm: values.soTreEm,
                ghiChu: values.ghiChu
            });

            message.success("Đặt phòng thành công, chờ xác nhận");
            // keep original behavior (no automatic navigation)
        } catch (e) {
            message.error(e.response?.data?.message || "Đặt phòng thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card title={selected.tieuDe} className="max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">{selected.tenKhachSan} — {selected.diaChi}</p>

            <Form layout="vertical" initialValues={{
                soLuongPhongDat: 1,
                soNguoiLon: selected.soNguoiLon || 1,
                soTreEm: 0,
                ghiChu: ""
            }} onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Số phòng" name="soLuongPhongDat" rules={[{ required: true, message: 'Nhập số phòng' }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Người lớn" name="soNguoiLon" rules={[{ required: true, message: 'Nhập số người lớn' }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Trẻ em" name="soTreEm">
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Ghi chú" name="ghiChu">
                    <TextArea rows={4} />
                </Form.Item>

                <div className="flex gap-2">
                    <Button type="primary" htmlType="submit" loading={submitting}>
                        Xác nhận đặt phòng
                    </Button>
                    <Button onClick={() => navigate(-1)}>Hủy</Button>
                </div>
            </Form>
        </Card>
    );
}
