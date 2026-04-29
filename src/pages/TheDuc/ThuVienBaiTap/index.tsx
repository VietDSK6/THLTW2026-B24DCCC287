import { EMucDoKho, ENhomCo, MucDoKhoColor, MucDoKhoText, NhomCoText } from '@/services/TheDuc/constant';
import { DeleteOutlined, EditOutlined, FireOutlined, PlusOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormBaiTap from './components/Form';

const ThuVienBaiTapPage = () => {
	const { danhSach, loading, visibleForm, setVisibleForm, edit, setEdit, setRecord, getModel, deleteModel, handleEdit } =
		useModel('theduc.baitap');

	const [searchText, setSearchText] = useState('');
	const [nhomCoFilter, setNhomCoFilter] = useState<string>();
	const [mucDoKhoFilter, setMucDoKhoFilter] = useState<string>();

	const [visibleDetail, setVisibleDetail] = useState(false);
	const [detailRecord, setDetailRecord] = useState<BaiTap.IRecord | null>(null);

	useEffect(() => {
		getModel();
	}, []);

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const showDetail = (record: BaiTap.IRecord) => {
		setDetailRecord(record);
		setVisibleDetail(true);
	};

	const filteredData = danhSach.filter((item) => {
		let matchSearch = true;
		if (searchText) {
			matchSearch = item.ten.toLowerCase().includes(searchText.toLowerCase());
		}
		let matchNhomCo = true;
		if (nhomCoFilter) {
			matchNhomCo = item.nhomCo === nhomCoFilter;
		}
		let matchMucDoKho = true;
		if (mucDoKhoFilter) {
			matchMucDoKho = item.mucDoKho === mucDoKhoFilter;
		}
		return matchSearch && matchNhomCo && matchMucDoKho;
	});

	return (
		<div>
			<Card
				title='Thư viện bài tập'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
						Thêm bài tập
					</Button>
				}
				style={{ marginBottom: 16 }}
			>
				<Form layout='inline' style={{ marginBottom: 24 }}>
					<Form.Item label='Tìm kiếm'>
						<Input.Search
							placeholder='Tên bài tập...'
							allowClear
							onSearch={setSearchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={{ width: 250 }}
						/>
					</Form.Item>
					<Form.Item label='Nhóm cơ'>
						<Select
							placeholder='Chọn nhóm cơ'
							allowClear
							style={{ width: 150 }}
							value={nhomCoFilter}
							onChange={setNhomCoFilter}
						>
							{Object.entries(NhomCoText).map(([key, value]) => (
								<Select.Option key={key} value={key}>
									{value}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label='Mức độ khó'>
						<Select
							placeholder='Chọn mức độ khó'
							allowClear
							style={{ width: 150 }}
							value={mucDoKhoFilter}
							onChange={setMucDoKhoFilter}
						>
							{Object.entries(MucDoKhoText).map(([key, value]) => (
								<Select.Option key={key} value={key}>
									{value}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>

				<Row gutter={[16, 16]}>
					{filteredData.map((item) => (
						<Col xs={24} sm={12} lg={8} xl={6} key={item._id}>
							<Card
								hoverable
								size='small'
								style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
								bodyStyle={{ flex: 1 }}
								onClick={() => showDetail(item)}
								actions={[
									<Button type='text' icon={<ReadOutlined />} onClick={(e) => { e.stopPropagation(); showDetail(item); }}>Chi tiết</Button>,
									<Button type='text' icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleEdit(item); }} />,
									<Popconfirm
										title='Bạn có chắc chắn muốn xóa?'
										onConfirm={(e) => { e?.stopPropagation(); deleteModel(item._id); }}
										onCancel={(e) => e?.stopPropagation()}
										placement='top'
									>
										<Button type='text' danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
									</Popconfirm>
								]}
							>
								<Card.Meta
									title={
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<Typography.Text ellipsis style={{ maxWidth: '65%' }}>{item.ten}</Typography.Text>
											<Tag color={MucDoKhoColor[item.mucDoKho]}>{MucDoKhoText[item.mucDoKho]}</Tag>
										</div>
									}
									description={
										<Space direction='vertical' style={{ width: '100%', marginTop: 8 }}>
											<Tag color='blue'>{NhomCoText[item.nhomCo]}</Tag>
											<Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0, height: 44 }}>
												{item.moTa}
											</Typography.Paragraph>
											<div style={{ display: 'flex', alignItems: 'center', marginTop: 8, color: '#fa8c16' }}>
												<FireOutlined style={{ marginRight: 4 }} />
												<span>{item.caloTrungBinh} calo/giờ</span>
											</div>
										</Space>
									}
								/>
							</Card>
						</Col>
					))}
					{filteredData.length === 0 && (
						<Col span={24} style={{ textAlign: 'center', padding: 40 }}>
							<Typography.Text type='secondary'>Không tìm thấy bài tập nào</Typography.Text>
						</Col>
					)}
				</Row>
			</Card>

			<Modal
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				destroyOnClose
				width={600}
				title={edit ? 'Chỉnh sửa bài tập' : 'Thêm bài tập mới'}
			>
				<FormBaiTap />
			</Modal>

			<Modal
				visible={visibleDetail}
				onCancel={() => setVisibleDetail(false)}
				footer={
					<Button type='primary' onClick={() => setVisibleDetail(false)}>
						Đóng
					</Button>
				}
				title='Chi tiết bài tập'
				width={600}
			>
				{detailRecord && (
					<div>
						<Typography.Title level={4} style={{ marginBottom: 16 }}>{detailRecord.ten}</Typography.Title>
						<Space style={{ marginBottom: 16 }}>
							<Tag color={MucDoKhoColor[detailRecord.mucDoKho]}>{MucDoKhoText[detailRecord.mucDoKho]}</Tag>
							<Tag color='blue'>{NhomCoText[detailRecord.nhomCo]}</Tag>
							<Tag color='orange' icon={<FireOutlined />}>{detailRecord.caloTrungBinh} calo/giờ</Tag>
						</Space>
						
						<Typography.Title level={5}>Mô tả</Typography.Title>
						<Typography.Paragraph>{detailRecord.moTa}</Typography.Paragraph>
						
						<Typography.Title level={5}>Hướng dẫn thực hiện</Typography.Title>
						<Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>{detailRecord.huongDan}</Typography.Paragraph>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default ThuVienBaiTapPage;
