import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../api/axios"
import { Card, Descriptions, Spin, Button, Tag, message } from "antd"

export default function GuestHotelDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [hotel, setHotel] = useState(null)
    const [loading, setLoading] = useState(true)

    const HotelStatusMap = {
        CHO_DUYET: "Chờ duyệt",
        DA_DUYET: "Đã duyệt",
        CAP_NHAT_THONG_TIN: "Chờ duyệt cập nhật",
        TU_CHOI: "Từ chối",
        NGUNG_HOAT_DONG: "Ngừng hoạt động",
    }

    useEffect(() => {
        if (!id) return
        setLoading(true)
        api.get(`/khach-san/public/${id}`)
            .then((res) => setHotel(res?.data?.data))
            .catch(() => {
                message.error("Lỗi tải thông tin khách sạn")
            })
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="flex justify-center p-8"><Spin size="large" /></div>
    if (!hotel) return <div className="p-6">Không tìm thấy khách sạn</div>

    return (
        <div className="p-6">
            <Button onClick={() => navigate(-1)} className="mb-4">← Quay lại</Button>
            <h1 className="text-2xl font-bold mb-4">{hotel.tenKhachSan}</h1>
            <Card>
                <Descriptions column={1}>
                    <Descriptions.Item label="Địa chỉ">{hotel.diaChi}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={hotel.trangThai === "DA_DUYET" ? "green" : "orange"}>{HotelStatusMap[hotel.trangThai] || hotel.trangThai}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Chủ khách sạn">{hotel.chuKhachSan?.hoTen || hotel.chuKhachSan?.email}</Descriptions.Item>
                    {hotel.moTa && <Descriptions.Item label="Mô tả">{hotel.moTa}</Descriptions.Item>}
                </Descriptions>
            </Card>
        </div>
    )
}