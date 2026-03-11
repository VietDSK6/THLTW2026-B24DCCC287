import type { FC } from 'react';
import { Button, Form, Input, InputNumber, Modal } from 'antd';

interface FormMonHocProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: any) => void;
	initialValues?: QuanLyDeThi.MonHoc;
	isEdit: boolean;
}

const FormMonHoc: FC<FormMonHocProps> = ({ visible, onCancel, onSubmit, initialValues, isEdit }) => {
	const [form] = Form.useForm();

	const handleSubmit = () => {
		form
			.validateFields()
			.then((values) => {
				onSubmit(values);
				form.resetFields();
			})
			.catch((error) => {
				console.error('Validate error:', error);
			});
	};

	return (
		<Modal
			title={isEdit ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
			visible={visible}
			onCancel={() => {
				form.resetFields();
				onCancel();
			}}
			footer={[
				<Button key='cancel' onClick={onCancel}>
					Hủy
				</Button>,
				<Button key='submit' type='primary' onClick={handleSubmit}>
					{isEdit ? 'Cập nhật' : 'Thêm mới'}
				</Button>,
			]}
		>
			<Form form={form} layout='vertical' initialValues={initialValues}>
				{isEdit && (
					<Form.Item label='Mã môn' name='maMon'>
						<Input disabled />
					</Form.Item>
				)}
				<Form.Item
					label='Tên môn học'
					name='tenMon'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên môn!' },
						{ min: 3, message: 'Tên môn phải có ít nhất 3 ký tự!' },
					]}
				>
					<Input placeholder='VD: Cấu trúc dữ liệu, Lập trình web...' />
				</Form.Item>
				<Form.Item
					label='Số tín chỉ'
					name='soTinChi'
					rules={[
						{ required: true, message: 'Vui lòng nhập số tín chỉ!' },
						{ type: 'number', min: 1, max: 10, message: 'Số tín chỉ phải từ 1 đến 10!' },
					]}
				>
					<InputNumber style={{ width: '100%' }} placeholder='VD: 3' min={1} max={10} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormMonHoc;
