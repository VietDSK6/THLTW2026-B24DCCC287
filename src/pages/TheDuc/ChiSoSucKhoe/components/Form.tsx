import rules from '@/utils/rules';
import { Button, DatePicker, Form, InputNumber } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormChiSo = () => {
	const [form] = Form.useForm();
	const { record, edit, postModel, putModel, formSubmiting, setVisibleForm, visibleForm } = useModel('theduc.chisosuckhoe');

	useEffect(() => {
		if (visibleForm && record?._id) {
			form.setFieldsValue({
				...record,
				ngay: moment(record.ngay),
			});
		} else {
			form.resetFields();
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			ngay: values.ngay.toISOString(),
		};
		if (edit && record?._id) {
			await putModel(record._id, payload);
		} else {
			await postModel(payload);
		}
	};

	return (
		<div>
			<h3 style={{ marginBottom: 24 }}>{edit ? 'Chỉnh sửa chỉ số' : 'Thêm mới chỉ số'}</h3>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='ngay' label='Ngày đo' rules={[...rules.required]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item name='canNang' label='Cân nặng (kg)' rules={[...rules.required]}>
					<InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập cân nặng' />
				</Form.Item>

				<Form.Item name='chieuCao' label='Chiều cao (cm)' rules={[...rules.required]}>
					<InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập chiều cao' />
				</Form.Item>

				<Form.Item name='nhipTim' label='Nhịp tim lúc nghỉ (bpm)'>
					<InputNumber min={30} max={200} style={{ width: '100%' }} placeholder='Nhập nhịp tim' />
				</Form.Item>

				<Form.Item name='gioNgu' label='Giờ ngủ'>
					<InputNumber min={0} max={24} style={{ width: '100%' }} placeholder='Nhập số giờ ngủ' />
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{edit ? 'Cập nhật' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisibleForm(false)} style={{ marginLeft: 8 }}>Hủy</Button>
				</div>
			</Form>
		</div>
	);
};

export default FormChiSo;
