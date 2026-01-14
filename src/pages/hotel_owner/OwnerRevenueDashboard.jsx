import { useState, useEffect } from "react";
import { Card, DatePicker, Tabs, Typography, Select, Spin, Empty } from "antd";
import dayjs from "dayjs";
import RevenueMonthly from "./components/RevenueMonthly";
import RevenueByRoomType from "./components/RevenueByRoomType";
import RevenueAllHotelsMonthly from "./components/RevenueAllHotelsMonthly";
import api from "../..//api/axios";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const OwnerRevenueDashboard = ({ khachSanId }) => {
  const defaultEnd = dayjs().endOf("month");
  const defaultStart = dayjs().subtract(11, "month").startOf("month");

  const [range, setRange] = useState([defaultStart, defaultEnd]);
  const [appliedRange, setAppliedRange] = useState([defaultStart, defaultEnd]);

  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleRangeChange = (val) => setRange(val || []);
  const handleRangeOk = (val) => {
    if (val && val[0] && val[1]) {
      setAppliedRange(val);
    }
  };

  useEffect(() => {
    const fetchHotels = async () => {
      setLoadingHotels(true);
      try {
        const res = await api.get("/chu-khach-san/khach-san");
        const list = res?.data?.data || [];
        setHotels(list);
        if (list && list.length) {
          setSelectedHotel(list[0].id);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách khách sạn:", err);
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchHotels();
  }, []);

  const handleHotelChange = (val) => {
    setSelectedHotel(val);
  };

  const from = appliedRange && appliedRange[0] ? appliedRange[0].format("YYYY-MM-DDTHH:mm:ss") : defaultStart.format("YYYY-MM-DDTHH:mm:ss");
  const to = appliedRange && appliedRange[1] ? appliedRange[1].format("YYYY-MM-DDTHH:mm:ss") : defaultEnd.format("YYYY-MM-DDTHH:mm:ss");

  return (
    <Card>
      <Title level={4}>Thống kê doanh thu</Title>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <div style={{ minWidth: 260 }}>
          <RangePicker value={range} onChange={handleRangeChange} onOk={handleRangeOk} style={{ width: "100%" }} />
        </div>

        <div style={{ minWidth: 260 }}>
          {loadingHotels ? (
            <Spin />
          ) : (
            <Select
              value={selectedHotel}
              onChange={handleHotelChange}
              style={{ width: "100%" }}
              options={hotels.map((h) => ({ label: h.tenKhachSan, value: h.id }))}
              placeholder="Chọn khách sạn"
              allowClear
            />
          )}
        </div>
      </div>

      <Tabs
        defaultActiveKey="monthly"
        items={[
          {
            key: "monthly",
            label: "Theo tháng (1 khách sạn)",
            children: selectedHotel ? (
              <RevenueMonthly from={from} to={to} khachSanId={selectedHotel} />
            ) : (
              <Card>
                <Empty description="Vui lòng chọn khách sạn" />
              </Card>
            ),
          },
          {
            key: "byRoom",
            label: "Theo loại phòng",
            children: selectedHotel ? (
              <RevenueByRoomType from={from} to={to} khachSanId={selectedHotel} />
            ) : (
              <Card>
                <Empty description="Vui lòng chọn khách sạn" />
              </Card>
            ),
          },
          {
            key: "all",
            label: "Tất cả khách sạn",
            children: <RevenueAllHotelsMonthly from={from} to={to} />,
          },
        ]}
      />
    </Card>
  );
};

export default OwnerRevenueDashboard;
