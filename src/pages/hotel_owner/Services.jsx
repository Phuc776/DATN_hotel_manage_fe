import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();
    const [hotels, setHotels] = useState([]);
    const [editing, setEditing] = useState(null);
    const navigate = useNavigate();

    const fetchServices = async () => {
        try {
            const res = await api.get("/chu-khach-san/dich-vu");
            setServices(res.data.data || []);
        } catch (err) {
            message.error("Lỗi tải danh sách dịch vụ");
        } finally {
            setLoading(false);
        }
    };

    const fetchHotels = async () => {
        try {
            const res = await api.get("/chu-khach-san/khach-san");
            setHotels(res.data.data || []);
        } catch (err) {
            // ignore
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const openCreate = () => {
        form.resetFields();
        if (!hotels.length) fetchHotels();
        setIsCreateOpen(true);
    };

    const submitCreate = async (values) => {
        try {
            const khachSanId = values.khachSanId;
            const body = {
                tenDichVu: values.tenDichVu,
                donGia: values.donGia,
                moTa: values.moTa,
            };
            const res = await api.post(`/chu-khach-san/khach-san/${khachSanId}/dich-vu`, body);
            message.success(res.data.message || "Thêm dịch vụ thành công");
            setIsCreateOpen(false);
            fetchServices();
        } catch (err) {
            message.error(err.response?.data?.message || "Lỗi tạo dịch vụ");
        }
    };

    const handleEdit = (record) => {
        setEditing(record);
        updateForm.setFieldsValue({
            tenDichVu: record.tenDichVu,
            donGia: record.donGia,
            moTa: record.moTa,
            khachSanId: record.khachSan?.id,
        });
        if (!hotels.length) fetchHotels();
        setIsEditOpen(true);
    };

    const submitEdit = async (values) => {
        try {
            const body = {
                tenDichVu: values.tenDichVu,
                donGia: values.donGia,
                moTa: values.moTa,
            };
            // Assuming backend supports PUT /chu-khach-san/dich-vu/{id}
            const res = await api.put(`/chu-khach-san/dich-vu/${editing.id}`, body);
            message.success(res.data.message || "Cập nhật dịch vụ thành công");
            setIsEditOpen(false);
            setEditing(null);
            fetchServices();
        } catch (err) {
            message.error(err.response?.data?.message || "Lỗi cập nhật dịch vụ");
        }
    };

    const columns = [
        { title: "ID", width: 70, render: (_, __, idx) => idx + 1 },
        { title: "Tên dịch vụ", dataIndex: "tenDichVu" },
        { title: "Đơn Giá", dataIndex: "donGia", render: (v) => v?.toLocaleString() },
        { title: "Mô tả", dataIndex: "moTa" },
        { title: "Hành động", width: 320, render: (_, record) => (
            <Space>
                <Button type="primary" onClick={() => navigate(`/owner/services/${record.id}`)}>Chi tiết</Button>
                <Button onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
            </Space>
        )},
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý Dịch vụ</h1>
                <Button type="primary" onClick={openCreate}>+ Thêm Dịch Vụ</Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <Table columns={columns} dataSource={services} rowKey="id" loading={loading} pagination={{ pageSize: 8 }} />
            </div>

            <Modal title="Thêm dịch vụ" open={isCreateOpen} onCancel={() => setIsCreateOpen(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={submitCreate}>
                    <Form.Item name="tenDichVu" label="Tên dịch vụ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="donGia" label="Đơn Giá" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô tả">
                        <Input />
                    </Form.Item>
                    <Form.Item name="khachSanId" label="Khách sạn" rules={[{ required: true }]}>
                        <Select placeholder="Chọn khách sạn">
                            {hotels.map((h) => (
                                <Select.Option key={h.id} value={h.id}>{h.tenKhachSan} ({h.id})</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => setIsCreateOpen(false)}>Hủy</Button>
                            <Button htmlType="submit" type="primary">Thêm</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Chỉnh sửa dịch vụ" open={isEditOpen} onCancel={() => { setIsEditOpen(false); setEditing(null); }} footer={null}>
                <Form form={updateForm} layout="vertical" onFinish={submitEdit}>
                    <Form.Item name="tenDichVu" label="Tên dịch vụ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="donGia" label="Đơn Giá" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô tả">
                        <Input />
                    </Form.Item>
                    <Form.Item name="khachSanId" label="Khách sạn" rules={[{ required: true }]}>
                        <Select placeholder="Chọn khách sạn">
                            {hotels.map((h) => (
                                <Select.Option key={h.id} value={h.id}>{h.tenKhachSan} ({h.id})</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => { setIsEditOpen(false); setEditing(null); }}>Hủy</Button>
                            <Button htmlType="submit" type="primary">Lưu</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}