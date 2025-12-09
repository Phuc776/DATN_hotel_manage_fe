import { useEffect, useState } from "react";
import { Table, Button, Select, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function StaffRooms() {
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const navigate = useNavigate();

    const statusLabel = {
        TRONG: "Trống",
        DA_DAT: "Đã đặt",
        CHUA_DEN: "Chưa đến",
        CO_KHACH: "Có khách",
        CHUA_DI: "Chưa đi",
        DA_TRA: "Đã trả",
    };
    const statusColor = {
        TRONG: "green",
        DA_DAT: "orange",
        CHUA_DEN: "blue",
        CO_KHACH: "red",
        CHUA_DI: "purple",
        DA_TRA: "gray",
    };

    const fetchHotels = async () => {
        try {
            const res = await api.get("/nhan-vien/khach-san");
            setHotels(res.data.data || []);
        } catch (e) {
            message.error("Không thể tải danh sách khách sạn");
        }
    };

    const fetchRooms = async (khachSanId) => {
        if (!khachSanId) return setRooms([]);
        setLoading(true);
        try {
            const res = await api.get(`/nhan-vien/khach-san/${khachSanId}/phong`);
            setRooms(res.data.data || []);
        } catch (e) {
            message.error("Không thể tải danh sách phòng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        fetchRooms(selectedHotel);
    }, [selectedHotel]);

    const columns = [
        { title: "ID", width: 70, render: (_, __, i) => i + 1 },
        { title: "Số phòng", dataIndex: "soPhong" },
        { title: "Loại phòng", render: (_, r) => r.loaiPhongId?.tenLoaiPhong },
        { title: "Trạng thái", dataIndex: "trangThaiPhong", render: v => <Tag color={statusColor[v]}>{statusLabel[v] || v}</Tag> },
        { title: "Khách sạn", render: (_, r) => r.khachSanId?.tenKhachSan },
        { title: "Hành động", width: 200, render: (_, r) => (
            <div className="flex gap-2">
                <Button type="primary" onClick={() => navigate(`/staff/rooms/${r.id}`)}>Chi tiết</Button>
            </div>
        )},
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Phòng (Staff)</h1>
                <Select style={{ width: 320 }} placeholder="Chọn khách sạn" value={selectedHotel} onChange={setSelectedHotel} allowClear>
                    {hotels.map(h => <Select.Option key={h.id} value={h.id}>{h.tenKhachSan}</Select.Option>)}
                </Select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <Table columns={columns} dataSource={rooms} rowKey="id" loading={loading} />
            </div>
        </div>
    )
}