import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, Switch } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCauLacBo = (props: { title?: string }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('caulacbo.caulacbo');
	const title = props?.title ?? 'câu lạc bộ';

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngayThanhLap: record.ngayThanhLap ? moment(record.ngayThanhLap) : undefined,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			ngayThanhLap: values.ngayThanhLap?.toISOString(),
		};
		if (edit) {
			putModel(record?._id ?? '', payload);
		} else {
			postModel(payload);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='anhDaiDien' label='Ảnh đại diện'>
					<UploadFile isAvatar accept='image/*' />
				</Form.Item>

				<Form.Item name='tenCLB' label='Tên câu lạc bộ' rules={[...rules.required, ...rules.length(200)]}>
					<Input placeholder='Nhập tên câu lạc bộ' />
				</Form.Item>

				<Form.Item name='ngayThanhLap' label='Ngày thành lập' rules={[...rules.required]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày thành lập' />
				</Form.Item>

				<Form.Item name='chuNhiem' label='Chủ nhiệm CLB' rules={[...rules.required, ...rules.length(100)]}>
					<Input placeholder='Nhập tên chủ nhiệm' />
				</Form.Item>

				<Form.Item name='moTa' label='Mô tả'>
					<TinyEditor height={300} miniToolbar />
				</Form.Item>

				<Form.Item name='hoatDong' label='Hoạt động' valuePropName='checked' initialValue={true}>
					<Switch checkedChildren='Có' unCheckedChildren='Không' />
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

export default FormCauLacBo;
