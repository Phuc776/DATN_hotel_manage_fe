import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminHotels() {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const getHotels = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/khach-san");
      setHotels(res.data.data || []);
    } catch (e) {
      message.error("Không thể tải danh sách khách sạn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHotels();
  }, []);

  const statusLabel = {
    CHO_DUYET: "Chờ duyệt",
    DA_DUYET: "Đã duyệt",
    TU_CHOI: "Từ chối",
    CAP_NHAT_THONG_TIN: "Cập nhật thông tin",
    NGUNG_HOAT_DONG: "Ngừng hoạt động",
  };

  const statusColor = {
    CHO_DUYET: "orange",
    DA_DUYET: "green",
    TU_CHOI: "red",
    CAP_NHAT_THONG_TIN: "blue",
    NGUNG_HOAT_DONG: "gray",
  };


  const isActionable = (trangThai) =>
    trangThai === "CHO_DUYET" || trangThai === "CAP_NHAT_THONG_TIN";

  const handleApprove = (record) => {
    setSelected({ action: "approve", ...record });
  };

  const handleReject = (record) => {
    setSelected({ action: "reject", ...record });
  };

  const confirmAction = async () => {
    try {
      const apiPath =
        selected.action === "approve"
          ? `/admin/khach-san/${selected.id}/approve`
          : `/admin/khach-san/${selected.id}/reject`;

      const res = await api.post(apiPath);
      message.success(res.data.message || "Thao tác thành công");
      setSelected(null);
      getHotels();
    } catch (e) {
      message.error("Lỗi thao tác");
    }
  };

  const columns = [
    {
      title: "ID",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên khách sạn",
      dataIndex: "tenKhachSan",
    },
    {
      title: "Địa chỉ",
      dataIndex: "diaChi",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      width: 160,
      render: (trangThai) => (
        <span style={{ color: statusColor[trangThai] || "black" }}>
          {statusLabel[trangThai] || trangThai}
        </span>
      ),
    },
    {
      title: "Chủ khách sạn",
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.chuKhachSan?.hoTen}</div>
          <div className="text-sm text-gray-500">{record.chuKhachSan?.email}</div>
        </div>
      ),
    },
    {
      title: "Hành động",
      width: 300,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/admin/hotels/${record.id}`)}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            onClick={() => handleApprove(record)}
            disabled={!isActionable(record.trangThai)}
          >
            Duyệt
          </Button>
          <Button
            danger
            onClick={() => handleReject(record)}
            disabled={!isActionable(record.trangThai)}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách khách sạn</h1>

      <Table rowKey="id" columns={columns} dataSource={hotels} loading={loading} />

      <Modal
        title={
          selected?.action === "approve"
            ? "Xác nhận duyệt khách sạn"
            : "Xác nhận từ chối khách sạn"
        }
        open={!!selected}
        onOk={confirmAction}
        onCancel={() => setSelected(null)}
        okText={selected?.action === "approve" ? "Duyệt" : "Từ chối"}
        okButtonProps={{
          danger: selected?.action === "reject",
          type: "primary",
        }}
      >
        <p>
          Bạn có chắc muốn <strong>{selected?.action === "approve" ? "DUYỆT" : "TỪ CHỐI"}</strong> khách sạn:
        </p>
        <p className="font-semibold mt-2">{selected?.tenKhachSan}</p>
      </Modal>
    </div>
  );
}
