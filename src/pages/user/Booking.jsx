import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Form, Input, Button, message } from "antd";
import dayjs from "dayjs";
import api from "../../api/axios";

const { TextArea } = Input;

function formatDate(v) {
  if (!v) return "-";
  const d = dayjs(v, "YYYY-MM-DDTHH:mm");
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : v;
}

export default function Booking() {
  const { baiDangPhongId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ngayNhan = searchParams.get("ngayNhan") || "";
  const ngayTra = searchParams.get("ngayTra") || "";
  const soNguoiLon = searchParams.get("soNguoiLon") || "";
  const soTreEm = searchParams.get("soTreEm") || "";
  const soLuongPhong = searchParams.get("soLuongPhong") || "";

  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await api.post("/khach-hang/booking", {
        baiDangPhongId: Number(baiDangPhongId),
        ngayNhan: ngayNhan,
        ngayTra: ngayTra,
        soLuongPhongDat: Number(soLuongPhong) || 1,
        soNguoiLon: Number(soNguoiLon) || 1,
        soTreEm: Number(soTreEm) || 0,
        ghiChu: values.ghiChu || "",
      });

      message.success("Gửi yêu cầu đặt phòng thành công. Vui lòng chờ xác nhận.");
    } catch (e) {
      message.error(e?.response?.data?.message || "Đặt phòng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Card title="Xác nhận đặt phòng" style={{ maxWidth: 900, margin: "0 auto" }}>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Mã bài đăng">{baiDangPhongId}</Descriptions.Item>
          <Descriptions.Item label="Ngày nhận">{formatDate(ngayNhan)}</Descriptions.Item>
          <Descriptions.Item label="Ngày trả">{formatDate(ngayTra)}</Descriptions.Item>
          <Descriptions.Item label="Người lớn">{soNguoiLon || "-"}</Descriptions.Item>
          <Descriptions.Item label="Trẻ em">{soTreEm || 0}</Descriptions.Item>
          <Descriptions.Item label="Số phòng yêu cầu">{soLuongPhong || "-"}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 16 }}>
          <Form layout="vertical" onFinish={onFinish} initialValues={{ ghiChu: "" }}>
            <Form.Item label="Ghi chú" name="ghiChu">
              <TextArea rows={4} placeholder="Ghi chú (không bắt buộc)" />
            </Form.Item>

            <div style={{ display: "flex", gap: 8 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Xác nhận đặt phòng
              </Button>
              <Button onClick={() => navigate(-1)}>Quay lại</Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}
