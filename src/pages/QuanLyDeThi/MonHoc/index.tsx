import type { FC } from 'react';
import { useState } from 'react';
import { Button, Space, Table, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import FormMonHoc from './FormMonHoc';
import type { ColumnType } from 'antd/es/table';

const MonHoc: FC = () => {
	const { danhSachMonHoc, themMonHoc, suaMonHoc, xoaMonHoc } = useModel('quanlydethi');
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [recordEdit, setRecordEdit] = useState<QuanLyDeThi.MonHoc>();

	const columns: ColumnType<QuanLyDeThi.MonHoc>[] = [
		{
			title: 'Mã môn',
			dataIndex: 'maMon',
			key: 'maMon',
			width: 150,
			render: (text) => <Tag color='green'>{text}</Tag>,
		},
		{
			title: 'Tên môn học',
			dataIndex: 'tenMon',
			key: 'tenMon',
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'soTinChi',
			key: 'soTinChi',
			width: 120,
			align: 'center',
			render: (text) => <Tag color='blue'>{text} TC</Tag>,
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
						title='Bạn có chắc muốn xóa môn học này?'
						onConfirm={() => xoaMonHoc(record.maMon)}
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
			suaMonHoc(recordEdit.maMon, values);
		} else {
			themMonHoc(values);
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
					Thêm môn học
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={danhSachMonHoc}
				rowKey='maMon'
				pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} môn` }}
			/>

			<FormMonHoc
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

export default MonHoc;
