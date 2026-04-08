import { Button, Form, Input, Modal, Popconfirm, Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'monhoc';

const DEFAULT_SUBJECTS = [
	{ id: '1', ten: 'Toán' },
	{ id: '2', ten: 'Văn' },
	{ id: '3', ten: 'Anh' },
];

const DanhMucMonHoc: React.FC = () => {
	const [data, setData] = useState<HocTap.MonHoc[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [record, setRecord] = useState<HocTap.MonHoc | undefined>(undefined);
	const [form] = Form.useForm();

	const loadData = () => {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			setData(JSON.parse(raw));
		} else {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SUBJECTS));
			setData(DEFAULT_SUBJECTS);
		}
	};

	const saveData = (newData: HocTap.MonHoc[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
		setData(newData);
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleAdd = () => {
		setIsEdit(false);
		setRecord(undefined);
		form.resetFields();
		setVisible(true);
	};

	const handleEdit = (rec: HocTap.MonHoc) => {
		setIsEdit(true);
		setRecord(rec);
		form.setFieldsValue(rec);
		setVisible(true);
	};

	const handleDelete = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		saveData(newData);
	};

	const handleSubmit = (values: { ten: string }) => {
		if (isEdit && record) {
			const newData = data.map((item) => (item.id === record.id ? { ...item, ten: values.ten } : item));
			saveData(newData);
		} else {
			const newItem: HocTap.MonHoc = {
				id: Date.now().toString(),
				ten: values.ten,
			};
			saveData([...data, newItem]);
		}
		setVisible(false);
	};

	const columns: ColumnType<HocTap.MonHoc>[] = [
		{
			title: 'STT',
			width: 60,
			align: 'center',
			render: (_text, _record, index) => index + 1,
		},
		{
			title: 'Tên môn học',
			dataIndex: 'ten',
			key: 'ten',
		},
		{
			title: 'Thao tác',
			width: 180,
			align: 'center',
			render: (_text, rec) => (
				<div>
					<Button size='small' onClick={() => handleEdit(rec)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa môn học này?' onConfirm={() => handleDelete(rec.id)}>
						<Button size='small' danger style={{ marginLeft: 8 }}>
							Xóa
						</Button>
					</Popconfirm>
				</div>
			),
		},
	];

	return (
		<div>
			<Button type='primary' onClick={handleAdd} style={{ marginBottom: 16 }}>
				Thêm môn học
			</Button>
			<Table dataSource={data} columns={columns} rowKey='id' pagination={false} />
			<Modal
				destroyOnClose
				title={isEdit ? 'Sửa môn học' : 'Thêm môn học'}
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={null}
			>
				<Form form={form} onFinish={handleSubmit} layout='vertical'>
					<Form.Item label='Tên môn học' name='ten' rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}>
						<Input placeholder='Nhập tên môn học' />
					</Form.Item>
					<div className='form-footer'>
						<Button htmlType='submit' type='primary'>
							{isEdit ? 'Cập nhật' : 'Thêm mới'}
						</Button>
						<Button onClick={() => setVisible(false)} style={{ marginLeft: 8 }}>
							Hủy
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default DanhMucMonHoc;
