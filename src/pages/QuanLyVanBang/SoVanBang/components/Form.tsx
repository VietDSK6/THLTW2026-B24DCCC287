import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, InputNumber } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSoVanBang = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'quanlyvanbang.sovanbang' as any,
	);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngayMoSo: record.ngayMoSo ? moment(record.ngayMoSo) : undefined,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			ngayMoSo: values.ngayMoSo ? values.ngayMoSo.format('YYYY-MM-DD') : undefined,
		};
		if (edit) {
			putModel(record?._id ?? '', payload);
		} else {
			postModel(payload);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa' : 'Thêm mới') + ' sổ văn bằng'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='namSo' label='Năm sổ' rules={[...rules.required]}>
					<InputNumber placeholder='Năm sổ' style={{ width: '100%' }} min={2000} max={2100} />
				</Form.Item>

				<Form.Item name='tenSo' label='Tên sổ' rules={[...rules.required, ...rules.length(250)]}>
					<Input placeholder='Tên sổ văn bằng' />
				</Form.Item>

				<Form.Item name='tienToSoHieu' label='Tiền tố số hiệu' rules={[...rules.required, ...rules.length(20)]}>
					<Input placeholder='VD: SH2024' />
				</Form.Item>

				<Form.Item name='ngayMoSo' label='Ngày mở sổ' rules={[...rules.required]}>
					<DatePicker placeholder='Chọn ngày mở sổ' style={{ width: '100%' }} format='DD/MM/YYYY' />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormSoVanBang;
