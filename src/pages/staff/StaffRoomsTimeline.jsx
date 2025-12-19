import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

const DAYS = 10;            // số ngày hiển thị
const HOUR_WIDTH = 7;   // px per hour (tùy chỉnh)
const PAST_DAYS = 1;     // số ngày ở quá khứ
const ROOM_COL_WIDTH = 192; // px — fixed room column width (w-48 == 12rem == 192px)
const DAY_WIDTH = 24 * HOUR_WIDTH;

const bookingColor = {
    CHO_XAC_NHAN: "bg-orange-400",
    DA_XAC_NHAN: "bg-blue-500",
    CHO_HUY: "bg-purple-600",
    DANG_O: "bg-green-600",
    CHO_TRA: "bg-cyan-400",
};

export default function StaffRoomsTimeline({ rooms }) {
    const [hoverX, setHoverX] = useState(null);
    const scrollerRef = useRef(null);
    const contentRef = useRef(null);
    const navigate = useNavigate();
    const startDay = dayjs().startOf("day").subtract(PAST_DAYS, "day");

    // group phòng theo loại phòng
    const roomsByLoaiPhong = rooms.reduce((acc, room) => {
        const key = room.tenLoaiPhong;
        if (!acc[key]) acc[key] = [];
        acc[key].push(room);
        return acc;
    }, {});

    // tính vị trí & độ dài booking
    const calcBookingStyle = (ngayNhan, ngayTra) => {
        const start = dayjs(ngayNhan);
        const end = dayjs(ngayTra);

        const offsetHours = start.diff(startDay, "day") * 24 + start.hour();
        const durationHours = Math.max(end.diff(start, "hour"), 1);

        return {
            left: offsetHours * HOUR_WIDTH,
            width: durationHours * HOUR_WIDTH,
        };
    };


    const handleMouseMove = (e) => {
        const scroller = scrollerRef.current;
        const content = contentRef.current;
        if (!scroller || !content) return;
        // use the scroller container rect so calculations account for visible viewport
        const rect = scroller.getBoundingClientRect();
        // containerX: mouse position relative to content left (account for horizontal scroll)
        const containerX = e.clientX - rect.left + scroller.scrollLeft;

        // gridX: position inside the time grid (exclude fixed room column)
        const gridX = containerX - ROOM_COL_WIDTH;

        // if cursor is over the room column (gridX < 0) do not show hover
        if (gridX < 0) {
            setHoverX(null);
            return;
        }

        // clamp gridX to [0, DAYS * DAY_WIDTH]
        const maxGridWidth = DAYS * DAY_WIDTH;
        const clampedGridX = Math.max(0, Math.min(gridX, maxGridWidth));

        // store visual X = room column width + clamped grid X so the line positions correctly
        setHoverX(ROOM_COL_WIDTH + clampedGridX);
    };

    const handleMouseLeave = () => setHoverX(null);

    return (
        <div className="border rounded overflow-hidden">
            <div className="overflow-x-auto" ref={scrollerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="min-w-max" ref={contentRef}
                    style={{
                        width: (DAYS * 24 * HOUR_WIDTH) + 192 // 192 = cột phòng
                    }}
                >
                    {/* Header timeline */}
                    <div className="flex sticky top-0 bg-white z-10">
                        <div className="w-48 border-r"></div>

                        {Array.from({ length: DAYS }).map((_, i) => (
                            <div
                                key={i}
                                style={{ width: 24 * HOUR_WIDTH }} // old: DAY_WIDTH=120 => 24 * HOUR_WIDTH=8
                                className="border-r text-center py-2 font-semibold border-b"
                            >
                                {startDay.add(i, "day").format("DD/MM")}
                            </div>
                        ))}
                    </div>
                    <div className="flex bg-gray-50 border-b">
                        <div className="w-48 border-r"></div>

                        {Array.from({ length: DAYS * 24 }).map((_, i) => (
                            <div
                                key={i}
                                style={{ width: HOUR_WIDTH }}
                                className="border-r text-[10px] text-center text-gray-500 border-b border-gray-200"
                            >
                                {i % 24 === 0 ? "0h" : i % 6 === 0 ? `${i % 24}h` : ""}
                            </div>
                        ))}
                    </div>

                    {/* Body wrapper (relative) - hover overlays will be placed here */}
                    <div className="relative">
                        {/* hover overlay: single vertical line + tooltip */}
                        {hoverX !== null && (
                            (() => {
                                const gridX = hoverX - ROOM_COL_WIDTH;
                                const maxGridWidth = DAYS * DAY_WIDTH;
                                const effectiveX = Math.max(0, Math.min(gridX, maxGridWidth));
                                const totalHours = Math.floor(effectiveX / HOUR_WIDTH);
                                const hoverTime = startDay.add(totalHours, 'hour');

                                return (
                                    <>
                                        <div
                                            className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
                                            style={{ left: hoverX }}
                                        />
                                        <div
                                            className="absolute z-30 pointer-events-none bg-red-600 text-white text-xs px-2 py-1 rounded"
                                            style={{ left: hoverX + 8, top: 6 }}
                                        >
                                            {hoverTime.format('DD/MM HH:mm')}
                                        </div>
                                    </>
                                );
                            })()
                        )}

                        {/* Body */}
                        {Object.entries(roomsByLoaiPhong).map(([tenLoai, listPhong]) => (
                            <div key={tenLoai}>
                                {/* Tên loại phòng */}
                                <div className="bg-gray-100 px-4 py-2 font-bold">
                                    {tenLoai}
                                </div>

                                {listPhong.map((room) => (
                                    <div key={room.id} className="flex border-t">
                                        {/* Cột phòng */}
                                        <div className="w-48 border-r px-3 py-2 font-semibold">
                                            Phòng {room.soPhong}
                                        </div>

                                        {/* Timeline của phòng */}
                                        <div className="relative h-12 flex-1">
                                            {room.bookings.map((b) => {
                                                const style = calcBookingStyle(b.ngayNhan, b.ngayTra);

                                                return (
                                                    <div
                                                        key={b.bookingId}
                                                        className={`absolute top-2 h-8 rounded px-2 text-white text-sm cursor-pointer
                        ${bookingColor[b.trangThai] || "bg-gray-400"}
                      `}
                                                        style={style}
                                                        title={`${b.tenKhachHang}`}
                                                        onClick={() =>
                                                            navigate(`/staff/bookings/${b.bookingId}`)
                                                        }
                                                    >
                                                        {b.tenKhachHang}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
