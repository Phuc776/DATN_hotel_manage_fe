import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Spin, message, Button, Tag, Modal } from "antd";
import api from "../../api/axios";

export default function AdminRoomPostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (!id) return;
        api.get(`/admin/bai-dang-phong/${id}`)
            .then((res) => setPost(res.data.data))
            .catch(() => message.error("Lỗi tải chi tiết bài đăng"))
            .finally(() => setLoading(false));
    }, [id]);

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

    const doApprove = () => {
        Modal.confirm({
            title: "Xác nhận duyệt",
            onOk: async () => {
                try {
                    const res = await api.post(`/admin/bai-dang-phong/${id}/approve`);
                    message.success(res.data.message || "Đã duyệt");
                    navigate(-1);
                } catch (e) {
                    message.error(e?.response?.data?.message || "Lỗi duyệt bài đăng");
                }
            }
        });
    };

    const doReject = () => {
        Modal.confirm({
            title: "Xác nhận từ chối",
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    const res = await api.post(`/admin/bai-dang-phong/${id}/reject`);
                    message.success(res.data.message || "Đã từ chối");
                    navigate(-1);
                } catch (e) {
                    message.error(e?.response?.data?.message || "Lỗi từ chối bài đăng");
                }
            }
        });
    };

    if (loading) return <Spin className="m-10" />;
    if (!post) return <p>Không tìm thấy bài đăng</p>;

    return (
        <div>
            <Button onClick={() => navigate(-1)} className="mb-4">← Quay lại</Button>
            <h1 className="text-2xl font-bold mb-4">Chi tiết bài đăng (Admin)</h1>

            <Card>
                <Descriptions column={1}>
                    <Descriptions.Item label="Tiêu đề">{post.tieuDe}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">{post.moTa}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng phòng">{post.soLuongPhong}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái"><Tag color={statusColor[post.trangThaiBaiDang]}>{statusLabel[post.trangThaiBaiDang]}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Loại phòng">{post.loaiPhong?.tenLoaiPhong}</Descriptions.Item>
                    <Descriptions.Item label="Khách sạn">{post.khachSan?.tenKhachSan}</Descriptions.Item>
                    <Descriptions.Item label="Chủ khách sạn">{post.khachSan?.chuKhachSan?.email}</Descriptions.Item>
                    <Descriptions.Item label="Ngày đăng">{new Date(post.ngayDang).toLocaleString()}</Descriptions.Item>
                </Descriptions>

                <div className="mt-4 flex gap-3">
                    <Button type="primary" onClick={doApprove} disabled={post.trangThaiBaiDang !== 'CHO_DUYET'}>Duyệt</Button>
                    <Button danger onClick={doReject} disabled={post.trangThaiBaiDang !== 'CHO_DUYET'}>Từ chối</Button>
                </div>
            </Card>
        </div>
    )
}