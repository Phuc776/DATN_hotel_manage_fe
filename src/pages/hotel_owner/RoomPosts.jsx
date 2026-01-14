import { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message, Space, Select, Tag, Card, Row, Col, Spin, Empty, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadImageToFirebase from "../../utils/uploadFirebase";
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
    const [createLoading, setCreateLoading] = useState(false);
    const [createUploadList, setCreateUploadList] = useState([]);
    // edit modal
    const [editOpen, setEditOpen] = useState(false);
    const [editForm] = Form.useForm();
    const [editingPost, setEditingPost] = useState(null);
    const [editUploadList, setEditUploadList] = useState([]);
    const [editLoading, setEditLoading] = useState(false);
    const [editImagesChanged, setEditImagesChanged] = useState(false);
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

    const onHotelChangeInEdit = async (khachSanId) => {
        editForm.setFieldsValue({ loaiPhongId: undefined });
        try {
            const res = await api.get(`/chu-khach-san/khach-san/${khachSanId}/loai-phong`);
            setRoomTypes(res.data.data || []);
        } catch (e) {
            setRoomTypes([]);
        }
    };

    const submitCreate = async (values) => {
        setCreateLoading(true);
        try {
            // upload images
            const files = createUploadList.map((f) => f.originFileObj || f).filter(Boolean);
            const urls = await Promise.all(
                files.map(async (file) => await uploadImageToFirebase(file))
            );

            const body = {
                loaiPhongId: values.loaiPhongId,
                tieuDe: values.tieuDe,
                moTa: values.moTa,
                khachSanId: values.khachSanId,
                soLuongPhong: values.soLuongPhong,
                hinhAnh: urls,
            };
            const res = await api.post(`/chu-khach-san/bai-dang-phong`, body);
            message.success(res.data.message || "Tạo bài đăng thành công");
            setCreateOpen(false);
            form.resetFields();
            setCreateUploadList([]);
            fetchPosts(filterHotel, filterStatus);
        } catch (e) {
            console.error(e);
            message.error(e?.response?.data?.message || e.message || "Lỗi tạo bài đăng");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCreateUploadChange = ({ fileList }) => setCreateUploadList(fileList);

    // Edit handlers
    const openEdit = (post) => {
        setEditingPost(post);
        setEditOpen(true);
        // prefill form and room types
        editForm.setFieldsValue({
            loaiPhongId: post.loaiPhong?.id,
            tieuDe: post.tieuDe,
            moTa: post.moTa,
            khachSanId: post.khachSan?.id,
            soLuongPhong: post.soLuongPhong,
        });
        if (post.khachSan?.id) onHotelChangeInEdit(post.khachSan.id);
        // prefill upload list with existing URLs
        const existing = (post.hinhAnh || []).map((url, idx) => ({ uid: `e-${idx}`, name: `image-${idx}`, status: 'done', url }));
        setEditUploadList(existing);
        setEditImagesChanged(false);
    };

    const handleEditUploadChange = ({ fileList }) => {
        setEditUploadList(fileList);
        setEditImagesChanged(true);
    };

    const submitEdit = async () => {
        setEditLoading(true);
        try {
            const isApproved = editingPost?.trangThaiBaiDang === 'DA_DUYET';

            if (isApproved) {
                // Only allow image updates for approved posts
                if (!editImagesChanged) {
                    message.info('Không có thay đổi hình ảnh');
                } else {
                    const existingUrls = editUploadList.filter(f => !f.originFileObj && f.url).map(f => f.url);
                    const newFiles = editUploadList.filter(f => f.originFileObj).map(f => f.originFileObj);
                    const newUrls = await Promise.all(newFiles.map(async (file) => await uploadImageToFirebase(file)));
                    const merged = [...existingUrls, ...newUrls];

                    await api.put(`/chu-khach-san/bai-dang-phong/${editingPost.id}/images`, { imageUrls: merged });
                    message.success("Cập nhật hình ảnh thành công");
                }
            } else {
                // Full update for non-approved posts
                const values = await editForm.validateFields();
                const payload = {
                    loaiPhongId: values.loaiPhongId,
                    tieuDe: values.tieuDe,
                    moTa: values.moTa,
                    soLuongPhong: values.soLuongPhong,
                    khachSanId: values.khachSanId,
                };

                if (editImagesChanged) {
                    const existingUrls = editUploadList.filter(f => !f.originFileObj && f.url).map(f => f.url);
                    const newFiles = editUploadList.filter(f => f.originFileObj).map(f => f.originFileObj);
                    const newUrls = await Promise.all(newFiles.map(async (file) => await uploadImageToFirebase(file)));
                    payload.hinhAnh = [...existingUrls, ...newUrls];
                }

                await api.put(`/chu-khach-san/bai-dang-phong/${editingPost.id}`, payload);
                message.success("Cập nhật bài đăng thành công");
            }

            setEditOpen(false);
            editForm.resetFields();
            setEditUploadList([]);
            fetchPosts(filterHotel, filterStatus);
        } catch (e) {
            console.error(e);
            message.error(e?.response?.data?.message || e.message || "Lỗi cập nhật bài đăng");
        } finally {
            setEditLoading(false);
        }
    };

    // We'll render posts as a grid of cards (first image as thumbnail)

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
                {loading ? (
                    <div className="flex justify-center p-8"><Spin size="large" /></div>
                ) : posts.length === 0 ? (
                    <Empty description="Chưa có bài đăng" />
                ) : (
                    <Row gutter={[16,16]}>
                        {posts.map((p, idx) => (
                            <Col key={p.id} xs={24} sm={12} lg={8}>
                                <Card
                                    hoverable
                                    cover={
                                        p.hinhAnh?.[0] ? (
                                            <img src={p.hinhAnh[0]} alt={p.tieuDe || `Bài đăng ${p.id}`} className="h-40 w-full object-cover mb-4 rounded" />
                                        ) : (
                                            <div className="h-40 bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-400">Không có ảnh</div>
                                        )
                                    }
                                >
                                    <h3 className="text-lg font-semibold">{p.tieuDe || `Bài đăng ${p.id}`}</h3>
                                    <p className="text-gray-600 text-sm mb-1">Khách sạn: {p.khachSan?.tenKhachSan}</p>
                                    <p className="text-gray-600 text-sm mb-2">Loại phòng: {p.loaiPhong?.tenLoaiPhong}</p>
                                    <div className="flex items-center justify-between">
                                        <Tag color={statusColor[p.trangThaiBaiDang]}>{statusLabel[p.trangThaiBaiDang]}</Tag>
                                        <div className="flex gap-2">
                                            <Button type="primary" onClick={() => navigate(`/owner/room-posts/${p.id}`)}>Chi tiết</Button>
                                            <Button type="default" onClick={() => openEdit(p)}>Sửa</Button>
                                            <Button danger onClick={() => handleDelete(p)} disabled={p.trangThaiBaiDang === 'DA_DUYET'}>Xóa</Button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">{new Date(p.ngayDang).toLocaleString()}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            <Modal title="Tạo bài đăng phòng" open={createOpen} onCancel={() => setCreateOpen(false)} onOk={() => form.submit()} confirmLoading={createLoading}>
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

                    <Form.Item label="Hình ảnh">
                        <Upload listType="picture-card" multiple beforeUpload={() => false} fileList={createUploadList} onChange={handleCreateUploadChange}>
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Thêm</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => setCreateOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Tạo</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Sửa bài đăng phòng" open={editOpen} onCancel={() => setEditOpen(false)} onOk={submitEdit} confirmLoading={editLoading}>
                    <Form form={editForm} layout="vertical">
                        {editingPost?.trangThaiBaiDang === 'DA_DUYET' ? (
                            <Form.Item label="Hình ảnh">
                                <Upload listType="picture-card" multiple beforeUpload={() => false} fileList={editUploadList} onChange={handleEditUploadChange}>
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Thêm</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        ) : (
                            <>
                                <Form.Item name="khachSanId" label="Khách sạn" rules={[{ required: true }]}>
                                    <Select placeholder="Chọn khách sạn" onChange={onHotelChangeInEdit}>
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

                                <Form.Item label="Hình ảnh">
                                    <Upload listType="picture-card" multiple beforeUpload={() => false} fileList={editUploadList} onChange={handleEditUploadChange}>
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Thêm</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </>
                        )}
                    </Form>
            </Modal>
        </div>
    );
}