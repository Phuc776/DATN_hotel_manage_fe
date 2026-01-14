import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Tag, Button, Spin, Empty, Typography, message } from "antd";
import dayjs from "dayjs";
import api from "../../api/axios";
import { downloadBlob } from "../../utils/downloadFile";

const { Text } = Typography;

const OwnerInvoiceDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [invoice, setInvoice] = useState(null);
	const [loading, setLoading] = useState(false);
	const [downloading, setDownloading] = useState(false);

	useEffect(() => {
		const fetchDetail = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const res = await api.get(`/chu-khach-san/hoa-don/${id}`);
				setInvoice(res?.data?.data || null);
			} catch (err) {
				console.error("Lỗi khi lấy chi tiết hóa đơn (owner):", err);
			} finally {
				setLoading(false);
			}
		};

		fetchDetail();
	}, [id]);

	const currency = (value) =>
		typeof value === "number"
			? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
			: value || "-";

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

	const detail = invoice;
	const items = detail?.chiTietHoaDons || [];
	const total = detail?.tongTien ?? items.reduce((s, it) => s + (it.donGia || 0) * (it.soLuong || 0), 0);

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
								<Text>{detail?.id || "-"}</Text>
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

						<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, alignItems: "center" }}>
							<Text strong style={{ fontSize: 16, marginRight: 24 }}>
								Tổng tiền: {currency(total)}
							</Text>
							<Button
								type="primary"
								style={{ marginRight: 8 }}
								loading={downloading}
								onClick={async () => {
									if (!id) return;
									setDownloading(true);
									try {
										const res = await api.get(`/chu-khach-san/hoa-don/${id}/pdf`, { responseType: "blob" });
										downloadBlob(res.data, `hoa-don-${id}.pdf`);
										message.success("Bắt đầu tải xuống");
									} catch (err) {
										console.error("Lỗi khi tải PDF (owner):", err);
										message.error("Tải PDF thất bại");
									} finally {
										setDownloading(false);
									}
								}}
							>
								Tải PDF
							</Button>
							<Button onClick={() => navigate(-1)}>Quay lại</Button>
						</div>
					</div>
				)}
			</Spin>
		</Card>
	);
};

export default OwnerInvoiceDetail;

