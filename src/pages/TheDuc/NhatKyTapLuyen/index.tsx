import { LoaiBaiTapText, TrangThaiBuoiTapColor, TrangThaiBuoiTapText } from '@/services/TheDuc/constant';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Table, Tag, Tooltip, DatePicker, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormBuoiTap from './components/Form';

const { RangePicker } = DatePicker;

const NhatKyTapLuyenPage = () => {
	const { danhSach, loading, visibleForm, setVisibleForm, setEdit, setRecord, getModel, deleteModel, handleEdit } =
		useModel('theduc.buoitap');

	const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null]>([null, null]);
	const [loaiBaiTapFilter, setLoaiBaiTapFilter] = useState<string>();

	useEffect(() => {
		getModel();
	}, []);

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const filteredData = danhSach.filter((item) => {
		let matchDate = true;
		if (dateRange[0] && dateRange[1]) {
			const ngay = moment(item.ngay);
			matchDate = ngay.isSameOrAfter(dateRange[0], 'day') && ngay.isSameOrBefore(dateRange[1], 'day');
		}
		let matchLoai = true;
		if (loaiBaiTapFilter) {
			matchLoai = item.loaiBaiTap === loaiBaiTapFilter;
		}
		return matchDate && matchLoai;
	});

	const columns: ColumnsType<BuoiTap.IRecord> = [
		{
			title: 'Ngày',
			dataIndex: 'ngay',
			width: 120,
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Loại bài tập',
			dataIndex: 'loaiBaiTap',
			width: 150,
			render: (val: string) => <Tag color='blue'>{LoaiBaiTapText[val as keyof typeof LoaiBaiTapText]}</Tag>,
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'thoiLuong',
			width: 150,
			align: 'right',
		},
		{
			title: 'Calo đốt',
			dataIndex: 'calo',
			width: 120,
			align: 'right',
			render: (val: number) => val?.toLocaleString('vi-VN'),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 250,
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 150,
			align: 'center',
			render: (val: string) => (
				<Tag color={TrangThaiBuoiTapColor[val as keyof typeof TrangThaiBuoiTapColor]}>
					{TrangThaiBuoiTapText[val as keyof typeof TrangThaiBuoiTapText]}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_, record) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm title='Bạn có chắc chắn muốn xóa?' onConfirm={() => deleteModel(record._id)} placement='topRight'>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<Card
			title='Nhật ký tập luyện'
			extra={
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm mới
				</Button>
			}
		>
			<div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
				<div>
					<span style={{ marginRight: 8 }}>Thời gian:</span>
					<RangePicker
						value={dateRange}
						onChange={(dates) => setDateRange(dates ? [dates[0], dates[1]] : [null, null])}
						format='DD/MM/YYYY'
					/>
				</div>
				<div>
					<span style={{ marginRight: 8 }}>Loại bài tập:</span>
					<Select
						style={{ width: 200 }}
						placeholder='Chọn loại bài tập'
						allowClear
						value={loaiBaiTapFilter}
						onChange={setLoaiBaiTapFilter}
					>
						{Object.entries(LoaiBaiTapText).map(([key, value]) => (
							<Select.Option key={key} value={key}>
								{value}
							</Select.Option>
						))}
					</Select>
				</div>
			</div>

			<Table
				dataSource={filteredData}
				columns={columns}
				rowKey='_id'
				loading={loading}
				scroll={{ x: 1000 }}
				pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} buổi tập` }}
			/>

			<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} destroyOnClose width={500}>
				<FormBuoiTap />
			</Modal>
		</Card>
	);
};

export default NhatKyTapLuyenPage;
