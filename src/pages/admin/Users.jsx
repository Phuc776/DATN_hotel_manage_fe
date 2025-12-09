import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminUsers() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const UserMap = {
        ADMIN: "Admin",
        CHU_KHACH_SAN: "Chủ khách sạn",
        NHAN_VIEN: "Nhân viên",
        KHACH_HANG: "Khách hàng",
    };

    const getUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/tai-khoan");
            setUsers(res.data.data || []);
        } catch (e) {
            message.error("Không thể tải danh sách tài khoản");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleChangeStatus = (record) => {
        setSelected(record);
    };

    const confirmChangeStatus = async () => {
        try {
            const res = await api.post(`/admin/tai-khoan/${selected.id}/change-status`);
            message.success(res.data.message || "Thao tác thành công");
            setSelected(null);
            getUsers();
        } catch (e) {
            message.error("Lỗi thao tác");
        }
    };

    const openAddAdmin = () => {
        form.resetFields();
        setAddOpen(true);
    };

    const submitAddAdmin = async (values) => {
        try {
            const res = await api.post("/admin/tai-khoan/admin", values);
            message.success(res.data.message || "Tạo admin thành công");
            setAddOpen(false);
            getUsers();
        } catch (e) {
            message.error(e?.response?.data?.message || "Lỗi tạo admin");
        }
    };

    const columns = [
        {
            title: "ID",
            width: 70,
            render: (_, __, index) => index + 1,
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Họ tên",
            dataIndex: "hoTen",
        },
        {
            title: "SĐT",
            dataIndex: "soDienThoai",
        },
        {
            title: "Vai trò",
            dataIndex: "vaiTro",
            render: (v) => UserMap[v] || v,
        },
        {
            title: "Ngày tạo",
            dataIndex: "ngayTao",
        },
        {
            title: "Trạng thái",
            dataIndex: "trangThai",
            render: (v) => (v ? "Hoạt động" : "Bị khóa"),
        },
        {
            title: "Hành động",
            width: 260,
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => navigate(`/admin/users/${record.id}`)}>
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
                <h1 className="text-xl font-bold">Quản lý tài khoản</h1>
                <Button type="primary" onClick={openAddAdmin}>Thêm admin</Button>
            </div>

            <Table rowKey="id" columns={columns} dataSource={users} loading={loading} />

            <Modal
                title="Xác nhận đổi trạng thái"
                open={!!selected}
                onOk={confirmChangeStatus}
                onCancel={() => setSelected(null)}
                okText="Đổi trạng thái"
            >
                <p>Bạn có chắc muốn đổi trạng thái tài khoản:</p>
                <p className="font-semibold mt-2">{selected?.email}</p>
            </Modal>

            <Modal
                title="Tạo tài khoản admin"
                open={addOpen}
                onCancel={() => setAddOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={submitAddAdmin}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }] }>
                        <Input />
                    </Form.Item>
                    <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }] }>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => setAddOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Tạo admin</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}