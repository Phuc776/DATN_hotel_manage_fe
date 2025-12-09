import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../api/axios"
import { Card, Descriptions, Spin, Button, Tag, message } from "antd"

export default function GuestRoomPostDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    const RoomPostStatusMap = {
        CHO_DUYET: "Chờ duyệt",
        DA_DUYET: "Đã duyệt",
        TU_CHOI: "Từ chối",
    }

    useEffect(() => {
        if (!id) return
        setLoading(true)
        api.get(`/bai-dang-phong/public/${id}`)
            .then((res) => setPost(res?.data?.data))
            .catch(() => {
                message.error("Lỗi tải chi tiết bài đăng")
            })
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="flex justify-center p-8"><Spin size="large" /></div>
    if (!post) return <div className="p-6">Không tìm thấy bài đăng</div>

    return (
        <div className="p-6">
            <Button onClick={() => navigate(-1)} className="mb-4">← Quay lại</Button>
            <h1 className="text-2xl font-bold mb-4">{post.tieuDe || `Bài đăng ${post.id}`}</h1>
            <Card>
                <Descriptions column={1}>
                    <Descriptions.Item label="Khách sạn">{post.khachSan?.tenKhachSan || post.khachSanId?.tenKhachSan}</Descriptions.Item>
                    <Descriptions.Item label="Loại phòng">{post.loaiPhong?.tenLoaiPhong || post.loaiPhongId?.tenLoaiPhong}</Descriptions.Item>
                    <Descriptions.Item label="Giá">{post.gia?.toLocaleString() || "—"} VNĐ</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái"><Tag color={post.trangThaiBaiDang === "DA_DUYET" ? "green" : "orange"}>{RoomPostStatusMap[post.trangThaiBaiDang] || post.trangThaiBaiDang}</Tag></Descriptions.Item>
                    {post.moTa && <Descriptions.Item label="Mô tả">{post.moTa}</Descriptions.Item>}
                </Descriptions>
            </Card>
        </div>
    )
}