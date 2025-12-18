import { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function StaffRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const statusLabel = {
        TRONG: "Trống",
        DA_DAT: "Đã đặt",
        CO_KHACH: "Có khách",

    };
    const statusColor = {
        TRONG: "green",
        DA_DAT: "orange",
        CO_KHACH: "red",

    };

    const fetchRooms = async () => {

        setLoading(true);
        try {
            const res = await api.get(`/nhan-vien/phong`);
            setRooms(res.data.data || []);
        } catch (e) {
            message.error("Không thể tải danh sách phòng");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchRooms();
    }, []);


    const columns = [
        { title: "ID", width: 70, render: (_, __, i) => i + 1 },
        { title: "Số phòng", dataIndex: "soPhong" },
        { title: "Loại phòng", render: (_, r) => r.loaiPhong.tenLoaiPhong },
        { title: "Trạng thái", dataIndex: "trangThaiPhong", render: v => <Tag color={statusColor[v]}>{statusLabel[v] || v}</Tag> },
        {
            title: "Hành động", width: 200, render: (_, r) => (
                <div className="flex gap-2">
                    <Button type="primary" onClick={() => navigate(`/staff/rooms/${r.id}`)}>Chi tiết</Button>
                </div>
            )
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Phòng (Staff)</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <Table columns={columns} dataSource={rooms} rowKey="id" loading={loading} />
            </div>
        </div>
    )
}