import * as CauHinhBieuMauService from '@/services/QuanLyVanBang/CauHinhBieuMau';
import * as QuyetDinhService from '@/services/QuanLyVanBang/QuyetDinh';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, InputNumber } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectQuyetDinh from './SelectQuyetDinh';

const FormThongTinVanBang = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'quanlyvanbang.thongtinvanbang' as any,
	);

	const [selectedQuyetDinhId, setSelectedQuyetDinhId] = useState<string>();
	const [cauHinhFields, setCauHinhFields] = useState<CauHinhBieuMau.IRecord[]>([]);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedQuyetDinhId(undefined);
			setCauHinhFields([]);
		} else if (record?._id) {
			setSelectedQuyetDinhId(record.quyetDinhId);
			loadCauHinh(record.quyetDinhId);

			const formValues: any = {
				quyetDinhId: record.quyetDinhId,
				maSinhVien: record.maSinhVien,
				hoTen: record.hoTen,
				ngaySinh: record.ngaySinh ? moment(record.ngaySinh) : undefined,
				ngayCap: record.ngayCap ? moment(record.ngayCap) : undefined,
				nguoiCap: record.nguoiCap,
			};

			Object.keys(record.dynamicData || {}).forEach((key) => {
				const fieldConfig = cauHinhFields.find((f) => f.maTruong === key);
				if (fieldConfig?.kieuDuLieu === 'Date') {
					formValues[key] = record.dynamicData[key] ? moment(record.dynamicData[key]) : undefined;
				} else {
					formValues[key] = record.dynamicData[key];
				}
			});

			form.setFieldsValue(formValues);
		}
	}, [record?._id, visibleForm]);

	const loadCauHinh = (quyetDinhId: string) => {
		const quyetDinh = QuyetDinhService.getById(quyetDinhId);
		if (quyetDinh) {
			const fields = CauHinhBieuMauService.getBySoVanBangId(quyetDinh.soVanBangId);
			const customFields = fields.filter((f) => !f.laMacDinh);
			setCauHinhFields(customFields);
		}
	};

	const handleQuyetDinhChange = (value: string) => {
		setSelectedQuyetDinhId(value);
		loadCauHinh(value);
		form.resetFields(cauHinhFields.map((f) => f.maTruong));
	};

	const renderDynamicField = (field: CauHinhBieuMau.IRecord) => {
		const commonRules = field.batBuoc ? [...rules.required] : [];

		switch (field.kieuDuLieu) {
			case 'String':
				return (
					<Form.Item
						key={field._id}
						name={field.maTruong}
						label={field.tenTruong}
						rules={[...commonRules, ...rules.length(250)]}
						tooltip={field.ghiChu}
					>
						<Input placeholder={`Nhập ${field.tenTruong.toLowerCase()}`} />
					</Form.Item>
				);

			case 'Number':
				return (
					<Form.Item
						key={field._id}
						name={field.maTruong}
						label={field.tenTruong}
						rules={commonRules}
						tooltip={field.ghiChu}
					>
						<InputNumber placeholder={`Nhập ${field.tenTruong.toLowerCase()}`} style={{ width: '100%' }} />
					</Form.Item>
				);

			case 'Date':
				return (
					<Form.Item
						key={field._id}
						name={field.maTruong}
						label={field.tenTruong}
						rules={commonRules}
						tooltip={field.ghiChu}
					>
						<DatePicker
							placeholder={`Chọn ${field.tenTruong.toLowerCase()}`}
							style={{ width: '100%' }}
							format='DD/MM/YYYY'
						/>
					</Form.Item>
				);

			default:
				return null;
		}
	};

	const onFinish = async (values: any) => {
		const dynamicData: Record<string, any> = {};

		cauHinhFields.forEach((field) => {
			if (values[field.maTruong] !== undefined) {
				if (field.kieuDuLieu === 'Date') {
					dynamicData[field.maTruong] = values[field.maTruong]
						? values[field.maTruong].format('YYYY-MM-DD')
						: undefined;
				} else {
					dynamicData[field.maTruong] = values[field.maTruong];
				}
			}
		});

		const payload = {
			quyetDinhId: values.quyetDinhId,
			maSinhVien: values.maSinhVien,
			hoTen: values.hoTen,
			ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : undefined,
			ngayCap: values.ngayCap ? values.ngayCap.format('YYYY-MM-DD') : undefined,
			nguoiCap: values.nguoiCap,
			dynamicData,
		};

		if (edit) {
			putModel(record?._id ?? '', payload);
		} else {
			postModel(payload);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa' : 'Thêm mới') + ' thông tin văn bằng'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='quyetDinhId' label='Quyết định tốt nghiệp' rules={[...rules.required]}>
					<SelectQuyetDinh onChange={handleQuyetDinhChange} disabled={edit} />
				</Form.Item>

				<div
					style={{
						background: '#f5f5f5',
						padding: 16,
						marginBottom: 16,
						borderRadius: 4,
					}}
				>
					<h4 style={{ marginTop: 0 }}>Thông tin cơ bản</h4>

					<Form.Item name='maSinhVien' label='Mã sinh viên' rules={[...rules.required, ...rules.length(50)]}>
						<Input placeholder='Nhập mã sinh viên' />
					</Form.Item>

					<Form.Item name='hoTen' label='Họ tên' rules={[...rules.required, ...rules.length(250)]}>
						<Input placeholder='Nhập họ tên sinh viên' />
					</Form.Item>

					<Form.Item name='ngaySinh' label='Ngày sinh' rules={[...rules.required]}>
						<DatePicker placeholder='Chọn ngày sinh' style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>
				</div>

				{cauHinhFields.length > 0 && (
					<div
						style={{
							background: '#f0f9ff',
							padding: 16,
							marginBottom: 16,
							borderRadius: 4,
						}}
					>
						<h4 style={{ marginTop: 0 }}>Thông tin bổ sung</h4>
						{cauHinhFields.map((field) => renderDynamicField(field))}
					</div>
				)}

				<div
					style={{
						background: '#f5f5f5',
						padding: 16,
						marginBottom: 16,
						borderRadius: 4,
					}}
				>
					<h4 style={{ marginTop: 0 }}>Thông tin cấp phát</h4>

					<Form.Item name='ngayCap' label='Ngày cấp' rules={[...rules.required]}>
						<DatePicker placeholder='Chọn ngày cấp' style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>

					<Form.Item name='nguoiCap' label='Người cấp' rules={[...rules.length(250)]}>
						<Input placeholder='Nhập tên người cấp' />
					</Form.Item>
				</div>

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

export default FormThongTinVanBang;
