// src/pages/staff/StaffRoomsCard.jsx
import { Card, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const roomStyle = {
    TRONG: "border-green-400 bg-green-400",
    DA_DAT: "border-orange-400 bg-orange-400",
    CO_KHACH: "border-red-400 bg-red-400",
};

const roomLabel = {
    TRONG: "Trống",
    DA_DAT: "Đã đặt",
    CO_KHACH: "Có khách",
};

export default function StaffRoomsCard({ rooms }) {
    const [open, setOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const navigate = useNavigate();

    return (
        <>
            {/* Grid phòng */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className={`cursor-pointer p-0 border rounded ${roomStyle[room.trangThaiPhong]}`}
                        onClick={() => {
                            setSelectedRoom(room);
                            setOpen(true);
                        }}
                    >
                        <Card variant="plain" className="h-full bg-transparent" styles={{ body: { background: 'transparent' } }}>
                            <h3 className="text-lg font-bold">Phòng {room.soPhong}</h3>
                            <div className="text-sm text-gray-600">{room.tenLoaiPhong}</div>
                            <div className={`mt-2 inline-block px-2 py-0.5 text-sm font-medium rounded ${roomStyle[room.trangThaiPhong]}`}>
                                {roomLabel[room.trangThaiPhong]}
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Modal booking */}
            <Modal
                open={open}
                title={`Danh sách booking - Phòng ${selectedRoom?.soPhong}`}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                {selectedRoom?.bookings?.length === 0 && (
                    <p>Không có booking</p>
                )}

                {selectedRoom?.bookings?.map((b) => (
                    <div
                        key={b.bookingId}
                        className="p-3 border rounded mb-2 cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                            navigate(`/staff/bookings/${b.bookingId}`)
                        }
                    >
                        <div className="font-semibold">
                            {b.tenKhachHang}
                        </div>
                        <div className="text-sm">
                            {dayjs(b.ngayNhan).format("DD/MM HH:mm")}
                            {" → "}
                            {dayjs(b.ngayTra).format("DD/MM HH:mm")}
                        </div>
                        <div className="mt-1 inline-block px-2 py-0.5 text-sm font-medium rounded bg-gray-100">{b.trangThai}</div>
                    </div>
                ))}
            </Modal>
        </>
    );
}
