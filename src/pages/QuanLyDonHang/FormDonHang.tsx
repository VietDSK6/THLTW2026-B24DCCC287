import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Table, Tag } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';
import { DANH_SACH_KHACH_HANG, DANH_SACH_SAN_PHAM, TRANG_THAI_OPTIONS } from '@/services/QuanLyDonHang/constants';

const { Option } = Select;

interface FormDonHangProps {
	visible: boolean;
	isEdit: boolean;
	initialValues?: QuanLyDonHang.DonHang;
	onCancel: () => void;
	onSubmit: (values: Omit<QuanLyDonHang.DonHang, 'maDonHang'>) => void;
}

const FormDonHang: FC<FormDonHangProps> = ({ visible, isEdit, initialValues, onCancel, onSubmit }) => {
	const [form] = Form.useForm();
	const watchedDanhSachSanPham = Form.useWatch('danhSachSanPham', form);
	const danhSachSanPham: QuanLyDonHang.SanPhamTrongDon[] = Array.isArray(watchedDanhSachSanPham)
		? watchedDanhSachSanPham
		: [];

	const tongTien = useMemo(() => {
		return danhSachSanPham.reduce((sum, sp) => sum + (sp?.thanhTien || 0), 0);
	}, [danhSachSanPham]);

	useEffect(() => {
		if (visible) {
			if (initialValues) {
				form.setFieldsValue(initialValues);
			} else {
				form.resetFields();
			}
		}
	}, [visible, initialValues]);

	const handleThemSanPham = (maSanPham: string) => {
		const sanPham = DANH_SACH_SAN_PHAM.find((sp) => sp.maSanPham === maSanPham);
		if (!sanPham) return;

		const current: QuanLyDonHang.SanPhamTrongDon[] = form.getFieldValue('danhSachSanPham') || [];
		const existing = current.find((sp) => sp.maSanPham === maSanPham);
		if (existing) return;

		const newItem: QuanLyDonHang.SanPhamTrongDon = {
			maSanPham: sanPham.maSanPham,
			tenSanPham: sanPham.tenSanPham,
			soLuong: 1,
			donGia: sanPham.donGia,
			thanhTien: sanPham.donGia,
		};
		form.setFieldsValue({ danhSachSanPham: [...current, newItem] });
	};

	const handleXoaSanPham = (maSanPham: string) => {
		const current: QuanLyDonHang.SanPhamTrongDon[] = form.getFieldValue('danhSachSanPham') || [];
		form.setFieldsValue({ danhSachSanPham: current.filter((sp) => sp.maSanPham !== maSanPham) });
	};

	const handleSoLuongChange = (maSanPham: string, soLuong: number | string | null) => {
		if (soLuong === null || soLuong === '') return;
		const soLuongSo = typeof soLuong === 'string' ? Number(soLuong) : soLuong;
		if (Number.isNaN(soLuongSo)) return;
		const soLuongMoi = soLuongSo < 1 ? 1 : Math.floor(soLuongSo);
		const current: QuanLyDonHang.SanPhamTrongDon[] = form.getFieldValue('danhSachSanPham') || [];
		form.setFieldsValue({
			danhSachSanPham: current.map((sp) =>
				sp.maSanPham === maSanPham ? { ...sp, soLuong: soLuongMoi, thanhTien: sp.donGia * soLuongMoi } : sp,
			),
		});
	};

	const handleSubmit = () => {
		form
			.validateFields()
			.then((values) => {
				const data: Omit<QuanLyDonHang.DonHang, 'maDonHang'> = {
					khachHang: values.khachHang,
					ngayDatHang: values.ngayDatHang || new Date().toISOString(),
					danhSachSanPham: values.danhSachSanPham,
					tongTien,
					trangThai: values.trangThai,
				};
				onSubmit(data);
				form.resetFields();
			})
			.catch(() => {});
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel();
	};

	const maSanPhamDaChon = danhSachSanPham.map((sp) => sp?.maSanPham).filter(Boolean);

	const columnsSanPham: ColumnType<QuanLyDonHang.SanPhamTrongDon>[] = [
		{
			title: 'Sản phẩm',
			dataIndex: 'tenSanPham',
			key: 'tenSanPham',
		},
		{
			title: 'Đơn giá',
			dataIndex: 'donGia',
			key: 'donGia',
			width: 130,
			align: 'right',
			render: (val: number) => val?.toLocaleString('vi-VN') + ' đ',
		},
		{
			title: 'Số lượng',
			dataIndex: 'soLuong',
			key: 'soLuong',
			width: 100,
			align: 'center',
			render: (val: number, record) => (
				<InputNumber
					min={1}
					max={999}
					precision={0}
					value={val}
					size='small'
					onChange={(v) => handleSoLuongChange(record.maSanPham, v)}
				/>
			),
		},
		{
			title: 'Thành tiền',
			dataIndex: 'thanhTien',
			key: 'thanhTien',
			width: 140,
			align: 'right',
			render: (val: number) => <Tag color='blue'>{val?.toLocaleString('vi-VN')} đ</Tag>,
		},
		{
			title: '',
			key: 'action',
			width: 50,
			align: 'center',
			render: (_, record) => (
				<Button
					type='text'
					danger
					size='small'
					icon={<DeleteOutlined />}
					onClick={() => handleXoaSanPham(record.maSanPham)}
				/>
			),
		},
	];

	return (
		<Modal
			title={isEdit ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}
			visible={visible}
			onCancel={handleCancel}
			width={700}
			footer={[
				<Button key='cancel' onClick={handleCancel}>
					Hủy
				</Button>,
				<Button key='submit' type='primary' onClick={handleSubmit}>
					{isEdit ? 'Cập nhật' : 'Thêm mới'}
				</Button>,
			]}
		>
			<Form form={form} layout='vertical' initialValues={{ danhSachSanPham: [], trangThai: 'cho_xac_nhan' }}>
				<Form.Item
					label='Khách hàng'
					name='khachHang'
					rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
				>
					<Select placeholder='Chọn khách hàng' showSearch optionFilterProp='children'>
						{DANH_SACH_KHACH_HANG.map((kh) => (
							<Option key={kh} value={kh}>
								{kh}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					label='Trạng thái'
					name='trangThai'
					rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
				>
					<Select placeholder='Chọn trạng thái'>
						{TRANG_THAI_OPTIONS.map((tt) => (
							<Option key={tt.value} value={tt.value}>
								{tt.label}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item label='Sản phẩm trong đơn'>
					<Form.Item
						name='danhSachSanPham'
						hidden
						rules={[
							{
								validator: (_, value) => {
									if (!value || value.length === 0) {
										return Promise.reject('Vui lòng chọn ít nhất một sản phẩm!');
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Input />
					</Form.Item>
					<div>
						<Select
							placeholder='Thêm sản phẩm vào đơn...'
							showSearch
							optionFilterProp='children'
							value={undefined}
							onChange={handleThemSanPham}
							style={{ marginBottom: 8 }}
						>
							{DANH_SACH_SAN_PHAM.filter((sp) => !maSanPhamDaChon.includes(sp.maSanPham)).map((sp) => (
								<Option key={sp.maSanPham} value={sp.maSanPham}>
									{sp.tenSanPham} - {sp.donGia.toLocaleString('vi-VN')} đ
								</Option>
							))}
						</Select>

						{danhSachSanPham.length > 0 && (
							<Table
								columns={columnsSanPham}
								dataSource={danhSachSanPham}
								rowKey='maSanPham'
								pagination={false}
								size='small'
								summary={() => (
									<Table.Summary.Row>
										<Table.Summary.Cell index={0} colSpan={3}>
											<strong>Tổng tiền</strong>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={1} align='right'>
											<Tag color='green' style={{ fontSize: 14, padding: '2px 8px' }}>
												<strong>{tongTien.toLocaleString('vi-VN')} đ</strong>
											</Tag>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={2} />
									</Table.Summary.Row>
								)}
							/>
						)}
					</div>
					<Form.ErrorList errors={form.getFieldError('danhSachSanPham')} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormDonHang;
