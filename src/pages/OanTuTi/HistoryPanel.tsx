import type { FC } from 'react';
import { Card, Empty, Tag, Timeline } from 'antd';
import { TrophyOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import imgKeo from '@/assets/scissors.png';
import imgBua from '@/assets/fist.png';
import imgBao from '@/assets/paper.png';

interface HistoryPanelProps {
	lichSu: OanTuTi.VanDau[];
}

const ICON_MAP: Record<OanTuTi.LuaChon, string> = {
	keo: imgKeo,
	bua: imgBua,
	bao: imgBao,
};

const HistoryPanel: FC<HistoryPanelProps> = ({ lichSu }) => {
	if (!lichSu || lichSu.length === 0) {
		return (
			<Card title='Lịch sử đấu' className={styles.historyCard}>
				<Empty description='Chưa có ván nào' />
			</Card>
		);
	}

	// Helper format thời gian
	const formatTime = (timestamp: number) => {
		const date = new Date(timestamp);
		return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(
			2,
			'0',
		)}`;
	};

	return (
		<Card title='Lịch sử đấu' className={styles.historyCard}>
			<Timeline mode='left'>
				{lichSu.slice(0, 10).map((van) => {
					const color = van.ketQua === 'thang' ? 'green' : van.ketQua === 'thua' ? 'red' : 'orange';
					const icon =
						van.ketQua === 'thang' ? (
							<TrophyOutlined />
						) : van.ketQua === 'thua' ? (
							<CloseCircleOutlined />
						) : (
							<MinusCircleOutlined />
						);

					return (
						<Timeline.Item key={van.id} color={color} dot={icon}>
							<div className={styles.timelineItem}>
								<div className={styles.timelineTime}>{formatTime(van.thoiGian)}</div>
								<div className={styles.timelineContent}>
									<span>
										Bạn: <img src={ICON_MAP[van.nguoiChoi]} alt={van.nguoiChoi} /> vs Máy:{' '}
										<img src={ICON_MAP[van.mayTinh]} alt={van.mayTinh} />
									</span>
									<Tag color={color} style={{ marginLeft: 8 }}>
										{van.ketQua.toUpperCase()}
									</Tag>
								</div>
							</div>
						</Timeline.Item>
					);
				})}
			</Timeline>
		</Card>
	);
};

export default HistoryPanel;
