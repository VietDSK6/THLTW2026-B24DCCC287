import { Button, Card, Col, DatePicker, Form, InputNumber, Modal, Progress, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';

const STORAGE_KEY_MUCTIEU = 'muctieu';
const STORAGE_KEY_MONHOC = 'monhoc';
const STORAGE_KEY_TIENDO = 'tiendo';

interface GoalWithProgress extends HocTap.MucTieu {
	tenMonHoc: string;
	thucTe: number;
	percent: number;
}

const MucTieuHangThang: React.FC = () => {
	const [goals, setGoals] = useState<HocTap.MucTieu[]>([]);
	const [monHocList, setMonHocList] = useState<HocTap.MonHoc[]>([]);
	const [buoiHocList, setBuoiHocList] = useState<HocTap.BuoiHoc[]>([]);
	const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY-MM'));
	const [visible, setVisible] = useState<boolean>(false);
	const [form] = Form.useForm();

	const loadData = () => {
		const rawGoals = localStorage.getItem(STORAGE_KEY_MUCTIEU);
		setGoals(rawGoals ? JSON.parse(rawGoals) : []);

		const rawMonHoc = localStorage.getItem(STORAGE_KEY_MONHOC);
		setMonHocList(rawMonHoc ? JSON.parse(rawMonHoc) : []);

		const rawTienDo = localStorage.getItem(STORAGE_KEY_TIENDO);
		setBuoiHocList(rawTienDo ? JSON.parse(rawTienDo) : []);
	};

	useEffect(() => {
		loadData();
	}, []);

	const saveGoals = (newGoals: HocTap.MucTieu[]) => {
		localStorage.setItem(STORAGE_KEY_MUCTIEU, JSON.stringify(newGoals));
		setGoals(newGoals);
	};

	const handleAddGoal = () => {
		form.resetFields();
		setVisible(true);
	};

	const handleSubmit = (values: any) => {
		const newGoal: HocTap.MucTieu = {
			id: Date.now().toString(),
			monHocId: values.monHocId,
			thang: values.thang.format('YYYY-MM'),
			thoiLuongMucTieu: values.thoiLuongMucTieu,
		};
		saveGoals([...goals, newGoal]);
		setVisible(false);
	};

	const handleDelete = (id: string) => {
		const newGoals = goals.filter((g) => g.id !== id);
		saveGoals(newGoals);
	};

	const getTenMonHoc = (monHocId: string): string => {
		const found = monHocList.find((m) => m.id === monHocId);
		return found ? found.ten : '';
	};

	const calculateActual = (monHocId: string, thang: string): number => {
		const filtered = buoiHocList.filter((b) => {
			const buoiThang = moment(b.thoiGian).format('YYYY-MM');
			return b.monHocId === monHocId && buoiThang === thang;
		});
		return filtered.reduce((sum, b) => sum + b.thoiLuong, 0);
	};

	const goalsWithProgress: GoalWithProgress[] = goals
		.filter((g) => g.thang === selectedMonth)
		.map((g) => {
			const thucTe = calculateActual(g.monHocId, g.thang);
			const percent = g.thoiLuongMucTieu > 0 ? Math.round((thucTe / g.thoiLuongMucTieu) * 100) : 0;
			return {
				...g,
				tenMonHoc: getTenMonHoc(g.monHocId),
				thucTe,
				percent,
			};
		});

	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
				<Button type='primary' onClick={handleAddGoal}>
					Thêm mục tiêu
				</Button>
				<DatePicker.MonthPicker
					value={moment(selectedMonth)}
					onChange={(date) => setSelectedMonth(date ? date.format('YYYY-MM') : moment().format('YYYY-MM'))}
					format='YYYY-MM'
					style={{ width: 180 }}
				/>
			</div>

			{goalsWithProgress.length === 0 ? (
				<Card>
					<p style={{ textAlign: 'center', color: '#999' }}>Chưa có mục tiêu nào cho tháng này.</p>
				</Card>
			) : (
				<Row gutter={[16, 16]}>
					{goalsWithProgress.map((g) => (
						<Col span={12} key={g.id}>
							<Card
								title={g.tenMonHoc}
								extra={
									<Button size='small' danger onClick={() => handleDelete(g.id)}>
										Xóa
									</Button>
								}
							>
								<div style={{ marginBottom: 8 }}>
									<b>Mục tiêu:</b> {g.thoiLuongMucTieu} phút
								</div>
								<div style={{ marginBottom: 8 }}>
									<b>Thực tế:</b> {g.thucTe} phút
								</div>
								<Progress percent={g.percent} status={g.percent >= 100 ? 'success' : 'active'} />
								<div style={{ marginTop: 8, textAlign: 'center', fontWeight: 500 }}>
									{g.percent >= 100 ? '✓ Hoàn thành' : 'Chưa đạt'}
								</div>
							</Card>
						</Col>
					))}
				</Row>
			)}

			<Modal destroyOnClose title='Thêm mục tiêu' visible={visible} onCancel={() => setVisible(false)} footer={null}>
				<Form form={form} onFinish={handleSubmit} layout='vertical'>
					<Form.Item label='Môn học' name='monHocId' rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
						<Select placeholder='Chọn môn học'>
							{monHocList.map((m) => (
								<Select.Option key={m.id} value={m.id}>
									{m.ten}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label='Tháng' name='thang' rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}>
						<DatePicker.MonthPicker format='YYYY-MM' style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						label='Thời lượng mục tiêu (phút)'
						name='thoiLuongMucTieu'
						rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} placeholder='Nhập số phút' />
					</Form.Item>
					<div className='form-footer'>
						<Button htmlType='submit' type='primary'>
							Thêm mới
						</Button>
						<Button onClick={() => setVisible(false)} style={{ marginLeft: 8 }}>
							Hủy
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default MucTieuHangThang;
