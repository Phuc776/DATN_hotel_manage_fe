import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminPendingHotels() {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const getPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/khach-san/pending");
      setHotels(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPending();
  }, []);

  const handleApprove = (record) => {
    setSelected({
      action: "approve",
      ...record,
    });
  };

  const handleReject = (record) => {
    setSelected({
      action: "reject",
      ...record,
    });
  };

  const confirmAction = async () => {
    try {
      const apiPath =
        selected.action === "approve"
          ? `/admin/khach-san/${selected.id}/approve`
          : `/admin/khach-san/${selected.id}/reject`;

      const res = await api.post(apiPath);
      message.success(res.data.message);
      setSelected(null);
      getPending();
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
      title: "Chủ khách sạn",
      render: (_, record) =>
        record.chuKhachSan?.hoTen,
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
          <Button type="default" onClick={() => handleApprove(record)}>
            Duyệt
          </Button>
          <Button danger onClick={() => handleReject(record)}>
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Khách sạn chờ duyệt</h1>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={hotels}
        loading={loading}
      />

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
          Bạn có chắc muốn{" "}
          <strong>
            {selected?.action === "approve" ? "DUYỆT" : "TỪ CHỐI"}
          </strong>{" "}
          khách sạn:
        </p>
        <p className="font-semibold mt-2">{selected?.tenKhachSan}</p>
      </Modal>
    </div>
  );
}
