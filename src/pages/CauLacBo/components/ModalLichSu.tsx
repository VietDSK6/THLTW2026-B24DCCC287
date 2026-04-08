import { TrangThaiColor, TrangThaiLabel } from '@/services/CauLacBo/constant';
import { Modal, Tag, Timeline } from 'antd';
import moment from 'moment';

interface Props {
	visible: boolean;
	onCancel: () => void;
	lichSu: DonDangKy.ILichSu[];
	hoTen?: string;
}

const ModalLichSu = (props: Props) => {
	const { visible, onCancel, lichSu, hoTen } = props;

	return (
		<Modal title={`Lịch sử thao tác - ${hoTen}`} visible={visible} onCancel={onCancel} footer={null} width={600}>
			<Timeline mode='left'>
				{lichSu?.map((item, index) => (
					<Timeline.Item
						key={index}
						color={TrangThaiColor[item.hanhDong]}
						label={moment(item.thoiGian).format('HH:mm DD/MM/YYYY')}
					>
						<p>
							<Tag color={TrangThaiColor[item.hanhDong]}>{TrangThaiLabel[item.hanhDong]}</Tag>
						</p>
						<p>
							<strong>Người thực hiện:</strong> {item.nguoiThucHien}
						</p>
						{item.ghiChu && (
							<p>
								<strong>Ghi chú:</strong> {item.ghiChu}
							</p>
						)}
					</Timeline.Item>
				))}
			</Timeline>
		</Modal>
	);
};

export default ModalLichSu;
