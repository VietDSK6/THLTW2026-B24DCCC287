import type { FC } from 'react';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { useModel } from 'umi';
import { MUC_DO_KHO_OPTIONS } from '@/services/QuanLyDeThi/constants';

interface FormCauHoiProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: any) => void;
	initialValues?: QuanLyDeThi.CauHoi;
	isEdit: boolean;
}

const FormCauHoi: FC<FormCauHoiProps> = ({ visible, onCancel, onSubmit, initialValues, isEdit }) => {
	const [form] = Form.useForm();
	const { danhSachMonHoc, danhSachKhoiKT } = useModel('quanlydethi');

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
			title={isEdit ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
			visible={visible}
			onCancel={() => {
				form.resetFields();
				onCancel();
			}}
			width={700}
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
					<Form.Item label='Mã câu hỏi' name='maCauHoi'>
						<Input disabled />
					</Form.Item>
				)}
				<Form.Item label='Môn học' name='maMon' rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
					<Select placeholder='Chọn môn học'>
						{danhSachMonHoc.map((mh) => (
							<Select.Option key={mh.maMon} value={mh.maMon}>
								{mh.tenMon}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					label='Khối kiến thức'
					name='khoiKienThuc'
					rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}
				>
					<Select placeholder='Chọn khối kiến thức'>
						{danhSachKhoiKT.map((kk) => (
							<Select.Option key={kk.ma} value={kk.ma}>
								{kk.ten}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					label='Nội dung câu hỏi'
					name='noiDung'
					rules={[
						{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' },
						{ min: 10, message: 'Nội dung phải có ít nhất 10 ký tự!' },
					]}
				>
					<Input.TextArea rows={4} placeholder='Nhập nội dung câu hỏi...' />
				</Form.Item>
				<Form.Item
					label='Mức độ khó'
					name='mucDoKho'
					rules={[{ required: true, message: 'Vui lòng chọn mức độ khó!' }]}
				>
					<Radio.Group>
						{MUC_DO_KHO_OPTIONS.map((opt) => (
							<Radio key={opt.value} value={opt.value}>
								{opt.label}
							</Radio>
						))}
					</Radio.Group>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormCauHoi;
