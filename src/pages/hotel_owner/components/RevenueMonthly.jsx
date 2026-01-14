import React, { useEffect, useState } from "react";
import { Card, Table, Spin, Empty } from "antd";
import { Column } from "@ant-design/charts";
import dayjs from "dayjs";
import api from "../../../api/axios";

const RevenueMonthly = ({ from, to, khachSanId }) => {
    const [rawData, setRawData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!from || !to || !khachSanId) return;
        setLoading(true);
        try {
            const res = await api.get("/chu-khach-san/thong-ke/doanh-thu/monthly", {
                params: { khachSanId, from, to },
            });
            const fetched = res?.data?.data || [];

            const generateMonths = (fromStr, toStr) => {
                const start = dayjs(fromStr).startOf("month");
                const end = dayjs(toStr).startOf("month");
                const result = [];
                let current = start;
                while (current.isBefore(end) || current.isSame(end)) {
                    result.push(current.format("YYYY-MM"));
                    current = current.add(1, "month");
                }
                return result;
            };

            const months = generateMonths(from, to);
            const normalized = months.map((month) => {
                const found = fetched.find((d) => d.thang === month);
                return { thang: month, doanhThu: found ? found.doanhThu : 0 };
            });

            setRawData(fetched);
            setChartData(normalized);
        } catch (err) {
            console.error("Lỗi khi lấy doanh thu theo tháng:", err);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from, to, khachSanId]);

    const columns = [
        { title: "Tháng", dataIndex: "thang", key: "thang" },
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


    const chartConfig = {
        data: chartData,
        xField: "thang",
        yField: "doanhThu",
        yAxis: {
            label: { formatter: (v) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v) },
        },
        tooltip: { formatter: (datum) => ({ name: "Doanh thu", value: datum.doanhThu }) },
        columnWidthRatio: 0.6,
    };

    return (
        <Card>
            <Spin spinning={loading}>
                {chartData && chartData.length ? (
                    <div style={{ marginBottom: 16 }}>
                        <Column {...chartConfig} />
                    </div>
                ) : (
                    <div style={{ marginBottom: 16 }}>
                        <Empty description="Không có dữ liệu doanh thu" />
                    </div>
                )}

                <Table columns={columns} dataSource={rawData} rowKey="thang" pagination={false} locale={{ emptyText: <Empty description="Không có dữ liệu doanh thu" /> }} />
            </Spin>
        </Card>
    );
};

export default RevenueMonthly;
