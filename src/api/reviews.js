import api from "./axios";

export const getMyReviews = () => api.get("/khach-hang/danh-gia");

export const getAllApprovedHotels = () => api.get("/khach-san/public");

export const getHotelReviews = (khachSanId) =>
  api.get(`/khach-san/public/${khachSanId}/danh-gia`);

export const hasReviewed = (khachSanId) =>
  api.get(`/khach-hang/khach-san/${khachSanId}/da-danh-gia`);

export const createReview = (khachSanId, body) =>
  api.post(`/khach-hang/khach-san/${khachSanId}/danh-gia`, body);

export default {
  getMyReviews,
  hasReviewed,
  createReview,
};
