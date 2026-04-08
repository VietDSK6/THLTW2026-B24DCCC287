import { Button, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import moment from 'moment';

const STORAGE_KEY_TIENDO = 'tiendo';
const STORAGE_KEY_MONHOC = 'monhoc';

const TienDoHocTap: React.FC = () => {
	const [data, setData] = useState<HocTap.BuoiHoc[]>([]);
	const [monHocList, setMonHocList] = useState<HocTap.MonHoc[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [record, setRecord] = useState<HocTap.BuoiHoc | undefined>(undefined);
	const [filterMonHoc, setFilterMonHoc] = useState<string>('');
	const [form] = Form.useForm();

	const loadData = () => {
		const raw = localStorage.getItem(STORAGE_KEY_TIENDO);
		setData(raw ? JSON.parse(raw) : []);
	};

	const loadMonHoc = () => {
		const raw = localStorage.getItem(STORAGE_KEY_MONHOC);
		setMonHocList(raw ? JSON.parse(raw) : []);
	};

	const saveData = (newData: HocTap.BuoiHoc[]) => {
		localStorage.setItem(STORAGE_KEY_TIENDO, JSON.stringify(newData));
		setData(newData);
	};

	useEffect(() => {
		loadData();
		loadMonHoc();
	}, []);

	const handleAdd = () => {
		setIsEdit(false);
		setRecord(undefined);
		form.resetFields();
		setVisible(true);
	};

	const handleEdit = (rec: HocTap.BuoiHoc) => {
		setIsEdit(true);
		setRecord(rec);
		form.setFieldsValue({
			...rec,
			thoiGian: moment(rec.thoiGian),
		});
		setVisible(true);
	};

	const handleDelete = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		saveData(newData);
	};

	const handleSubmit = (values: any) => {
		const payload = {
			...values,
			thoiGian: values.thoiGian.format('YYYY-MM-DD HH:mm'),
		};

		if (isEdit && record) {
			const newData = data.map((item) => (item.id === record.id ? { ...item, ...payload } : item));
			saveData(newData);
		} else {
			const newItem: HocTap.BuoiHoc = {
				id: Date.now().toString(),
				...payload,
			};
			saveData([...data, newItem]);
		}
		setVisible(false);
	};

	const getTenMonHoc = (monHocId: string): string => {
		const found = monHocList.find((m) => m.id === monHocId);
		return found ? found.ten : '';
	};

	const filteredData = filterMonHoc ? data.filter((item) => item.monHocId === filterMonHoc) : data;

	const columns: ColumnType<HocTap.BuoiHoc>[] = [
		{
			title: 'STT',
			width: 60,
			align: 'center',
			render: (_text, _record, index) => index + 1,
		},
		{
			title: 'Môn học',
			dataIndex: 'monHocId',
			key: 'monHocId',
			width: 120,
			render: (monHocId) => getTenMonHoc(monHocId),
		},
		{
			title: 'Thời gian học',
			dataIndex: 'thoiGian',
			key: 'thoiGian',
			width: 160,
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'thoiLuong',
			key: 'thoiLuong',
			width: 130,
			align: 'center',
		},
		{
			title: 'Nội dung đã học',
			dataIndex: 'noiDung',
			key: 'noiDung',
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			key: 'ghiChu',
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
					<Popconfirm title='Xóa buổi học này?' onConfirm={() => handleDelete(rec.id)}>
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
			<div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
				<Button type='primary' onClick={handleAdd}>
					Thêm buổi học
				</Button>
				<Select
					allowClear
					placeholder='Lọc theo môn học'
					style={{ width: 200 }}
					value={filterMonHoc || undefined}
					onChange={(val) => setFilterMonHoc(val || '')}
				>
					{monHocList.map((m) => (
						<Select.Option key={m.id} value={m.id}>
							{m.ten}
						</Select.Option>
					))}
				</Select>
			</div>
			<Table dataSource={filteredData} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />
			<Modal
				destroyOnClose
				title={isEdit ? 'Sửa buổi học' : 'Thêm buổi học'}
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={null}
				width={600}
			>
				<Form form={form} onFinish={handleSubmit} layout='vertical'>
					<Form.Item label='Môn học' name='monHocId' rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
						<Select placeholder='Chọn môn học'>
							{monHocList.map((m) => (
								<Select.Option key={m.id} value={m.id}>
									{m.ten}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label='Thời gian học'
						name='thoiGian'
						rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
					>
						<DatePicker showTime format='YYYY-MM-DD HH:mm' style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						label='Thời lượng (phút)'
						name='thoiLuong'
						rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập số phút' />
					</Form.Item>
					<Form.Item
						label='Nội dung đã học'
						name='noiDung'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
					>
						<Input.TextArea rows={3} placeholder='Mô tả nội dung buổi học' />
					</Form.Item>
					<Form.Item label='Ghi chú' name='ghiChu'>
						<Input.TextArea rows={2} placeholder='Ghi chú thêm (tùy chọn)' />
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

export default TienDoHocTap;
