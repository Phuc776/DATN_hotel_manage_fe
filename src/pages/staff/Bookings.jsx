import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Tag, message, Modal } from "antd";
import api from "../../api/axios";

export default function StaffBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const statusMap = {
        CHO_XAC_NHAN: { label: "Chờ xác nhận", color: "orange" }, // Đã đặt phòng, chờ nhân viên xác nhận
        DA_XAC_NHAN: { label: "Đã xác nhận", color: "blue" }, // Nhân viên check-in
        CHO_HUY: { label: "Chờ hủy", color: "purple" }, // Khách hàng yêu cầu hủy, chờ nhân viên duyệt hủy
        DA_HUY: { label: "Đã hủy", color: "red" }, // Đã hủy đặt phòng
        DANG_O: { label: "Đang ở", color: "green" }, // Khách hàng đã dùng QR / bắt đầu ở
        CHO_TRA: { label: "Chờ trả", color: "cyan" }, // Khách hàng yêu cầu trả phòng, chờ nhân viên duyệt
        DA_TRA_PHONG: { label: "Đã trả phòng", color: "gray" }, // Khách hàng đã trả phòng
    };

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


    const columns = [
        { title: "ID", width: 70, render: (_, __, idx) => idx + 1 },
        { title: "Khách hàng", render: (_, b) => b.khachHang?.taiKhoan.hoTen },
        { title: "Phòng", render: (_, b) => b.phong?.soPhong },
        { title: "Ngày nhận", render: (_, b) => new Date(b.ngayNhan).toLocaleString("vi-VN") },
        { title: "Ngày trả", render: (_, b) => new Date(b.ngayTra).toLocaleString("vi-VN") },
        {
            title: "Trạng thái",
            dataIndex: "trangThai",
            render: v => <Tag color={statusMap[v]?.color}>{statusMap[v]?.label || v}</Tag>
        },
        {
            title: "Hành động",
            render: (_, b) => (
                <div className="flex gap-2">
                    <Button type="primary"
                        onClick={() => navigate(`/staff/bookings/${b.id}`)}>
                        Xem chi tiết
                    </Button>
                </div>

            )
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
