import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Row, Col, Card, Descriptions, Rate, Button, Spin, message, Carousel, Image, Empty } from "antd";
import dayjs from "dayjs";
import api from "../../api/axios";
import { getHotelReviews } from "../../api/reviews";

export default function RoomDetail() {
  const { baiDangPhongId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ngayNhan = searchParams.get("ngayNhan") || "";
  const ngayTra = searchParams.get("ngayTra") || "";
  const soNguoiLon = searchParams.get("soNguoiLon") || "";
  const soTreEm = searchParams.get("soTreEm") || "";
  const soLuongPhong = searchParams.get("soLuongPhong") || "";

  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [hotelReviews, setHotelReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!baiDangPhongId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const body = {
          ngayNhan: ngayNhan || "",
          ngayTra: ngayTra || "",
          soNguoiLon: Number(soNguoiLon) || 1,
          soTreEm: Number(soTreEm) || 0,
          soLuongPhong: Number(soLuongPhong) || 1,
        };

        const res = await api.post(`/bai-dang-phong/public/${baiDangPhongId}/availability`, body);
        setItem(res?.data?.data ?? res?.data ?? null);
      } catch (err) {
        message.error("Không thể tải thông tin phòng");
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [baiDangPhongId]);

  useEffect(() => {
    const fetchHotelReviewData = async (hotelId) => {
      setReviewsLoading(true);
      try {
        const res = await getHotelReviews(hotelId);
        const data = res?.data?.data || {};
        setAvgRating(data.diemTrungBinh ?? 0);
        setReviewCount(data.soLuong ?? 0);
        setHotelReviews(Array.isArray(data.danhGias) ? data.danhGias.slice(0, 5) : []);
      } catch (err) {
        // show friendly error
        message.error(err?.response?.data?.message || err?.message || "Không thể tải đánh giá khách sạn");
        setAvgRating(0);
        setReviewCount(0);
        setHotelReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (!item) return;
    console.log("Item changed:", item);
    const hotelId = item?.khachSanId ?? item?.khachSan?.id ?? item?.hotelId ?? item?.khachSanId ?? null;
    if (hotelId) fetchHotelReviewData(hotelId);
  }, [item]);

  const toBooking = () => {
    const qp = new URLSearchParams({
      ngayNhan: ngayNhan || "",
      ngayTra: ngayTra || "",
      soNguoiLon: soNguoiLon || "",
      soTreEm: soTreEm || "",
      soLuongPhong: soLuongPhong || "",
    }).toString();
    navigate(`/booking/${baiDangPhongId}?${qp}`);
  };

  const formatDate = (v) => {
    if (!v) return "-";
    const d = dayjs(v, "YYYY-MM-DDTHH:mm");
    return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : v;
  };

  return (
    <div style={{ padding: 16 }}>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : (
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Card>
              {/* Gallery from hinhAnhBaiDang */}
              {item?.hinhAnhBaiDang && item.hinhAnhBaiDang.length > 0 ? (
                <div style={{ marginBottom: 12 }}>
                  <Carousel autoplay dots>
                    {item.hinhAnhBaiDang.map((src, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image src={src} alt={`${item.tieuDe || 'image'}-${i}`} preview={{ src }} style={{ maxHeight: 360, width: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </Carousel>
                </div>
              ) : null}
              <h2 style={{ marginBottom: 8 }}>{item?.tieuDe ?? item?.title ?? "-"}</h2>
              <div style={{ marginBottom: 12 }}>
                Khách sạn:
                <strong>{item?.tenKhachSan ?? item?.hotelName ?? "-"}</strong>
                {item?.diaChiKhachSan ? <span> — {item.diaChiKhachSan}</span> : null}
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  {item?.giaLoaiPhong ?? item?.gia ?? item?.price ?? "-"} đ
                </div>
                <div>
                  <Rate disabled value={Math.round(item?.diemDanhGiaTrungBinh ?? item?.diemDanhGia ?? item?.avgRating ?? 0)} />
                  <span style={{ marginLeft: 8 }}>{(item?.diemDanhGiaTrungBinh ?? item?.diemDanhGia ?? item?.avgRating ?? 0).toFixed?.(1) ?? "-"}</span>
                </div>
              </div>

              <Descriptions column={1} bordered>
                <Descriptions.Item label="Mô tả">{item?.moTa ?? item?.description ?? "-"}</Descriptions.Item>
                <Descriptions.Item label="Loại phòng">{item?.tenLoaiPhong ?? item?.roomType ?? "-"}</Descriptions.Item>
                <Descriptions.Item label="Sức chứa">{item?.soNguoiLon ?? item?.sucChua ?? item?.capacity ?? "-"}</Descriptions.Item>
                <Descriptions.Item label="Tổng số phòng">{item?.tongSoPhong ?? item?.soPhongTong ?? item?.totalRooms ?? "-"}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Đánh giá khách" style={{ marginTop: 16 }}>
              {reviewsLoading ? (
                <div style={{ textAlign: "center", padding: 12 }}><Spin /></div>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <Rate disabled value={Math.round(avgRating || 0)} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{(avgRating || 0).toFixed?.(1) ?? 0} / 5</div>
                      <div style={{ color: "rgba(0,0,0,0.45)" }}>{reviewCount ?? 0} đánh giá</div>
                    </div>
                  </div>

                  {(!hotelReviews || hotelReviews.length === 0) ? (
                    <Empty description={"Chưa có đánh giá"} />
                  ) : (
                    hotelReviews.map((rv) => (
                      <div key={rv.id} style={{ marginBottom: 12, borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontWeight: 600 }}>{rv.tenKhachHang || "Khách"}</div>
                          <Rate disabled value={Number(rv.diemDanhGia) || 0} />
                        </div>
                        <div style={{ marginTop: 8 }}>{rv.noiDung}</div>
                        <div style={{ marginTop: 6, color: "rgba(0,0,0,0.45)" }}>{rv.thoiGianDanhGia ? dayjs(rv.thoiGianDanhGia).format("DD/MM/YYYY HH:mm") : "-"}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="Tóm tắt tìm kiếm" size="small">
              <div style={{ marginBottom: 8 }}>
                <strong>Ngày nhận:</strong> {formatDate(ngayNhan)}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Ngày trả:</strong> {formatDate(ngayTra)}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Người lớn:</strong> {soNguoiLon || "-"}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Trẻ em:</strong> {soTreEm || 0}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Số phòng:</strong> {soLuongPhong || "-"}
              </div>

              <Button type="primary" block onClick={toBooking}>
                Đặt phòng
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
