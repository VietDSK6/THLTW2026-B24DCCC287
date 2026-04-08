import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import { HANG_MUC_NGAN_SACH, LOAI_HINH_COLOR, LOAI_HINH_MAP } from '@/services/DuLich/constant';
import { tienVietNam } from '@/utils/utils';
import { Card, Col, Row, Statistic, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKe = () => {
	const { getAllModel: getAllLichTrinh } = useModel('dulich.lichtrinh' as any);
	const { getAllModel: getAllDiemDen } = useModel('dulich.diemden' as any);
	const [lichTrinhs, setLichTrinhs] = useState<LichTrinh.IRecord[]>([]);
	const [diemDens, setDiemDens] = useState<DiemDen.IRecord[]>([]);

	useEffect(() => {
		getAllLichTrinh().then(setLichTrinhs);
		getAllDiemDen().then(setDiemDens);
	}, []);

	const tongDoanhThu = lichTrinhs.reduce((sum, lt) => sum + lt.tongNganSach, 0);
	const tongLichTrinh = lichTrinhs.length;

	const doanhThuTheoHangMuc = HANG_MUC_NGAN_SACH.map((hm) => ({
		...hm,
		value: lichTrinhs.reduce(
			(sum, lt) => sum + (lt.nganSachTheoHangMuc[hm.key as keyof LichTrinh.NganSachHangMuc] || 0),
			0,
		),
	}));

	const diemDenCount: Record<string, number> = {};
	lichTrinhs.forEach((lt) => {
		lt.chiTiet.forEach((ngay) => {
			ngay.diemDens.forEach((dd) => {
				diemDenCount[dd.diemDenId] = (diemDenCount[dd.diemDenId] || 0) + 1;
			});
		});
	});

	const diemDenPhoBien = Object.entries(diemDenCount)
		.map(([id, count]) => {
			const dd = diemDens.find((d) => d._id === id);
			return { id, ten: dd?.ten || 'Không xác định', loaiHinh: dd?.loaiHinh, count };
		})
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	const lichTrinhTheoThang: Record<string, number> = {};
	lichTrinhs.forEach((lt) => {
		const month = lt.createdAt?.slice(0, 7) || 'N/A';
		lichTrinhTheoThang[month] = (lichTrinhTheoThang[month] || 0) + 1;
	});

	const months = Object.keys(lichTrinhTheoThang).sort();
	const monthCounts = months.map((m) => lichTrinhTheoThang[m]);

	const columns: ColumnsType<any> = [
		{ title: 'Hạng mục', dataIndex: 'label', key: 'label' },
		{
			title: 'Doanh thu',
			dataIndex: 'value',
			key: 'value',
			align: 'right',
			render: (val) => tienVietNam(val),
		},
		{
			title: 'Tỷ lệ',
			dataIndex: 'value',
			key: 'percent',
			align: 'center',
			render: (val) => `${((val / tongDoanhThu) * 100).toFixed(1)}%`,
		},
	];

	const diemDenColumns: ColumnsType<any> = [
		{ title: 'TT', dataIndex: 'index', key: 'index', width: 50, align: 'center' },
		{ title: 'Điểm đến', dataIndex: 'ten', key: 'ten' },
		{
			title: 'Loại hình',
			dataIndex: 'loaiHinh',
			key: 'loaiHinh',
			render: (val: DiemDen.LoaiHinh) =>
				val ? <span style={{ color: LOAI_HINH_COLOR[val] }}>{LOAI_HINH_MAP[val]}</span> : '-',
		},
		{ title: 'Số lượt chọn', dataIndex: 'count', key: 'count', align: 'center' },
	];

	return (
		<div>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic title='Tổng lịch trình' value={tongLichTrinh} suffix='lịch trình' />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic title='Tổng điểm đến' value={diemDens.length} suffix='điểm' />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic title='Tổng doanh thu' value={tongDoanhThu} formatter={(val) => tienVietNam(val as number)} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title='Trung bình/lịch trình'
							value={tongLichTrinh > 0 ? tongDoanhThu / tongLichTrinh : 0}
							formatter={(val) => tienVietNam(val as number)}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} lg={12}>
					<Card title='Lịch trình theo tháng'>
						<ColumnChart
							xAxis={months}
							yAxis={[monthCounts]}
							yLabel={['Số lịch trình']}
							height={300}
							formatY={(val) => val.toString()}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Doanh thu theo hạng mục'>
						<DonutChart
							xAxis={doanhThuTheoHangMuc.map((h) => h.label)}
							yAxis={[doanhThuTheoHangMuc.map((h) => h.value)]}
							yLabel={['Doanh thu']}
							colors={doanhThuTheoHangMuc.map((h) => h.color)}
							height={300}
							showTotal
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} lg={12}>
					<Card title='Chi tiết doanh thu theo hạng mục'>
						<Table columns={columns} dataSource={doanhThuTheoHangMuc} rowKey='key' pagination={false} size='small' />
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Top 5 điểm đến phổ biến'>
						<Table
							columns={diemDenColumns}
							dataSource={diemDenPhoBien.map((d, i) => ({ ...d, index: i + 1 }))}
							rowKey='id'
							pagination={false}
							size='small'
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default ThongKe;
