import { ETrangThai } from '@/services/CauLacBo/constant';
import { Modal, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

interface Props {
	visible: boolean;
	onCancel: () => void;
	cauLacBoId?: string;
	tenCLB?: string;
}

const ModalThanhVien = (props: Props) => {
	const { visible, onCancel, cauLacBoId, tenCLB } = props;
	const { getAllModel } = useModel('caulacbo.dondangky');
	const [thanhVien, setThanhVien] = useState<DonDangKy.IRecord[]>([]);

	useEffect(() => {
		if (visible && cauLacBoId) {
			getAllModel().then((data) => {
				const filtered = data.filter((don) => don.cauLacBoId === cauLacBoId && don.trangThai === ETrangThai.APPROVED);
				setThanhVien(filtered);
			});
		}
	}, [visible, cauLacBoId]);

	const columns = [
		{
			title: 'TT',
			width: 50,
			align: 'center' as const,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 180,
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDienThoai',
			width: 120,
		},
		{
			title: 'Ngày tham gia',
			dataIndex: 'updatedAt',
			width: 150,
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
		},
	];

	return (
		<Modal title={`Danh sách thành viên - ${tenCLB}`} visible={visible} onCancel={onCancel} footer={null} width={800}>
			<div style={{ marginBottom: 16 }}>
				<Tag color='blue'>Tổng số: {thanhVien.length} thành viên</Tag>
			</div>
			<Table
				dataSource={thanhVien}
				columns={columns}
				rowKey='_id'
				pagination={{ pageSize: 10 }}
				size='small'
				bordered
			/>
		</Modal>
	);
};

export default ModalThanhVien;
