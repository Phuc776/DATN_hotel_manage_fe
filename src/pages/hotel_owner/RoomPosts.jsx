import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Select, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function RoomPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hotels, setHotels] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [filterHotel, setFilterHotel] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const statusLabel = {
        CHO_DUYET: "Chờ duyệt",
        DA_DUYET: "Đã duyệt",
        TU_CHOI: "Từ chối",
    };
    const statusColor = {
        CHO_DUYET: "orange",
        DA_DUYET: "green",
        TU_CHOI: "red",
    };

    const fetchHotels = async () => {
        try {
            const res = await api.get("/chu-khach-san/khach-san/active");
            setHotels(res.data.data || []);
        } catch (e) {
            // ignore
        }
    };

    const fetchPosts = async (khachSanId = null, trangThai = null) => {
        setLoading(true);
        try {
            const params = {};
            if (khachSanId) params.khachSanId = khachSanId;
            if (trangThai) params.trangThai = trangThai;
            const res = await api.get("/chu-khach-san/bai-dang-phong", { params });
            setPosts(res.data.data || []);
        } catch (e) {
            message.error("Không thể tải danh sách bài đăng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchHotels();
    }, []);

    const handleFilterApply = () => {
        fetchPosts(filterHotel, filterStatus);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn có chắc muốn xóa bài đăng "${record.tieuDe}"?`,
            okText: "Xóa",
            okType: "danger",
            onOk: async () => {
                try {
                    await api.delete(`/chu-khach-san/bai-dang-phong/${record.id}`);
                    message.success("Đã xóa");
                    fetchPosts(filterHotel, filterStatus);
                } catch (e) {
                    message.error(e?.response?.data?.message || "Lỗi xóa bài đăng");
                }
            },
        });
    };

    const openCreate = () => {
        form.resetFields();
        if (!hotels.length) fetchHotels();
        setRoomTypes([]);
        setCreateOpen(true);
    };

    const onHotelChangeInCreate = async (khachSanId) => {
        form.setFieldsValue({ loaiPhongId: undefined });
        try {
            const res = await api.get(`/chu-khach-san/khach-san/${khachSanId}/loai-phong`);
            setRoomTypes(res.data.data || []);
        } catch (e) {
            setRoomTypes([]);
        }
    };

    const submitCreate = async (values) => {
        try {
            const body = {
                loaiPhongId: values.loaiPhongId,
                tieuDe: values.tieuDe,
                moTa: values.moTa,
                khachSanId: values.khachSanId,
                soLuongPhong: values.soLuongPhong,
            };
            const res = await api.post(`/chu-khach-san/bai-dang-phong`, body);
            message.success(res.data.message || "Tạo bài đăng thành công");
            setCreateOpen(false);
            fetchPosts(filterHotel, filterStatus);
        } catch (e) {
            message.error(e?.response?.data?.message || "Lỗi tạo bài đăng");
        }
    };

    const columns = [
        { title: "ID", width: 70, render: (_, __, idx) => idx + 1 },
        { title: "Tiêu đề", dataIndex: "tieuDe" },
        { title: "Khách sạn", render: (_, r) => r.khachSan?.tenKhachSan },
        { title: "Loại phòng", render: (_, r) => r.loaiPhong?.tenLoaiPhong },
        { title: "Số lượng", dataIndex: "soLuongPhong" },
        { title: "Trạng thái", dataIndex: "trangThaiBaiDang", render: (v) => <Tag color={statusColor[v]}>{statusLabel[v]}</Tag> },
        { title: "Ngày đăng", dataIndex: "ngayDang", render: (v) => new Date(v).toLocaleString() },
        {
            title: "Hành động",
            width: 300,
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => navigate(`/owner/room-posts/${record.id}`)}>Chi tiết</Button>
                    <Button danger onClick={() => handleDelete(record)} disabled={record.trangThaiBaiDang === 'DA_DUYET'}>Xóa</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Quản lý Bài đăng phòng</h1>
                <Button type="primary" onClick={openCreate}>+ Tạo bài đăng</Button>
            </div>

            <div className="flex gap-3 mb-4">
                <Select allowClear placeholder="Lọc theo khách sạn" style={{ width: 240 }} value={filterHotel} onChange={setFilterHotel}>
                    {hotels.map(h => <Select.Option key={h.id} value={h.id}>{h.tenKhachSan}</Select.Option>)}
                </Select>
                <Select allowClear placeholder="Lọc theo trạng thái" style={{ width: 200 }} value={filterStatus} onChange={setFilterStatus}>
                    <Select.Option value="CHO_DUYET">Chờ duyệt</Select.Option>
                    <Select.Option value="DA_DUYET">Đã duyệt</Select.Option>
                    <Select.Option value="TU_CHOI">Từ chối</Select.Option>
                </Select>
                <Button onClick={handleFilterApply}>Áp dụng</Button>
                <Button onClick={() => { setFilterHotel(null); setFilterStatus(null); fetchPosts(); }}>Reset</Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <Table columns={columns} dataSource={posts} rowKey="id" loading={loading} />
            </div>

            <Modal title="Tạo bài đăng phòng" open={createOpen} onCancel={() => setCreateOpen(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={submitCreate}>
                    <Form.Item name="khachSanId" label="Khách sạn" rules={[{ required: true }]}>
                        <Select placeholder="Chọn khách sạn" onChange={onHotelChangeInCreate}>
                            {hotels.map(h => <Select.Option key={h.id} value={h.id}>{h.tenKhachSan}</Select.Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="loaiPhongId" label="Loại phòng" rules={[{ required: true }]}>
                        <Select placeholder="Chọn loại phòng">
                            {roomTypes.map(rt => <Select.Option key={rt.id} value={rt.id}>{rt.tenLoaiPhong}</Select.Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="tieuDe" label="Tiêu đề" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="moTa" label="Mô tả" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="soLuongPhong" label="Số lượng phòng" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button onClick={() => setCreateOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Tạo</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}