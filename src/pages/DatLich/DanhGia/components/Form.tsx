import rules from '@/utils/rules';
import { Button, Form, Input, Rate, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

interface FormDanhGiaProps {
	lichHenList: LichHen.IRecord[];
}

const FormDanhGia = ({ lichHenList }: FormDanhGiaProps) => {
	const [form] = Form.useForm();
	const { postModel, formSubmiting, setVisibleForm, visibleForm } = useModel('datlich.danhgia');
	const { danhSach: danhSachNhanVien } = useModel('datlich.nhanvien');
	const { danhSach: danhSachDichVu } = useModel('datlich.dichvu');

	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
		}
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		const lichHen = lichHenList.find((lh) => lh._id === values.lichHenId);
		if (!lichHen) return;

		const payload = {
			lichHenId: values.lichHenId,
			nhanVienId: lichHen.nhanVienId,
			dichVuIds: lichHen.dichVuIds,
			khachHang: lichHen.khachHang.hoTen,
			diem: values.diem,
			noiDung: values.noiDung,
		};

		await postModel(payload);
	};

	const handleLichHenChange = (lichHenId: string) => {
		const lichHen = lichHenList.find((lh) => lh._id === lichHenId);
		if (lichHen) {
			const nhanVien = danhSachNhanVien.find((nv: NhanVien.IRecord) => nv._id === lichHen.nhanVienId);
			const dichVuNames = lichHen.dichVuIds
				.map((id) => danhSachDichVu.find((dv: DichVu.IRecord) => dv._id === id)?.ten)
				.filter(Boolean)
				.join(', ');

			form.setFieldsValue({
				nhanVienDisplay: nhanVien?.hoTen || '-',
				dichVuDisplay: dichVuNames || '-',
				khachHangDisplay: lichHen.khachHang.hoTen,
			});
		}
	};

	return (
		<div>
			<h3 style={{ marginBottom: 24 }}>Thêm đánh giá</h3>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='lichHenId' label='Chọn lịch hẹn đã hoàn thành' rules={[...rules.required]}>
					<Select placeholder='Chọn lịch hẹn' onChange={handleLichHenChange}>
						{lichHenList.map((lh) => (
							<Select.Option key={lh._id} value={lh._id}>
								{lh.ma} - {lh.khachHang.hoTen} ({lh.ngayHen})
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='khachHangDisplay' label='Khách hàng'>
					<Input disabled />
				</Form.Item>

				<Form.Item name='nhanVienDisplay' label='Nhân viên phục vụ'>
					<Input disabled />
				</Form.Item>

				<Form.Item name='dichVuDisplay' label='Dịch vụ'>
					<Input disabled />
				</Form.Item>

				<Form.Item name='diem' label='Điểm đánh giá' rules={[...rules.required]} initialValue={5}>
					<Rate />
				</Form.Item>

				<Form.Item name='noiDung' label='Nội dung đánh giá'>
					<Input.TextArea rows={3} placeholder='Nhập nội dung đánh giá (không bắt buộc)' />
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						Gửi đánh giá
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</div>
	);
};

export default FormDanhGia;
