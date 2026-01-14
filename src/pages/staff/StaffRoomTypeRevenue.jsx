import React, { useEffect, useState } from "react";
import { Card, DatePicker, Table, Spin, Empty, Typography } from "antd";
import { Column } from "@ant-design/charts";
import dayjs from "dayjs";
import api from "../../api/axios";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const StaffRoomTypeRevenue = () => {
  const defaultEnd = dayjs().endOf("month");
  const defaultStart = dayjs().subtract(11, "month").startOf("month");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState([defaultStart, defaultEnd]);

  const fetchData = async (from, to) => {
    setLoading(true);
    try {
      const res = await api.get("/nhan-vien/thong-ke/doanh-thu/loai-phong", {
        params: { from, to },
      });
      setData(res?.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy doanh thu theo loại phòng:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch default last 12 months on mount
    fetchData(defaultStart.format("YYYY-MM-DDTHH:mm:ss"), defaultEnd.format("YYYY-MM-DDTHH:mm:ss"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = (val) => {
    setRange(val || []);
  };

  const handleRangeOk = (val) => {
    if (val && val[0] && val[1]) {
      fetchData(val[0].format("YYYY-MM-DDTHH:mm:ss"), val[1].format("YYYY-MM-DDTHH:mm:ss"));
    }
  };

  const columns = [
    {
      title: "Loại phòng",
      dataIndex: "tenLoaiPhong",
      key: "tenLoaiPhong",
    },
    {
      title: "Doanh thu",
      dataIndex: "doanhThu",
      key: "doanhThu",
      render: (v) =>
        typeof v === "number"
          ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
          : "-",
    },
  ];

  const chartData = data.map((d) => ({ tenLoaiPhong: d.tenLoaiPhong, doanhThu: d.doanhThu || 0 }));

  const chartConfig = {
    data: chartData,
    xField: "tenLoaiPhong",
    yField: "doanhThu",
    xAxis: { title: { text: "Loại phòng" } },
    yAxis: {
      label: {
        formatter: (v) =>
          new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v),
      },
    },
    tooltip: {
      formatter: (datum) => ({ name: "Doanh thu", value: datum.doanhThu }),
    },
    columnWidthRatio: 0.6,
  };

  return (
    <Card>
      <Title level={4}>Doanh thu theo loại phòng</Title>

      <RangePicker
        value={range}
        onChange={handleRangeChange}
        onOk={handleRangeOk}
        style={{ marginBottom: 16 }}
        allowClear
      />

      <Spin spinning={loading}>
        {data && data.length ? (
          <div style={{ marginBottom: 16 }}>
            <Column {...chartConfig} />
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <Empty description="Không có dữ liệu doanh thu" />
          </div>
        )}

        <Table
          columns={columns}
          dataSource={data}
          rowKey="tenLoaiPhong"
          pagination={false}
          locale={{ emptyText: <Empty description="Không có dữ liệu doanh thu" /> }}
        />
      </Spin>
    </Card>
  );
};

export default StaffRoomTypeRevenue;
