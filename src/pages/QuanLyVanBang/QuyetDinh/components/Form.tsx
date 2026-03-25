import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectSoVanBang from './SelectSoVanBang';

const FormQuyetDinh = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'quanlyvanbang.quyetdinh' as any,
	);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngayBanHanh: record.ngayBanHanh ? moment(record.ngayBanHanh) : undefined,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			ngayBanHanh: values.ngayBanHanh ? values.ngayBanHanh.format('YYYY-MM-DD') : undefined,
		};
		if (edit) {
			putModel(record?._id ?? '', payload);
		} else {
			postModel(payload);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa' : 'Thêm mới') + ' quyết định tốt nghiệp'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='soVanBangId' label='Sổ văn bằng' rules={[...rules.required]}>
					<SelectSoVanBang />
				</Form.Item>

				<Form.Item name='soQuyetDinh' label='Số quyết định' rules={[...rules.required, ...rules.length(100)]}>
					<Input placeholder='VD: 123/QĐ-ĐHV' />
				</Form.Item>

				<Form.Item name='ngayBanHanh' label='Ngày ban hành' rules={[...rules.required]}>
					<DatePicker placeholder='Chọn ngày ban hành' style={{ width: '100%' }} format='DD/MM/YYYY' />
				</Form.Item>

				<Form.Item name='trichYeu' label='Trích yếu' rules={[...rules.required, ...rules.length(500)]}>
					<TextArea rows={3} placeholder='Mô tả nội dung quyết định' />
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

export default FormQuyetDinh;
