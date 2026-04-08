import DonutChart from '@/components/Chart/DonutChart';
import { HANG_MUC_NGAN_SACH } from '@/services/DuLich/constant';
import { tienVietNam } from '@/utils/utils';
import { Alert, Card, Col, Empty, Progress, Row, Select, Statistic, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const NganSachPage = () => {
	const { getAllModel } = useModel('dulich.lichtrinh' as any);
	const { getAllModel: getAllDiemDen } = useModel('dulich.diemden' as any);
	const [lichTrinhs, setLichTrinhs] = useState<LichTrinh.IRecord[]>([]);
	const [selectedId, setSelectedId] = useState<string>();
	const [diemDens, setDiemDens] = useState<DiemDen.IRecord[]>([]);

	useEffect(() => {
		getAllModel().then((data: LichTrinh.IRecord[]) => {
			setLichTrinhs(data);
			if (data.length > 0) {
				setSelectedId(data[0]._id);
			}
		});
		getAllDiemDen().then(setDiemDens);
	}, []);

	const selectedLichTrinh = lichTrinhs.find((lt) => lt._id === selectedId);

	if (!selectedLichTrinh) {
		return (
			<Card title='Quản lý ngân sách'>
				<Empty description='Chưa có lịch trình nào. Vui lòng tạo lịch trình trước.' />
			</Card>
		);
	}

	const { tongNganSach, nganSachDuKien, nganSachTheoHangMuc } = selectedLichTrinh;
	const conLai = tongNganSach - nganSachDuKien;
	const vuotNganSach = conLai < 0;
	const tiLeSuDung = tongNganSach > 0 ? (nganSachDuKien / tongNganSach) * 100 : 0;

	const chartData = HANG_MUC_NGAN_SACH.map((hm) => ({
		...hm,
		value: nganSachTheoHangMuc[hm.key as keyof LichTrinh.NganSachHangMuc] || 0,
	}));

	const getDiemDen = (id: string) => diemDens.find((d) => d._id === id);

	const chiTietChiPhi: any[] = [];
	selectedLichTrinh.chiTiet.forEach((ngay) => {
		ngay.diemDens.forEach((dd) => {
			const diemDen = getDiemDen(dd.diemDenId);
			if (diemDen) {
				const tongChiPhi =
					diemDen.chiPhi.anUong + diemDen.chiPhi.diChuyen + diemDen.chiPhi.luuTru + diemDen.chiPhi.veThamQuan;
				chiTietChiPhi.push({
					key: `${ngay.ngay}-${dd.diemDenId}`,
					ngay: ngay.ngay,
					diemDen: diemDen.ten,
					anUong: diemDen.chiPhi.anUong,
					diChuyen: diemDen.chiPhi.diChuyen,
					luuTru: diemDen.chiPhi.luuTru,
					veThamQuan: diemDen.chiPhi.veThamQuan,
					tongChiPhi,
				});
			}
		});
	});

	const columns: ColumnsType<any> = [
		{ title: 'Ngày', dataIndex: 'ngay', width: 60, align: 'center' },
		{ title: 'Điểm đến', dataIndex: 'diemDen' },
		{ title: 'Ăn uống', dataIndex: 'anUong', align: 'right', render: (val) => tienVietNam(val) },
		{ title: 'Di chuyển', dataIndex: 'diChuyen', align: 'right', render: (val) => tienVietNam(val) },
		{ title: 'Lưu trú', dataIndex: 'luuTru', align: 'right', render: (val) => tienVietNam(val) },
		{ title: 'Vé', dataIndex: 'veThamQuan', align: 'right', render: (val) => tienVietNam(val) },
		{
			title: 'Tổng',
			dataIndex: 'tongChiPhi',
			align: 'right',
			render: (val) => <strong>{tienVietNam(val)}</strong>,
		},
	];

	return (
		<div>
			<Card
				title='Quản lý ngân sách'
				extra={
					<Select
						value={selectedId}
						onChange={setSelectedId}
						style={{ width: 250 }}
						options={lichTrinhs.map((lt) => ({ value: lt._id, label: lt.ten }))}
					/>
				}
			>
				{vuotNganSach && (
					<Alert
						type='error'
						message={`Vượt ngân sách ${tienVietNam(Math.abs(conLai))}`}
						description='Chi phí dự kiến đã vượt quá ngân sách ban đầu. Hãy xem xét điều chỉnh lịch trình.'
						showIcon
						style={{ marginBottom: 16 }}
					/>
				)}

				<Row gutter={[16, 16]}>
					<Col xs={24} sm={8}>
						<Card size='small'>
							<Statistic
								title='Ngân sách'
								value={tongNganSach}
								formatter={(val) => tienVietNam(val as number)}
								valueStyle={{ color: 'var(--primary-color)' }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={8}>
						<Card size='small'>
							<Statistic
								title='Chi phí dự kiến'
								value={nganSachDuKien}
								formatter={(val) => tienVietNam(val as number)}
								valueStyle={{ color: vuotNganSach ? 'var(--ant-error-color)' : undefined }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={8}>
						<Card size='small'>
							<Statistic
								title='Còn lại'
								value={conLai}
								formatter={(val) => tienVietNam(val as number)}
								valueStyle={{ color: vuotNganSach ? 'var(--ant-error-color)' : 'var(--ant-success-color)' }}
							/>
						</Card>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
					<Col xs={24} lg={12}>
						<Card title='Tỷ lệ sử dụng ngân sách' size='small'>
							<Progress
								percent={Math.min(tiLeSuDung, 100)}
								status={vuotNganSach ? 'exception' : tiLeSuDung > 80 ? 'active' : 'normal'}
								format={() => `${tiLeSuDung.toFixed(1)}%`}
							/>
							<div style={{ marginTop: 16 }}>
								<DonutChart
									xAxis={chartData.map((h) => h.label)}
									yAxis={[chartData.map((h) => h.value)]}
									yLabel={['Chi phí']}
									colors={chartData.map((h) => h.color)}
									height={280}
									showTotal
								/>
							</div>
						</Card>
					</Col>
					<Col xs={24} lg={12}>
						<Card title='Chi tiết theo hạng mục' size='small'>
							<Table
								dataSource={chartData.map((h) => ({
									...h,
									percent: nganSachDuKien > 0 ? ((h.value / nganSachDuKien) * 100).toFixed(1) : 0,
								}))}
								columns={[
									{
										title: 'Hạng mục',
										dataIndex: 'label',
										render: (val, rec: any) => (
											<span>
												<span
													style={{
														display: 'inline-block',
														width: 12,
														height: 12,
														borderRadius: 2,
														backgroundColor: rec.color,
														marginRight: 8,
													}}
												/>
												{val}
											</span>
										),
									},
									{
										title: 'Chi phí',
										dataIndex: 'value',
										align: 'right',
										render: (val) => tienVietNam(val),
									},
									{
										title: 'Tỷ lệ',
										dataIndex: 'percent',
										align: 'center',
										render: (val) => `${val}%`,
									},
								]}
								rowKey='key'
								pagination={false}
								size='small'
							/>
						</Card>
					</Col>
				</Row>

				<Card title='Chi tiết chi phí theo điểm đến' size='small' style={{ marginTop: 16 }}>
					<Table
						dataSource={chiTietChiPhi}
						columns={columns}
						rowKey='key'
						pagination={false}
						size='small'
						scroll={{ x: 700 }}
						summary={() => (
							<Table.Summary.Row>
								<Table.Summary.Cell index={0} colSpan={2}>
									<strong>Tổng cộng</strong>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1} align='right'>
									<strong>{tienVietNam(nganSachTheoHangMuc.anUong)}</strong>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={2} align='right'>
									<strong>{tienVietNam(nganSachTheoHangMuc.diChuyen)}</strong>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={3} align='right'>
									<strong>{tienVietNam(nganSachTheoHangMuc.luuTru)}</strong>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={4} align='right'>
									<strong>{tienVietNam(nganSachTheoHangMuc.veThamQuan)}</strong>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={5} align='right'>
									<strong style={{ color: 'var(--primary-color)' }}>{tienVietNam(nganSachDuKien)}</strong>
								</Table.Summary.Cell>
							</Table.Summary.Row>
						)}
					/>
				</Card>
			</Card>
		</div>
	);
};

export default NganSachPage;
