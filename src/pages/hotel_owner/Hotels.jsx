import { useEffect, useState } from "react";
import { Tag, Button, Modal, Form, Input, message, Card, Row, Col, Spin, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadImageToFirebase from "../../utils/uploadFirebase";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function OwnerHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🟦 Modal tạo mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [uploadFileList, setUploadFileList] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);

  // 🟦 Modal cập nhật
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm] = Form.useForm();
  const [editingHotel, setEditingHotel] = useState(null);
  const [updateUploadFileList, setUpdateUploadFileList] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

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
    setCreateLoading(true);
    try {
      const values = await createForm.validateFields();

      // Prepare files to upload (use originFileObj when present)
      const files = uploadFileList.map((f) => f.originFileObj || f).filter(Boolean);

      // Upload to Firebase and collect URLs
      const urls = await Promise.all(
        files.map(async (file) => {
          try {
            return await uploadImageToFirebase(file);
          } catch (e) {
            console.error("Upload failed for file", file, e);
            throw e;
          }
        })
      );

      const payload = {
        tenKhachSan: values.tenKhachSan,
        diaChi: values.diaChi,
        hinhAnh: urls,
      };

      await api.post("/chu-khach-san/khach-san", payload);

      message.success("Tạo khách sạn thành công!");
      setIsCreateModalOpen(false);
      createForm.resetFields();
      setUploadFileList([]);
      fetchHotels();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || "Lỗi tạo khách sạn");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setUploadFileList(fileList);
  };

  // 🟦 Xử lý mở modal cập nhật
  const handleUpdate = (hotel) => {
    setEditingHotel(hotel);
    updateForm.setFieldsValue(hotel);
    // Prefill upload list with existing image URLs (if any)
    const existing = (hotel.hinhAnh || []).map((url, idx) => ({
      uid: `e-${idx}`,
      name: `image-${idx}`,
      status: "done",
      url,
    }));
    setUpdateUploadFileList(existing);
    setIsUpdateModalOpen(true);
  };

  // 🟦 Xử lý cập nhật
  const handleUpdateHotel = async () => {
    setUpdateLoading(true);
    try {
      const values = await updateForm.validateFields();

      // Separate existing URLs and new files from updateUploadFileList
      const existingUrls = updateUploadFileList
        .filter(
          (f) =>
            !f.originFileObj &&
            f.url &&
            f.url.startsWith("https://firebasestorage.googleapis.com")
        )
        .map((f) => f.url);

      const newFiles = updateUploadFileList
        .filter((f) => f.originFileObj)
        .map((f) => f.originFileObj);

      // Upload new files to Firebase
      const newUrls = await Promise.all(
        newFiles.map(async (file) => {
          try {
            return await uploadImageToFirebase(file);
          } catch (e) {
            console.error("Upload failed for file", file, e);
            throw e;
          }
        })
      );

      const merged = [...existingUrls, ...newUrls];

      const payload = {
        tenKhachSan: values.tenKhachSan,
        diaChi: values.diaChi,
        hinhAnh: merged,
      };

      await api.put(`/chu-khach-san/khach-san/${editingHotel.id}`, payload);

      message.success("Cập nhật thành công!");
      setIsUpdateModalOpen(false);
      updateForm.resetFields();
      setUpdateUploadFileList([]);
      fetchHotels();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || err.message || "Lỗi cập nhật khách sạn");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateUploadChange = ({ fileList }) => {
    setUpdateUploadFileList(fileList);
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

  // We'll render hotels as a grid of cards instead of an Ant Table.

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Khách sạn</h1>

        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          + Thêm Khách Sạn
        </Button>
      </div>

      {/* Cards grid */}
      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center p-8"><Spin size="large" /></div>
        ) : hotels.length === 0 ? (
          <div className="text-center text-gray-500 p-8">Chưa có khách sạn</div>
        ) : (
          <Row gutter={[16, 16]}>
            {hotels.map((h) => (
              <Col key={h.id} xs={24} sm={12} lg={8}>
                <Card
                  hoverable
                  cover={
                    h.hinhAnh?.[0] ? (
                      <img
                        src={h.hinhAnh[0]}
                        alt={h.tenKhachSan || 'Thumbnail'}
                        className="h-40 w-full object-cover mb-4 rounded"
                      />
                    ) : (
                      <div className="h-40 bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-400">
                        Không có ảnh
                      </div>
                    )
                  }
                >
                  <h3 className="text-xl font-semibold">{h.tenKhachSan}</h3>
                  <p className="text-gray-600 text-sm mb-2">{h.diaChi}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <Tag color={statusColorMap[h.trangThai]}>{statusLabelMap[h.trangThai]}</Tag>
                    </div>
                    <div className="flex gap-2">
                      <Button type="primary" onClick={() => navigate(`/owner/hotels/${h.id}`)}>
                        Chi tiết
                      </Button>

                      <Button
                        type="default"
                        disabled={h.trangThai === "NGUNG_HOAT_DONG"}
                        onClick={() => handleUpdate(h)}
                      >
                        Cập nhật
                      </Button>

                      <Button
                        danger
                        disabled={h.trangThai === "NGUNG_HOAT_DONG"}
                        onClick={() => handleStop(h)}
                      >
                        Ngừng hoạt động
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* 🟦 Modal tạo mới */}
      <Modal
        title="Tạo Khách Sạn Mới"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={handleCreateHotel}
        confirmLoading={createLoading}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item label="Tên khách sạn" name="tenKhachSan" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="diaChi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={() => false}
              fileList={uploadFileList}
              onChange={handleUploadChange}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Thêm</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 🟦 Modal cập nhật */}
      <Modal
        title="Cập Nhật Khách Sạn"
        open={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        onOk={handleUpdateHotel}
        confirmLoading={updateLoading}
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item label="Tên khách sạn" name="tenKhachSan" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="diaChi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={() => false}
              fileList={updateUploadFileList}
              onChange={handleUpdateUploadChange}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Thêm</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}
