import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';
import { ETrangThaiBuoiTap, ETrangThaiMucTieu } from '@/services/TheDuc/constant';
import { CalendarOutlined, FireOutlined, StarOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Timeline, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

const DashboardPage = () => {
	const { danhSach: danhSachBuoiTap, getModel: getBuoiTap } = useModel('theduc.buoitap');
	const { danhSach: danhSachChiSo, getModel: getChiSo } = useModel('theduc.chisosuckhoe');
	const { danhSach: danhSachMucTieu, getModel: getMucTieu } = useModel('theduc.muctieu');

	useEffect(() => {
		getBuoiTap();
		getChiSo();
		getMucTieu();
	}, []);

	// Calculate stats
	const buoiTapThangNay = useMemo(() => {
		const startOfMonth = moment().startOf('month');
		const endOfMonth = moment().endOf('month');
		return danhSachBuoiTap.filter((bt) => {
			const ngay = moment(bt.ngay);
			return ngay.isBetween(startOfMonth, endOfMonth, 'day', '[]');
		});
	}, [danhSachBuoiTap]);

	const tongBuoiTap = buoiTapThangNay.length;
	const tongCalo = buoiTapThangNay.reduce((sum, bt) => sum + (bt.calo || 0), 0);

	const streak = useMemo(() => {
		if (danhSachBuoiTap.length === 0) return 0;
		let currentStreak = 0;
		let checkDate = moment().startOf('day');
		
		const sortedDates = [...new Set(danhSachBuoiTap.map(bt => moment(bt.ngay).format('YYYY-MM-DD')))].sort().reverse();
		
		if (sortedDates[0] === checkDate.format('YYYY-MM-DD') || sortedDates[0] === checkDate.subtract(1, 'day').format('YYYY-MM-DD')) {
			let expectedDate = moment(sortedDates[0]);
			for (const dateStr of sortedDates) {
				if (dateStr === expectedDate.format('YYYY-MM-DD')) {
					currentStreak++;
					expectedDate.subtract(1, 'day');
				} else {
					break;
				}
			}
		}
		return currentStreak;
	}, [danhSachBuoiTap]);

	const mucTieuHoanThanh = useMemo(() => {
		if (danhSachMucTieu.length === 0) return 0;
		const completed = danhSachMucTieu.filter(mt => mt.trangThai === ETrangThaiMucTieu.DA_DAT).length;
		return Math.round((completed / danhSachMucTieu.length) * 100);
	}, [danhSachMucTieu]);

	// Chart Data
	const chartBuoiTapData = useMemo(() => {
		const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
		const data = [0, 0, 0, 0];
		
		buoiTapThangNay.forEach(bt => {
			const ngay = moment(bt.ngay);
			const weekOfMonth = Math.ceil(ngay.date() / 7) - 1;
			if (weekOfMonth >= 0 && weekOfMonth < 4) {
				data[weekOfMonth]++;
			} else if (weekOfMonth >= 4) {
				data[3]++; // Gộp những ngày cuối tháng vào tuần 4
			}
		});

		return {
			xAxis: weeks,
			yAxis: [data],
			yLabel: ['Số buổi tập'],
		};
	}, [buoiTapThangNay]);

	const chartCanNangData = useMemo(() => {
		const sortedData = [...danhSachChiSo].sort((a, b) => moment(a.ngay).valueOf() - moment(b.ngay).valueOf()).slice(-10); // Lấy 10 lần đo gần nhất
		
		return {
			xAxis: sortedData.map(cs => moment(cs.ngay).format('DD/MM')),
			yAxis: [sortedData.map(cs => cs.canNang)],
			yLabel: ['Cân nặng (kg)'],
		};
	}, [danhSachChiSo]);

	return (
		<div>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Buổi tập tháng này'
							value={tongBuoiTap}
							prefix={<CalendarOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Tổng calo đã đốt'
							value={tongCalo}
							prefix={<FireOutlined />}
							valueStyle={{ color: '#fa8c16' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Chuỗi ngày tập (Streak)'
							value={streak}
							prefix={<TrophyOutlined />}
							valueStyle={{ color: '#52c41a' }}
							suffix='ngày'
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Mục tiêu hoàn thành'
							value={mucTieuHoanThanh}
							prefix={<StarOutlined />}
							valueStyle={{ color: '#eb2f96' }}
							suffix='%'
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={16}>
					<Card title='Số buổi tập theo tuần' style={{ marginBottom: 16 }}>
						<ColumnChart
							xAxis={chartBuoiTapData.xAxis}
							yAxis={chartBuoiTapData.yAxis}
							yLabel={chartBuoiTapData.yLabel}
							height={300}
						/>
					</Card>
					<Card title='Biến động cân nặng'>
						{chartCanNangData.xAxis.length > 0 ? (
							<LineChart
								xAxis={chartCanNangData.xAxis}
								yAxis={chartCanNangData.yAxis}
								yLabel={chartCanNangData.yLabel}
								height={300}
								colors={['#eb2f96']}
							/>
						) : (
							<div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Chưa có dữ liệu đo cân nặng</div>
						)}
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card title='Buổi tập gần đây' style={{ height: '100%' }}>
						<Timeline>
							{[...danhSachBuoiTap]
								.sort((a, b) => moment(b.ngay).valueOf() - moment(a.ngay).valueOf())
								.slice(0, 5)
								.map(bt => (
									<Timeline.Item 
										key={bt._id} 
										color={bt.trangThai === ETrangThaiBuoiTap.HOAN_THANH ? 'green' : 'red'}
									>
										<Typography.Text strong>{moment(bt.ngay).format('DD/MM/YYYY')}</Typography.Text>
										<br />
										<Typography.Text>{bt.loaiBaiTap} - {bt.thoiLuong} phút</Typography.Text>
										<br />
										<Typography.Text type='secondary' style={{ fontSize: 12 }}>Đốt cháy {bt.calo} calo</Typography.Text>
									</Timeline.Item>
								))}
							{danhSachBuoiTap.length === 0 && (
								<div style={{ textAlign: 'center', padding: 20, color: '#999' }}>Chưa có buổi tập nào</div>
							)}
						</Timeline>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default DashboardPage;
