import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Button, Tag, message, Modal, Spin } from "antd";
import api from "../../api/axios";

const statusMap = {
        CHO_XAC_NHAN: { label: "Chờ xác nhận", color: "orange" }, // Đã đặt phòng, chờ nhân viên xác nhận
        DA_XAC_NHAN: { label: "Đã xác nhận", color: "blue" }, // Nhân viên check-in
        CHO_HUY: { label: "Chờ hủy", color: "purple" }, // Khách hàng yêu cầu hủy, chờ nhân viên duyệt hủy
        DA_HUY: { label: "Đã hủy", color: "red" }, // Đã hủy đặt phòng
        DANG_O: { label: "Đang ở", color: "green" }, // Khách hàng đã dùng QR / bắt đầu ở
        CHO_TRA: { label: "Chờ trả", color: "cyan" }, // Khách hàng yêu cầu trả phòng, chờ nhân viên duyệt
        DA_TRA_PHONG: { label: "Đã trả phòng", color: "gray" }, // Khách hàng đã trả phòng
    };

export default function StaffBookingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const renderActions = (b) => {
        if (b.trangThai === "CHO_XAC_NHAN") {
            return (
                <Button type="primary" onClick={() => checkIn(b.id)}>Check-in</Button>
            );
        }

        if(b.trangThai === "CHO_TRA") {
            return (
                <Button type="primary" onClick={() => checkOut(b.id)}>Check-out</Button>
            );
        } 

        if (b.trangThai === "CHO_HUY") {
            return (
                <Button danger onClick={() => cancelBooking(b.id)}>Hủy</Button>
            );
        }

        return null;
    };

    const fetchBooking = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await api.get(`/nhan-vien/booking/${id}`);
            setBooking(res.data.data || null);
        } catch (e) {
            message.error("Không thể tải chi tiết booking");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    

    const checkIn = (bid) => {
        Modal.confirm({
            title: "Xác nhận check-in",
            content: "Hệ thống sẽ tạo QR và gửi hợp đồng cho khách.",
            onOk: async () => {
                try {
                    await api.post(`/nhan-vien/booking/${bid}/check-in`);
                    message.success("Check-in thành công.");
                    fetchBooking();
                } catch (ex) {
                    message.error("Check-in thất bại." + ex);
                }
            }
        });
    };

    const checkOut = async (bid) => {
        try {
            await api.post(`/nhan-vien/booking/${bid}/check-out`);
            message.success("Check-out thành công");
            fetchBooking();
        } catch (ex) {
            message.error("Check-out thất bại." + ex);
        }
    };

    const cancelBooking = (bid) => {
        Modal.confirm({
            title: "Xác nhận hủy booking",
            content: "Bạn có chắc muốn hủy booking này?",
            onOk: async () => {
                try {
                    await api.post(`/nhan-vien/booking/${bid}/cancel`);
                    message.success("Đã hủy booking");
                    fetchBooking();
                } catch (ex) {
                    message.error("Hủy booking thất bại." + ex);
                }
            }
        });
    };

    if (loading) return <div className="flex justify-center p-8"><Spin size="large" /></div>;
    if (!booking) return <div className="p-6">Không tìm thấy booking</div>;

    return (
        <div>
            <Button onClick={() => navigate(-1)} className="mb-4">← Quay lại</Button>
            <h1 className="text-2xl font-bold mb-4">Chi tiết đặt phòng</h1>

            <Card>
                <Descriptions column={1}>
                    <Descriptions.Item label="ID">{booking.id}</Descriptions.Item>
                    <Descriptions.Item label="Số phòng">{booking.phong?.soPhong || booking.soPhong}</Descriptions.Item>
                    <Descriptions.Item label="Ngày nhận">{new Date(booking.ngayNhan).toLocaleString("vi-VN")}</Descriptions.Item>
                    <Descriptions.Item label="Ngày trả">{new Date(booking.ngayTra).toLocaleString("vi-VN")}</Descriptions.Item>
                    <Descriptions.Item label="Số người lớn">{booking.soNguoiLon}</Descriptions.Item>
                    <Descriptions.Item label="Số trẻ em">{booking.soTreEm}</Descriptions.Item>
                    <Descriptions.Item label="Ghi chú">{booking.ghiChu}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái"><Tag color={statusMap[booking.trangThai]?.color}>{statusMap[booking.trangThai]?.label || booking.trangThai}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Khách hàng">{booking.khachHang?.taiKhoan?.hoTen || booking.khachHang?.email}</Descriptions.Item>
                    <Descriptions.Item>{renderActions(booking)}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
}