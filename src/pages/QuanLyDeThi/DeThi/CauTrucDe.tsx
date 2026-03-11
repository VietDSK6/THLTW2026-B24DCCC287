import type { FC } from 'react';
import { Button, Form, Input, Modal, Select, Space, InputNumber, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { MUC_DO_KHO_OPTIONS } from '@/services/QuanLyDeThi/constants';

interface CauTrucDeProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: any) => void;
}

const CauTrucDe: FC<CauTrucDeProps> = ({ visible, onCancel, onSubmit }) => {
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
			title='Tạo cấu trúc đề mới'
			visible={visible}
			onCancel={() => {
				form.resetFields();
				onCancel();
			}}
			width={800}
			footer={[
				<Button key='cancel' onClick={onCancel}>
					Hủy
				</Button>,
				<Button key='submit' type='primary' onClick={handleSubmit}>
					Lưu cấu trúc
				</Button>,
			]}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					label='Tên cấu trúc'
					name='tenCauTruc'
					rules={[{ required: true, message: 'Vui lòng nhập tên cấu trúc!' }]}
				>
					<Input placeholder='VD: Đề thi giữa kỳ' />
				</Form.Item>
				<Form.Item label='Môn học' name='maMon' rules={[{ required: true, message: 'Vui lòng chọn môn!' }]}>
					<Select placeholder='Chọn môn học'>
						{danhSachMonHoc.map((mh) => (
							<Select.Option key={mh.maMon} value={mh.maMon}>
								{mh.tenMon}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Divider>Yêu cầu câu hỏi</Divider>

				<Form.List name='danhSachYeuCau'>
					{(fields, { add, remove }) => (
						<>
							{fields.map((field) => (
								<Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
									<Form.Item
										{...field}
										name={[field.name, 'khoiKienThuc']}
										rules={[{ required: true, message: 'Chọn khối!' }]}
									>
										<Select placeholder='Khối KT' style={{ width: 180 }}>
											{danhSachKhoiKT.map((kk) => (
												<Select.Option key={kk.ma} value={kk.ma}>
													{kk.ten}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
									<Form.Item
										{...field}
										name={[field.name, 'mucDoKho']}
										rules={[{ required: true, message: 'Chọn độ khó!' }]}
									>
										<Select placeholder='Mức độ' style={{ width: 140 }}>
											{MUC_DO_KHO_OPTIONS.map((opt) => (
												<Select.Option key={opt.value} value={opt.value}>
													{opt.label}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
									<Form.Item
										{...field}
										name={[field.name, 'soLuong']}
										rules={[{ required: true, message: 'Nhập SL!' }]}
									>
										<InputNumber placeholder='Số lượng' min={1} style={{ width: 100 }} />
									</Form.Item>
									<MinusCircleOutlined onClick={() => remove(field.name)} />
								</Space>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm yêu cầu câu hỏi
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form>
		</Modal>
	);
};

export default CauTrucDe;
