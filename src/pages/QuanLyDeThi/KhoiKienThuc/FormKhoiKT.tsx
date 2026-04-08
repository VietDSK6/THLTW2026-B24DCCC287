import type { FC } from 'react';
import { Button, Form, Input, Modal } from 'antd';

interface FormKhoiKTProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: any) => void;
	initialValues?: QuanLyDeThi.KhoiKienThuc;
	isEdit: boolean;
}

const FormKhoiKT: FC<FormKhoiKTProps> = ({ visible, onCancel, onSubmit, initialValues, isEdit }) => {
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
			title={isEdit ? 'Chỉnh sửa khối kiến thức' : 'Thêm khối kiến thức mới'}
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
					<Form.Item label='Mã khối' name='ma'>
						<Input disabled />
					</Form.Item>
				)}
				<Form.Item
					label='Tên khối kiến thức'
					name='ten'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên khối!' },
						{ min: 3, message: 'Tên khối phải có ít nhất 3 ký tự!' },
					]}
				>
					<Input placeholder='VD: Tổng quan, Chuyên sâu...' />
				</Form.Item>
				<Form.Item label='Mô tả' name='moTa'>
					<Input.TextArea rows={3} placeholder='Mô tả về khối kiến thức này (không bắt buộc)' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormKhoiKT;
