import { useState } from 'react';
import { notification } from 'antd';
import { PREFIX, STORAGE_KEYS } from '@/services/QuanLyDeThi/constants';

export default () => {
	const [danhSachKhoiKT, setDanhSachKhoiKT] = useState<QuanLyDeThi.KhoiKienThuc[]>([]);
	const [danhSachMonHoc, setDanhSachMonHoc] = useState<QuanLyDeThi.MonHoc[]>([]);
	const [danhSachCauHoi, setDanhSachCauHoi] = useState<QuanLyDeThi.CauHoi[]>([]);
	const [danhSachCauTruc, setDanhSachCauTruc] = useState<QuanLyDeThi.CauTrucDe[]>([]);
	const [danhSachDeThi, setDanhSachDeThi] = useState<QuanLyDeThi.DeThi[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	// Helper: Load từ localStorage
	const loadFromStorage = <T>(key: string): T[] => {
		try {
			const data = localStorage.getItem(key);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error(`Lỗi load ${key}:`, error);
			return [];
		}
	};

	// Helper: Save vào localStorage
	const saveToStorage = <T>(key: string, data: T[]): void => {
		try {
			localStorage.setItem(key, JSON.stringify(data));
		} catch (error) {
			console.error(`Lỗi save ${key}:`, error);
			notification.error({ message: 'Lỗi lưu dữ liệu!', description: 'Có thể bộ nhớ đầy.' });
		}
	};

	// Load tất cả data
	const loadTatCaData = () => {
		setDanhSachKhoiKT(loadFromStorage<QuanLyDeThi.KhoiKienThuc>(STORAGE_KEYS.KHOI_KT));
		setDanhSachMonHoc(loadFromStorage<QuanLyDeThi.MonHoc>(STORAGE_KEYS.MON_HOC));
		setDanhSachCauHoi(loadFromStorage<QuanLyDeThi.CauHoi>(STORAGE_KEYS.CAU_HOI));
		setDanhSachCauTruc(loadFromStorage<QuanLyDeThi.CauTrucDe>(STORAGE_KEYS.CAU_TRUC));
		setDanhSachDeThi(loadFromStorage<QuanLyDeThi.DeThi>(STORAGE_KEYS.DE_THI));
	};

	// Auto-gen mã
	const taoMaTuDong = (prefix: string, danhSach: any[]): string => {
		const soThuTu = danhSach.length + 1;
		const timestamp = Date.now().toString().slice(-4);
		return `${prefix}${String(soThuTu).padStart(3, '0')}_${timestamp}`;
	};

	// ========== KHỐI KIẾN THỨC ==========
	const themKhoiKT = (data: Omit<QuanLyDeThi.KhoiKienThuc, 'ma'>) => {
		const khoiMoi: QuanLyDeThi.KhoiKienThuc = {
			ma: taoMaTuDong(PREFIX.KHOI_KT, danhSachKhoiKT),
			...data,
		};
		const danhSachMoi = [...danhSachKhoiKT, khoiMoi];
		setDanhSachKhoiKT(danhSachMoi);
		saveToStorage(STORAGE_KEYS.KHOI_KT, danhSachMoi);
		notification.success({ message: 'Thêm khối kiến thức thành công!' });
	};

	const suaKhoiKT = (ma: string, data: Partial<QuanLyDeThi.KhoiKienThuc>) => {
		const danhSachMoi = danhSachKhoiKT.map((item) => (item.ma === ma ? { ...item, ...data } : item));
		setDanhSachKhoiKT(danhSachMoi);
		saveToStorage(STORAGE_KEYS.KHOI_KT, danhSachMoi);
		notification.success({ message: 'Cập nhật khối kiến thức thành công!' });
	};

	const xoaKhoiKT = (ma: string) => {
		// Check có câu hỏi nào đang dùng không
		const coCauHoiDung = danhSachCauHoi.some((ch) => ch.khoiKienThuc === ma);
		if (coCauHoiDung) {
			notification.error({ message: 'Không thể xóa!', description: 'Còn câu hỏi đang sử dụng khối này.' });
			return;
		}

		const danhSachMoi = danhSachKhoiKT.filter((item) => item.ma !== ma);
		setDanhSachKhoiKT(danhSachMoi);
		saveToStorage(STORAGE_KEYS.KHOI_KT, danhSachMoi);
		notification.success({ message: 'Xóa khối kiến thức thành công!' });
	};

	// ========== MÔN HỌC ==========
	const themMonHoc = (data: Omit<QuanLyDeThi.MonHoc, 'maMon'>) => {
		const monMoi: QuanLyDeThi.MonHoc = {
			maMon: taoMaTuDong(PREFIX.MON_HOC, danhSachMonHoc),
			...data,
		};
		const danhSachMoi = [...danhSachMonHoc, monMoi];
		setDanhSachMonHoc(danhSachMoi);
		saveToStorage(STORAGE_KEYS.MON_HOC, danhSachMoi);
		notification.success({ message: 'Thêm môn học thành công!' });
	};

	const suaMonHoc = (maMon: string, data: Partial<QuanLyDeThi.MonHoc>) => {
		const danhSachMoi = danhSachMonHoc.map((item) => (item.maMon === maMon ? { ...item, ...data } : item));
		setDanhSachMonHoc(danhSachMoi);
		saveToStorage(STORAGE_KEYS.MON_HOC, danhSachMoi);
		notification.success({ message: 'Cập nhật môn học thành công!' });
	};

	const xoaMonHoc = (maMon: string) => {
		// Check có câu hỏi/đề/cấu trúc nào đang dùng không
		const coCauHoiDung = danhSachCauHoi.some((ch) => ch.maMon === maMon);
		const coCauTrucDung = danhSachCauTruc.some((ct) => ct.maMon === maMon);
		const coDeDung = danhSachDeThi.some((dt) => dt.maMon === maMon);

		if (coCauHoiDung || coCauTrucDung || coDeDung) {
			notification.error({ message: 'Không thể xóa!', description: 'Còn dữ liệu liên quan đang sử dụng môn này.' });
			return;
		}

		const danhSachMoi = danhSachMonHoc.filter((item) => item.maMon !== maMon);
		setDanhSachMonHoc(danhSachMoi);
		saveToStorage(STORAGE_KEYS.MON_HOC, danhSachMoi);
		notification.success({ message: 'Xóa môn học thành công!' });
	};

	// ========== CÂU HỎI ==========
	const themCauHoi = (data: Omit<QuanLyDeThi.CauHoi, 'maCauHoi' | 'ngayTao'>) => {
		const cauHoiMoi: QuanLyDeThi.CauHoi = {
			maCauHoi: taoMaTuDong(PREFIX.CAU_HOI, danhSachCauHoi),
			ngayTao: Date.now(),
			...data,
		};
		const danhSachMoi = [...danhSachCauHoi, cauHoiMoi];
		setDanhSachCauHoi(danhSachMoi);
		saveToStorage(STORAGE_KEYS.CAU_HOI, danhSachMoi);
		notification.success({ message: 'Thêm câu hỏi thành công!' });
	};

	const suaCauHoi = (maCauHoi: string, data: Partial<QuanLyDeThi.CauHoi>) => {
		const danhSachMoi = danhSachCauHoi.map((item) => (item.maCauHoi === maCauHoi ? { ...item, ...data } : item));
		setDanhSachCauHoi(danhSachMoi);
		saveToStorage(STORAGE_KEYS.CAU_HOI, danhSachMoi);
		notification.success({ message: 'Cập nhật câu hỏi thành công!' });
	};

	const xoaCauHoi = (maCauHoi: string) => {
		// Check có đề nào đang dùng không
		const coDeDung = danhSachDeThi.some((dt) => dt.danhSachCauHoi.includes(maCauHoi));
		if (coDeDung) {
			notification.error({ message: 'Không thể xóa!', description: 'Câu hỏi đang được dùng trong đề thi.' });
			return;
		}

		const danhSachMoi = danhSachCauHoi.filter((item) => item.maCauHoi !== maCauHoi);
		setDanhSachCauHoi(danhSachMoi);
		saveToStorage(STORAGE_KEYS.CAU_HOI, danhSachMoi);
		notification.success({ message: 'Xóa câu hỏi thành công!' });
	};

	// Tìm kiếm câu hỏi theo filter
	const timKiemCauHoi = (filter: QuanLyDeThi.FilterCauHoi): QuanLyDeThi.CauHoi[] => {
		return danhSachCauHoi.filter((ch) => {
			if (filter.maMon && ch.maMon !== filter.maMon) return false;
			if (filter.mucDoKho && ch.mucDoKho !== filter.mucDoKho) return false;
			if (filter.khoiKienThuc && ch.khoiKienThuc !== filter.khoiKienThuc) return false;
			return true;
		});
	};

	// ========== CẤU TRÚC ĐỀ ==========
	const themCauTruc = (data: Omit<QuanLyDeThi.CauTrucDe, 'maCauTruc' | 'ngayTao'>) => {
		const cauTrucMoi: QuanLyDeThi.CauTrucDe = {
			maCauTruc: taoMaTuDong(PREFIX.CAU_TRUC, danhSachCauTruc),
			ngayTao: Date.now(),
			...data,
		};
		const danhSachMoi = [...danhSachCauTruc, cauTrucMoi];
		setDanhSachCauTruc(danhSachMoi);
		saveToStorage(STORAGE_KEYS.CAU_TRUC, danhSachMoi);
		notification.success({ message: 'Thêm cấu trúc đề thành công!' });
		return cauTrucMoi;
	};

	const suaCauTruc = (maCauTruc: string, data: Partial<QuanLyDeThi.CauTrucDe>) => {
		const danhSachMoi = danhSachCauTruc.map((item) => (item.maCauTruc === maCauTruc ? { ...item, ...data } : item));
		setDanhSachCauTruc(danhSachMoi);
		saveToStorage(STORAGE_KEYS.CAU_TRUC, danhSachMoi);
		notification.success({ message: 'Cập nhật cấu trúc đề thành công!' });
	};

	const xoaCauTruc = (maCauTruc: string) => {
		const danhSachMoi = danhSachCauTruc.filter((item) => item.maCauTruc !== maCauTruc);
		setDanhSachCauTruc(danhSachMoi);
		saveToStorage(STORAGE_KEYS.CAU_TRUC, danhSachMoi);
		notification.success({ message: 'Xóa cấu trúc đề thành công!' });
	};

	// ========== ĐỀ THI ==========
	// Bốc câu hỏi ngẫu nhiên
	const bocCauHoi = (poolCauHoi: QuanLyDeThi.CauHoi[], soLuong: number): QuanLyDeThi.CauHoi[] => {
		const poolIdx = Array.from({ length: poolCauHoi.length }, (_, i) => i);
		const ketQua: QuanLyDeThi.CauHoi[] = [];

		while (ketQua.length < soLuong && poolIdx.length > 0) {
			const randomIdx = Math.floor(Math.random() * poolIdx.length);
			const realIdx = poolIdx.splice(randomIdx, 1)[0];
			ketQua.push(poolCauHoi[realIdx]);
		}

		return ketQua;
	};

	// Check đủ câu hỏi theo yêu cầu
	const kiemTraDuCauHoi = (
		maMon: string,
		danhSachYeuCau: QuanLyDeThi.YeuCauCauHoi[],
	): { ok: boolean; message?: string } => {
		for (const yc of danhSachYeuCau) {
			const poolCauHoi = timKiemCauHoi({
				maMon,
				mucDoKho: yc.mucDoKho,
				khoiKienThuc: yc.khoiKienThuc,
			});

			if (poolCauHoi.length < yc.soLuong) {
				return {
					ok: false,
					message: `Không đủ câu hỏi! Cần ${yc.soLuong} câu ${yc.mucDoKho} - ${yc.khoiKienThuc}, chỉ có ${poolCauHoi.length}.`,
				};
			}
		}
		return { ok: true };
	};

	// Tạo đề từ cấu trúc
	const taoDeTuCauTruc = (
		tenDe: string,
		cauTruc: QuanLyDeThi.CauTrucDe,
		trangThai: QuanLyDeThi.DeThi['trangThai'] = 'hoan_thanh',
	): QuanLyDeThi.DeThi | null => {
		// Check đủ câu không
		const checkResult = kiemTraDuCauHoi(cauTruc.maMon, cauTruc.danhSachYeuCau);
		if (!checkResult.ok) {
			notification.error({ message: 'Không thể tạo đề!', description: checkResult.message });
			return null;
		}

		// Bốc câu theo từng yêu cầu
		const tatCaCauHoiDaBoc: QuanLyDeThi.CauHoi[] = [];
		for (const yc of cauTruc.danhSachYeuCau) {
			const poolCauHoi = timKiemCauHoi({
				maMon: cauTruc.maMon,
				mucDoKho: yc.mucDoKho,
				khoiKienThuc: yc.khoiKienThuc,
			});

			const cauHoiBoc = bocCauHoi(poolCauHoi, yc.soLuong);
			tatCaCauHoiDaBoc.push(...cauHoiBoc);
		}

		const deMoi: QuanLyDeThi.DeThi = {
			maDe: taoMaTuDong(PREFIX.DE_THI, danhSachDeThi),
			tenDe,
			maMon: cauTruc.maMon,
			ngayTao: Date.now(),
			cauTruc: cauTruc.maCauTruc,
			danhSachCauHoi: tatCaCauHoiDaBoc.map((ch) => ch.maCauHoi),
			trangThai,
		};

		const danhSachMoi = [...danhSachDeThi, deMoi];
		setDanhSachDeThi(danhSachMoi);
		saveToStorage(STORAGE_KEYS.DE_THI, danhSachMoi);
		notification.success({
			message: `Tạo đề "${tenDe}" thành công!`,
			description: `Tổng ${tatCaCauHoiDaBoc.length} câu hỏi.`,
		});
		return deMoi;
	};

	// Tạo đề custom (không từ cấu trúc)
	const taoDeTuYeuCau = (
		tenDe: string,
		maMon: string,
		danhSachYeuCau: QuanLyDeThi.YeuCauCauHoi[],
		trangThai: QuanLyDeThi.DeThi['trangThai'] = 'hoan_thanh',
	): QuanLyDeThi.DeThi | null => {
		// Tương tự logic trên
		const checkResult = kiemTraDuCauHoi(maMon, danhSachYeuCau);
		if (!checkResult.ok) {
			notification.error({ message: 'Không thể tạo đề!', description: checkResult.message });
			return null;
		}

		const tatCaCauHoiDaBoc: QuanLyDeThi.CauHoi[] = [];
		for (const yc of danhSachYeuCau) {
			const poolCauHoi = timKiemCauHoi({
				maMon,
				mucDoKho: yc.mucDoKho,
				khoiKienThuc: yc.khoiKienThuc,
			});

			const cauHoiBoc = bocCauHoi(poolCauHoi, yc.soLuong);
			tatCaCauHoiDaBoc.push(...cauHoiBoc);
		}

		const deMoi: QuanLyDeThi.DeThi = {
			maDe: taoMaTuDong(PREFIX.DE_THI, danhSachDeThi),
			tenDe,
			maMon,
			ngayTao: Date.now(),
			danhSachCauHoi: tatCaCauHoiDaBoc.map((ch) => ch.maCauHoi),
			trangThai,
		};

		const danhSachMoi = [...danhSachDeThi, deMoi];
		setDanhSachDeThi(danhSachMoi);
		saveToStorage(STORAGE_KEYS.DE_THI, danhSachMoi);
		notification.success({
			message: `Tạo đề "${tenDe}" thành công!`,
			description: `Tổng ${tatCaCauHoiDaBoc.length} câu hỏi.`,
		});
		return deMoi;
	};

	const suaDeThi = (maDe: string, data: Partial<QuanLyDeThi.DeThi>) => {
		const danhSachMoi = danhSachDeThi.map((item) => (item.maDe === maDe ? { ...item, ...data } : item));
		setDanhSachDeThi(danhSachMoi);
		saveToStorage(STORAGE_KEYS.DE_THI, danhSachMoi);
		notification.success({ message: 'Cập nhật đề thi thành công!' });
	};

	const xoaDeThi = (maDe: string) => {
		const danhSachMoi = danhSachDeThi.filter((item) => item.maDe !== maDe);
		setDanhSachDeThi(danhSachMoi);
		saveToStorage(STORAGE_KEYS.DE_THI, danhSachMoi);
		notification.success({ message: 'Xóa đề thi thành công!' });
	};

	// Export đề thi ra JSON
	const xuatDeThi = (maDe: string) => {
		const deThi = danhSachDeThi.find((dt) => dt.maDe === maDe);
		if (!deThi) {
			notification.error({ message: 'Không tìm thấy đề thi!' });
			return;
		}

		const chiTietCauHoi = deThi.danhSachCauHoi.map((maCH) => danhSachCauHoi.find((ch) => ch.maCauHoi === maCH));

		const dataXuat = {
			...deThi,
			chiTietCauHoi,
		};

		const blob = new Blob([JSON.stringify(dataXuat, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${deThi.maDe}_${deThi.tenDe}.json`;
		a.click();
		URL.revokeObjectURL(url);
		notification.success({ message: 'Xuất đề thi thành công!' });
	};

	return {
		// State
		danhSachKhoiKT,
		danhSachMonHoc,
		danhSachCauHoi,
		danhSachCauTruc,
		danhSachDeThi,
		loading,
		setLoading,

		// Methods
		loadTatCaData,
		timKiemCauHoi,
		kiemTraDuCauHoi,

		// Khối KT
		themKhoiKT,
		suaKhoiKT,
		xoaKhoiKT,

		// Môn học
		themMonHoc,
		suaMonHoc,
		xoaMonHoc,

		// Câu hỏi
		themCauHoi,
		suaCauHoi,
		xoaCauHoi,

		// Cấu trúc
		themCauTruc,
		suaCauTruc,
		xoaCauTruc,

		// Đề thi
		taoDeTuCauTruc,
		taoDeTuYeuCau,
		suaDeThi,
		xoaDeThi,
		xuatDeThi,
	};
};
