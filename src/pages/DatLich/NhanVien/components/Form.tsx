import {
	ETrangThaiNhanVien,
	GioLamViecMacDinh,
	ThuTrongTuan,
	TrangThaiNhanVienText,
} from '@/services/DatLich/constant';
import rules from '@/utils/rules';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select, TimePicker } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormNhanVien = () => {
	const [form] = Form.useForm();
	const { record, edit, postModel, putModel, formSubmiting, setVisibleForm, visibleForm } =
		useModel('datlich.nhanvien');
	const { danhSach: danhSachDichVu } = useModel('datlich.dichvu');

	useEffect(() => {
		if (visibleForm && record?._id) {
			const lichLamViecFormatted = record.lichLamViec?.map((item) => ({
				...item,
				gioMoCua: item.gioMoCua ? moment(item.gioMoCua, 'HH:mm') : undefined,
				gioDongCua: item.gioDongCua ? moment(item.gioDongCua, 'HH:mm') : undefined,
			}));
			form.setFieldsValue({
				...record,
				lichLamViec: lichLamViecFormatted,
			});
		} else {
			const defaultLichLamViec = Array.from({ length: 7 }, (_, i) => ({
				thu: i,
				gioMoCua: moment(GioLamViecMacDinh.gioMoCua, 'HH:mm'),
				gioDongCua: moment(GioLamViecMacDinh.gioDongCua, 'HH:mm'),
				nghiPhep: i === 0,
			}));
			form.setFieldsValue({ lichLamViec: defaultLichLamViec });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const lichLamViec = values.lichLamViec?.map((item: any) => ({
			...item,
			gioMoCua: item.gioMoCua?.format('HH:mm'),
			gioDongCua: item.gioDongCua?.format('HH:mm'),
		}));

		const payload = { ...values, lichLamViec };

		if (edit && record?._id) {
			await putModel(record._id, payload);
		} else {
			await postModel(payload);
		}
	};

	return (
		<div>
			<h3 style={{ marginBottom: 24 }}>{edit ? 'Chỉnh sửa nhân viên' : 'Thêm mới nhân viên'}</h3>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='ma' label='Mã nhân viên' rules={[...rules.required]}>
							<Input placeholder='Nhập mã nhân viên' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='hoTen' label='Họ tên' rules={[...rules.required]}>
							<Input placeholder='Nhập họ tên' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='soDienThoai' label='Số điện thoại' rules={[...rules.required]}>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='email' label='Email'>
							<Input placeholder='Nhập email' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='soKhachToiDa' label='Số khách tối đa/ngày' rules={[...rules.required]}>
							<InputNumber min={1} max={50} style={{ width: '100%' }} placeholder='Nhập số khách tối đa' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='trangThai' label='Trạng thái' initialValue={ETrangThaiNhanVien.HOAT_DONG}>
							<Select>
								{Object.values(ETrangThaiNhanVien).map((status) => (
									<Select.Option key={status} value={status}>
										{TrangThaiNhanVienText[status]}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='dichVu' label='Dịch vụ có thể thực hiện' rules={[...rules.required]}>
					<Select mode='multiple' placeholder='Chọn dịch vụ' allowClear>
						{danhSachDichVu.map((dv) => (
							<Select.Option key={dv._id} value={dv._id}>
								{dv.ten}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<div style={{ marginBottom: 8, fontWeight: 500 }}>Lịch làm việc</div>
				<div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: 12, marginBottom: 16 }}>
					{ThuTrongTuan.map((thu, index) => (
						<Row key={index} gutter={8} align='middle' style={{ marginBottom: index < 6 ? 8 : 0 }}>
							<Col span={5}>
								<span style={{ fontWeight: 500 }}>{thu}</span>
							</Col>
							<Col span={5}>
								<Form.Item name={['lichLamViec', index, 'nghiPhep']} valuePropName='checked' noStyle>
									<Checkbox>Nghỉ</Checkbox>
								</Form.Item>
							</Col>
							<Col span={7}>
								<Form.Item name={['lichLamViec', index, 'gioMoCua']} noStyle>
									<TimePicker format='HH:mm' placeholder='Giờ bắt đầu' style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col span={7}>
								<Form.Item name={['lichLamViec', index, 'gioDongCua']} noStyle>
									<TimePicker format='HH:mm' placeholder='Giờ kết thúc' style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Form.Item name={['lichLamViec', index, 'thu']} initialValue={index} hidden>
								<Input />
							</Form.Item>
						</Row>
					))}
				</div>

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

export default FormNhanVien;
