import type { FC } from 'react';
import { Card } from 'antd';
import styles from './index.less';
import imgKeo from '@/assets/scissors.png';
import imgBua from '@/assets/fist.png';
import imgBao from '@/assets/paper.png';

interface GameResultProps {
	vanHienTai: OanTuTi.VanDau | null;
	dangChoi: boolean;
}

const ICON_MAP: Record<OanTuTi.LuaChon, string> = {
	keo: imgKeo,
	bua: imgBua,
	bao: imgBao,
};

const LABEL_MAP: Record<OanTuTi.LuaChon, string> = {
	keo: 'KÉO',
	bua: 'BÚA',
	bao: 'BAO',
};

const GameResult: FC<GameResultProps> = ({ vanHienTai, dangChoi }) => {
	if (dangChoi) {
		return (
			<Card className={styles.resultCard}>
				<div className={styles.resultLoading}>
					<div className={styles.loadingAnimation}>⏳</div>
					<div className={styles.loadingText}>Máy đang chọn...</div>
				</div>
			</Card>
		);
	}

	if (!vanHienTai) {
		return (
			<Card className={styles.resultCard}>
				<div className={styles.resultEmpty}>Chọn một lựa chọn để bắt đầu!</div>
			</Card>
		);
	}

	const bgColor = vanHienTai.ketQua === 'thang' ? '#f6ffed' : vanHienTai.ketQua === 'thua' ? '#fff2f0' : '#fffbe6';

	const borderColor = vanHienTai.ketQua === 'thang' ? '#52c41a' : vanHienTai.ketQua === 'thua' ? '#ff4d4f' : '#faad14';

	return (
		<Card className={styles.resultCard} style={{ backgroundColor: bgColor, borderColor }}>
			<div className={styles.resultContent}>
				<div className={styles.choices}>
					<div className={styles.choiceItem}>
						<div className={styles.choiceLabel}>Bạn chọn</div>
						<div className={styles.choiceIcon}>
							<img src={ICON_MAP[vanHienTai.nguoiChoi]} alt={vanHienTai.nguoiChoi} />
						</div>
						<div className={styles.choiceName}>{LABEL_MAP[vanHienTai.nguoiChoi]}</div>
					</div>

					<div className={styles.vsText}>VS</div>

					<div className={styles.choiceItem}>
						<div className={styles.choiceLabel}>Máy chọn</div>
						<div className={styles.choiceIcon}>
							<img src={ICON_MAP[vanHienTai.mayTinh]} alt={vanHienTai.mayTinh} />
						</div>
						<div className={styles.choiceName}>{LABEL_MAP[vanHienTai.mayTinh]}</div>
					</div>
				</div>

				<div className={styles.resultText} style={{ color: borderColor }}>
					{vanHienTai.ketQua === 'thang' && 'BẠN THẮNG!'}
					{vanHienTai.ketQua === 'thua' && 'BẠN THUA!'}
					{vanHienTai.ketQua === 'hoa' && 'HÒA!'}
				</div>
			</div>
		</Card>
	);
};

export default GameResult;
