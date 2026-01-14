import React, { useEffect, useState } from "react";
import { Card, Table, Button, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api/axios";

const StaffInvoiceList = () => {
	const [invoices, setInvoices] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchInvoices = async () => {
			setLoading(true);
			try {
				const res = await api.get("/nhan-vien/hoa-don");
				const data = res?.data?.data || [];
				setInvoices(data);
			} catch (error) {
				console.error("Lỗi khi lấy danh sách hóa đơn:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchInvoices();
	}, []);

	const columns = [
		{
			title: "Mã hóa đơn",
			render: (_, __, idx) => idx + 1,
		},
		{
			title: "Ngày tạo",
			dataIndex: "ngayTao",
			key: "ngayTao",
			render: (value) => (value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-"),
		},
		{
			title: "Tổng tiền",
			dataIndex: "tongTien",
			key: "tongTien",
			render: (value) =>
				typeof value === "number"
					? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
					: value || "-",
		},
		// {
		// 	title: "Nội dung",
		// 	dataIndex: "noiDung",
		// 	key: "noiDung",
		// 	ellipsis: true,
		// },
		{
			title: "Hành động",
			key: "action",
			render: (_, record) => (
				<Button type="primary" onClick={() => navigate(`/staff/invoices/${record.id}`)}>
					Xem chi tiết
				</Button>
			),
		},
	];

	return (
		<Card title="Danh sách hóa đơn khách sạn">
			<Spin spinning={loading}>
				<Table
					columns={columns}
					dataSource={invoices}
					rowKey={(record) => record.id}
					locale={{ emptyText: <Empty description={"Chưa có hóa đơn"} /> }}
					pagination={{ pageSize: 10 }}
				/>
			</Spin>
		</Card>
	);
};

export default StaffInvoiceList;

