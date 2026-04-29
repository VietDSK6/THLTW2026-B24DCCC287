import { EMucDoKho, ENhomCo, MucDoKhoText, NhomCoText } from '@/services/TheDuc/constant';
import rules from '@/utils/rules';
import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormBaiTap = () => {
	const [form] = Form.useForm();
	const { record, edit, postModel, putModel, formSubmiting, setVisibleForm, visibleForm } = useModel('theduc.baitap');

	useEffect(() => {
		if (visibleForm && record?._id) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (edit && record?._id) {
			await putModel(record._id, values);
		} else {
			await postModel(values);
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
			<Form.Item name='ten' label='Tên bài tập' rules={[...rules.required]}>
				<Input placeholder='Nhập tên bài tập' />
			</Form.Item>

			<Space style={{ display: 'flex' }}>
				<Form.Item name='nhomCo' label='Nhóm cơ' rules={[...rules.required]} style={{ width: '100%' }}>
					<Select placeholder='Chọn nhóm cơ'>
						{Object.entries(NhomCoText).map(([key, value]) => (
							<Select.Option key={key} value={key}>
								{value}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='mucDoKho' label='Mức độ khó' rules={[...rules.required]} style={{ width: '100%' }}>
					<Select placeholder='Chọn mức độ khó'>
						{Object.entries(MucDoKhoText).map(([key, value]) => (
							<Select.Option key={key} value={key}>
								{value}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Space>

			<Form.Item name='caloTrungBinh' label='Calo đốt trung bình (1 giờ)' rules={[...rules.required]}>
				<InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập calo trung bình' />
			</Form.Item>

			<Form.Item name='moTa' label='Mô tả ngắn' rules={[...rules.required]}>
				<Input.TextArea rows={2} placeholder='Nhập mô tả ngắn' />
			</Form.Item>

			<Form.Item name='huongDan' label='Hướng dẫn thực hiện' rules={[...rules.required]}>
				<Input.TextArea rows={5} placeholder='Nhập hướng dẫn chi tiết các bước' />
			</Form.Item>

			<div style={{ textAlign: 'right' }}>
				<Space>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{edit ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</Space>
			</div>
		</Form>
	);
};

export default FormBaiTap;
