import React, { useEffect, useState } from "react";
import { Card, Rate, Spin, Empty, Typography, message, Button, Modal, Input, Select } from "antd";
import dayjs from "dayjs";
import { getMyReviews, createReview, getAllApprovedHotels } from "../../api/reviews";

const { Text, Paragraph } = Typography;

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getMyReviews();
      setReviews(res?.data?.data || []);
    } catch (err) {
      const text = err?.response?.data?.message || err?.message || "Lỗi khi tải đánh giá";
      message.error(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoadingHotels(true);
    try {
      const res = await getAllApprovedHotels();
      setHotels(res?.data?.data || []);
    } catch (err) {
      const text = err?.response?.data?.message || err?.message || "Lỗi khi tải danh sách khách sạn";
      message.error(text);
    } finally {
      setLoadingHotels(false);
    }
  };

  const hotelOptions =
    hotels && hotels.length > 0
      ? hotels.map((h) => ({ value: h.id, label: `${h.tenKhachSan} - ${h.diaChi || ""}` }))
      : Array.from(
          reviews
            .filter((r) => r.khachSanId)
            .reduce((m, r) => m.set(r.khachSanId, r.tenKhachSan), new Map())
            .entries()
        ).map(([khachSanId, tenKhachSan]) => ({ value: khachSanId, label: tenKhachSan }));


  const resetForm = () => {
    setSelectedHotelId(null);
    setRating(5);
    setContent("");
  };

  const openAddModal = (khachSanId) => {
    resetForm();
    setSelectedHotelId(khachSanId);
    setOpenModal(true);
  };

  const submitReview = async () => {
    if (!selectedHotelId) return;
    if (!rating || rating < 1) {
      message.error("Vui lòng chọn số sao");
      return;
    }
    if (!content || !content.trim()) {
      message.error("Nội dung đánh giá không được để trống");
      return;
    }
    setSubmitting(true);
    try {
      await createReview(selectedHotelId, { diemDanhGia: rating, noiDung: content });
      message.success("Đánh giá thành công");
      setOpenModal(false);
      resetForm();
      await fetchReviews();
    } catch (err) {
      const text = err?.response?.data?.message || err?.message || "Không thể gửi đánh giá";
      message.error(text);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Đánh giá của tôi" extra={<Button type="primary" onClick={() => openAddModal(null)}>Viết đánh giá mới</Button>}>
      <Spin spinning={loading || loadingHotels}>
        {!loading && (!reviews || reviews.length === 0) ? (
          <Empty description={"Bạn chưa có đánh giá nào"} />
        ) : (
          <Card type="inner" title="Đánh giá đã gửi" style={{ marginBottom: 16 }}>
            {(!reviews || reviews.length === 0) ? (
              <Empty description={"Bạn chưa có đánh giá nào"} />
            ) : (
              reviews.map((r) => (
                <Card key={r.id} type="inner" style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Rate disabled value={Number(r.diemDanhGia) || 0} />
                    <Text strong style={{ marginLeft: 12 }}>{r.tenKhachSan}</Text>
                  </div>
                  <Paragraph style={{ marginTop: 8 }}>{r.noiDung}</Paragraph>
                  <Text type="secondary">
                    {r.thoiGianDanhGia ? dayjs(r.thoiGianDanhGia).format("DD/MM/YYYY HH:mm") : "-"}
                  </Text>
                </Card>
              ))
            )}
          </Card>
        )}
      </Spin>
      <Modal
        title="Đánh giá khách sạn"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          resetForm();
        }}
        onOk={submitReview}
        confirmLoading={submitting}
        okButtonProps={{ disabled: !selectedHotelId || !rating || !content || !content.trim() }}
      >
        <div>
          <Select
            style={{ width: "100%", marginBottom: 12 }}
            placeholder="Chọn khách sạn"
            options={hotelOptions}
            value={selectedHotelId}
            onChange={(v) => setSelectedHotelId(v)}
            showSearch
            loading={loadingHotels}
            optionFilterProp="label"
            allowClear
          />
          <Rate value={rating} onChange={(v) => setRating(v)} />
          <Input.TextArea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ marginTop: 12 }}
            placeholder="Viết nhận xét của bạn ở đây..."
          />
        </div>
      </Modal>
    </Card>
  );
};

export default CustomerReviews;
