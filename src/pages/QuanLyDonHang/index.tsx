import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Button, Input, Select, Space, Table, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, StopOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnType } from 'antd/es/table';
import FormDonHang from './FormDonHang';
import { TRANG_THAI_OPTIONS } from '@/services/QuanLyDonHang/constants';

const { Option } = Select;

const QuanLyDonHang: FC = () => {
	const { danhSachDonHang, loadData, themDonHang, suaDonHang, huyDonHang } = useModel('quanlydonhang');
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [recordEdit, setRecordEdit] = useState<QuanLyDonHang.DonHang | undefined>();
	const [search, setSearch] = useState('');
	const [filterTrangThai, setFilterTrangThai] = useState<QuanLyDonHang.TrangThai | undefined>();

	useEffect(() => {
		loadData();
	}, []);

	const danhSachHienThi = useMemo(() => {
		return danhSachDonHang.filter((dh) => {
			if (
				search &&
				!dh.maDonHang.toLowerCase().includes(search.toLowerCase()) &&
				!dh.khachHang.toLowerCase().includes(search.toLowerCase())
			)
				return false;
			if (filterTrangThai && dh.trangThai !== filterTrangThai) return false;
			return true;
		});
	}, [danhSachDonHang, search, filterTrangThai]);

	const handleDoiTrangThai = (record: QuanLyDonHang.DonHang, trangThaiMoi: QuanLyDonHang.TrangThai) => {
		if (record.trangThai === trangThaiMoi) return;
		const { maDonHang, ...data } = record;
		suaDonHang(maDonHang, { ...data, trangThai: trangThaiMoi });
	};

	const columns: ColumnType<QuanLyDonHang.DonHang>[] = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'maDonHang',
			key: 'maDonHang',
			width: 160,
			render: (text) => <Tag color='blue'>{text}</Tag>,
		},
		{
			title: 'Khách hàng',
			dataIndex: 'khachHang',
			key: 'khachHang',
			width: 180,
		},
		{
			title: 'Ngày đặt hàng',
			dataIndex: 'ngayDatHang',
			key: 'ngayDatHang',
			width: 160,
			sorter: (a, b) => new Date(a.ngayDatHang).getTime() - new Date(b.ngayDatHang).getTime(),
			render: (val: string) => {
				const d = new Date(val);
				return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
			},
		},
		{
			title: 'Sản phẩm',
			dataIndex: 'danhSachSanPham',
			key: 'danhSachSanPham',
			ellipsis: true,
			render: (list: QuanLyDonHang.SanPhamTrongDon[]) =>
				list.map((sp) => `${sp.tenSanPham} (x${sp.soLuong})`).join(', '),
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'tongTien',
			key: 'tongTien',
			width: 150,
			align: 'right',
			sorter: (a, b) => a.tongTien - b.tongTien,
			render: (val: number) => <Tag color='geekblue'>{val.toLocaleString('vi-VN')} đ</Tag>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			width: 140,
			align: 'center',
			render: (value: QuanLyDonHang.TrangThai, record) => {
				return (
					<Select<QuanLyDonHang.TrangThai>
						size='small'
						value={value}
						style={{ width: '100%' }}
						onChange={(newValue) => handleDoiTrangThai(record, newValue)}
					>
						{TRANG_THAI_OPTIONS.map((tt) => (
							<Option key={tt.value} value={tt.value}>
								{tt.label}
							</Option>
						))}
					</Select>
				);
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 180,
			align: 'center',
			render: (_, record) => (
				<Space>
					<Button
						size='small'
						icon={<EditOutlined />}
						onClick={() => {
							setIsEdit(true);
							setRecordEdit(record);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					{record.trangThai === 'cho_xac_nhan' && (
						<Popconfirm
							title='Bạn có chắc muốn hủy đơn hàng này?'
							description='Hành động này không thể hoàn tác.'
							onConfirm={() => huyDonHang(record.maDonHang)}
							okText='Hủy đơn'
							cancelText='Không'
							okButtonProps={{ danger: true }}
						>
							<Button size='small' danger icon={<StopOutlined />}>
								Hủy
							</Button>
						</Popconfirm>
					)}
				</Space>
			),
		},
	];

	const handleSubmit = (values: Omit<QuanLyDonHang.DonHang, 'maDonHang'>) => {
		let ok: boolean;
		if (isEdit && recordEdit) {
			ok = suaDonHang(recordEdit.maDonHang, values);
		} else {
			ok = themDonHang(values);
		}
		if (ok) {
			setVisible(false);
			setIsEdit(false);
			setRecordEdit(undefined);
		}
	};

	return (
		<div>
			<div
				style={{
					marginBottom: 16,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: 8,
				}}
			>
				<Space wrap>
					<Input
						placeholder='Tìm theo mã đơn hàng hoặc khách hàng...'
						prefix={<SearchOutlined />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						allowClear
						style={{ width: 300 }}
					/>
					<Select
						placeholder='Lọc theo trạng thái'
						allowClear
						style={{ width: 180 }}
						value={filterTrangThai}
						onChange={setFilterTrangThai}
					>
						{TRANG_THAI_OPTIONS.map((tt) => (
							<Option key={tt.value} value={tt.value}>
								{tt.label}
							</Option>
						))}
					</Select>
				</Space>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setIsEdit(false);
						setRecordEdit(undefined);
						setVisible(true);
					}}
				>
					Thêm đơn hàng
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={danhSachHienThi}
				rowKey='maDonHang'
				pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} đơn hàng` }}
			/>

			<FormDonHang
				visible={visible}
				isEdit={isEdit}
				initialValues={recordEdit}
				onCancel={() => {
					setVisible(false);
					setIsEdit(false);
					setRecordEdit(undefined);
				}}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default QuanLyDonHang;
