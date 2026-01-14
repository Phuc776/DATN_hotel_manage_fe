import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  List,
  Slider,
  Checkbox,
  Tag,
  Rate,
  Button,
  Spin,
  message,
  Form,
  DatePicker,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import api from "../../api/axios";

const PRICE_MIN = 10000;
const PRICE_MAX = 1000000;

function getPrice(item) {
  return (
    item.giaLoaiPhong ?? item.gia ?? item.price ?? item.pricePerNight ?? 0
  );
}

function getRating(item) {
  return (
    item.diemDanhGia ?? item.diemDanhGiaTrungBinh ?? item.avgRating ?? item.rating ?? 0
  );
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const ngayNhan = searchParams.get("ngayNhan") || "";
  const ngayTra = searchParams.get("ngayTra") || "";
  const soNguoiLon = Number(searchParams.get("soNguoiLon") || 1);
  const soTreEm = Number(searchParams.get("soTreEm") || 0);
  const soLuongPhong = Number(searchParams.get("soLuongPhong") || 1);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Filters (client-side)
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [ratingChecks, setRatingChecks] = useState([]);

  // Build request body from query params
  const requestBody = useMemo(() => ({
    ngayNhan,
    ngayTra,
    soNguoiLon,
    soTreEm,
    soLuongPhong,
  }), [ngayNhan, ngayTra, soNguoiLon, soTreEm, soLuongPhong]);

  useEffect(() => {
    // Validate required params before calling API
    if (!ngayNhan || !ngayTra || !soNguoiLon || !soLuongPhong) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.post(
          "/bai-dang-phong/public/booking/check-availability",
          requestBody
        );
        const data = res?.data?.data ?? [];
        setResults(data);

        // initialize price range from results but clamp to fixed bounds
        const prices = data.map(getPrice).filter(Boolean);
        if (prices.length) {
          let min = Math.min(...prices);
          let max = Math.max(...prices);
          min = Math.max(PRICE_MIN, Math.floor(min));
          max = Math.min(PRICE_MAX, Math.ceil(max));
          if (min > max) {
            min = PRICE_MIN;
            max = PRICE_MAX;
          }
          setPriceRange([min, max]);
        } else {
          setPriceRange([PRICE_MIN, PRICE_MAX]);
        }
      } catch (err) {
        message.error("Không thể tìm phòng. Vui lòng thử lại.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestBody]);

  // Derived filtered results
  const filtered = useMemo(() => {
    return results.filter((it) => {
      const price = Number(getPrice(it) ?? 0);
      if (price < priceRange[0] || price > priceRange[1]) return false;

      if (ratingChecks.length > 0) {
        const r = Math.round(Number(getRating(it) ?? 0));
        // ratingChecks contains numbers like 1..5
        if (!ratingChecks.includes(r)) return false;
      }

      return true;
    });
  }, [results, priceRange, ratingChecks]);

  const onSearchAgain = (values) => {
    // values contain Date objects; need to format as in SearchBox
    const params = new URLSearchParams({
      ngayNhan: values.ngayNhan.format("YYYY-MM-DDTHH:mm"),
      ngayTra: values.ngayTra.format("YYYY-MM-DDTHH:mm"),
      soNguoiLon: String(values.soNguoiLon),
      soTreEm: String(values.soTreEm || 0),
      soLuongPhong: String(values.soLuongPhong),
    });
    setSearchParams(params);
  };

  return (
    <div style={{ padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <Form
          layout="inline"
          initialValues={{
            ngayNhan: ngayNhan ? dayjs(ngayNhan, "YYYY-MM-DDTHH:mm") : null,
            ngayTra: ngayTra ? dayjs(ngayTra, "YYYY-MM-DDTHH:mm") : null,
            soNguoiLon,
            soTreEm,
            soLuongPhong,
          }}
          onFinish={onSearchAgain}
        >
          <Form.Item name="ngayNhan" rules={[{ required: true }]}> 
            <DatePicker showTime={{ format: "HH:mm" }} format={"YYYY-MM-DD HH:mm"} />
          </Form.Item>

          <Form.Item name="ngayTra" rules={[{ required: true }]}> 
            <DatePicker showTime={{ format: "HH:mm" }} format={"YYYY-MM-DD HH:mm"} />
          </Form.Item>

          <Form.Item name="soNguoiLon" rules={[{ required: true, type: 'number', min: 1 }]}>
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item name="soTreEm">
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item name="soLuongPhong" rules={[{ required: true, type: 'number', min: 1 }]}>
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tìm lại
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Card title="Bộ lọc" size="small">
            <div style={{ marginBottom: 12 }}>
              <div style={{ marginBottom: 8 }}>Khoảng giá</div>
              <Slider
                range
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceRange}
                onChange={(val) => setPriceRange(val)}
              />
              <div>
                {priceRange[0]} - {priceRange[1]}
              </div>
            </div>

            <div>
              <div style={{ marginBottom: 8 }}>Điểm đánh giá</div>
              <Checkbox.Group
                value={ratingChecks}
                onChange={(vals) => setRatingChecks(vals)}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[5, 4, 3, 2, 1].map((v) => (
                    <Checkbox key={v} value={v}>
                      <Rate disabled defaultValue={v} /> &nbsp;{v}+
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={18}>
          <Card size="small">
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin />
              </div>
            ) : (
              <List
                itemLayout="vertical"
                dataSource={filtered}
                renderItem={(item) => (
                  <List.Item
                    key={item.baiDangPhongId}
                    style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 16, marginBottom: 12, background: '#fff' }}
                    actions={[
                      <Button
                        type="primary"
                        onClick={() => {
                          const qp = new URLSearchParams({
                            ngayNhan,
                            ngayTra,
                            soNguoiLon: String(soNguoiLon),
                            soTreEm: String(soTreEm),
                            soLuongPhong: String(soLuongPhong),
                          }).toString();
                          navigate(`/phong/${item.baiDangPhongId}?${qp}`);
                        }}
                      >
                        Xem chi tiết
                      </Button>,
                    ]}
                  >
                    <div style={{ display: "flex", gap: 16 }}>
                      {/* thumbnail */}
                      {(() => {
                        const src = item.hinhAnhBaiDang?.[0] || item.images?.[0] || item.thumbnail || null;
                        if (src) {
                          return (
                            <img
                              src={src}
                              alt={item.tieuDe || item.tenLoaiPhong || "thumbnail"}
                              style={{ width: 160, height: 100, objectFit: "cover", borderRadius: 6 }}
                            />
                          );
                        }
                        return (
                          <div style={{ width: 160, height: 100, background: "#f0f0f0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#9aa0a6" }}>
                            No image
                          </div>
                        );
                      })()}

                      <div style={{ flex: 1 }}>
                        <List.Item.Meta
                          title={item.tenKhachSan ?? item.hotelName ?? "-"}
                          description={item.tenLoaiPhong ?? item.roomName ?? "-"}
                        />

                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <div style={{ fontWeight: 600 }}>{getPrice(item)} đ/ đêm</div>
                          <div>
                            <Rate disabled value={Math.round(getRating(item) || 0)} />
                            <span style={{ marginLeft: 8 }}>
                              {Number(getRating(item) ?? 0).toFixed(1)}
                            </span>
                          </div>
                          <div style={{ marginLeft: 8 }}>
                            {item.conPhong ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f6ffed', padding: '6px 10px', borderRadius: 10, border: '1px solid #b7eb8f' }}>
                                <Tag color="green" style={{ margin: 0, padding: '4px 8px', fontWeight: 700 }}>Còn phòng</Tag>
                                <div style={{ fontWeight: 800, color: '#237804', fontSize: 14 }}>{item.soPhongCon ?? 0} phòng</div>
                              </div>
                            ) : (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff1f0', padding: '6px 10px', borderRadius: 10, border: '1px solid #ffa39e' }}>
                                <Tag color="red" style={{ margin: 0, padding: '4px 8px', fontWeight: 700 }}>Hết phòng</Tag>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
