import ExpandText from '@/components/ExpandText';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Modal, Popconfirm, Switch, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCauLacBo from '../components/FormCauLacBo';
import ModalThanhVien from '../components/ModalThanhVien';

const DanhSachCLB = () => {
	const {
		danhSach,
		loading,
		getModel,
		deleteModel,
		handleEdit,
		putModel,
		setVisibleForm,
		setEdit,
		setRecord,
		visibleForm,
	} = useModel('caulacbo.caulacbo');
	const [visibleThanhVien, setVisibleThanhVien] = useState(false);
	const [selectedCLB, setSelectedCLB] = useState<CauLacBo.IRecord>();

	useEffect(() => {
		getModel();
	}, []);

	const handleToggleHoatDong = (record: CauLacBo.IRecord) => {
		putModel(record._id, { hoatDong: !record.hoatDong });
	};

	const handleXemThanhVien = (record: CauLacBo.IRecord) => {
		setSelectedCLB(record);
		setVisibleThanhVien(true);
	};

	const columns: ColumnsType<CauLacBo.IRecord> = [
		{
			title: 'TT',
			width: 50,
			align: 'center',
			render: (_, __, index) => index + 1,
		},
		{
			title: 'Ảnh',
			dataIndex: 'anhDaiDien',
			width: 70,
			align: 'center',
			render: (val) => <Avatar src={val?.fileList?.[0]?.url || val?.fileList?.[0]?.thumbUrl} size={40} />,
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCLB',
			width: 200,
			sorter: (a, b) => a.tenCLB.localeCompare(b.tenCLB),
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			width: 130,
			align: 'center',
			sorter: (a, b) => moment(a.ngayThanhLap).unix() - moment(b.ngayThanhLap).unix(),
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Chủ nhiệm',
			dataIndex: 'chuNhiem',
			width: 150,
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			width: 100,
			align: 'center',
			filters: [
				{ text: 'Có', value: true },
				{ text: 'Không', value: false },
			],
			onFilter: (value, record) => record.hoatDong === value,
			render: (val, record) => (
				<Switch
					checked={val}
					onChange={() => handleToggleHoatDong(record)}
					checkedChildren='Có'
					unCheckedChildren='Không'
				/>
			),
		},
		{
			title: 'Thao tác',
			width: 130,
			align: 'center',
			fixed: 'right',
			render: (record: CauLacBo.IRecord) => (
				<>
					<Tooltip title='Xem thành viên'>
						<Button type='link' icon={<TeamOutlined />} onClick={() => handleXemThanhVien(record)} />
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							title='Bạn có chắc chắn muốn xóa?'
							onConfirm={() => deleteModel(record._id)}
							placement='topRight'
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<Card bordered={false}>
				<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
					<Button
						type='primary'
						onClick={() => {
							setRecord(undefined);
							setEdit(false);
							setVisibleForm(true);
						}}
					>
						Thêm mới
					</Button>
					<span>Tổng số: {danhSach.length}</span>
				</div>
				<Table
					dataSource={danhSach}
					columns={columns}
					rowKey='_id'
					loading={loading}
					bordered
					size='small'
					scroll={{ x: 1000 }}
					pagination={{ pageSize: 10, showSizeChanger: true }}
				/>
			</Card>

			<Modal
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={700}
				bodyStyle={{ padding: 0 }}
			>
				<FormCauLacBo title='câu lạc bộ' />
			</Modal>

			<ModalThanhVien
				visible={visibleThanhVien}
				onCancel={() => setVisibleThanhVien(false)}
				cauLacBoId={selectedCLB?._id}
				tenCLB={selectedCLB?.tenCLB}
			/>
		</>
	);
};

export default DanhSachCLB;
