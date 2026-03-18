import { ETrangThaiDichVu, TrangThaiDichVuText } from '@/services/DatLich/constant';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const DichVuPage = () => {
	const { danhSach, loading, visibleForm, setVisibleForm, setEdit, setRecord, getModel, deleteModel, handleEdit } =
		useModel('datlich.dichvu');

	useEffect(() => {
		getModel();
	}, []);

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const columns: ColumnsType<DichVu.IRecord> = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 100,
		},
		{
			title: 'Tên dịch vụ',
			dataIndex: 'ten',
			width: 200,
		},
		{
			title: 'Giá (VNĐ)',
			dataIndex: 'gia',
			width: 120,
			align: 'right',
			render: (val: number) => val?.toLocaleString('vi-VN'),
		},
		{
			title: 'Thời gian (phút)',
			dataIndex: 'thoiGianThucHien',
			width: 130,
			align: 'center',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 120,
			align: 'center',
			render: (val: ETrangThaiDichVu) => (
				<Tag color={val === ETrangThaiDichVu.HOAT_DONG ? 'green' : 'red'}>{TrangThaiDichVuText[val]}</Tag>
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
			title='Quản lý dịch vụ'
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
				pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} dịch vụ` }}
			/>

			<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} destroyOnClose width={500}>
				<Form />
			</Modal>
		</Card>
	);
};

export default DichVuPage;
