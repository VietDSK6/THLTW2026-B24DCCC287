import { ETrangThaiLichHen, TrangThaiLichHenColor, TrangThaiLichHenText } from '@/services/DatLich/constant';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Menu, Modal, Popconfirm, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const LichHenPage = () => {
	const {
		danhSach,
		loading,
		visibleForm,
		setVisibleForm,
		setEdit,
		setRecord,
		getModel,
		deleteModel,
		handleEdit,
		updateTrangThai,
	} = useModel('datlich.lichhen');
	const { danhSach: danhSachNhanVien, getModel: getNhanVien } = useModel('datlich.nhanvien');
	const { danhSach: danhSachDichVu, getModel: getDichVu } = useModel('datlich.dichvu');

	useEffect(() => {
		getModel();
		getNhanVien();
		getDichVu();
	}, []);

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

	const getStatusMenu = (record: LichHen.IRecord) => (
		<Menu
			onClick={({ key }) => updateTrangThai(record._id, key as ETrangThaiLichHen)}
			items={Object.values(ETrangThaiLichHen)
				.filter((s) => s !== record.trangThai)
				.map((status) => ({
					key: status,
					label: TrangThaiLichHenText[status],
				}))}
		/>
	);

	const columns: ColumnsType<LichHen.IRecord> = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 160,
		},
		{
			title: 'Khách hàng',
			dataIndex: ['khachHang', 'hoTen'],
			width: 150,
		},
		{
			title: 'SĐT',
			dataIndex: ['khachHang', 'soDienThoai'],
			width: 110,
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
			title: 'Ngày hẹn',
			dataIndex: 'ngayHen',
			width: 100,
			align: 'center',
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Giờ hẹn',
			dataIndex: 'gioHen',
			width: 80,
			align: 'center',
		},
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
			width: 120,
			align: 'center',
			render: (val: ETrangThaiLichHen, record: LichHen.IRecord) => (
				<Dropdown overlay={getStatusMenu(record)} trigger={['click']}>
					<Tag color={TrangThaiLichHenColor[val]} style={{ cursor: 'pointer' }}>
						{TrangThaiLichHenText[val]}
					</Tag>
				</Dropdown>
			),
		},
		{
			title: 'Thao tác',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_, record) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							type='link'
							icon={<EditOutlined />}
							onClick={() => handleEdit(record)}
							disabled={record.trangThai === ETrangThaiLichHen.HOAN_THANH || record.trangThai === ETrangThaiLichHen.HUY}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							title='Bạn có chắc chắn muốn xóa?'
							onConfirm={() => deleteModel(record._id)}
							placement='topRight'
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<Card
			title='Quản lý lịch hẹn'
			extra={
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Đặt lịch mới
				</Button>
			}
		>
			<Table
				dataSource={danhSach}
				columns={columns}
				rowKey='_id'
				loading={loading}
				scroll={{ x: 1300 }}
				pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} lịch hẹn` }}
			/>

			<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} destroyOnClose width={700}>
				<Form />
			</Modal>
		</Card>
	);
};

export default LichHenPage;
