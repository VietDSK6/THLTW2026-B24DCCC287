import { ETrangThaiDichVu, TrangThaiDichVuText } from '@/services/DatLich/constant';
import rules from '@/utils/rules';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDichVu = () => {
	const [form] = Form.useForm();
	const { record, edit, postModel, putModel, formSubmiting, setVisibleForm, visibleForm } = useModel('datlich.dichvu');

	useEffect(() => {
		if (visibleForm && record?._id) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DichVu.IRecord) => {
		if (edit && record?._id) {
			await putModel(record._id, values);
		} else {
			await postModel(values);
		}
	};

	return (
		<div>
			<h3 style={{ marginBottom: 24 }}>{edit ? 'Chỉnh sửa dịch vụ' : 'Thêm mới dịch vụ'}</h3>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='ma' label='Mã dịch vụ' rules={[...rules.required]}>
					<Input placeholder='Nhập mã dịch vụ' />
				</Form.Item>

				<Form.Item name='ten' label='Tên dịch vụ' rules={[...rules.required]}>
					<Input placeholder='Nhập tên dịch vụ' />
				</Form.Item>

				<Form.Item name='moTa' label='Mô tả'>
					<Input.TextArea rows={3} placeholder='Nhập mô tả dịch vụ' />
				</Form.Item>

				<Form.Item name='gia' label='Giá (VNĐ)' rules={[...rules.required]}>
					<InputNumber
						min={0}
						step={10000}
						style={{ width: '100%' }}
						formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={(value) => Number(value?.replace(/,/g, '') || 0) as 0}
						placeholder='Nhập giá dịch vụ'
					/>
				</Form.Item>

				<Form.Item name='thoiGianThucHien' label='Thời gian thực hiện (phút)' rules={[...rules.required]}>
					<InputNumber min={1} max={480} style={{ width: '100%' }} placeholder='Nhập thời gian thực hiện' />
				</Form.Item>

				<Form.Item name='trangThai' label='Trạng thái' initialValue={ETrangThaiDichVu.HOAT_DONG}>
					<Select>
						{Object.values(ETrangThaiDichVu).map((status) => (
							<Select.Option key={status} value={status}>
								{TrangThaiDichVuText[status]}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{edit ? 'Cập nhật' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</div>
	);
};

export default FormDichVu;
