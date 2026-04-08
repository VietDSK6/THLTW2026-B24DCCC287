import type { FC } from 'react';
import { useEffect } from 'react';
import { Button, Card, Col, Row, Statistic } from 'antd';
import { TrophyOutlined, CloseCircleOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import GameResult from './GameResult';
import HistoryPanel from './HistoryPanel';
import styles from './index.less';
import scissorsImg from '@/assets/scissors.png';
import fistImg from '@/assets/fist.png';
import paperImg from '@/assets/paper.png';

const OanTuTi: FC = () => {
	const { lichSu, vanHienTai, dangChoi, thongKe, layLichSu, choi, xoaLichSu } = useModel('oantuti');

	useEffect(() => {
		layLichSu();
	}, []);

	const BUTTON_CONFIG: { key: OanTuTi.LuaChon; icon: string; label: string; color: string }[] = [
		{ key: 'keo', icon: scissorsImg, label: 'KÉO', color: '#1890ff' },
		{ key: 'bua', icon: fistImg, label: 'BÚA', color: '#52c41a' },
		{ key: 'bao', icon: paperImg, label: 'BAO', color: '#faad14' },
	];

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>OẲN TÙ TÌ</h1>
				<p className={styles.subtitle}>Chọn một lựa chọn và thử vận may của bạn!</p>
			</div>

			{/* Kết quả hiện tại */}
			<GameResult vanHienTai={vanHienTai} dangChoi={dangChoi} />

			{/* 3 nút chọn */}
			<Row gutter={[16, 16]} className={styles.buttonRow}>
				{BUTTON_CONFIG.map((btn) => (
					<Col xs={24} sm={8} key={btn.key}>
						<Card
							hoverable
							className={styles.choiceCard}
							onClick={() => !dangChoi && choi(btn.key, btn.label)}
							style={{
								borderColor: btn.color,
								cursor: dangChoi ? 'not-allowed' : 'pointer',
								opacity: dangChoi ? 0.6 : 1,
							}}
						>
							<div className={styles.choiceButton}>
								<div className={styles.choiceButtonIcon}>
									<img src={btn.icon} alt={btn.label} />
								</div>
								<div className={styles.choiceButtonLabel}>{btn.label}</div>
							</div>
						</Card>
					</Col>
				))}
			</Row>

			{/* Thống kê */}
			<Card title='Thống kê' className={styles.statsCard}>
				<Row gutter={[16, 16]}>
					<Col xs={12} sm={6}>
						<Statistic title='Tổng số ván' value={thongKe.tongVan} />
					</Col>
					<Col xs={12} sm={6}>
						<Statistic
							title='Thắng'
							value={thongKe.soVanThang}
							valueStyle={{ color: '#52c41a' }}
							prefix={<TrophyOutlined />}
						/>
					</Col>
					<Col xs={12} sm={6}>
						<Statistic
							title='Thua'
							value={thongKe.soVanThua}
							valueStyle={{ color: '#ff4d4f' }}
							prefix={<CloseCircleOutlined />}
						/>
					</Col>
					<Col xs={12} sm={6}>
						<Statistic
							title='Hòa'
							value={thongKe.soVanHoa}
							valueStyle={{ color: '#faad14' }}
							prefix={<MinusCircleOutlined />}
						/>
					</Col>
				</Row>
				<div className={styles.statsFooter}>
					<div className={styles.winRate}>Tỉ lệ thắng: {thongKe.tiLeThang}%</div>
					<Button danger icon={<DeleteOutlined />} onClick={xoaLichSu} disabled={lichSu.length === 0}>
						Xóa lịch sử
					</Button>
				</div>
			</Card>

			{/* Lịch sử */}
			<HistoryPanel lichSu={lichSu} />
		</div>
	);
};

export default OanTuTi;
