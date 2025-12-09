import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, message, Modal, Descriptions, Tag } from "antd";
import api from "../../api/axios";

export default function AdminHotelDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const statusLabelMap = {
        CHO_DUYET: "Chờ duyệt",
        DA_DUYET: "Đã duyệt",
        CAP_NHAT_THONG_TIN: "Chờ duyệt cập nhật",
        TU_CHOI: "Từ chối",
        NGUNG_HOAT_DONG: "Ngừng hoạt động",
    };
    const statusColorMap = {
        CHO_DUYET: "orange",
        DA_DUYET: "green",
        CAP_NHAT_THONG_TIN: "blue",
        TU_CHOI: "red",
        NGUNG_HOAT_DONG: "gray",
    };

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/khach-san/${id}`);
            setHotel(res.data.data);
        } catch (error) {
            message.error("Lỗi tải chi tiết khách sạn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, []);

    const confirmApprove = () => {
        Modal.confirm({
            title: "Xác nhận duyệt",
            onOk: async () => {
                try {
                    const res = await api.post(`/admin/khach-san/${id}/approve`);
                    message.success(res.data.message);
                    navigate("/admin/hotels");
                } catch (error) {
                    message.error(error.response?.data?.message || "Lỗi duyệt khách sạn");
                    navigate("/admin/hotels");
                }
            },
        });
    };

    const confirmReject = () => {
        Modal.confirm({
            title: "Xác nhận từ chối",
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    const res = await api.post(`/admin/khach-san/${id}/reject`);
                    message.success(res.data.message);
                    navigate("/admin/hotels");
                } catch (error) {
                    message.error(error.response?.data?.message || "Lỗi từ chối khách sạn");
                    navigate("/admin/hotels");
                }
            },
        });
    };

    if (loading || !hotel) return <Spin className="m-10" />;

    return (
        <div className="p-4">
            <Button onClick={() => navigate(-1)} className="mb-4">
                ← Quay lại
            </Button>

            <Card title={hotel.tenKhachSan}>
                <Descriptions column={1}>
                    <Descriptions.Item label="Tên khách sạn">{hotel.tenKhachSan}</Descriptions.Item>

                    <Descriptions.Item label="Địa chỉ">{hotel.diaChi}</Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        <Tag color={statusColorMap[hotel.trangThai]}>
                            {statusLabelMap[hotel.trangThai]}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Chủ khách sạn">
                        {hotel.chuKhachSan?.email}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số phòng kinh doanh">
                        {hotel.soPhongKinhDoanh}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số nhân viên">
                        {hotel.soNhanVien}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số bài đăng phòng">
                        {hotel.soBaiDangPhong}
                    </Descriptions.Item>

                    <Descriptions.Item label="Điểm đánh giá trung bình">
                        {hotel.danhGiaTrungBinh.toFixed(1)}
                    </Descriptions.Item>
                </Descriptions>

                <div className="mt-4 flex gap-3">
                    <Button type="primary" onClick={confirmApprove}>
                        Duyệt khách sạn
                    </Button>
                    <Button danger onClick={confirmReject}>
                        Từ chối
                    </Button>
                </div>
            </Card>
        </div>
    );
}
