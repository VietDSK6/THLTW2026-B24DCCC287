import { ETrangThai, GioiTinhLabel, TrangThaiColor, TrangThaiLabel } from '@/services/CauLacBo/constant';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	HistoryOutlined,
} from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Select, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormDonDangKy from '../components/FormDonDangKy';
import ModalDuyetDon from '../components/ModalDuyetDon';
import ModalLichSu from '../components/ModalLichSu';
import SelectCauLacBo from '../components/SelectCauLacBo';

const DonDangKy = () => {
	const {
		danhSach,
		loading,
		getModel,
		deleteModel,
		handleEdit,
		handleView,
		setVisibleForm,
		setEdit,
		setRecord,
		visibleForm,
		selectedIds,
		setSelectedIds,
		filterCauLacBoId,
		setFilterCauLacBoId,
		record,
	} = useModel('caulacbo.dondangky');
	const { danhSach: danhSachCLB, getAllModel: getAllCLB } = useModel('caulacbo.caulacbo');

	const [visibleDuyet, setVisibleDuyet] = useState(false);
	const [isApprove, setIsApprove] = useState(true);
	const [visibleLichSu, setVisibleLichSu] = useState(false);
	const [filterTrangThai, setFilterTrangThai] = useState<string>();

	useEffect(() => {
		getModel();
		getAllCLB();
	}, [filterCauLacBoId]);

	const getCLBName = (cauLacBoId: string) => {
		return danhSachCLB.find((clb) => clb._id === cauLacBoId)?.tenCLB || '-';
	};

	const handleDuyet = (ids: string[], approve: boolean) => {
		setSelectedIds(ids);
		setIsApprove(approve);
		setVisibleDuyet(true);
	};

	const handleXemLichSu = (rec: DonDangKy.IRecord) => {
		setRecord(rec);
		setVisibleLichSu(true);
	};

	const filteredData = filterTrangThai ? danhSach.filter((item) => item.trangThai === filterTrangThai) : danhSach;

	const columns: ColumnsType<DonDangKy.IRecord> = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
			sorter: (a, b) => a.hoTen.localeCompare(b.hoTen),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 180,
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 110,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 90,
			align: 'center',
			render: (val) => GioiTinhLabel[val] || val,
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			width: 150,
			render: (val) => getCLBName(val),
		},
		{
			title: 'Lý do đăng ký',
			dataIndex: 'lyDoDangKy',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 110,
			align: 'center',
			render: (val) => <Tag color={TrangThaiColor[val]}>{TrangThaiLabel[val]}</Tag>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 150,
			ellipsis: true,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			width: 140,
			align: 'center',
			sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			width: 200,
			align: 'center',
			fixed: 'right',
			render: (rec: DonDangKy.IRecord) => (
				<>
					<Tooltip title='Xem chi tiết'>
						<Button type='link' icon={<EyeOutlined />} onClick={() => handleView(rec)} />
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(rec)} />
					</Tooltip>
					{rec.trangThai === ETrangThai.PENDING && (
						<>
							<Tooltip title='Duyệt'>
								<Button
									type='link'
									style={{ color: 'green' }}
									icon={<CheckOutlined />}
									onClick={() => handleDuyet([rec._id], true)}
								/>
							</Tooltip>
							<Tooltip title='Từ chối'>
								<Button type='link' danger icon={<CloseOutlined />} onClick={() => handleDuyet([rec._id], false)} />
							</Tooltip>
						</>
					)}
					<Tooltip title='Lịch sử'>
						<Button type='link' icon={<HistoryOutlined />} onClick={() => handleXemLichSu(rec)} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm title='Bạn có chắc chắn muốn xóa?' onConfirm={() => deleteModel(rec._id)} placement='topRight'>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const pendingSelected = selectedIds?.filter((id) => {
		const rec = danhSach.find((item) => item._id === id);
		return rec?.trangThai === ETrangThai.PENDING;
	});

	return (
		<>
			<Card bordered={false}>
				<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
					<Space wrap>
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
						{pendingSelected && pendingSelected.length > 0 && (
							<>
								<Button type='primary' onClick={() => handleDuyet(pendingSelected, true)}>
									Duyệt {pendingSelected.length} đơn đã chọn
								</Button>
								<Button danger onClick={() => handleDuyet(pendingSelected, false)}>
									Từ chối {pendingSelected.length} đơn đã chọn
								</Button>
							</>
						)}
					</Space>
					<Space wrap>
						<SelectCauLacBo
							value={filterCauLacBoId}
							onChange={setFilterCauLacBoId}
							placeholder='Lọc theo CLB'
							style={{ width: 200 }}
							allowClear
						/>
						<Select
							value={filterTrangThai}
							onChange={setFilterTrangThai}
							placeholder='Lọc trạng thái'
							style={{ width: 150 }}
							allowClear
						>
							<Select.Option value={ETrangThai.PENDING}>{TrangThaiLabel.PENDING}</Select.Option>
							<Select.Option value={ETrangThai.APPROVED}>{TrangThaiLabel.APPROVED}</Select.Option>
							<Select.Option value={ETrangThai.REJECTED}>{TrangThaiLabel.REJECTED}</Select.Option>
						</Select>
						<span>Tổng số: {filteredData.length}</span>
					</Space>
				</div>
				<Table
					dataSource={filteredData}
					columns={columns}
					rowKey='_id'
					loading={loading}
					bordered
					size='small'
					scroll={{ x: 1400 }}
					pagination={{ pageSize: 10, showSizeChanger: true }}
					rowSelection={{
						type: 'checkbox',
						selectedRowKeys: selectedIds,
						onChange: (keys) => setSelectedIds(keys as string[]),
					}}
				/>
			</Card>

			<Modal
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={600}
				bodyStyle={{ padding: 0 }}
			>
				<FormDonDangKy title='đơn đăng ký' />
			</Modal>

			<ModalDuyetDon
				visible={visibleDuyet}
				onCancel={() => setVisibleDuyet(false)}
				isApprove={isApprove}
				selectedIds={selectedIds || []}
			/>

			<ModalLichSu
				visible={visibleLichSu}
				onCancel={() => setVisibleLichSu(false)}
				lichSu={record?.lichSu || []}
				hoTen={record?.hoTen}
			/>
		</>
	);
};

export default DonDangKy;
