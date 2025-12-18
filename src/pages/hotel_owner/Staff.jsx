import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Form, Input, Select, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function OwnerStaff() {
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState([]);
    const [selected, setSelected] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const RoleMap = {
        ADMIN: "Admin",
        CHU_KHACH_SAN: "Chủ khách sạn",
        NHAN_VIEN: "Nhân viên",
        KHACH_HANG: "Khách hàng",
    };

    const [hotelsList, setHotelsList] = useState([]);

    const getHotelsList = async () => {
        try {
            const res = await api.get("/chu-khach-san/khach-san/active");
            setHotelsList(res.data.data || []);
        } catch (e) {
            // non-fatal
        }
    };

    const getStaff = async () => {
        setLoading(true);
        try {
            const res = await api.get("/chu-khach-san/nhan-vien");
            setStaff(res.data.data || []);
        } catch (e) {
            message.error("Không thể tải danh sách nhân viên");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStaff();
    }, []);

    const handleChangeStatus = (record) => {
        setSelected(record);
    };

    const confirmChangeStatus = async () => {
        try {
            const res = await api.post(`/chu-khach-san/nhan-vien/${selected.id}/status`);
            message.success(res.data.message || "Thao tác thành công");
            setSelected(null);
            getStaff();
        } catch (e) {
            message.error("Lỗi thao tác");
        }
    };

    const openAdd = () => {
        form.resetFields();
        // ensure hotels list available for select
        if (!hotelsList.length) getHotelsList();
        setAddOpen(true);
    };

    const submitAdd = async (values) => {
        try {
            // API expects POST /chu-khach-san/khach-san/{khachSanId}/nhan-vien
            const khachSanId = values.khachSanId;
            const body = {
                hoTen: values.hoTen,
                email: values.email,
                matKhau: values.matKhau,
                soDienThoai: values.soDienThoai,
                chucVu: values.chucVu,
                khachSanId: values.khachSanId,
            };
            const res = await api.post(`/chu-khach-san/khach-san/${khachSanId}/nhan-vien`, body);
            message.success(res.data.message || "Thêm nhân viên thành công");
            setAddOpen(false);
            getStaff();
        } catch (e) {
            message.error(e?.response?.data?.message || "Lỗi thêm nhân viên");
        }
    };

    const columns = [
        {
            title: "ID",
            width: 70,
            render: (_, __, index) => index + 1,
        },
        {
            title: "Nhân viên",
            render: (_, record) => (
                <div>
                    <div className="font-semibold">{record.taiKhoan?.hoTen}</div>
                    <div className="text-sm text-gray-500">{record.taiKhoan?.email}</div>
                </div>
            ),
        },
        {
            title: "Khách sạn",
            render: (_, record) => (
                <div>
                    <div className="font-semibold">{record.khachSan?.tenKhachSan}</div>
                    <div className="text-sm text-gray-500">{record.khachSan?.diaChi}</div>
                </div>
            ),
        },
        {
            title: "Chức vụ",
            dataIndex: "chucVu",
        },
        {
            title: "SĐT",
            render: (_, record) => record.taiKhoan?.soDienThoai,
        },
        {
            title: "Ngày tạo",
            render: (_, record) => record.taiKhoan?.ngayTao,
        },
        {
            title: "Trạng thái",
            render: (_, record) => (record.taiKhoan?.trangThai ? "Hoạt động" : "Bị khóa"),
        },
        {
            title: "Hành động",
            width: 260,
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => navigate(`/owner/staff/${record.id}`)}>
                        Chi tiết
                    </Button>
                    <Button onClick={() => handleChangeStatus(record)}>
                        Đổi trạng thái
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Quản lý nhân viên</h1>
                <Button type="primary" onClick={openAdd}>Thêm nhân viên</Button>
            </div>

            <Table rowKey="id" columns={columns} dataSource={staff} loading={loading} />

            <Modal
                title="Xác nhận đổi trạng thái"
                open={!!selected}
                onOk={confirmChangeStatus}
                onCancel={() => setSelected(null)}
                okText="Đổi trạng thái"
            >
                <p>Bạn có chắc muốn đổi trạng thái nhân viên:</p>
                <p className="font-semibold mt-2">{selected?.taiKhoan?.email}</p>
            </Modal>

            <Modal
                title="Thêm nhân viên cho khách sạn"
                open={addOpen}
                onCancel={() => setAddOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={submitAdd}>
                    <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="soDienThoai" label="SĐT" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="chucVu" label="Chức vụ">
                        <Input />
                    </Form.Item>
                    <Form.Item name="khachSanId" label="Khách sạn" rules={[{ required: true, message: 'Vui lòng chọn khách sạn' }]}>
                        <Select placeholder="Chọn khách sạn">
                            {hotelsList.map((h) => (
                                <Select.Option key={h.id} value={h.id}>
                                    {h.tenKhachSan} ({h.id})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => setAddOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Thêm</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}