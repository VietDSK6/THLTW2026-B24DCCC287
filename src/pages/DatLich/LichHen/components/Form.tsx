import { ETrangThaiDichVu, ETrangThaiNhanVien } from '@/services/DatLich/constant';
import rules from '@/utils/rules';
import { Button, Col, DatePicker, Form, Input, message, Row, Select, TimePicker } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';

const FormLichHen = () => {
	const [form] = Form.useForm();
	const {
		record,
		edit,
		postModel,
		putModel,
		formSubmiting,
		setVisibleForm,
		visibleForm,
		checkTrungLich,
		countLichHenByNhanVien,
	} = useModel('datlich.lichhen');
	const { danhSach: danhSachNhanVien } = useModel('datlich.nhanvien');
	const { danhSach: danhSachDichVu } = useModel('datlich.dichvu');

	const [selectedDichVu, setSelectedDichVu] = useState<string[]>([]);
	const [, setSelectedNhanVien] = useState<string | undefined>();
	const [, setSelectedNgay] = useState<moment.Moment | undefined>();

	const dichVuHoatDong = useMemo(() => {
		return danhSachDichVu.filter((dv: DichVu.IRecord) => dv.trangThai === ETrangThaiDichVu.HOAT_DONG);
	}, [danhSachDichVu]);

	const nhanVienKhaDung = useMemo(() => {
		if (!selectedDichVu.length) return [];
		return danhSachNhanVien.filter(
			(nv: NhanVien.IRecord) =>
				nv.trangThai === ETrangThaiNhanVien.HOAT_DONG && selectedDichVu.every((dvId) => nv.dichVu?.includes(dvId)),
		);
	}, [danhSachNhanVien, selectedDichVu]);

	const tongTien = useMemo(() => {
		return selectedDichVu.reduce((sum, dvId) => {
			const dv = danhSachDichVu.find((d: DichVu.IRecord) => d._id === dvId);
			return sum + (dv?.gia || 0);
		}, 0);
	}, [selectedDichVu, danhSachDichVu]);

	const tongThoiGian = useMemo(() => {
		return selectedDichVu.reduce((sum, dvId) => {
			const dv = danhSachDichVu.find((d: DichVu.IRecord) => d._id === dvId);
			return sum + (dv?.thoiGianThucHien || 0);
		}, 0);
	}, [selectedDichVu, danhSachDichVu]);

	useEffect(() => {
		if (visibleForm && record?._id) {
			form.setFieldsValue({
				...record,
				ngayHen: record.ngayHen ? moment(record.ngayHen) : undefined,
				gioHen: record.gioHen ? moment(record.gioHen, 'HH:mm') : undefined,
			});
			setSelectedDichVu(record.dichVuIds || []);
			setSelectedNhanVien(record.nhanVienId);
			setSelectedNgay(record.ngayHen ? moment(record.ngayHen) : undefined);
		} else {
			form.resetFields();
			setSelectedDichVu([]);
			setSelectedNhanVien(undefined);
			setSelectedNgay(undefined);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const ngayHen = values.ngayHen?.format('YYYY-MM-DD');
		const gioHen = values.gioHen?.format('HH:mm');

		if (checkTrungLich(values.nhanVienId, ngayHen, gioHen, record?._id)) {
			message.error('Nhân viên đã có lịch hẹn vào thời gian này!');
			return;
		}

		const nhanVien = danhSachNhanVien.find((nv: NhanVien.IRecord) => nv._id === values.nhanVienId);
		if (nhanVien) {
			const soLichHienTai = countLichHenByNhanVien(values.nhanVienId, ngayHen);
			if (!edit && soLichHienTai >= nhanVien.soKhachToiDa) {
				message.error(`Nhân viên đã đạt giới hạn ${nhanVien.soKhachToiDa} khách trong ngày!`);
				return;
			}

			const ngayIndex = moment(ngayHen).day();
			const lichLamViec = nhanVien.lichLamViec?.find((l: NhanVien.ILichLamViec) => l.thu === ngayIndex);
			if (!lichLamViec || lichLamViec.nghiPhep) {
				message.error('Nhân viên không làm việc vào ngày này!');
				return;
			}

			const gioHenMoment = moment(gioHen, 'HH:mm');
			const gioMoCua = moment(lichLamViec.gioMoCua, 'HH:mm');
			const gioDongCua = moment(lichLamViec.gioDongCua, 'HH:mm');
			if (gioHenMoment.isBefore(gioMoCua) || gioHenMoment.isAfter(gioDongCua)) {
				message.error(`Nhân viên chỉ làm việc từ ${lichLamViec.gioMoCua} đến ${lichLamViec.gioDongCua}!`);
				return;
			}
		}

		const payload = {
			khachHang: {
				hoTen: values.hoTen,
				soDienThoai: values.soDienThoai,
				email: values.email,
			},
			nhanVienId: values.nhanVienId,
			dichVuIds: values.dichVuIds,
			ngayHen,
			gioHen,
			tongTien,
			tongThoiGian,
			ghiChu: values.ghiChu,
		};

		if (edit && record?._id) {
			await putModel(record._id, payload);
		} else {
			await postModel(payload);
		}
	};

	const handleDichVuChange = (values: string[]) => {
		setSelectedDichVu(values);
		form.setFieldsValue({ nhanVienId: undefined });
		setSelectedNhanVien(undefined);
	};

	const disabledDate = (current: moment.Moment) => {
		return current && current < moment().startOf('day');
	};

	return (
		<div>
			<h3 style={{ marginBottom: 24 }}>{edit ? 'Chỉnh sửa lịch hẹn' : 'Đặt lịch hẹn mới'}</h3>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
					<strong>Thông tin khách hàng</strong>
				</div>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='hoTen' label='Họ tên khách hàng' rules={[...rules.required]}>
							<Input placeholder='Nhập họ tên' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='soDienThoai' label='Số điện thoại' rules={[...rules.required]}>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name='email' label='Email'>
					<Input placeholder='Nhập email (không bắt buộc)' />
				</Form.Item>

				<div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
					<strong>Thông tin lịch hẹn</strong>
				</div>

				<Form.Item name='dichVuIds' label='Chọn dịch vụ' rules={[...rules.required]}>
					<Select mode='multiple' placeholder='Chọn dịch vụ' onChange={handleDichVuChange} allowClear>
						{dichVuHoatDong.map((dv: DichVu.IRecord) => (
							<Select.Option key={dv._id} value={dv._id}>
								{dv.ten} - {dv.gia?.toLocaleString('vi-VN')}đ ({dv.thoiGianThucHien} phút)
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				{selectedDichVu.length > 0 && (
					<div style={{ marginBottom: 16, padding: 8, background: '#e6f7ff', borderRadius: 4 }}>
						<strong>Tổng tiền:</strong> {tongTien.toLocaleString('vi-VN')} đ | <strong>Thời gian:</strong>{' '}
						{tongThoiGian} phút
					</div>
				)}

				<Form.Item name='nhanVienId' label='Chọn nhân viên' rules={[...rules.required]}>
					<Select
						placeholder={selectedDichVu.length ? 'Chọn nhân viên' : 'Vui lòng chọn dịch vụ trước'}
						disabled={!selectedDichVu.length}
						onChange={(val) => setSelectedNhanVien(val)}
						allowClear
					>
						{nhanVienKhaDung.map((nv: NhanVien.IRecord) => (
							<Select.Option key={nv._id} value={nv._id}>
								{nv.hoTen} - Tối đa {nv.soKhachToiDa} khách/ngày
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='ngayHen' label='Ngày hẹn' rules={[...rules.required]}>
							<DatePicker
								format='DD/MM/YYYY'
								style={{ width: '100%' }}
								placeholder='Chọn ngày'
								disabledDate={disabledDate}
								onChange={(date) => setSelectedNgay(date || undefined)}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='gioHen' label='Giờ hẹn' rules={[...rules.required]}>
							<TimePicker format='HH:mm' style={{ width: '100%' }} placeholder='Chọn giờ' minuteStep={15} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='ghiChu' label='Ghi chú'>
					<Input.TextArea rows={2} placeholder='Ghi chú thêm (không bắt buộc)' />
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{edit ? 'Cập nhật' : 'Đặt lịch'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</div>
	);
};

export default FormLichHen;
