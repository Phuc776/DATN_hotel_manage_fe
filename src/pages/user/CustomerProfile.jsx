import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    Card,
    Descriptions,
    Button,
    Spin,
    message,
    Input,
    Form,
    Divider,
    Space
} from "antd";

export default function CustomerProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cccd, setCccd] = useState(null);
    const [loadingCccd, setLoadingCccd] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        api.get("/khach-hang/profile")
            .then(res => {
                setProfile(res.data.data);
                form.setFieldsValue(res.data.data);
            })
            .catch(() => {
                message.error("Không tải được thông tin cá nhân");
            })
            .finally(() => setLoading(false));
    }, []);

    const revealCccd = async () => {
        try {
            setLoadingCccd(true);
            const res = await api.get("/khach-hang/profile/reveal-cccd");
            setCccd(res.data.data);
        } catch {
            message.error("Không thể lấy CCCD");
        } finally {
            setLoadingCccd(false);
        }
    };

    const submitUpdate = async (values) => {
        try {
            await api.put("/khach-hang/profile", values);
            message.success("Cập nhật thông tin thành công");
            setEditing(false);

            // reload profile
            const res = await api.get("/khach-hang/profile");
            setProfile(res.data.data);
            form.setFieldsValue({
                hoTen: res.data.data.taiKhoan?.hoTen,
                soDienThoai: res.data.data.taiKhoan?.soDienThoai,
                cccd: "" // luôn để trống
            });
        } catch (e) {
            message.error(e.response?.data?.message || "Cập nhật thất bại");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Hồ sơ cá nhân</h1>

            <Card>
                {!editing ? (
                    <>
                        <Descriptions column={1}>
                            <Descriptions.Item label="Họ tên">
                                {profile.taiKhoan.hoTen}
                            </Descriptions.Item>

                            <Descriptions.Item label="Email">
                                {profile.taiKhoan.email}
                            </Descriptions.Item>

                            <Descriptions.Item label="Số điện thoại">
                                {profile.taiKhoan.soDienThoai || "—"}
                            </Descriptions.Item>

                            <Descriptions.Item label="CCCD">
                                {cccd ? (
                                    <span className="font-mono">{cccd}</span>
                                ) : (
                                    <Space>
                                        <Button
                                            size="small"
                                            loading={loadingCccd}
                                            onClick={revealCccd}
                                        >
                                            Hiện CCCD
                                        </Button>
                                        <span className="text-sm text-gray-500">(Bảo mật)</span>
                                    </Space>
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày xác thực CCCD">
                                {profile.ngayXacThucCCCD ? new Date(profile.ngayXacThucCCCD).toLocaleString() : '—'}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày tạo tài khoản">
                                {profile.taiKhoan.ngayTao ? new Date(profile.taiKhoan.ngayTao).toLocaleString() : '—'}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <div className="flex gap-2">
                            <Button
                                type="primary"
                                onClick={() => {
                                    setEditing(true);
                                    form.setFieldsValue({
                                        hoTen: profile.taiKhoan?.hoTen,
                                        soDienThoai: profile.taiKhoan?.soDienThoai,
                                        cccd: "" // reset CCCD
                                    });
                                }}
                            >
                                Chỉnh sửa thông tin
                            </Button>
                        </div>
                    </>
                ) : (
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={submitUpdate}
                    >
                        <Form.Item
                            label="Họ tên"
                            name="hoTen"
                            rules={[{ required: true, message: "Nhập họ tên" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="soDienThoai"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="CCCD"
                            name="cccd"
                            extra="Chỉ nhập khi bạn muốn cập nhật CCCD"
                        >
                            <Input />
                        </Form.Item>

                        <div className="flex gap-2">
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                            <Button onClick={() => setEditing(false)}>
                                Hủy
                            </Button>
                        </div>
                    </Form>
                )}
            </Card>
        </div>
    );
}
