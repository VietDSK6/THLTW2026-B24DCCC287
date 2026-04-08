import ColumnChart from '@/components/Chart/ColumnChart';
import { ETrangThai, TrangThaiColor, TrangThaiLabel } from '@/services/CauLacBo/constant';
import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKe = () => {
	const { danhSach: danhSachCLB, getAllModel: getAllCLB } = useModel('caulacbo.caulacbo');
	const { danhSach: danhSachDon, getAllModel: getAllDon } = useModel('caulacbo.dondangky');
	const [stats, setStats] = useState({
		totalCLB: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
	});
	const [chartData, setChartData] = useState<{
		xAxis: string[];
		pending: number[];
		approved: number[];
		rejected: number[];
	}>({
		xAxis: [],
		pending: [],
		approved: [],
		rejected: [],
	});

	useEffect(() => {
		getAllCLB();
		getAllDon();
	}, []);

	useEffect(() => {
		const pending = danhSachDon.filter((don) => don.trangThai === ETrangThai.PENDING).length;
		const approved = danhSachDon.filter((don) => don.trangThai === ETrangThai.APPROVED).length;
		const rejected = danhSachDon.filter((don) => don.trangThai === ETrangThai.REJECTED).length;

		setStats({
			totalCLB: danhSachCLB.length,
			pending,
			approved,
			rejected,
		});

		const xAxis: string[] = [];
		const pendingData: number[] = [];
		const approvedData: number[] = [];
		const rejectedData: number[] = [];

		danhSachCLB.forEach((clb) => {
			xAxis.push(clb.tenCLB);
			const clbDons = danhSachDon.filter((don) => don.cauLacBoId === clb._id);
			pendingData.push(clbDons.filter((don) => don.trangThai === ETrangThai.PENDING).length);
			approvedData.push(clbDons.filter((don) => don.trangThai === ETrangThai.APPROVED).length);
			rejectedData.push(clbDons.filter((don) => don.trangThai === ETrangThai.REJECTED).length);
		});

		setChartData({
			xAxis,
			pending: pendingData,
			approved: approvedData,
			rejected: rejectedData,
		});
	}, [danhSachCLB, danhSachDon]);

	return (
		<>
			<Row gutter={[16, 16]}>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic title='Tổng số CLB' value={stats.totalCLB} valueStyle={{ color: '#1890ff' }} />
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title={TrangThaiLabel.PENDING}
							value={stats.pending}
							valueStyle={{ color: TrangThaiColor.PENDING }}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title={TrangThaiLabel.APPROVED}
							value={stats.approved}
							valueStyle={{ color: TrangThaiColor.APPROVED }}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title={TrangThaiLabel.REJECTED}
							value={stats.rejected}
							valueStyle={{ color: TrangThaiColor.REJECTED }}
						/>
					</Card>
				</Col>
			</Row>

			<Card style={{ marginTop: 16 }} title='Thống kê đơn đăng ký theo câu lạc bộ'>
				{chartData.xAxis.length > 0 ? (
					<ColumnChart
						xAxis={chartData.xAxis}
						yAxis={[chartData.pending, chartData.approved, chartData.rejected]}
						yLabel={[TrangThaiLabel.PENDING, TrangThaiLabel.APPROVED, TrangThaiLabel.REJECTED]}
						colors={[TrangThaiColor.PENDING, TrangThaiColor.APPROVED, TrangThaiColor.REJECTED]}
						height={400}
						formatY={(val) => val.toString()}
					/>
				) : (
					<div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Chưa có dữ liệu thống kê</div>
				)}
			</Card>
		</>
	);
};

export default ThongKe;
