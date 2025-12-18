import { useEffect, useState } from "react";
import { Table, Button, Tag, message, Modal } from "antd";
import api from "../../api/axios";

export default function StaffBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const statusLabel = {
        CHO_XAC_NHAN: "Chờ xác nhận", // Đã đặt phòng, chờ nhân viên xác nhận
        DA_XAC_NHAN: "Đã xác nhận", // Nhân viên check-in
        CHO_HUY: "Chờ hủy", // Khách hàng yêu cầu hủy, chờ nhân viên duyệt hủy
        DA_HUY: "Đã hủy", // Đã hủy đặt phòng
        DANG_O: "Đang ở", // Khách hàng đã dùng QR / bắt đầu ở
        CHO_TRA: "Chờ trả", // Khách hàng yêu cầu trả phòng, chờ nhân viên duyệt
        DA_TRA_PHONG: "Đã trả phòng", // Khách hàng đã trả phòng    
    };
    const statusColor = {
        CHO_XAC_NHAN: "orange",
        DA_XAC_NHAN: "blue",
        CHO_HUY: "purple",
        DA_HUY: "red",
        DANG_O: "green",
        CHO_TRA: "cyan",
        DA_TRA_PHONG: "gray",
    }

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get("/nhan-vien/booking");
            setBookings(res.data.data || []);
        } catch (e) {
            message.error("Không thể tải danh sách booking");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const checkIn = (id) => {
        Modal.confirm({
            title: "Xác nhận check-in",
            content: "Hệ thống sẽ tạo QR và gửi hợp đồng cho khách.",
            onOk: async () => {
                try {
                    await api.post(`/nhan-vien/booking/${id}/check-in`);
                    message.success("Check-in thành công");
                    fetchBookings();
                } catch {
                    message.error("Check-in thất bại");
                }
            }
        });
    };

    const checkOut = async (id) => {
        try {
            await api.post(`/nhan-vien/booking/${id}/check-out`);
            message.success("Check-out thành công");
            fetchBookings();
        } catch {
            message.error("Check-out thất bại");
        }
    };

    const cancelBooking = (id) => {
        Modal.confirm({
            title: "Xác nhận hủy booking",
            content: "Bạn có chắc muốn hủy booking này?",
            onOk: async () => {
                try {
                    await api.post(`/nhan-vien/booking/${id}/cancel`);
                    message.success("Đã hủy booking");
                    fetchBookings();
                } catch {
                    message.error("Hủy booking thất bại");
                }
            }
        });
    };
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

    const columns = [
        { title: "ID", width: 70, render: (_, __, idx) => idx + 1 },
        { title: "Khách hàng", render: (_, b) => b.khachHang?.taiKhoan.hoTen },
        { title: "Phòng", render: (_, b) => b.phong?.soPhong },
        { title: "Ngày nhận", dataIndex: "ngayNhan" },
        { title: "Ngày trả", dataIndex: "ngayTra" },
        {
            title: "Trạng thái",
            dataIndex: "trangThai",
            render: v => <Tag color={statusColor[v]}>{statusLabel[v]}</Tag>
        },
        {
            title: "Hành động",
            render: (_, b) => <div className="flex gap-2">{renderActions(b)}</div>
        }
    ];




    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Quản lý đặt phòng</h1>

            <div className="bg-white p-6 rounded-lg shadow">
                <Table
                    columns={columns}
                    dataSource={bookings}
                    rowKey="id"
                    loading={loading}
                />
            </div>
        </div>
    );
}
