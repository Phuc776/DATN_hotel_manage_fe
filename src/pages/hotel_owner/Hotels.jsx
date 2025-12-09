import { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function OwnerHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🟦 Modal tạo mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();

  // 🟦 Modal cập nhật
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm] = Form.useForm();
  const [editingHotel, setEditingHotel] = useState(null);

  // Map trạng thái
  const statusLabelMap = {
    CHO_DUYET: "Chờ duyệt",
    DA_DUYET: "Đã duyệt",
    CAP_NHAT_THONG_TIN: "Chờ duyệt cập nhật",
    TU_CHOI: "Từ chối",
    NGUNG_HOAT_DONG: "Ngừng hoạt động",
  };
  const statusColorMap = {
    CHO_DUYET: "orange",
    DA_DUYET: "green",
    CAP_NHAT_THONG_TIN: "blue",
    TU_CHOI: "red",
    NGUNG_HOAT_DONG: "gray",
  };

  // Fetch hotels
  const fetchHotels = async () => {
    try {
      const res = await api.get("/chu-khach-san/khach-san");
      setHotels(res.data.data);
    } catch (err) {
      console.error("Lỗi load khách sạn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // 🟦 Xử lý thêm khách sạn
  const handleCreateHotel = async () => {
    try {
      const values = await createForm.validateFields();
      await api.post("/chu-khach-san/khach-san", values);

      message.success("Tạo khách sạn thành công!");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      fetchHotels();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi tạo khách sạn");
    }
  };

  // 🟦 Xử lý mở modal cập nhật
  const handleUpdate = (hotel) => {
    setEditingHotel(hotel);
    updateForm.setFieldsValue(hotel);
    setIsUpdateModalOpen(true);
  };

  // 🟦 Xử lý cập nhật
  const handleUpdateHotel = async () => {
    try {
      const values = await updateForm.validateFields();
      await api.put(`/chu-khach-san/khach-san/${editingHotel.id}`, values);

      message.success("Cập nhật thành công!");
      setIsUpdateModalOpen(false);
      updateForm.resetFields();
      fetchHotels();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi cập nhật khách sạn");
    }
  };

  // 🟦 Xử lý ngừng hoạt động
  const handleStop = (record) => {
    Modal.confirm({
      title: "Xác nhận ngừng hoạt động",
      content: `Bạn có chắc chắn muốn ngừng hoạt động khách sạn "${record.tenKhachSan}" không?`,
      okText: "Đồng ý",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await api.put(`/chu-khach-san/khach-san/${record.id}/stop`);
          message.success("Khách sạn đã ngừng hoạt động");
          fetchHotels(); // reload lại danh sách
        } catch (err) {
          message.error(err.response?.data?.message || "Ngừng hoạt động thất bại");
        }
      },
    });
  };

  // Table columns
  const columns = [
    { title: "ID", width: 70 ,render: (_, __, index) => index + 1},
    { title: "Tên khách sạn", dataIndex: "tenKhachSan" },
    { title: "Địa chỉ", dataIndex: "diaChi" },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (status) => {
        return <Tag color={statusColorMap[status]}>{statusLabelMap[status]}</Tag>;
      },
    },
    {
      title: "Hành động",
      width: 450,
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          <Button type="primary" onClick={() => navigate(`/owner/hotels/${record.id}`)}>
            Chi tiết
          </Button>

          <Button
            type="default"
            disabled={record.trangThai === "NGUNG_HOAT_DONG"}
            onClick={() => handleUpdate(record)}
          >
            Cập nhật
          </Button>

          <Button
            danger
            disabled={record.trangThai === "NGUNG_HOAT_DONG"}
            onClick={() => handleStop(record)}
          >
            Ngừng hoạt động
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Khách sạn</h1>

        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          + Thêm Khách Sạn
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={hotels}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* 🟦 Modal tạo mới */}
      <Modal
        title="Tạo Khách Sạn Mới"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={handleCreateHotel}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item label="Tên khách sạn" name="tenKhachSan" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="diaChi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 🟦 Modal cập nhật */}
      <Modal
        title="Cập Nhật Khách Sạn"
        open={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        onOk={handleUpdateHotel}
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item label="Tên khách sạn" name="tenKhachSan" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="diaChi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}
