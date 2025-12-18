import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, message, Tag } from "antd";
import api from "../../api/axios";

export default function SearchAvailable({ onSelect }) {
    const [ngayNhan, setNgayNhan] = useState("");
    const [ngayTra, setNgayTra] = useState("");
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const search = async () => {
        try {
            const res = await api.post("/bai-dang-phong/public/booking/check-availability", {
                ngayNhan,
                ngayTra
            });
            setData(res.data.data || []);
        } catch {
            message.error("Không tìm được phòng khả dụng");
        }
    };

    const columns = [
        { title: "Tiêu đề", dataIndex: "tieuDe" },
        { title: "Khách sạn", dataIndex: "tenKhachSan" },
        { title: "Loại phòng", dataIndex: "tenLoaiPhong" },
        { title: "Giá", dataIndex: "giaLoaiPhong" },
        {
            title: "Còn phòng",
            render: (_, r) =>
                r.conPhong
                    ? <Tag color="green">{r.soPhongCon} phòng</Tag>
                    : <Tag color="red">Hết phòng</Tag>
        },
        {
            title: "Hành động",
            render: (_, r) =>
                r.conPhong && (
                    <Button
                        type="primary"
                        onClick={() => {
                            navigate(`/search/${r.baiDangPhongId}`, {
                                state: {
                                    ...r,
                                    ngayNhan,
                                    ngayTra
                                }
                            });
                        }}
                    >
                        Chọn
                    </Button>
                )
        }

    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <input type="datetime-local" onChange={e => setNgayNhan(e.target.value)} />
                <input type="datetime-local" onChange={e => setNgayTra(e.target.value)} />
                <Button onClick={search}>Tìm phòng</Button>
            </div>

            <Table rowKey="baiDangPhongId" columns={columns} dataSource={data} />
        </div>
    );
}
