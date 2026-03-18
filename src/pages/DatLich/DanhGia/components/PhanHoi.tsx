import rules from '@/utils/rules';
import { Button, Form, Input, Rate } from 'antd';
import { useModel } from 'umi';

interface PhanHoiProps {
	danhGia?: DanhGia.IRecord;
}

const PhanHoi = ({ danhGia }: PhanHoiProps) => {
	const [form] = Form.useForm();
	const { addPhanHoi, formSubmiting, setVisiblePhanHoi } = useModel('datlich.danhgia');
	const { danhSach: danhSachNhanVien } = useModel('datlich.nhanvien');

	const nhanVien = danhSachNhanVien.find((nv: NhanVien.IRecord) => nv._id === danhGia?.nhanVienId);

	const onFinish = async (values: any) => {
		if (!danhGia?._id) return;

		const phanHoi: DanhGia.IPhanHoi = {
			noiDung: values.noiDung,
			ngayPhanHoi: new Date().toISOString(),
			nguoiPhanHoi: danhGia.nhanVienId,
		};

		await addPhanHoi(danhGia._id, phanHoi);
	};

	return (
		<div>
			<h3 style={{ marginBottom: 24 }}>Phản hồi đánh giá</h3>

			<div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 6 }}>
				<div style={{ marginBottom: 8 }}>
					<strong>Khách hàng:</strong> {danhGia?.khachHang}
				</div>
				<div style={{ marginBottom: 8 }}>
					<strong>Nhân viên:</strong> {nhanVien?.hoTen || '-'}
				</div>
				<div style={{ marginBottom: 8 }}>
					<strong>Điểm đánh giá:</strong> <Rate disabled value={danhGia?.diem} style={{ fontSize: 14 }} />
				</div>
				{danhGia?.noiDung && (
					<div>
						<strong>Nội dung:</strong> {danhGia.noiDung}
					</div>
				)}
			</div>

			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='noiDung' label='Nội dung phản hồi' rules={[...rules.required]}>
					<Input.TextArea rows={4} placeholder='Nhập nội dung phản hồi' />
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						Gửi phản hồi
					</Button>
					<Button onClick={() => setVisiblePhanHoi(false)}>Hủy</Button>
				</div>
			</Form>
		</div>
	);
};

export default PhanHoi;
