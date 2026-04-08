import { ETrangThaiLichHen, TrangThaiLichHenColor, TrangThaiLichHenText } from '@/services/DatLich/constant';
import { CalendarOutlined, CheckCircleOutlined, DollarOutlined, StarOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, Row, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';

const { RangePicker } = DatePicker;

const ThongKePage = () => {
	const { danhSach: danhSachLichHen, getModel: getLichHen } = useModel('datlich.lichhen');
	const { danhSach: danhSachNhanVien, getModel: getNhanVien } = useModel('datlich.nhanvien');
	const { danhSach: danhSachDichVu, getModel: getDichVu } = useModel('datlich.dichvu');
	const { danhSach: danhSachDanhGia, getModel: getDanhGia, getDiemTrungBinhNhanVien } = useModel('datlich.danhgia');

	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
		moment().startOf('month'),
		moment().endOf('month'),
	]);

	useEffect(() => {
		getLichHen();
		getNhanVien();
		getDichVu();
		getDanhGia();
	}, []);

	const lichHenTrongKhoang = useMemo(() => {
		return danhSachLichHen.filter((lh: LichHen.IRecord) => {
			const ngay = moment(lh.ngayHen);
			return ngay.isSameOrAfter(dateRange[0], 'day') && ngay.isSameOrBefore(dateRange[1], 'day');
		});
	}, [danhSachLichHen, dateRange]);

	const tongLichHen = lichHenTrongKhoang.length;
	const lichHoanThanh = lichHenTrongKhoang.filter(
		(lh: LichHen.IRecord) => lh.trangThai === ETrangThaiLichHen.HOAN_THANH,
	).length;
	const tongDoanhThu = lichHenTrongKhoang
		.filter((lh: LichHen.IRecord) => lh.trangThai === ETrangThaiLichHen.HOAN_THANH)
		.reduce((sum: number, lh: LichHen.IRecord) => sum + lh.tongTien, 0);
	const diemDanhGiaTB = useMemo(() => {
		if (danhSachDanhGia.length === 0) return 0;
		const tongDiem = danhSachDanhGia.reduce((sum: number, dg: DanhGia.IRecord) => sum + dg.diem, 0);
		return (tongDiem / danhSachDanhGia.length).toFixed(1);
	}, [danhSachDanhGia]);

	const thongKeTheoDichVu = useMemo(() => {
		const stats: Record<string, { dichVu: string; soLuong: number; doanhThu: number }> = {};

		lichHenTrongKhoang
			.filter((lh: LichHen.IRecord) => lh.trangThai === ETrangThaiLichHen.HOAN_THANH)
			.forEach((lh: LichHen.IRecord) => {
				lh.dichVuIds?.forEach((dvId: string) => {
					const dv = danhSachDichVu.find((d: DichVu.IRecord) => d._id === dvId);
					if (dv) {
						if (!stats[dvId]) {
							stats[dvId] = { dichVu: dv.ten, soLuong: 0, doanhThu: 0 };
						}
						stats[dvId].soLuong += 1;
						stats[dvId].doanhThu += dv.gia;
					}
				});
			});

		return Object.values(stats).sort((a, b) => b.doanhThu - a.doanhThu);
	}, [lichHenTrongKhoang, danhSachDichVu]);

	const thongKeTheoNhanVien = useMemo(() => {
		const stats: Record<string, { nhanVien: string; soLuong: number; doanhThu: number; diemTB: number }> = {};

		lichHenTrongKhoang
			.filter((lh: LichHen.IRecord) => lh.trangThai === ETrangThaiLichHen.HOAN_THANH)
			.forEach((lh: LichHen.IRecord) => {
				const nv = danhSachNhanVien.find((n: NhanVien.IRecord) => n._id === lh.nhanVienId);
				if (nv) {
					if (!stats[lh.nhanVienId]) {
						stats[lh.nhanVienId] = {
							nhanVien: nv.hoTen,
							soLuong: 0,
							doanhThu: 0,
							diemTB: getDiemTrungBinhNhanVien(nv._id),
						};
					}
					stats[lh.nhanVienId].soLuong += 1;
					stats[lh.nhanVienId].doanhThu += lh.tongTien;
				}
			});

		return Object.values(stats).sort((a, b) => b.doanhThu - a.doanhThu);
	}, [lichHenTrongKhoang, danhSachNhanVien]);

	const lichHenColumns: ColumnsType<LichHen.IRecord> = [
		{ title: 'Mã', dataIndex: 'ma', width: 140 },
		{ title: 'Khách hàng', dataIndex: ['khachHang', 'hoTen'], width: 150 },
		{
			title: 'Ngày hẹn',
			dataIndex: 'ngayHen',
			width: 100,
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
		},
		{ title: 'Giờ', dataIndex: 'gioHen', width: 70 },
		{
			title: 'Tổng tiền',
			dataIndex: 'tongTien',
			width: 110,
			align: 'right',
			render: (val: number) => val?.toLocaleString('vi-VN') + ' đ',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 110,
			render: (val: ETrangThaiLichHen) => <Tag color={TrangThaiLichHenColor[val]}>{TrangThaiLichHenText[val]}</Tag>,
		},
	];

	const dichVuColumns: ColumnsType<{ dichVu: string; soLuong: number; doanhThu: number }> = [
		{ title: 'Dịch vụ', dataIndex: 'dichVu', width: 200 },
		{ title: 'Số lượng', dataIndex: 'soLuong', width: 100, align: 'center' },
		{
			title: 'Doanh thu',
			dataIndex: 'doanhThu',
			width: 150,
			align: 'right',
			render: (val: number) => val?.toLocaleString('vi-VN') + ' đ',
		},
	];

	const nhanVienColumns: ColumnsType<{ nhanVien: string; soLuong: number; doanhThu: number; diemTB: number }> = [
		{ title: 'Nhân viên', dataIndex: 'nhanVien', width: 150 },
		{ title: 'Số khách', dataIndex: 'soLuong', width: 90, align: 'center' },
		{
			title: 'Doanh thu',
			dataIndex: 'doanhThu',
			width: 130,
			align: 'right',
			render: (val: number) => val?.toLocaleString('vi-VN') + ' đ',
		},
		{
			title: 'Điểm TB',
			dataIndex: 'diemTB',
			width: 80,
			align: 'center',
			render: (val: number) => (val ? val.toFixed(1) : '-'),
		},
	];

	return (
		<div>
			<Card style={{ marginBottom: 16 }}>
				<div style={{ marginBottom: 16 }}>
					<span style={{ marginRight: 8 }}>Khoảng thời gian:</span>
					<RangePicker
						value={dateRange}
						onChange={(dates) => {
							if (dates && dates[0] && dates[1]) {
								setDateRange([dates[0], dates[1]]);
							}
						}}
						format='DD/MM/YYYY'
					/>
				</div>

				<Row gutter={16}>
					<Col xs={12} sm={6}>
						<Statistic
							title='Tổng lịch hẹn'
							value={tongLichHen}
							prefix={<CalendarOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Col>
					<Col xs={12} sm={6}>
						<Statistic
							title='Hoàn thành'
							value={lichHoanThanh}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Col>
					<Col xs={12} sm={6}>
						<Statistic
							title='Tổng doanh thu'
							value={tongDoanhThu}
							prefix={<DollarOutlined />}
							suffix='đ'
							valueStyle={{ color: '#fa8c16' }}
						/>
					</Col>
					<Col xs={12} sm={6}>
						<Statistic
							title='Đánh giá TB'
							value={diemDanhGiaTB}
							prefix={<StarOutlined />}
							suffix='/ 5'
							valueStyle={{ color: '#eb2f96' }}
						/>
					</Col>
				</Row>
			</Card>

			<Row gutter={16}>
				<Col xs={24} lg={12}>
					<Card title='Thống kê theo dịch vụ' style={{ marginBottom: 16 }}>
						<Table
							dataSource={thongKeTheoDichVu}
							columns={dichVuColumns}
							rowKey='dichVu'
							size='small'
							pagination={false}
							scroll={{ y: 300 }}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Thống kê theo nhân viên' style={{ marginBottom: 16 }}>
						<Table
							dataSource={thongKeTheoNhanVien}
							columns={nhanVienColumns}
							rowKey='nhanVien'
							size='small'
							pagination={false}
							scroll={{ y: 300 }}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Danh sách lịch hẹn trong khoảng thời gian'>
				<Table
					dataSource={lichHenTrongKhoang}
					columns={lichHenColumns}
					rowKey='_id'
					size='small'
					pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} lịch hẹn` }}
					scroll={{ x: 700 }}
				/>
			</Card>
		</div>
	);
};

export default ThongKePage;
