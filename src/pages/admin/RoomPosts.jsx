import { useEffect, useState } from "react";
import { Table, Button, Tag, Select, Space, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminRoomPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [owners, setOwners] = useState([]);
    const [filterOwner, setFilterOwner] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);
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

    const fetchOwners = async () => {
        try {
            const res = await api.get("/admin/tai-khoan");
            const list = (res.data.data || []).filter(u => u.vaiTro === "CHU_KHACH_SAN");
            setOwners(list);
        } catch (e) {
            // ignore
        }
    };

    const fetchPosts = async (ownerId = null, tt = null) => {
        setLoading(true);
        try {
            const params = {};
            if (ownerId) params['chu-khach-san'] = ownerId;
            if (tt) params['trang-thai'] = tt;
            const res = await api.get("/admin/bai-dang-phong", { params });
            setPosts(res.data.data || []);
        } catch (e) {
            message.error("Không thể tải danh sách bài đăng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchOwners();
    }, []);

    const applyFilters = () => fetchPosts(filterOwner, filterStatus);
    const resetFilters = () => { setFilterOwner(null); setFilterStatus(null); fetchPosts(); };

    const handleApprove = (record) => {
        Modal.confirm({
            title: "Xác nhận duyệt bài đăng",
            onOk: async () => {
                try {
                    const res = await api.post(`/admin/bai-dang-phong/${record.id}/approve`);
                    message.success(res.data.message || "Đã duyệt");
                    fetchPosts(filterOwner, filterStatus);
                } catch (e) {
                    message.error(e?.response?.data?.message || "Lỗi duyệt bài đăng");
                }
            },
        });
    };

    const handleReject = (record) => {
        Modal.confirm({
            title: "Xác nhận từ chối bài đăng",
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    const res = await api.post(`/admin/bai-dang-phong/${record.id}/reject`);
                    message.success(res.data.message || "Đã từ chối");
                    fetchPosts(filterOwner, filterStatus);
                } catch (e) {
                    message.error(e?.response?.data?.message || "Lỗi từ chối bài đăng");
                }
            },
        });
    };

    const columns = [
        { title: 'ID', width: 70, render: (_, __, i) => i + 1 },
        { title: 'Tiêu đề', dataIndex: 'tieuDe' },
        { title: 'Khách sạn', render: (_, r) => r.khachSan?.tenKhachSan },
        { title: 'Loại phòng', render: (_, r) => r.loaiPhong?.tenLoaiPhong },
        { title: 'Số lượng', dataIndex: 'soLuongPhong' },
        { title: 'Trạng thái', dataIndex: 'trangThaiBaiDang', render: v => <Tag color={statusColor[v]}>{statusLabel[v]}</Tag> },
        { title: 'Ngày đăng', dataIndex: 'ngayDang', render: v => new Date(v).toLocaleString() },
        {
            title: 'Hành động', width: 360, render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => navigate(`/admin/room-posts/${record.id}`)}>Chi tiết</Button>
                    <Button type="default" onClick={() => handleApprove(record)} disabled={record.trangThaiBaiDang !== 'CHO_DUYET'}>Duyệt</Button>
                    <Button danger onClick={() => handleReject(record)} disabled={record.trangThaiBaiDang !== 'CHO_DUYET'}>Từ chối</Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Quản lý Bài đăng (Admin)</h1>
            </div>

            <div className="flex gap-3 mb-4">
                <Select allowClear placeholder="Lọc theo chủ khách sạn" style={{ width: 260 }} value={filterOwner} onChange={setFilterOwner}>
                    {owners.map(o => <Select.Option key={o.id} value={o.id}>{o.hoTen} ({o.email})</Select.Option>)}
                </Select>
                <Select allowClear placeholder="Lọc theo trạng thái" style={{ width: 200 }} value={filterStatus} onChange={setFilterStatus}>
                    <Select.Option value="CHO_DUYET">Chờ duyệt</Select.Option>
                    <Select.Option value="DA_DUYET">Đã duyệt</Select.Option>
                    <Select.Option value="TU_CHOI">Từ chối</Select.Option>
                </Select>
                <Button onClick={applyFilters}>Áp dụng</Button>
                <Button onClick={resetFilters}>Reset</Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <Table columns={columns} dataSource={posts} rowKey="id" loading={loading} />
            </div>
        </div>
    )
}