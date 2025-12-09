import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Spin, message, Button, Tag } from "antd";
import api from "../../api/axios";

export default function RoomPostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (!id) return;
        api.get(`/chu-khach-san/bai-dang-phong/${id}`)
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

    if (loading) return <Spin className="m-10" />;
    if (!post) return <p>Không tìm thấy bài đăng</p>;

    return (
        <div>
            <Button onClick={() => navigate(-1)} className="mb-4">← Quay lại</Button>
            <h1 className="text-2xl font-bold mb-4">Chi tiết bài đăng</h1>

            <Card>
                <Descriptions column={1}>
                    <Descriptions.Item label="Tiêu đề">{post.tieuDe}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">{post.moTa}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng phòng">{post.soLuongPhong}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái"><Tag color={statusColor[post.trangThaiBaiDang]}>{statusLabel[post.trangThaiBaiDang]}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Loại phòng">{post.loaiPhong?.tenLoaiPhong}</Descriptions.Item>
                    <Descriptions.Item label="Khách sạn">{post.khachSan?.tenKhachSan}</Descriptions.Item>
                    <Descriptions.Item label="Ngày đăng">{new Date(post.ngayDang).toLocaleString()}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    )
}