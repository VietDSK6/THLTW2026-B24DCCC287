import { LOAI_HINH_COLOR, LOAI_HINH_MAP } from '@/services/DuLich/constant';
import { tienVietNam } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Image, Popconfirm, Rate, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const QuanLyDiemDen = () => {
	console.log('hello world');
	const {
		danhSach,
		loading,
		total,
		page,
		limit,
		setPage,
		setLimit,
		getModel,
		deleteModel,
		handleEdit,
		setEdit,
		setRecord,
		setVisibleForm,
	} = useModel('dulich.diemden' as any);

	useEffect(() => {
		getModel();
	}, [page, limit]);

	const columns: ColumnsType<DiemDen.IRecord> = [
		{
			title: 'Hình ảnh',
			dataIndex: 'hinhAnh',
			width: 100,
			render: (val) => <Image src={val} width={80} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />,
		},
		{
			title: 'Tên điểm đến',
			dataIndex: 'ten',
			width: 150,
		},
		{
			title: 'Địa điểm',
			dataIndex: 'diaDiem',
			width: 120,
		},
		{
			title: 'Loại hình',
			dataIndex: 'loaiHinh',
			width: 100,
			align: 'center',
			render: (val: DiemDen.LoaiHinh) => <Tag color={LOAI_HINH_COLOR[val]}>{LOAI_HINH_MAP[val]}</Tag>,
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			width: 140,
			align: 'center',
			render: (val) => <Rate disabled value={val} allowHalf style={{ fontSize: 14 }} />,
		},
		{
			title: 'Thời gian (giờ)',
			dataIndex: 'thoiGianThamQuan',
			width: 100,
			align: 'center',
		},
		{
			title: 'Tổng chi phí',
			dataIndex: 'chiPhi',
			width: 120,
			align: 'right',
			render: (val: DiemDen.ChiPhi) => tienVietNam(val.anUong + val.diChuyen + val.luuTru + val.veThamQuan),
		},
		{
			title: 'Thao tác',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_, record) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm title='Bạn có chắc chắn muốn xóa?' onConfirm={() => deleteModel(record._id)}>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<Card
			title='Quản lý điểm đến'
			extra={
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
			}
		>
			<Table
				columns={columns}
				dataSource={danhSach}
				loading={loading}
				rowKey='_id'
				scroll={{ x: 1000 }}
				pagination={{
					current: page,
					pageSize: limit,
					total,
					showSizeChanger: true,
					pageSizeOptions: ['5', '10', '20'],
					onChange: (p, l) => {
						setPage(p);
						setLimit(l);
					},
				}}
			/>
			<Form />
		</Card>
	);
};

export default QuanLyDiemDen;
