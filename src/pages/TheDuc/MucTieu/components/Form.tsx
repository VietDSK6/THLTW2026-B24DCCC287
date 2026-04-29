import { ELoaiMucTieu, ETrangThaiMucTieu, LoaiMucTieuText, TrangThaiMucTieuText } from '@/services/TheDuc/constant';
import rules from '@/utils/rules';
import { Button, DatePicker, Form, Input, InputNumber, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormMucTieu = () => {
	const [form] = Form.useForm();
	const { postModel, formSubmiting, setVisibleForm } = useModel('theduc.muctieu');

	useEffect(() => {
		form.resetFields();
	}, []);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			deadline: values.deadline.toISOString(),
		};
		await postModel(payload);
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
			<Form.Item name='ten' label='Tên mục tiêu' rules={[...rules.required]}>
				<Input placeholder='Nhập tên mục tiêu' />
			</Form.Item>

			<Form.Item name='loai' label='Phân loại' rules={[...rules.required]}>
				<Select placeholder='Chọn phân loại'>
					{Object.values(ELoaiMucTieu).map((val) => (
						<Select.Option key={val} value={val}>
							{LoaiMucTieuText[val]}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item name='giaTriMucTieu' label='Giá trị đích' rules={[...rules.required]}>
				<InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập giá trị cần đạt được' />
			</Form.Item>

			<Form.Item name='deadline' label='Thời hạn hoàn thành' rules={[...rules.required]}>
				<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item name='trangThai' label='Trạng thái ban đầu' initialValue={ETrangThaiMucTieu.DANG_THUC_HIEN}>
				<Select>
					{Object.values(ETrangThaiMucTieu).map((val) => (
						<Select.Option key={val} value={val}>
							{TrangThaiMucTieuText[val]}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<div style={{ position: 'absolute', bottom: 0, width: '100%', borderTop: '1px solid #e8e8e8', padding: '10px 16px', textAlign: 'right', left: 0, background: '#fff' }}>
				<Space>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						Thêm mới
					</Button>
				</Space>
			</div>
		</Form>
	);
};

export default FormMucTieu;
