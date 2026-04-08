import { LOAI_HINH_OPTIONS } from '@/services/DuLich/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Modal, Rate, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDiemDen = () => {
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, edit, postModel, putModel, formSubmiting } = useModel(
		'dulich.diemden' as any,
	);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				chiPhi_anUong: record.chiPhi?.anUong,
				chiPhi_diChuyen: record.chiPhi?.diChuyen,
				chiPhi_luuTru: record.chiPhi?.luuTru,
				chiPhi_veThamQuan: record.chiPhi?.veThamQuan,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload: Partial<DiemDen.IRecord> = {
			ten: values.ten,
			moTa: values.moTa,
			diaDiem: values.diaDiem,
			loaiHinh: values.loaiHinh,
			hinhAnh: values.hinhAnh,
			rating: values.rating,
			thoiGianThamQuan: values.thoiGianThamQuan,
			chiPhi: {
				anUong: values.chiPhi_anUong || 0,
				diChuyen: values.chiPhi_diChuyen || 0,
				luuTru: values.chiPhi_luuTru || 0,
				veThamQuan: values.chiPhi_veThamQuan || 0,
			},
		};

		if (edit && record?._id) {
			await putModel(record._id, payload);
		} else {
			await postModel(payload);
		}
	};

	return (
		<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} width={700} destroyOnClose>
			<Card title={edit ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'} bordered={false}>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item name='ten' label='Tên điểm đến' rules={[...rules.required]}>
								<Input placeholder='Nhập tên điểm đến' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='diaDiem' label='Địa điểm' rules={[...rules.required]}>
								<Input placeholder='Nhập địa điểm' />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item name='loaiHinh' label='Loại hình' rules={[...rules.required]}>
								<Select placeholder='Chọn loại hình' options={LOAI_HINH_OPTIONS} />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='rating' label='Đánh giá' rules={[...rules.required]}>
								<Rate allowHalf />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item name='hinhAnh' label='Link hình ảnh' rules={[...rules.required]}>
						<Input placeholder='Nhập URL hình ảnh' />
					</Form.Item>

					<Form.Item name='moTa' label='Mô tả'>
						<Input.TextArea rows={3} placeholder='Nhập mô tả điểm đến' />
					</Form.Item>

					<Form.Item name='thoiGianThamQuan' label='Thời gian tham quan (giờ)' rules={[...rules.required]}>
						<InputNumber min={1} max={48} style={{ width: '100%' }} placeholder='Nhập số giờ' />
					</Form.Item>

					<Card title='Chi phí ước tính' size='small' style={{ marginBottom: 16 }}>
						<Row gutter={16}>
							<Col xs={12} md={6}>
								<Form.Item name='chiPhi_anUong' label='Ăn uống'>
									<InputNumber
										min={0}
										step={50000}
										style={{ width: '100%' }}
										formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
									/>
								</Form.Item>
							</Col>
							<Col xs={12} md={6}>
								<Form.Item name='chiPhi_diChuyen' label='Di chuyển'>
									<InputNumber
										min={0}
										step={50000}
										style={{ width: '100%' }}
										formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
									/>
								</Form.Item>
							</Col>
							<Col xs={12} md={6}>
								<Form.Item name='chiPhi_luuTru' label='Lưu trú'>
									<InputNumber
										min={0}
										step={50000}
										style={{ width: '100%' }}
										formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
									/>
								</Form.Item>
							</Col>
							<Col xs={12} md={6}>
								<Form.Item name='chiPhi_veThamQuan' label='Vé tham quan'>
									<InputNumber
										min={0}
										step={50000}
										style={{ width: '100%' }}
										formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Card>

					<div className='form-footer'>
						<Button type='primary' htmlType='submit' loading={formSubmiting}>
							{edit ? 'Cập nhật' : 'Thêm mới'}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					</div>
				</Form>
			</Card>
		</Modal>
	);
};

export default FormDiemDen;
