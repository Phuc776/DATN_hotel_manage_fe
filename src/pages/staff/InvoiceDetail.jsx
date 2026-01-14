import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Tag, Button, Spin, Empty, Typography, message, Modal, InputNumber } from "antd";
import dayjs from "dayjs";
import api from "../../api/axios";
import { downloadBlob } from "../../utils/downloadFile";

const { Text } = Typography;

const InvoiceDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [invoice, setInvoice] = useState(null);
	const [loading, setLoading] = useState(false);
	const [payments, setPayments] = useState([]);
	const [paymentsLoading, setPaymentsLoading] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const [collecting, setCollecting] = useState(false);
	const [showCollectModal, setShowCollectModal] = useState(false);
	const [collectAmount, setCollectAmount] = useState(0);


	const fetchDetail = async () => {
		if (!id) return;
		setLoading(true);
		try {
			const res = await api.get(`/nhan-vien/hoa-don/${id}`);
			setInvoice(res?.data?.data || null);
		} catch (err) {
			showError(err, "Lỗi khi lấy chi tiết hóa đơn");
		} finally {
			setLoading(false);
		}
	};

	const fetchPayments = async () => {
		if (!id) return;
		setPaymentsLoading(true);
		try {
			const res = await api.get(`/nhan-vien/hoa-don/${id}/thanh-toan`);
			setPayments(res?.data?.data || []);
		} catch (err) {
			showError(err, "Lỗi khi lấy danh sách thanh toán");
		} finally {
			setPaymentsLoading(false);
		}
	};

	useEffect(() => {
		fetchDetail();
		fetchPayments();
	}, [id]);

	const handleDownload = async () => {
		if (!id) return;
		setDownloading(true);
		try {
			const res = await api.get(`/nhan-vien/hoa-don/${id}/pdf`, { responseType: "blob" });
			const blob = res.data;
			const filename = `hoa-don-${id}.pdf`;
			downloadBlob(blob, filename);
			message.success("Bắt đầu tải xuống");
		} catch (err) {
			showError(err, "Tải PDF thất bại");
		} finally {
			setDownloading(false);
		}
	};

	const currency = (value) =>
		typeof value === "number"
			? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
			: value || "-";

	const showError = (err, fallback) => {
		const text = err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback || "Đã có lỗi xảy ra";
		message.error(text);
	};

	const columns = [
		{
			title: "Loại",
			dataIndex: "loai",
			key: "loai",
			render: (val) => (
				<Tag color={val === "TIEN_PHONG" ? "blue" : val === "DICH_VU" ? "green" : "default"}>
					{val}
				</Tag>
			),
		},
		{
			title: "Mô tả",
			dataIndex: "moTa",
			key: "moTa",
		},
		{
			title: "Đơn giá",
			dataIndex: "donGia",
			key: "donGia",
			render: (v) => currency(v),
		},
		{
			title: "Số lượng",
			dataIndex: "soLuong",
			key: "soLuong",
		},
		{
			title: "Thành tiền",
			key: "thanhTien",
			render: (_, record) => currency((record.donGia || 0) * (record.soLuong || 0)),
		},
	];

	const paymentColumns = [
		{
			title: "Thời gian",
			dataIndex: "ngayThanhToan",
			key: "time",
			render: (v, r) => {
				const time = v || r.thoiGian || r.createdAt || r.created_at;
				return time ? dayjs(time).format("DD/MM/YYYY HH:mm") : "-";
			},
		},
		{
			title: "Số tiền",
			dataIndex: "soTien",
			key: "amount",
			render: (v, r) => {
				const amount = v ?? r.amount ?? r.tien ?? r.soTienThanhToan ?? 0;
				return currency(Number(amount));
			},
		},
		{
			title: "Phương thức",
			dataIndex: "phuongThuc",
			key: "method",
			render: (v, r) => v || r.method || r.paymentMethod || "-",
		},
		{
			title: "Trạng thái",
			dataIndex: "trangThai",
			key: "status",
			render: (v, r) => {
				const status = (v || r.status || r.trangthai || "").toUpperCase();
				let color = "default";
				if (status.includes("PAID") || status.includes("THANH_CONG") || status === "SUCCESS") color = "green";
				else if (status.includes("PENDING") || status.includes("CHO")) color = "orange";
				else if (status.includes("FAILED") || status.includes("THAT_BAI")) color = "red";
				return <Tag color={color}>{status || "-"}</Tag>;
			},
		},
	];

	const detail = invoice;
	const items = detail?.chiTietHoaDons || [];
	const total = detail?.tongTien ?? items.reduce((s, it) => s + (it.donGia || 0) * (it.soLuong || 0), 0);
	const totalPaid = (payments || []).reduce((s, p) => {
		const amount = p?.soTien ?? p?.amount ?? p?.tien ?? p?.soTienThanhToan ?? 0;
		return s + (Number(amount) || 0);
	}, 0);
	const remaining = (Number(total) || 0) - totalPaid;

	const openCollectModal = () => {
		const defaultAmount = Number(remaining > 0 ? remaining : 0);
		setCollectAmount(defaultAmount);
		setShowCollectModal(true);
	};

	const submitCollect = async () => {
		if (!id) return;
		const amount = Number(collectAmount) || 0;
		if (amount <= 0) {
			message.error("Số tiền phải lớn hơn 0");
			return;
		}
		if (amount > (Number(remaining) || 0)) {
			message.error("Số tiền không được vượt quá số tiền còn lại");
			return;
		}

		setCollecting(true);
		try {
			await api.post(`/nhan-vien/hoa-don/${id}/thanh-toan`, { soTien: amount });
			message.success("Thu tiền thành công");
			await fetchPayments();
			await fetchDetail();
			setShowCollectModal(false);
		} catch (err) {
			showError(err, "Thu tiền thất bại");
			// keep modal open on error per requirements
		} finally {
			setCollecting(false);
		}
	};

	const openConfirmForCollect = () => {
		Modal.confirm({
			title: "Xác nhận tạo thanh toán",
			content: `Bạn có chắc chắn muốn thu ${currency(Number(collectAmount) || 0)}?`,
			okText: "Xác nhận",
			cancelText: "Hủy",
			okButtonProps: { disabled: Number(collectAmount) <= 0 || Number(collectAmount) > (Number(remaining) || 0) },
			onOk: () => submitCollect(),
		});
	};

	return (
		<Card title="Chi tiết hóa đơn">
			<Spin spinning={loading}>
				{!detail && !loading ? (
					<Empty description={"Không tìm thấy hóa đơn"} />
				) : (
					<div>
						<div style={{ marginBottom: 16 }}>
							<div>
								<Text strong>Mã hóa đơn: </Text>
								<Text>{`HD-${detail?.id}` || "-"}</Text>
							</div>
							<div>
								<Text strong>Ngày tạo: </Text>
								<Text>{detail?.ngayTao ? dayjs(detail.ngayTao).format("DD/MM/YYYY HH:mm") : "-"}</Text>
							</div>
							<div>
								<Text strong>Nội dung: </Text>
								<Text>{detail?.noiDung || "-"}</Text>
							</div>
						</div>

						<Table
							columns={columns}
							dataSource={items}
							rowKey={(r) => r.id}
							pagination={false}
							locale={{ emptyText: <Empty description={"Không có chi tiết"} /> }}
						/>

						<div style={{ marginTop: 24 }}>
							<Text strong>Thanh toán</Text>
							<Table
								columns={paymentColumns}
								dataSource={payments}
								rowKey={(r, i) => r.id || i}
								pagination={false}
								loading={paymentsLoading}
								style={{ marginTop: 8 }}
								locale={{ emptyText: <Empty description={"Chưa có thanh toán"} /> }}
							/>
							<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, alignItems: "center" }}>
								<Text>Đã thanh toán: </Text>
								<Text strong style={{ margin: "0 12px" }}>{currency(totalPaid)}</Text>
								<Text>Còn lại: </Text>
								<Text strong style={{ margin: "0 12px", fontSize: 16 }}>{currency(remaining > 0 ? remaining : 0)}</Text>
							</div>
						</div>

						<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, alignItems: "center" }}>
							<Text strong style={{ fontSize: 16, marginRight: 24 }}>
								Tổng tiền: {currency(total)}
							</Text>
							{remaining > 0 && (
								<Button type="primary" onClick={openCollectModal} loading={collecting} style={{ marginRight: 8 }}>
									Thu tiền
								</Button>
							)}
							<Button type="primary" onClick={handleDownload} loading={downloading} style={{ marginRight: 8 }}>
								Tải PDF
							</Button>
							<Button onClick={() => navigate(-1)}>Quay lại</Button>
						</div>

							<Modal
								title="Thu tiền"
								open={showCollectModal}
								onCancel={() => setShowCollectModal(false)}
								onOk={openConfirmForCollect}
								confirmLoading={collecting}
								okButtonProps={{ disabled: Number(collectAmount) <= 0 || Number(collectAmount) > (Number(remaining) || 0) }}
							>
								<div>
									<Text>Nhập số tiền (VND)</Text>
									<InputNumber
										style={{ width: "100%", marginTop: 8 }}
										min={0}
										max={Number(remaining) || 0}
										formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
										parser={(value) => value.replace(/\D/g, "")}
										value={collectAmount}
										onChange={(v) => setCollectAmount(v)}
									/>
								</div>
							</Modal>
					</div>
				)}
			</Spin>
		</Card>
	);
};

export default InvoiceDetail;

