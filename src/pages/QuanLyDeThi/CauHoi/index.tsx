import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { Button, Space, Table, Popconfirm, Tag, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import FormCauHoi from './FormCauHoi';
import FilterPanel from './FilterPanel';
import type { ColumnType } from 'antd/es/table';
import { MUC_DO_KHO_OPTIONS } from '@/services/QuanLyDeThi/constants';

const CauHoi: FC = () => {
	const { danhSachCauHoi, danhSachMonHoc, danhSachKhoiKT, themCauHoi, suaCauHoi, xoaCauHoi, timKiemCauHoi } =
		useModel('quanlydethi');
	const [visible, setVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [recordEdit, setRecordEdit] = useState<QuanLyDeThi.CauHoi>();
	const [filter, setFilter] = useState<QuanLyDeThi.FilterCauHoi>({});

	// Dữ liệu sau khi filter
	const danhSachHienThi = useMemo(() => {
		return timKiemCauHoi(filter);
	}, [filter, danhSachCauHoi]);

	// Helper: Lấy tên môn theo mã
	const getTenMon = (maMon: string) => {
		return danhSachMonHoc.find((mh) => mh.maMon === maMon)?.tenMon || maMon;
	};

	// Helper: Lấy tên khối theo mã
	const getTenKhoi = (maKhoi: string) => {
		return danhSachKhoiKT.find((kk) => kk.ma === maKhoi)?.ten || maKhoi;
	};

	// Helper: Lấy config mức độ khó
	const getMucDoKhoConfig = (mucDo: QuanLyDeThi.MucDoKho) => {
		return MUC_DO_KHO_OPTIONS.find((opt) => opt.value === mucDo);
	};

	const columns: ColumnType<QuanLyDeThi.CauHoi>[] = [
		{
			title: 'Mã câu hỏi',
			dataIndex: 'maCauHoi',
			key: 'maCauHoi',
			width: 150,
			render: (text) => <Tag color='purple'>{text}</Tag>,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			key: 'noiDung',
			ellipsis: true,
		},
		{
			title: 'Môn học',
			dataIndex: 'maMon',
			key: 'maMon',
			width: 150,
			render: (text) => getTenMon(text),
		},
		{
			title: 'Khối KT',
			dataIndex: 'khoiKienThuc',
			key: 'khoiKienThuc',
			width: 130,
			render: (text) => <Tag color='blue'>{getTenKhoi(text)}</Tag>,
		},
		{
			title: 'Độ khó',
			dataIndex: 'mucDoKho',
			key: 'mucDoKho',
			width: 120,
			align: 'center',
			render: (text) => {
				const config = getMucDoKhoConfig(text);
				return <Tag color={config?.color}>{config?.label}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 150,
			align: 'center',
			render: (_, record) => (
				<Space>
					<Button
						size='small'
						icon={<EditOutlined />}
						onClick={() => {
							setIsEdit(true);
							setRecordEdit(record);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc muốn xóa câu hỏi này?'
						onConfirm={() => xoaCauHoi(record.maCauHoi)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleSubmit = (values: any) => {
		if (isEdit && recordEdit) {
			suaCauHoi(recordEdit.maCauHoi, values);
		} else {
			themCauHoi(values);
		}
		setVisible(false);
		setIsEdit(false);
		setRecordEdit(undefined);
	};

	return (
		<div>
			<FilterPanel onFilter={setFilter} onReset={() => setFilter({})} />

			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setIsEdit(false);
						setRecordEdit(undefined);
						setVisible(true);
					}}
				>
					Thêm câu hỏi
				</Button>
				<Badge count={danhSachHienThi.length} showZero style={{ backgroundColor: '#52c41a' }}>
					<div style={{ padding: '0 12px' }}>Câu hỏi hiển thị</div>
				</Badge>
			</div>

			<Table
				columns={columns}
				dataSource={danhSachHienThi}
				rowKey='maCauHoi'
				pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} câu hỏi` }}
			/>

			<FormCauHoi
				visible={visible}
				onCancel={() => {
					setVisible(false);
					setIsEdit(false);
					setRecordEdit(undefined);
				}}
				onSubmit={handleSubmit}
				initialValues={recordEdit}
				isEdit={isEdit}
			/>
		</div>
	);
};

export default CauHoi;
