import { tienVietNam } from '@/utils/utils';
import { CalendarOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
	Alert,
	Button,
	Card,
	Col,
	DatePicker,
	Empty,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Select,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ChiTietNgay from './components/ChiTietNgay';
import './index.less';

const LichTrinhPage = () => {
	const {
		danhSach,
		record,
		setRecord,
		loading,
		getModel,
		postModel,
		deleteModel,
		addDiemDenToNgay,
		removeDiemDenFromNgay,
	} = useModel('dulich.lichtrinh' as any);
	const { getAllModel: getAllDiemDen } = useModel('dulich.diemden' as any);
	const [diemDens, setDiemDens] = useState<DiemDen.IRecord[]>([]);
	const [visibleForm, setVisibleForm] = useState(false);
	const [visibleAddDiemDen, setVisibleAddDiemDen] = useState(false);
	const [selectedNgay, setSelectedNgay] = useState<number>(1);
	const [form] = Form.useForm();

	useEffect(() => {
		getModel();
		getAllDiemDen().then(setDiemDens);
	}, []);

	const handleCreateLichTrinh = async (values: any) => {
		const chiTiet: LichTrinh.NgayTrongTrinh[] = [];
		for (let i = 1; i <= values.soNgay; i++) {
			chiTiet.push({ ngay: i, diemDens: [] });
		}

		await postModel({
			ten: values.ten,
			ngayBatDau: values.ngayBatDau.format('YYYY-MM-DD'),
			soNgay: values.soNgay,
			chiTiet,
			tongNganSach: values.tongNganSach || 0,
		});
		setVisibleForm(false);
		form.resetFields();
	};

	const handleAddDiemDen = (values: { diemDenId: string }) => {
		if (record?._id) {
			addDiemDenToNgay(record._id, selectedNgay, values.diemDenId);
			setVisibleAddDiemDen(false);
		}
	};

	const handleRemoveDiemDen = (ngay: number, diemDenId: string) => {
		if (record?._id) {
			removeDiemDenFromNgay(record._id, ngay, diemDenId);
		}
	};

	const nganSachDuKien = record?.nganSachDuKien || 0;
	const tongNganSach = record?.tongNganSach || 0;
	const vuotNganSach = nganSachDuKien > tongNganSach && tongNganSach > 0;

	return (
		<div className='lich-trinh-page'>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={8}>
					<Card
						title='Danh sách lịch trình'
						extra={
							<Button type='primary' icon={<PlusOutlined />} onClick={() => setVisibleForm(true)}>
								Tạo mới
							</Button>
						}
					>
						{danhSach.length === 0 ? (
							<Empty description='Chưa có lịch trình nào' />
						) : (
							<div className='lich-trinh-list'>
								{danhSach.map((lt: LichTrinh.IRecord) => (
									<div
										key={lt._id}
										className={`lich-trinh-item ${record?._id === lt._id ? 'active' : ''}`}
										onClick={() => setRecord(lt)}
									>
										<div className='item-header'>
											<span className='item-title'>{lt.ten}</span>
											<Popconfirm title='Xóa lịch trình này?' onConfirm={() => deleteModel(lt._id)}>
												<Button
													type='text'
													danger
													size='small'
													icon={<DeleteOutlined />}
													onClick={(e) => e.stopPropagation()}
												/>
											</Popconfirm>
										</div>
										<div className='item-info'>
											<span>
												<CalendarOutlined /> {moment(lt.ngayBatDau).format('DD/MM/YYYY')}
											</span>
											<span>{lt.soNgay} ngày</span>
										</div>
										<div className='item-budget'>
											<span className='label'>Ngân sách: </span>
											<span className='value'>{tienVietNam(lt.tongNganSach)}</span>
										</div>
									</div>
								))}
							</div>
						)}
					</Card>
				</Col>

				<Col xs={24} lg={16}>
					<Card title={record ? `Chi tiết: ${record.ten}` : 'Chi tiết lịch trình'} className='detail-section'>
						{!record ? (
							<Empty description='Chọn một lịch trình để xem chi tiết' />
						) : (
							<>
								<div className='ngan-sach-summary'>
									<div className='summary-item'>
										<div className='label'>Ngân sách</div>
										<div className='value primary'>{tienVietNam(tongNganSach)}</div>
									</div>
									<div className='summary-item'>
										<div className='label'>Chi phí dự kiến</div>
										<div className={`value ${vuotNganSach ? 'error' : ''}`}>{tienVietNam(nganSachDuKien)}</div>
									</div>
									<div className='summary-item'>
										<div className='label'>Còn lại</div>
										<div className={`value ${vuotNganSach ? 'error' : 'primary'}`}>
											{tienVietNam(tongNganSach - nganSachDuKien)}
										</div>
									</div>
								</div>

								{vuotNganSach && (
									<Alert
										type='warning'
										message={`Vượt ngân sách ${tienVietNam(nganSachDuKien - tongNganSach)}`}
										style={{ marginBottom: 16 }}
										showIcon
									/>
								)}

								<div className='add-diem-den-section'>
									<Button
										icon={<PlusOutlined />}
										onClick={() => {
											setSelectedNgay(1);
											setVisibleAddDiemDen(true);
										}}
									>
										Thêm điểm đến
									</Button>
								</div>

								{record.chiTiet.map((ngay: LichTrinh.NgayTrongTrinh) => (
									<ChiTietNgay key={ngay.ngay} lichTrinh={record} ngay={ngay} onRemove={handleRemoveDiemDen} />
								))}
							</>
						)}
					</Card>
				</Col>
			</Row>

			<Modal
				title='Tạo lịch trình mới'
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={handleCreateLichTrinh}>
					<Form.Item name='ten' label='Tên lịch trình' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
						<Input placeholder='VD: Du lịch Đà Nẵng 3 ngày' />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='ngayBatDau' label='Ngày bắt đầu' rules={[{ required: true, message: 'Chọn ngày' }]}>
								<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='soNgay' label='Số ngày' rules={[{ required: true, message: 'Nhập số ngày' }]}>
								<InputNumber min={1} max={30} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='tongNganSach' label='Ngân sách dự kiến'>
						<InputNumber
							min={0}
							step={500000}
							style={{ width: '100%' }}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
							placeholder='Nhập ngân sách'
						/>
					</Form.Item>
					<div className='form-footer'>
						<Button type='primary' htmlType='submit' loading={loading}>
							Tạo lịch trình
						</Button>
						<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>

			<Modal
				title='Thêm điểm đến'
				visible={visibleAddDiemDen}
				onCancel={() => setVisibleAddDiemDen(false)}
				footer={null}
				destroyOnClose
			>
				<Form layout='vertical' onFinish={handleAddDiemDen}>
					<Form.Item name='ngay' label='Chọn ngày' initialValue={selectedNgay}>
						<Select
							value={selectedNgay}
							onChange={setSelectedNgay}
							options={record?.chiTiet.map((n: LichTrinh.NgayTrongTrinh) => ({
								value: n.ngay,
								label: `Ngày ${n.ngay}`,
							}))}
						/>
					</Form.Item>
					<Form.Item
						name='diemDenId'
						label='Chọn điểm đến'
						rules={[{ required: true, message: 'Vui lòng chọn điểm đến' }]}
					>
						<Select
							showSearch
							placeholder='Tìm và chọn điểm đến'
							optionFilterProp='children'
							filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
							options={diemDens.map((d) => ({
								value: d._id,
								label: `${d.ten} - ${d.diaDiem}`,
							}))}
						/>
					</Form.Item>
					<div className='form-footer'>
						<Button type='primary' htmlType='submit'>
							Thêm
						</Button>
						<Button onClick={() => setVisibleAddDiemDen(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default LichTrinhPage;
