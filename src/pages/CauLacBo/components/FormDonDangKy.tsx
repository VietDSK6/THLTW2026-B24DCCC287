import { GioiTinhOptions } from '@/services/CauLacBo/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectCauLacBo from './SelectCauLacBo';

const FormDonDangKy = (props: { title?: string }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, isView } =
		useModel('caulacbo.dondangky');
	const title = props?.title ?? 'đơn đăng ký';

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (edit) {
			putModel(record?._id ?? '', values);
		} else {
			postModel(values);
		}
	};

	return (
		<Card title={(isView ? 'Chi tiết ' : edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='hoTen' label='Họ tên' rules={[...rules.required, ...rules.length(100)]}>
					<Input placeholder='Nhập họ tên' disabled={isView} />
				</Form.Item>

				<Form.Item name='email' label='Email' rules={[...rules.required, ...rules.email]}>
					<Input placeholder='Nhập email' disabled={isView} />
				</Form.Item>

				<Form.Item name='soDienThoai' label='Số điện thoại' rules={[...rules.required, ...rules.soDienThoai]}>
					<Input placeholder='Nhập số điện thoại' disabled={isView} />
				</Form.Item>

				<Form.Item name='gioiTinh' label='Giới tính' rules={[...rules.required]}>
					<Select options={GioiTinhOptions} placeholder='Chọn giới tính' disabled={isView} />
				</Form.Item>

				<Form.Item name='diaChi' label='Địa chỉ' rules={[...rules.length(500)]}>
					<Input.TextArea rows={2} placeholder='Nhập địa chỉ' disabled={isView} />
				</Form.Item>

				<Form.Item name='soTruong' label='Sở trường' rules={[...rules.length(500)]}>
					<Input.TextArea rows={2} placeholder='Nhập sở trường' disabled={isView} />
				</Form.Item>

				<Form.Item name='cauLacBoId' label='Câu lạc bộ' rules={[...rules.required]}>
					<SelectCauLacBo disabled={isView} />
				</Form.Item>

				<Form.Item name='lyDoDangKy' label='Lý do đăng ký' rules={[...rules.length(1000)]}>
					<Input.TextArea rows={3} placeholder='Nhập lý do đăng ký' disabled={isView} />
				</Form.Item>

				{!isView && (
					<div className='form-footer'>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit ? 'Thêm mới' : 'Lưu lại'}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					</div>
				)}

				{isView && (
					<div className='form-footer'>
						<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
					</div>
				)}
			</Form>
		</Card>
	);
};

export default FormDonDangKy;
