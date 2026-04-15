import { LOAI_HINH_COLOR, LOAI_HINH_MAP } from '@/services/DuLich/constant';
import { tienVietNam } from '@/utils/utils';
import { ClockCircleOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Popconfirm, Tag, Timeline } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

interface ChiTietNgayProps {
	lichTrinh: LichTrinh.IRecord;
	ngay: LichTrinh.NgayTrongTrinh;
	onRemove: (ngay: number, diemDenId: string) => void;
}

const ChiTietNgay = ({ lichTrinh, ngay, onRemove }: ChiTietNgayProps) => {
	const { getAllModel } = useModel('dulich.diemden' as any);
	const [diemDens, setDiemDens] = useState<DiemDen.IRecord[]>([]);

	useEffect(() => {
		getAllModel().then(setDiemDens);
	}, []);

	const getDiemDen = (id: string) => diemDens.find((d) => d._id === id);

	if (ngay.diemDens.length === 0) {
		return (
			<Card size='small' title={`Ngày ${ngay.ngay}`} style={{ marginBottom: 12 }}>
				<Empty description='Chưa có điểm đến' image={Empty.PRESENTED_IMAGE_SIMPLE} />
			</Card>
		);
	}

	return (
		<Card size='small' title={`Ngày ${ngay.ngay}`} style={{ marginBottom: 12 }}>
			<Timeline>
				{ngay.diemDens
					.sort((a, b) => a.thuTu - b.thuTu)
					.map((dd, index) => {
						const diemDen = getDiemDen(dd.diemDenId);
						if (!diemDen) return null;

						const tongChiPhi =
							diemDen.chiPhi.anUong + diemDen.chiPhi.diChuyen + diemDen.chiPhi.luuTru + diemDen.chiPhi.veThamQuan;

						return (
							<Timeline.Item key={dd.diemDenId + index} color={LOAI_HINH_COLOR[diemDen.loaiHinh]}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
									<div>
										<div style={{ fontWeight: 600, marginBottom: 4 }}>
											{diemDen.ten}
											<Tag color={LOAI_HINH_COLOR[diemDen.loaiHinh]} style={{ marginLeft: 8 }}>
												{LOAI_HINH_MAP[diemDen.loaiHinh]}
											</Tag>
										</div>
										<div style={{ color: '#666', fontSize: 13 }}>
											<EnvironmentOutlined /> {diemDen.diaDiem}
										</div>
										<div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
											<ClockCircleOutlined /> {diemDen.thoiGianThamQuan}h •{' '}
											<span style={{ color: 'var(--primary-color)' }}>{tienVietNam(tongChiPhi)}</span>
										</div>
										{dd.thoiGianDiChuyen && index < ngay.diemDens.length - 1 && (
											<div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
												→ Di chuyển: {dd.thoiGianDiChuyen} phút
											</div>
										)}
									</div>
									<Popconfirm title='Xóa điểm đến này?' onConfirm={() => onRemove(ngay.ngay, dd.diemDenId)}>
										<Button type='text' danger icon={<DeleteOutlined />} size='small' />
									</Popconfirm>
								</div>
							</Timeline.Item>
						);
					})}
			</Timeline>
		</Card>
	);
};

export default ChiTietNgay;
