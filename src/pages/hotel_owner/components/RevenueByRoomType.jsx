import React, { useEffect, useState } from "react";
import { Card, Table, Spin, Empty } from "antd";
import { Column } from "@ant-design/charts";
import api from "../../../api/axios";

const RevenueByRoomType = ({ from, to, khachSanId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!from || !to || !khachSanId) return;
    setLoading(true);
    try {
      const res = await api.get("/chu-khach-san/thong-ke/doanh-thu/loai-phong", {
        params: { khachSanId, from, to },
      });
      setData(res?.data?.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy doanh thu theo loại phòng:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, khachSanId]);

  const columns = [
    { title: "Loại phòng", dataIndex: "tenLoaiPhong", key: "tenLoaiPhong" },
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
      label: { formatter: (v) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v) },
    },
    tooltip: { formatter: (datum) => ({ name: "Doanh thu", value: datum.doanhThu }) },
    columnWidthRatio: 0.6,
  };

  return (
    <Card>
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

        <Table columns={columns} dataSource={data} rowKey="tenLoaiPhong" pagination={false} locale={{ emptyText: <Empty description="Không có dữ liệu doanh thu" /> }} />
      </Spin>
    </Card>
  );
};

export default RevenueByRoomType;
