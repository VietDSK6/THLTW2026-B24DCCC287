import { useState } from 'react';
import { notification } from 'antd';

const STORAGE_KEY = 'oan_tu_ti_history';

// Map kết quả
const KET_QUA_MAP: Record<string, OanTuTi.KetQua> = {
	'keo-keo': 'hoa',
	'keo-bua': 'thua',
	'keo-bao': 'thang',
	'bua-keo': 'thang',
	'bua-bua': 'hoa',
	'bua-bao': 'thua',
	'bao-keo': 'thua',
	'bao-bua': 'thang',
	'bao-bao': 'hoa',
};

export default () => {
	const [lichSu, setLichSu] = useState<OanTuTi.VanDau[]>([]);
	const [vanHienTai, setVanHienTai] = useState<OanTuTi.VanDau | null>(null);
	const [dangChoi, setDangChoi] = useState<boolean>(false);
	const [thongKe, setThongKe] = useState<OanTuTi.ThongKe>({
		tongVan: 0,
		soVanThang: 0,
		soVanThua: 0,
		soVanHoa: 0,
		tiLeThang: 0,
	});


	// Tính toán thống kê
	const tinhThongKe = (data: OanTuTi.VanDau[]) => {
		const tongVan = data.length;
		const soVanThang = data.filter((v) => v.ketQua === 'thang').length;
		const soVanThua = data.filter((v) => v.ketQua === 'thua').length;
		const soVanHoa = data.filter((v) => v.ketQua === 'hoa').length;
		const tiLeThang = tongVan > 0 ? Math.round((soVanThang / tongVan) * 100) : 0;

		setThongKe({
			tongVan,
			soVanThang,
			soVanThua,
			soVanHoa,
			tiLeThang,
		});
	};

	const layLichSu = () => {
		try {
			const data = localStorage.getItem(STORAGE_KEY);
			if (data) {
				const parsedData = JSON.parse(data) as OanTuTi.VanDau[];
				setLichSu(parsedData);
				tinhThongKe(parsedData);
			}
		} catch (error) {
			console.error('Lỗi khi load lịch sử:', error);
		}
	};

	const taoLuaChonMay = (): [OanTuTi.LuaChon, string] => {
		const choices: OanTuTi.LuaChon[] = ['keo', 'bua', 'bao'];
		const labels: string[] = ['Kéo', 'Búa', 'Bao'];
		const timestamp = Date.now();
		const randomIdx = Math.floor((timestamp * Math.random()) % 3);
		return [choices[randomIdx], labels[randomIdx]];
	};

	const xetKetQua = (nguoiChoi: OanTuTi.LuaChon, mayTinh: OanTuTi.LuaChon): OanTuTi.KetQua => {
		const key = `${nguoiChoi}-${mayTinh}`;
		return KET_QUA_MAP[key] || 'hoa';
	};

	const choi = async (luaChonNguoi: OanTuTi.LuaChon, label: string) => {
		if (dangChoi) return;

		setDangChoi(true);

		const delayTime = 500 + Math.floor(Math.random() * 1000);

		setTimeout(() => {
			const luaChonMay = taoLuaChonMay();
			const ketQua = xetKetQua(luaChonNguoi, luaChonMay[0]);

			const vanMoi: OanTuTi.VanDau = {
				id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				nguoiChoi: luaChonNguoi,
				mayTinh: luaChonMay[0],
				ketQua,
				thoiGian: Date.now(),
			};

			setVanHienTai(vanMoi);

			// Update lịch sử
			const lichSuMoi = [vanMoi, ...lichSu].slice(0, 50); // Giữ tối đa 50 ván
			setLichSu(lichSuMoi);
			tinhThongKe(lichSuMoi);

			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(lichSuMoi));
			} catch (error) {
				console.error('Lỗi khi lưu lịch sử:', error);
			}

			const msg = ketQua === 'thang' ? 'Bạn thắng rồi!' : ketQua === 'thua' ? 'Bạn thua rồi!' : 'Hòa rồi!';

			notification[ketQua === 'thang' ? 'success' : ketQua === 'thua' ? 'error' : 'info']({
				message: msg,
				description: `Bạn: ${label.toUpperCase()} - Máy: ${luaChonMay[1].toUpperCase()}`,
				duration: 2,
			});

			setDangChoi(false);
		}, delayTime);
	};

	// Xóa lịch sử
	const xoaLichSu = () => {
		try {
			localStorage.removeItem(STORAGE_KEY);
			setLichSu([]);
			setVanHienTai(null);
			setThongKe({
				tongVan: 0,
				soVanThang: 0,
				soVanThua: 0,
				soVanHoa: 0,
				tiLeThang: 0,
			});
			notification.success({
				message: 'Đã xóa lịch sử!',
				duration: 2,
			});
		} catch (error) {
			console.error('Lỗi khi xóa lịch sử:', error);
		}
	};

	return {
		lichSu,
		vanHienTai,
		dangChoi,
		thongKe,
		layLichSu,
		choi,
		xoaLichSu,
	};
};
