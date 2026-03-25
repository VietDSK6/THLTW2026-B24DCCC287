import { KIEU_DU_LIEU_OPTIONS } from '@/services/QuanLyVanBang/CauHinhBieuMau/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Form, Input, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCauHinhBieuMau = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'quanlyvanbang.cauhinhbieumau' as any,
	);

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
		<Card title={(edit ? 'Chỉnh sửa' : 'Thêm mới') + ' trường thông tin'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='tenTruong' label='Tên trường' rules={[...rules.required, ...rules.length(100)]}>
					<Input placeholder='VD: Dân tộc, Điểm trung bình' />
				</Form.Item>

				<Form.Item
					name='maTruong'
					label='Mã trường (slug)'
					rules={[...rules.required, ...rules.length(50)]}
					tooltip='Tên biến lưu trữ, không dấu, viết liền, VD: danToc, diemTrungBinh'
				>
					<Input placeholder='VD: danToc, diemTB' />
				</Form.Item>

				<Form.Item name='kieuDuLieu' label='Kiểu dữ liệu' rules={[...rules.required]}>
					<Select options={KIEU_DU_LIEU_OPTIONS} placeholder='Chọn kiểu dữ liệu' />
				</Form.Item>

				<Form.Item name='batBuoc' valuePropName='checked' initialValue={false}>
					<Checkbox>Bắt buộc nhập</Checkbox>
				</Form.Item>

				<Form.Item name='ghiChu' label='Ghi chú'>
					<TextArea rows={2} placeholder='Ghi chú về trường thông tin này' />
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

export default FormCauHinhBieuMau;
