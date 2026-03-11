import type { FC } from 'react';
import { useState } from 'react';
import { Button, Space, Table, Popconfirm, Tag, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import TaoDe from './TaoDe';
import CauTrucDe from './CauTrucDe';
import ChiTietDe from './ChiTietDe';
import type { ColumnType } from 'antd/es/table';

const { TabPane } = Tabs;

const DeThi: FC = () => {
	const {
		danhSachDeThi,
		danhSachCauTruc,
		danhSachMonHoc,
		themCauTruc,
		xoaCauTruc,
		taoDeTuCauTruc,
		xoaDeThi,
		xuatDeThi,
	} = useModel('quanlydethi');

	const [visibleTaoDe, setVisibleTaoDe] = useState(false);
	const [visibleCauTruc, setVisibleCauTruc] = useState(false);
	const [visibleChiTiet, setVisibleChiTiet] = useState(false);
	const [deHienTai, setDeHienTai] = useState<QuanLyDeThi.DeThi | null>(null);

	// Helper
	const getTenMon = (maMon: string) => {
		return danhSachMonHoc.find((mh) => mh.maMon === maMon)?.tenMon || maMon;
	};

	// Cột cho bảng cấu trúc đề
	const columnsCauTruc: ColumnType<QuanLyDeThi.CauTrucDe>[] = [
		{
			title: 'Mã cấu trúc',
			dataIndex: 'maCauTruc',
			key: 'maCauTruc',
			width: 150,
			render: (text) => <Tag color='orange'>{text}</Tag>,
		},
		{
			title: 'Tên cấu trúc',
			dataIndex: 'tenCauTruc',
			key: 'tenCauTruc',
		},
		{
			title: 'Môn học',
			dataIndex: 'maMon',
			key: 'maMon',
			width: 180,
			render: (text) => getTenMon(text),
		},
		{
			title: 'Số yêu cầu',
			dataIndex: 'danhSachYeuCau',
			key: 'danhSachYeuCau',
			width: 120,
			align: 'center',
			render: (list: QuanLyDeThi.YeuCauCauHoi[]) => {
				const tongSoCau = list.reduce((sum, yc) => sum + yc.soLuong, 0);
				return <Tag color='blue'>{tongSoCau} câu</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 100,
			align: 'center',
			render: (_, record) => (
				<Popconfirm title='Xác nhận xóa cấu trúc?' onConfirm={() => xoaCauTruc(record.maCauTruc)}>
					<Button size='small' danger icon={<DeleteOutlined />}>
						Xóa
					</Button>
				</Popconfirm>
			),
		},
	];

	// Cột cho bảng đề thi
	const columnsDeThi: ColumnType<QuanLyDeThi.DeThi>[] = [
		{
			title: 'Mã đề',
			dataIndex: 'maDe',
			key: 'maDe',
			width: 150,
			render: (text) => <Tag color='red'>{text}</Tag>,
		},
		{
			title: 'Tên đề thi',
			dataIndex: 'tenDe',
			key: 'tenDe',
		},
		{
			title: 'Môn học',
			dataIndex: 'maMon',
			key: 'maMon',
			width: 150,
			render: (text) => getTenMon(text),
		},
		{
			title: 'Số câu',
			dataIndex: 'danhSachCauHoi',
			key: 'danhSachCauHoi',
			width: 100,
			align: 'center',
			render: (list: string[]) => list.length,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			width: 120,
			align: 'center',
			render: (text) => (
				<Tag color={text === 'hoan_thanh' ? 'success' : 'default'}>{text === 'hoan_thanh' ? 'Hoàn thành' : 'Nháp'}</Tag>
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 200,
			align: 'center',
			render: (_, record) => (
				<Space>
					<Button
						size='small'
						icon={<EyeOutlined />}
						onClick={() => {
							setDeHienTai(record);
							setVisibleChiTiet(true);
						}}
					>
						Xem
					</Button>
					<Button size='small' icon={<DownloadOutlined />} onClick={() => xuatDeThi(record.maDe)}>
						Xuất
					</Button>
					<Popconfirm title='Xác nhận xóa đề?' onConfirm={() => xoaDeThi(record.maDe)}>
						<Button size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleTaoCauTruc = (values: any) => {
		themCauTruc(values);
		setVisibleCauTruc(false);
	};

	const handleTaoDe = (values: any) => {
		const cauTruc = danhSachCauTruc.find((ct) => ct.maCauTruc === values.maCauTruc);
		if (cauTruc) {
			taoDeTuCauTruc(values.tenDe, cauTruc, values.trangThai);
		}
		setVisibleTaoDe(false);
	};

	return (
		<div>
			<Tabs defaultActiveKey='1'>
				<TabPane tab='Cấu trúc đề' key='1'>
					<div style={{ marginBottom: 16 }}>
						<Button type='primary' icon={<PlusOutlined />} onClick={() => setVisibleCauTruc(true)}>
							Tạo cấu trúc mới
						</Button>
					</div>
					<Table
						columns={columnsCauTruc}
						dataSource={danhSachCauTruc}
						rowKey='maCauTruc'
						pagination={{ pageSize: 10 }}
					/>
				</TabPane>

				<TabPane tab='Danh sách đề thi' key='2'>
					<div style={{ marginBottom: 16 }}>
						<Button type='primary' icon={<PlusOutlined />} onClick={() => setVisibleTaoDe(true)}>
							Tạo đề thi
						</Button>
					</div>
					<Table columns={columnsDeThi} dataSource={danhSachDeThi} rowKey='maDe' pagination={{ pageSize: 10 }} />
				</TabPane>
			</Tabs>

			{/* Modal tạo cấu trúc */}
			<CauTrucDe visible={visibleCauTruc} onCancel={() => setVisibleCauTruc(false)} onSubmit={handleTaoCauTruc} />

			{/* Modal tạo đề */}
			<TaoDe visible={visibleTaoDe} onCancel={() => setVisibleTaoDe(false)} onSubmit={handleTaoDe} />

			{/* Modal chi tiết đề */}
			<ChiTietDe visible={visibleChiTiet} onCancel={() => setVisibleChiTiet(false)} deThi={deHienTai} />
		</div>
	);
};

export default DeThi;
