import React, { useEffect, useState } from "react";
import { Card, Table, Button, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api/axios";

const OwnerInvoiceList = () => {
	const [invoices, setInvoices] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchInvoices = async () => {
			setLoading(true);
			try {
				const res = await api.get("/chu-khach-san/hoa-don");
				const data = res?.data?.data || [];
				setInvoices(data);
			} catch (err) {
				console.error("Lỗi khi lấy danh sách hóa đơn (owner):", err);
			} finally {
				setLoading(false);
			}
		};

		fetchInvoices();
	}, []);

	const columns = [
		{
			title: "Mã hóa đơn",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Ngày tạo",
			dataIndex: "ngayTao",
			key: "ngayTao",
			render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
		},
		{
			title: "Tổng tiền",
			dataIndex: "tongTien",
			key: "tongTien",
			render: (v) =>
				typeof v === "number"
					? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v)
					: v || "-",
		},
		{
			title: "Nội dung",
			dataIndex: "noiDung",
			key: "noiDung",
			ellipsis: true,
		},
		{
			title: "Hành động",
			key: "action",
			render: (_, record) => (
				<Button type="primary" onClick={() => navigate(`/owner/invoices/${record.id}`)}>
					Xem chi tiết
				</Button>
			),
		},
	];

	return (
		<Card title="Danh sách hóa đơn các khách sạn">
			<Spin spinning={loading}>
				<Table
					columns={columns}
					dataSource={invoices}
					rowKey={(r) => r.id}
					locale={{ emptyText: <Empty description={"Chưa có hóa đơn"} /> }}
					pagination={{ pageSize: 10 }}
				/>
			</Spin>
		</Card>
	);
};

export default OwnerInvoiceList;

