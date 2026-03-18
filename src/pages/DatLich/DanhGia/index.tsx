import { ETrangThaiLichHen } from '@/services/DatLich/constant';
import { DeleteOutlined, MessageOutlined, PlusOutlined, StarFilled } from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Rate, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import PhanHoi from './components/PhanHoi';

const DanhGiaPage = () => {
	const {
		danhSach,
		loading,
		visibleForm,
		setVisibleForm,
		visiblePhanHoi,
		setVisiblePhanHoi,
		setEdit,
		setRecord,
		record,
		getModel,
		deleteModel,
		handlePhanHoi,
		getDiemTrungBinhNhanVien,
	} = useModel('datlich.danhgia');
	const { danhSach: danhSachLichHen, getModel: getLichHen } = useModel('datlich.lichhen');
	const { danhSach: danhSachNhanVien, getModel: getNhanVien } = useModel('datlich.nhanvien');
	const { danhSach: danhSachDichVu, getModel: getDichVu } = useModel('datlich.dichvu');

	useEffect(() => {
		getModel();
		getLichHen();
		getNhanVien();
		getDichVu();
	}, []);

	const lichHenHoanThanh = useMemo(() => {
		return danhSachLichHen.filter(
			(lh: LichHen.IRecord) =>
				lh.trangThai === ETrangThaiLichHen.HOAN_THANH &&
				!danhSach.some((dg: DanhGia.IRecord) => dg.lichHenId === lh._id),
		);
	}, [danhSachLichHen, danhSach]);

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const getNhanVienName = (nhanVienId: string) => {
		return danhSachNhanVien.find((nv: NhanVien.IRecord) => nv._id === nhanVienId)?.hoTen || '-';
	};

	const getDichVuNames = (dichVuIds: string[]) => {
		if (!dichVuIds?.length) return '-';
		return dichVuIds
			.map((id) => danhSachDichVu.find((dv: DichVu.IRecord) => dv._id === id)?.ten)
			.filter(Boolean)
			.join(', ');
	};

	const thongKeNhanVien = useMemo(() => {
		const stats: { nhanVien: string; diemTB: number; soLuong: number }[] = [];
		danhSachNhanVien.forEach((nv: NhanVien.IRecord) => {
			const danhGiasNV = danhSach.filter((dg: DanhGia.IRecord) => dg.nhanVienId === nv._id);
			if (danhGiasNV.length > 0) {
				stats.push({
					nhanVien: nv.hoTen,
					diemTB: getDiemTrungBinhNhanVien(nv._id),
					soLuong: danhGiasNV.length,
				});
			}
		});
		return stats.sort((a, b) => b.diemTB - a.diemTB);
	}, [danhSach, danhSachNhanVien]);

	const columns: ColumnsType<DanhGia.IRecord> = [
		{
			title: 'Khách hàng',
			dataIndex: 'khachHang',
			width: 150,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'nhanVienId',
			width: 130,
			render: (val: string) => getNhanVienName(val),
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'dichVuIds',
			width: 180,
			render: (val: string[]) => getDichVuNames(val),
		},
		{
			title: 'Điểm',
			dataIndex: 'diem',
			width: 140,
			align: 'center',
			render: (val: number) => <Rate disabled value={val} style={{ fontSize: 14 }} />,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Phản hồi',
			dataIndex: 'phanHoi',
			width: 150,
			render: (val: DanhGia.IPhanHoi) =>
				val ? (
					<Tooltip title={val.noiDung}>
						<Tag color='blue'>Đã phản hồi</Tag>
					</Tooltip>
				) : (
					<Tag>Chưa phản hồi</Tag>
				),
		},
		{
			title: 'Ngày đánh giá',
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_, rec) => (
				<>
					<Tooltip title='Phản hồi'>
						<Button
							type='link'
							icon={<MessageOutlined />}
							onClick={() => handlePhanHoi(rec)}
							disabled={!!rec.phanHoi}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm title='Bạn có chắc chắn muốn xóa?' onConfirm={() => deleteModel(rec._id)} placement='topRight'>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<Card
			title='Đánh giá dịch vụ'
			extra={
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd} disabled={lichHenHoanThanh.length === 0}>
					Thêm đánh giá
				</Button>
			}
		>
			{thongKeNhanVien.length > 0 && (
				<div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
					{thongKeNhanVien.map((item, index) => (
						<div
							key={index}
							style={{
								padding: '8px 16px',
								background: '#fafafa',
								borderRadius: 6,
								border: '1px solid #f0f0f0',
							}}
						>
							<div style={{ fontWeight: 500 }}>{item.nhanVien}</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
								<StarFilled style={{ color: '#fadb14' }} />
								<span>{item.diemTB.toFixed(1)}</span>
								<span style={{ color: '#999', fontSize: 12 }}>({item.soLuong} đánh giá)</span>
							</div>
						</div>
					))}
				</div>
			)}

			<Table
				dataSource={danhSach}
				columns={columns}
				rowKey='_id'
				loading={loading}
				scroll={{ x: 1200 }}
				pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} đánh giá` }}
			/>

			<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} destroyOnClose width={500}>
				<Form lichHenList={lichHenHoanThanh} />
			</Modal>

			<Modal
				visible={visiblePhanHoi}
				onCancel={() => setVisiblePhanHoi(false)}
				footer={null}
				destroyOnClose
				width={500}
			>
				<PhanHoi danhGia={record} />
			</Modal>
		</Card>
	);
};

export default DanhGiaPage;
