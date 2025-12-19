import { useEffect, useState } from "react";
import { Button, Spin, message } from "antd";
import api from "../../api/axios";
import StaffRoomsTimeline from "./StaffRoomsTimeline";
import StaffRoomsCard from "./StaffRoomsCard";


export default function StaffRooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("timeline"); // timeline | card


    const fetchRooms = async () => {
        setLoading(true);
        try {
            const res = await api.get("/nhan-vien/phong");
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


    if (loading) return <Spin className="m-10" />;


    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Quản lý phòng</h1>
                <div className="flex gap-2">
                    <Button type={view === "timeline" ? "primary" : "default"}
                        onClick={() => setView("timeline")}> Timeline </Button>
                    <Button type={view === "card" ? "primary" : "default"}
                        onClick={() => setView("card")}> Card </Button>
                </div>
            </div>


            {view === "timeline" && <StaffRoomsTimeline rooms={rooms} />}
            {view === "card" && <StaffRoomsCard rooms={rooms} />}
        </div>
    );
}