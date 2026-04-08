import { GioiTinhLabel } from '@/services/CauLacBo/constant';
import { SwapOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalDoiCLB from '../components/ModalDoiCLB';
import SelectCauLacBo from '../components/SelectCauLacBo';

const ThanhVien = () => {
	const { danhSach, loading, getModel, selectedIds, setSelectedIds, filterCauLacBoId, setFilterCauLacBoId } =
		useModel('caulacbo.thanhvien');
	const { danhSach: danhSachCLB, getAllModel: getAllCLB } = useModel('caulacbo.caulacbo');
	const [visibleDoiCLB, setVisibleDoiCLB] = useState(false);

	useEffect(() => {
		getModel();
		getAllCLB();
	}, [filterCauLacBoId]);

	const getCLBName = (cauLacBoId: string) => {
		return danhSachCLB.find((clb) => clb._id === cauLacBoId)?.tenCLB || '-';
	};

	const columns: ColumnsType<DonDangKy.IRecord> = [
		{
			title: 'TT',
			width: 50,
			align: 'center',
			render: (_, __, index) => index + 1,
		},
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
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Sở trường',
			dataIndex: 'soTruong',
			width: 150,
			ellipsis: true,
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			width: 150,
			render: (val) => <Tag color='blue'>{getCLBName(val)}</Tag>,
		},
		{
			title: 'Ngày tham gia',
			dataIndex: 'updatedAt',
			width: 140,
			align: 'center',
			sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
			render: (val) => moment(val).format('DD/MM/YYYY'),
		},
	];

	return (
		<>
			<Card bordered={false}>
				<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
					<Space wrap>
						{selectedIds && selectedIds.length > 0 && (
							<Button type='primary' icon={<SwapOutlined />} onClick={() => setVisibleDoiCLB(true)}>
								Đổi CLB cho {selectedIds.length} thành viên
							</Button>
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
						<span>Tổng số: {danhSach.length}</span>
					</Space>
				</div>
				<Table
					dataSource={danhSach}
					columns={columns}
					rowKey='_id'
					loading={loading}
					bordered
					size='small'
					scroll={{ x: 1200 }}
					pagination={{ pageSize: 10, showSizeChanger: true }}
					rowSelection={{
						type: 'checkbox',
						selectedRowKeys: selectedIds,
						onChange: (keys) => setSelectedIds(keys as string[]),
					}}
				/>
			</Card>

			<ModalDoiCLB
				visible={visibleDoiCLB}
				onCancel={() => setVisibleDoiCLB(false)}
				selectedIds={selectedIds || []}
				onSuccess={() => getModel()}
			/>
		</>
	);
};

export default ThanhVien;
