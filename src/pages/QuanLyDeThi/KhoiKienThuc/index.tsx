import type { FC } from 'react';
import { useState } from 'react';
import { Button, Space, Table, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import FormKhoiKT from './FormKhoiKT';
import type { ColumnType } from 'antd/es/table';

const KhoiKienThuc: FC = () => {
	const { danhSachKhoiKT, themKhoiKT, suaKhoiKT, xoaKhoiKT } = useModel('quanlydethi');
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [recordEdit, setRecordEdit] = useState<QuanLyDeThi.KhoiKienThuc>();

	const columns: ColumnType<QuanLyDeThi.KhoiKienThuc>[] = [
		{
			title: 'Mã khối',
			dataIndex: 'ma',
			key: 'ma',
			width: 150,
			render: (text) => <Tag color='blue'>{text}</Tag>,
		},
		{
			title: 'Tên khối kiến thức',
			dataIndex: 'ten',
			key: 'ten',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			key: 'moTa',
			render: (text) => text || <span style={{ color: '#ccc' }}>Chưa có mô tả</span>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 150,
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
					<Popconfirm
						title='Bạn có chắc muốn xóa khối kiến thức này?'
						onConfirm={() => xoaKhoiKT(record.ma)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleSubmit = (values: any) => {
		if (isEdit && recordEdit) {
			suaKhoiKT(recordEdit.ma, values);
		} else {
			themKhoiKT(values);
		}
		setVisible(false);
		setIsEdit(false);
		setRecordEdit(undefined);
	};

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setIsEdit(false);
						setRecordEdit(undefined);
						setVisible(true);
					}}
				>
					Thêm khối kiến thức
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={danhSachKhoiKT}
				rowKey='ma'
				pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} khối` }}
			/>

			<FormKhoiKT
				visible={visible}
				onCancel={() => {
					setVisible(false);
					setIsEdit(false);
					setRecordEdit(undefined);
				}}
				onSubmit={handleSubmit}
				initialValues={recordEdit}
				isEdit={isEdit}
			/>
		</div>
	);
};

export default KhoiKienThuc;
