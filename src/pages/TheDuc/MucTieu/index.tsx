import { ELoaiMucTieu, ETrangThaiMucTieu, LoaiMucTieuText, TrangThaiMucTieuColor, TrangThaiMucTieuText } from '@/services/TheDuc/constant';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Drawer, InputNumber, Popconfirm, Progress, Row, Segmented, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormMucTieu from './components/Form';

const MucTieuPage = () => {
	const { danhSach, loading, visibleForm, setVisibleForm, setEdit, setRecord, getModel, deleteModel, updateGiaTriHienTai } =
		useModel('theduc.muctieu');

	const [statusFilter, setStatusFilter] = useState<string>('ALL');

	useEffect(() => {
		getModel();
	}, []);

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const filteredData = danhSach.filter((item) => statusFilter === 'ALL' || item.trangThai === statusFilter);

	return (
		<div>
			<Card
				title='Quản lý mục tiêu'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
						Thêm mới
					</Button>
				}
				style={{ marginBottom: 16 }}
			>
				<Segmented
					options={[
						{ label: 'Tất cả', value: 'ALL' },
						...Object.entries(TrangThaiMucTieuText).map(([value, label]) => ({ label, value })),
					]}
					value={statusFilter}
					onChange={(val) => setStatusFilter(val as string)}
					style={{ marginBottom: 24 }}
				/>

				<Row gutter={[16, 16]}>
					{filteredData.map((item) => {
						const percent = Math.min(100, Math.round((item.giaTriHienTai / item.giaTriMucTieu) * 100)) || 0;
						return (
							<Col xs={24} sm={12} lg={8} key={item._id}>
								<Card
									hoverable
									size='small'
									actions={[
										<Popconfirm title='Xác nhận xóa?' onConfirm={() => deleteModel(item._id)} placement='top'>
											<Button type='text' danger icon={<DeleteOutlined />}>Xóa</Button>
										</Popconfirm>
									]}
								>
									<Card.Meta
										title={
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<Typography.Text ellipsis style={{ maxWidth: '70%' }}>{item.ten}</Typography.Text>
												<Tag color={TrangThaiMucTieuColor[item.trangThai]}>{TrangThaiMucTieuText[item.trangThai]}</Tag>
											</div>
										}
										description={
											<Space direction='vertical' style={{ width: '100%', marginTop: 12 }}>
												<div>
													<Typography.Text type='secondary'>Loại: </Typography.Text>
													<Typography.Text strong>{LoaiMucTieuText[item.loai]}</Typography.Text>
												</div>
												<div>
													<Typography.Text type='secondary'>Deadline: </Typography.Text>
													<Typography.Text strong>{moment(item.deadline).format('DD/MM/YYYY')}</Typography.Text>
												</div>
												
												<div style={{ marginTop: 12 }}>
													<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
														<Space>
															<Typography.Text type='secondary'>Tiến độ:</Typography.Text>
															<InputNumber
																size='small'
																value={item.giaTriHienTai}
																onChange={(val) => updateGiaTriHienTai(item._id, val || 0)}
																min={0}
																disabled={item.trangThai === ETrangThaiMucTieu.DA_HUY}
																style={{ width: 80 }}
															/>
															<Typography.Text>/ {item.giaTriMucTieu}</Typography.Text>
														</Space>
													</div>
													<Progress percent={percent} status={item.trangThai === ETrangThaiMucTieu.DA_HUY ? 'exception' : percent >= 100 ? 'success' : 'active'} />
												</div>
											</Space>
										}
									/>
								</Card>
							</Col>
						);
					})}
					{filteredData.length === 0 && (
						<Col span={24} style={{ textAlign: 'center', padding: 40 }}>
							<Typography.Text type='secondary'>Không có mục tiêu nào</Typography.Text>
						</Col>
					)}
				</Row>
			</Card>

			<Drawer
				title='Thêm mới mục tiêu'
				width={400}
				onClose={() => setVisibleForm(false)}
				visible={visibleForm}
				destroyOnClose
				bodyStyle={{ paddingBottom: 80 }}
			>
				<FormMucTieu />
			</Drawer>
		</div>
	);
};

export default MucTieuPage;
