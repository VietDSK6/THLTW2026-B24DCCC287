import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Popconfirm, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const SoVanBangPage = () => {
	const {
		data,
		total,
		loading,
		page,
		setPage,
		limit,
		setLimit,
		visibleForm,
		setVisibleForm,
		setRecord,
		setEdit,
		getModel,
		deleteModel,
		handleEdit,
		dongSo,
		moSo,
	} = useModel('quanlyvanbang.sovanbang' as any);

	useEffect(() => {
		getModel();
	}, [page, limit]);

	const columns: IColumn<SoVanBang.IRecord>[] = [
		{
			title: 'Năm sổ',
			dataIndex: 'namSo',
			width: 100,
			align: 'center',
		},
		{
			title: 'Tên sổ',
			dataIndex: 'tenSo',
			width: 250,
		},
		{
			title: 'Tiền tố số hiệu',
			dataIndex: 'tienToSoHieu',
			width: 150,
			align: 'center',
		},
		{
			title: 'Số hiện tại',
			dataIndex: 'soHienTai',
			width: 100,
			align: 'center',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 130,
			align: 'center',
			render: (val) =>
				val === 'dang_su_dung' ? (
					<Badge status='processing' text='Đang sử dụng' />
				) : (
					<Badge status='default' text='Đã đóng' />
				),
		},
		{
			title: 'Ngày mở sổ',
			dataIndex: 'ngayMoSo',
			width: 120,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'Ngày đóng sổ',
			dataIndex: 'ngayDongSo',
			width: 120,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (record: SoVanBang.IRecord) => (
				<Space>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} size='small' />
					</Tooltip>
					{record.trangThai === 'dang_su_dung' ? (
						<Tooltip title='Đóng sổ'>
							<Popconfirm
								onConfirm={() => dongSo(record._id)}
								title='Bạn có chắc chắn muốn đóng sổ này?'
								placement='topLeft'
							>
								<Button type='link' icon={<LockOutlined />} size='small' />
							</Popconfirm>
						</Tooltip>
					) : (
						<Tooltip title='Mở sổ'>
							<Popconfirm
								onConfirm={() => moSo(record._id)}
								title='Bạn có chắc chắn muốn mở lại sổ này?'
								placement='topLeft'
							>
								<Button type='link' icon={<UnlockOutlined />} size='small' />
							</Popconfirm>
						</Tooltip>
					)}
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa sổ này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} size='small' />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Button
					onClick={() => {
						setEdit(false);
						setRecord(undefined);
						setVisibleForm(true);
					}}
					type='primary'
					icon={<EditOutlined />}
				>
					Thêm mới sổ văn bằng
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={data}
				loading={loading}
				rowKey='_id'
				pagination={{
					current: page,
					pageSize: limit,
					total: total,
					onChange: (p, ps) => {
						setPage(p);
						setLimit(ps);
					},
					showSizeChanger: true,
					showTotal: (total) => `Tổng ${total} bản ghi`,
				}}
				scroll={{ x: 1200 }}
			/>

			<Drawer
				title={(visibleForm ? 'Thêm mới' : 'Chỉnh sửa') + ' sổ văn bằng'}
				visible={visibleForm}
				onClose={() => setVisibleForm(false)}
				width={600}
				destroyOnClose
			>
				<Form />
			</Drawer>
		</div>
	);
};

export default SoVanBangPage;
