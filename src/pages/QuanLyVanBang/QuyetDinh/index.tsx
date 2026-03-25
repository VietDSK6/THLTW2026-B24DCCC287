import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Drawer, Popconfirm, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import SelectSoVanBang from './components/SelectSoVanBang';

const QuyetDinhPage = () => {
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
		filterSoVanBangId,
		setFilterSoVanBangId,
		getModel,
		deleteModel,
		handleEdit,
	} = useModel('quanlyvanbang.quyetdinh' as any);

	useEffect(() => {
		getModel();
	}, [page, limit, filterSoVanBangId]);

	const columns: IColumn<QuyetDinh.IRecord>[] = [
		{
			title: 'Số quyết định',
			dataIndex: 'soQuyetDinh',
			width: 150,
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'ngayBanHanh',
			width: 130,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'Trích yếu',
			dataIndex: 'trichYeu',
			width: 300,
		},
		{
			title: 'Sổ văn bằng',
			dataIndex: 'soVanBangTen',
			width: 200,
		},
		{
			title: 'Năm',
			dataIndex: 'namSo',
			width: 80,
			align: 'center',
		},
		{
			title: 'Số lượng VB',
			dataIndex: 'soLuongVanBang',
			width: 100,
			align: 'center',
		},
		{
			title: 'Lượt tra cứu',
			dataIndex: 'soLuotTraCuu',
			width: 110,
			align: 'center',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: QuyetDinh.IRecord) => (
				<Space>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} size='small' />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa quyết định này?'
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
			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
				<Button
					onClick={() => {
						setEdit(false);
						setRecord(undefined);
						setVisibleForm(true);
					}}
					type='primary'
					icon={<EditOutlined />}
				>
					Thêm mới quyết định
				</Button>

				<div style={{ width: 300 }}>
					<SelectSoVanBang
						value={filterSoVanBangId}
						onChange={setFilterSoVanBangId}
						placeholder='Lọc theo sổ văn bằng'
					/>
				</div>
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
				scroll={{ x: 1300 }}
			/>

			<Drawer
				title={(visibleForm ? 'Thêm mới' : 'Chỉnh sửa') + ' quyết định'}
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

export default QuyetDinhPage;
