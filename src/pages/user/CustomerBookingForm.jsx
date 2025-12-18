import { useState } from "react";
import { Button, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CustomerBookingForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const selected = location.state || {};

    if (!selected) {
        return <div>Không có dữ liệu đặt phòng</div>;
    }
    
    const [soLuongPhongDat, setSoLuongPhongDat] = useState(1);
    const [soNguoiLon, setSoNguoiLon] = useState(selected.soNguoiLon);
    const [soTreEm, setSoTreEm] = useState(0);
    const [ghiChu, setGhiChu] = useState("");

    const submit = async () => {
        try {
            await api.post("/khach-hang/booking", {
                baiDangPhongId: selected.baiDangPhongId,
                ngayNhan: selected.ngayNhan,
                ngayTra: selected.ngayTra,
                soLuongPhongDat,
                soNguoiLon,
                soTreEm,
                ghiChu
            });

            message.success("Đặt phòng thành công, chờ xác nhận");
        } catch (e) {
            message.error(e.response?.data?.message || "Đặt phòng thất bại");
        }
    };

    return (
        <div>
            <h3>{selected.tieuDe}</h3>
            <p>{selected.tenKhachSan}</p>

            <label>Số phòng</label>
            <input type="number" value={soLuongPhongDat}
                   onChange={e => setSoLuongPhongDat(e.target.value)} />

            <label>Người lớn</label>
            <input type="number" value={soNguoiLon}
                   onChange={e => setSoNguoiLon(e.target.value)} />

            <label>Trẻ em</label>
            <input type="number" value={soTreEm}
                   onChange={e => setSoTreEm(e.target.value)} />

            <label>Ghi chú</label>
            <textarea onChange={e => setGhiChu(e.target.value)} />

            <br />
            <Button type="primary" onClick={submit}>
                Xác nhận đặt phòng
            </Button>
        </div>
    );
}
