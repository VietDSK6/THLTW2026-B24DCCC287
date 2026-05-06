import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormChiSo from './components/Form';

const ChiSoSucKhoePage = () => {
	const { danhSach, loading, visibleForm, setVisibleForm, setEdit, setRecord, getModel, deleteModel, handleEdit } =
		useModel('theduc.chisosuckhoe');

	useEffect(() => {
		getModel();
	}, []);

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const getBmiColor = (bmi: number) => {
		if (!bmi) return 'default';
		if (bmi < 18.5) return 'blue';
		if (bmi < 25) return 'green';
		if (bmi < 30) return 'gold';
		return 'red';
	};

	const columns: ColumnsType<ChiSoSucKhoe.IRecord> = [
		{
			title: 'Ngày',
			dataIndex: 'ngay',
			width: 120,
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Cân nặng (kg)',
			dataIndex: 'canNang',
			width: 120,
			align: 'right',
		},
		{
			title: 'Chiều cao (cm)',
			dataIndex: 'chieuCao',
			width: 120,
			align: 'right',
		},
		{
			title: 'BMI',
			dataIndex: 'bmi',
			width: 120,
			align: 'center',
			render: (val: number) => <Tag color={getBmiColor(val)}>{val}</Tag>,
		},
		{
			title: 'Nhịp tim (bpm)',
			dataIndex: 'nhipTim',
			width: 130,
			align: 'right',
			render: (val: number) => val || '-',
		},
		{
			title: 'Giờ ngủ',
			dataIndex: 'gioNgu',
			width: 100,
			align: 'right',
			render: (val: number) => val || '-',
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
						<Popconfirm title='Bạn có chắc chắn muốn xóa?' onConfirm={() => deleteModel(record._id)} placement='topRight'>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<Card
			title='Nhật ký chỉ số sức khỏe'
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
				scroll={{ x: 800 }}
				pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} bản ghi` }}
			/>

			<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} destroyOnClose width={500}>
				<FormChiSo />
			</Modal>
		</Card>
	);
};

export default ChiSoSucKhoePage;
