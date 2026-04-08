import { ETrangThaiNhanVien, TrangThaiNhanVienText, ThuTrongTuan } from '@/services/DatLich/constant';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Rate, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const NhanVienPage = () => {
	const { danhSach, loading, visibleForm, setVisibleForm, setEdit, setRecord, getModel, deleteModel, handleEdit } =
		useModel('datlich.nhanvien');
	const { danhSach: danhSachDichVu, getModel: getDichVu } = useModel('datlich.dichvu');

	useEffect(() => {
		getModel();
		getDichVu();
	}, []);

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const getDichVuNames = (dichVuIds: string[]) => {
		if (!dichVuIds?.length) return '-';
		return dichVuIds
			.map((id) => danhSachDichVu.find((dv) => dv._id === id)?.ten)
			.filter(Boolean)
			.join(', ');
	};

	const getLichLamViecText = (lichLamViec: NhanVien.ILichLamViec[]) => {
		if (!lichLamViec?.length) return '-';
		const ngayLam = lichLamViec.filter((l) => !l.nghiPhep).map((l) => ThuTrongTuan[l.thu]);
		return ngayLam.length > 0 ? ngayLam.join(', ') : 'Không có';
	};

	const columns: ColumnsType<NhanVien.IRecord> = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 110,
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'dichVu',
			width: 200,
			render: (val: string[]) => getDichVuNames(val),
		},
		{
			title: 'Khách tối đa/ngày',
			dataIndex: 'soKhachToiDa',
			width: 130,
			align: 'center',
		},
		{
			title: 'Ngày làm việc',
			dataIndex: 'lichLamViec',
			width: 180,
			render: (val: NhanVien.ILichLamViec[]) => getLichLamViecText(val),
		},
		{
			title: 'Đánh giá TB',
			dataIndex: 'diemDanhGiaTB',
			width: 140,
			align: 'center',
			render: (val: number) => (val ? <Rate disabled defaultValue={val} allowHalf style={{ fontSize: 14 }} /> : '-'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 110,
			align: 'center',
			render: (val: ETrangThaiNhanVien) => (
				<Tag color={val === ETrangThaiNhanVien.HOAT_DONG ? 'green' : 'red'}>{TrangThaiNhanVienText[val]}</Tag>
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
						<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
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
			title='Quản lý nhân viên'
			extra={
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm mới
				</Button>
			}
		>
			<Table
				dataSource={danhSach}
				columns={columns}
				rowKey='_id'
				loading={loading}
				scroll={{ x: 1200 }}
				pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} nhân viên` }}
			/>

			<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} destroyOnClose width={700}>
				<Form />
			</Modal>
		</Card>
	);
};

export default NhanVienPage;
