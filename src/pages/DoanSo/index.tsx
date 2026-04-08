import { Button, Card, InputNumber } from 'antd';
import { useState } from 'react';
import './index.less';

const MAX_LUOT = 10;

const taoSoNgauNhien = (): number => {
	return Math.floor(Math.random() * 100) + 1;
};


const DoanSo: React.FC = () => {
	const [soCanTim, setSoCanTim] = useState<number>(taoSoNgauNhien());
	const [duDoan, setDuDoan] = useState<number | null>(null);
	const [thongBao, setThongBao] = useState<string>('');
	const [loaiTB, setLoaiTB] = useState<string>('');
	const [lichSu, setLichSu] = useState<{ lan: number; so: number; ketQua: string }[]>([]);
	const [hetLuot, setHetLuot] = useState<boolean>(false);
	const [thang, setThang] = useState<boolean>(false);

	const soLuotConLai = MAX_LUOT - lichSu.length;

	const xuLyDoan = () => {
		if (duDoan === null || duDoan < 1 || duDoan > 100) return;
		if (hetLuot || thang) return;

		let kq = '';
		let loai = '';

		if (duDoan < soCanTim) {
			kq = 'Bạn đoán quá thấp!';
			loai = 'msg-low';
		} else if (duDoan > soCanTim) {
			kq = 'Bạn đoán quá cao!';
			loai = 'msg-high';
		} else {
			kq = 'Chúc mừng! Bạn đã đoán đúng!';
			loai = 'msg-correct';
			setThang(true);
		}

		const lanMoi = {
			lan: lichSu.length + 1,
			so: duDoan,
			ketQua: kq,
		};

		const lichSuMoi = [...lichSu, lanMoi];
		setLichSu(lichSuMoi);
		setThongBao(kq);
		setLoaiTB(loai);

		if (!thang && duDoan !== soCanTim && lichSuMoi.length >= MAX_LUOT) {
			setThongBao(`Bạn đã hết lượt! Số đúng là ${soCanTim}.`);
			setLoaiTB('msg-lose');
			setHetLuot(true);
		}

		setDuDoan(null);
	};

	const choiLai = () => {
		setSoCanTim(taoSoNgauNhien());
		setDuDoan(null);
		setThongBao('');
		setLoaiTB('');
		setLichSu([]);
		setHetLuot(false);
		setThang(false);
	};

	return (
		<Card>
			<div className='game-wrapper'>
				<div className='game-header'>
					<h1>Trò chơi đoán số</h1>
					<p>Hệ thống đã chọn một số từ 1 đến 100. Hãy thử đoán xem!</p>
				</div>

				<div className='attempts-info'>
					Số lượt còn lại: <b>{soLuotConLai}</b> / {MAX_LUOT}
				</div>

				{thongBao && <div className={`game-message ${loaiTB}`}>{thongBao}</div>}

				{!hetLuot && !thang ? (
					<div className='game-input-row'>
						<InputNumber
							min={1}
							max={100}
							value={duDoan}
							onChange={(val) => setDuDoan(val)}
							placeholder='Nhập số từ 1-100'
							style={{ flex: 1 }}
							onPressEnter={xuLyDoan}
						/>
						<Button type='primary' onClick={xuLyDoan} disabled={duDoan === null}>
							Đoán
						</Button>
					</div>
				) : (
					<div style={{ textAlign: 'center' }}>
						<Button type='primary' onClick={choiLai}>
							Chơi lại
						</Button>
					</div>
				)}

				{lichSu.length > 0 && (
					<div className='history-section'>
						<h3>Lịch sử các lần đoán:</h3>
						{lichSu.map((item) => (
							<div className='history-item' key={item.lan}>
								<span>
									Lần {item.lan}: <b>{item.so}</b>
								</span>
								<span>{item.ketQua}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</Card>
	);
};

export default DoanSo;
