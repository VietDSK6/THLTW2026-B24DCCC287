import { ELoaiBaiTap, ETrangThaiBuoiTap, LoaiBaiTapText, TrangThaiBuoiTapText } from '@/services/TheDuc/constant';
import rules from '@/utils/rules';
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormBuoiTap = () => {
	const [form] = Form.useForm();
	const { record, edit, postModel, putModel, formSubmiting, setVisibleForm, visibleForm } = useModel('theduc.buoitap');

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
			<h3 style={{ marginBottom: 24 }}>{edit ? 'Chỉnh sửa buổi tập' : 'Thêm mới buổi tập'}</h3>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='ngay' label='Ngày tập' rules={[...rules.required]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item name='loaiBaiTap' label='Loại bài tập' rules={[...rules.required]}>
					<Select placeholder='Chọn loại bài tập'>
						{Object.values(ELoaiBaiTap).map((status) => (
							<Select.Option key={status} value={status}>
								{LoaiBaiTapText[status]}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='thoiLuong' label='Thời lượng (phút)' rules={[...rules.required]}>
					<InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập thời lượng' />
				</Form.Item>

				<Form.Item name='calo' label='Calo đốt' rules={[...rules.required]}>
					<InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập số calo' />
				</Form.Item>

				<Form.Item name='ghiChu' label='Ghi chú'>
					<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
				</Form.Item>

				<Form.Item name='trangThai' label='Trạng thái' initialValue={ETrangThaiBuoiTap.HOAN_THANH}>
					<Select>
						{Object.values(ETrangThaiBuoiTap).map((status) => (
							<Select.Option key={status} value={status}>
								{TrangThaiBuoiTapText[status]}
							</Select.Option>
						))}
					</Select>
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

export default FormBuoiTap;
