import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Tag, Select } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Roomtypes() {
  const [roomtypes, setRoomtypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  const fetchRoomtypes = async () => {
    try {
      const res = await api.get("/chu-khach-san/loai-phong");
      setRoomtypes(res.data.data || []);
    } catch (err) {
      message.error("Lỗi tải danh sách loại phòng");
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await api.get("/chu-khach-san/khach-san/active");
      setHotels(res.data.data || []);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchRoomtypes();
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
        tenLoaiPhong: values.tenLoaiPhong,
        gia: values.gia,
        soNguoiLon: values.soNguoiLon,
        soTreEm: values.soTreEm,
        moTa: values.moTa,
      };
      const res = await api.post(`/chu-khach-san/khach-san/${khachSanId}/loai-phong`, body);
      message.success(res.data.message || "Thêm loại phòng thành công");
      setIsCreateOpen(false);
      fetchRoomtypes();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi tạo loại phòng");
    }
  };

  const columns = [
    { title: "ID", width: 70, render: (_, __, idx) => idx + 1 },
    { title: "Tên loại phòng", dataIndex: "tenLoaiPhong" },
    { title: "Giá", dataIndex: "gia", render: (v) => v?.toLocaleString() },
    { title: "Số lượng còn", dataIndex: "soLuongCon" },
    { title: "Số người lớn", dataIndex: "soNguoiLon" },
    { title: "Số trẻ em", dataIndex: "soTreEm" },
    { title: "Mô tả", dataIndex: "moTa" },
    {
      title: "Hành động",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => navigate(`/owner/roomtypes/${record.id}`)}>Chi tiết</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Loại Phòng</h1>
        <Button type="primary" onClick={openCreate}>+ Thêm Loại Phòng</Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Table columns={columns} dataSource={roomtypes} rowKey="id" loading={loading} pagination={{ pageSize: 8 }} />
      </div>

      <Modal title="Thêm loại phòng" open={isCreateOpen} onCancel={() => setIsCreateOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={submitCreate}>
          <Form.Item name="tenLoaiPhong" label="Tên loại phòng" rules={[{ required: true }] }>
            <Input />
          </Form.Item>
          <Form.Item name="gia" label="Giá" rules={[{ required: true }] }>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="soNguoiLon" label="Số người lớn" rules={[{ required: true }] }>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="soTreEm" label="Số trẻ em" rules={[{ required: true }] }>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input />
          </Form.Item>
          <Form.Item name="khachSanId" label="Khách sạn" rules={[{ required: true }] }>
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
    </div>
  );
}