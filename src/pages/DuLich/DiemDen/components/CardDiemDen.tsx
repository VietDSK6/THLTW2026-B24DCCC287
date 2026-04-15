import { LOAI_HINH_COLOR, LOAI_HINH_MAP } from '@/services/DuLich/constant';
import { tienVietNam } from '@/utils/utils';
import { EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Rate, Tag, message } from 'antd';
import '../index.less';

interface CardDiemDenProps {
	record: DiemDen.IRecord;
	onAdd?: (record: DiemDen.IRecord) => void;
}

const CardDiemDen = ({ record, onAdd }: CardDiemDenProps) => {
	const tongChiPhi = record.chiPhi.anUong + record.chiPhi.diChuyen + record.chiPhi.luuTru + record.chiPhi.veThamQuan;

	const handleAdd = () => {
		if (onAdd) {
			onAdd(record);
		} else {
			message.info('Vui lòng tạo lịch trình trước khi thêm điểm đến');
		}
	};

	return (
		<Card
			className='card-diem-den'
			hoverable
			cover={
				<div className='card-cover'>
					<img alt={record.ten} src={record.hinhAnh} />
					<Tag className='tag-loai-hinh' color={LOAI_HINH_COLOR[record.loaiHinh]}>
						{LOAI_HINH_MAP[record.loaiHinh]}
					</Tag>
				</div>
			}
			actions={[
				<Button key='add' type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm vào lịch trình
				</Button>,
			]}
		>
			<Card.Meta
				title={record.ten}
				description={
					<div className='card-content'>
						<div className='location'>
							<EnvironmentOutlined /> {record.diaDiem}
						</div>
						<div className='rating'>
							<Rate disabled value={record.rating} allowHalf style={{ fontSize: 14 }} />
							<span className='rating-text'>{record.rating}</span>
						</div>
						<div className='info-row'>
							<span className='time'>{record.thoiGianThamQuan}h tham quan</span>
							<span className='price'>{tienVietNam(tongChiPhi)}</span>
						</div>
					</div>
				}
			/>
		</Card>
	);
};

export default CardDiemDen;
