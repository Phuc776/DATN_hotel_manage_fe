import { useNavigate } from "react-router-dom";
import { Card, Form, DatePicker, InputNumber, Button } from "antd";


export default function SearchBox() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { ngayNhan, ngayTra, soNguoiLon, soTreEm, soLuongPhong } = values;

    const params = new URLSearchParams({
      ngayNhan: ngayNhan.format("YYYY-MM-DDTHH:mm"),
      ngayTra: ngayTra.format("YYYY-MM-DDTHH:mm"),
      soNguoiLon: String(soNguoiLon),
      soTreEm: String(soTreEm || 0),
      soLuongPhong: String(soLuongPhong),
    }).toString();

    navigate(`/search?${params}`);
  };

  return (
    <Card size="small" style={{ width: "100%", maxWidth: 980, margin: "0 auto" }}>
      <Form
        form={form}
        layout="inline"
        initialValues={{ soNguoiLon: 1, soTreEm: 0, soLuongPhong: 1 }}
        onFinish={onFinish}
        style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}
      >
        <Form.Item
          name="ngayNhan"
          rules={[{ required: true, message: "Vui lòng chọn ngày nhận" }]}
        >
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format={"YYYY-MM-DD HH:mm"}
            placeholder="Ngày nhận"
          />
        </Form.Item>

        <Form.Item
          name="ngayTra"
          rules={[
            { required: true, message: "Vui lòng chọn ngày trả" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const start = getFieldValue("ngayNhan");
                if (!start || !value) return Promise.resolve();
                if (value.isAfter(start)) return Promise.resolve();
                return Promise.reject(new Error("Ngày trả phải sau ngày nhận"));
              },
            }),
          ]}
        >
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format={"YYYY-MM-DD HH:mm"}
            placeholder="Ngày trả"
          />
        </Form.Item>

        <Form.Item
          label="Người lớn"
          name="soNguoiLon"
          rules={[{ type: 'number', min: 1, required: true, message: 'Số người lớn tối thiểu là 1' }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item label="Trẻ em" name="soTreEm">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Số phòng"
          name="soLuongPhong"
          rules={[{ type: 'number', min: 1, required: true, message: 'Số phòng tối thiểu là 1' }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tìm phòng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
