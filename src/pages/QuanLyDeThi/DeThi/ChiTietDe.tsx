import type { FC } from 'react';
import { Modal, Descriptions, List, Tag, Typography } from 'antd';
import { useModel } from 'umi';
import { MUC_DO_KHO_OPTIONS } from '@/services/QuanLyDeThi/constants';

const { Text } = Typography;

interface ChiTietDeProps {
	visible: boolean;
	onCancel: () => void;
	deThi: QuanLyDeThi.DeThi | null;
}

const ChiTietDe: FC<ChiTietDeProps> = ({ visible, onCancel, deThi }) => {
	const { danhSachCauHoi, danhSachMonHoc } = useModel('quanlydethi');

	if (!deThi) return null;

	const tenMon = danhSachMonHoc.find((mh) => mh.maMon === deThi.maMon)?.tenMon || deThi.maMon;
	const chiTietCauHoi = deThi.danhSachCauHoi
		.map((maCH) => danhSachCauHoi.find((ch) => ch.maCauHoi === maCH))
		.filter((ch) => ch !== undefined) as QuanLyDeThi.CauHoi[];

	const getMucDoKhoColor = (mucDo: QuanLyDeThi.MucDoKho) => {
		return MUC_DO_KHO_OPTIONS.find((opt) => opt.value === mucDo)?.color || 'default';
	};

	const getMucDoKhoLabel = (mucDo: QuanLyDeThi.MucDoKho) => {
		return MUC_DO_KHO_OPTIONS.find((opt) => opt.value === mucDo)?.label || mucDo;
	};

	return (
		<Modal title='Chi tiết đề thi' visible={visible} onCancel={onCancel} width={900} footer={null}>
			<Descriptions bordered column={2}>
				<Descriptions.Item label='Mã đề'>{deThi.maDe}</Descriptions.Item>
				<Descriptions.Item label='Tên đề'>{deThi.tenDe}</Descriptions.Item>
				<Descriptions.Item label='Môn học'>{tenMon}</Descriptions.Item>
				<Descriptions.Item label='Số câu hỏi'>{deThi.danhSachCauHoi.length}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					<Tag color={deThi.trangThai === 'hoan_thanh' ? 'success' : 'default'}>
						{deThi.trangThai === 'hoan_thanh' ? 'Hoàn thành' : 'Nháp'}
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Ngày tạo'>{new Date(deThi.ngayTao).toLocaleString('vi-VN')}</Descriptions.Item>
			</Descriptions>

			<div style={{ marginTop: 24 }}>
				<Text strong>Danh sách câu hỏi:</Text>
				<List
					style={{ marginTop: 8 }}
					bordered
					dataSource={chiTietCauHoi}
					renderItem={(item, index) => (
						<List.Item>
							<div style={{ width: '100%' }}>
								<div style={{ marginBottom: 8 }}>
									<Tag color='blue'>Câu {index + 1}</Tag>
									<Tag color='purple'>{item.maCauHoi}</Tag>
									<Tag color={getMucDoKhoColor(item.mucDoKho)}>{getMucDoKhoLabel(item.mucDoKho)}</Tag>
								</div>
								<Text>{item.noiDung}</Text>
							</div>
						</List.Item>
					)}
				/>
			</div>
		</Modal>
	);
};

export default ChiTietDe;
