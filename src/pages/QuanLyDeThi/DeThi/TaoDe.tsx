import type { FC } from 'react';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { useModel } from 'umi';

interface TaoDeProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: any) => void;
}

const TaoDe: FC<TaoDeProps> = ({ visible, onCancel, onSubmit }) => {
	const [form] = Form.useForm();
	const { danhSachCauTruc } = useModel('quanlydethi');

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
			title='Tạo đề thi mới'
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
					Tạo đề
				</Button>,
			]}
		>
			<Form form={form} layout='vertical'>
				<Form.Item label='Tên đề thi' name='tenDe' rules={[{ required: true, message: 'Vui lòng nhập tên đề!' }]}>
					<Input placeholder='VD: Đề thi giữa kỳ HK1' />
				</Form.Item>
				<Form.Item
					label='Chọn cấu trúc đề'
					name='maCauTruc'
					rules={[{ required: true, message: 'Vui lòng chọn cấu trúc!' }]}
				>
					<Select placeholder='Chọn cấu trúc có sẵn'>
						{danhSachCauTruc.map((ct) => (
							<Select.Option key={ct.maCauTruc} value={ct.maCauTruc}>
								{ct.tenCauTruc}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label='Trạng thái' name='trangThai' initialValue='hoan_thanh'>
					<Radio.Group>
						<Radio value='nhap'>Nháp</Radio>
						<Radio value='hoan_thanh'>Hoàn thành</Radio>
					</Radio.Group>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaoDe;
