import { useState } from 'react';
import { notification } from 'antd';
import { STORAGE_KEY, PREFIX } from '@/services/QuanLyDonHang/constants';

export default () => {
	const [danhSachDonHang, setDanhSachDonHang] = useState<QuanLyDonHang.DonHang[]>([]);

	const loadFromStorage = (): QuanLyDonHang.DonHang[] => {
		try {
			const data = localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : [];
		} catch {
			return [];
		}
	};

	const saveToStorage = (data: QuanLyDonHang.DonHang[]): void => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch {
			notification.error({ message: 'Lỗi lưu dữ liệu!' });
		}
	};

	const taoMaTuDong = (danhSach: QuanLyDonHang.DonHang[]): string => {
		const soThuTu = danhSach.length + 1;
		const timestamp = Date.now().toString().slice(-4);
		return `${PREFIX}${String(soThuTu).padStart(3, '0')}_${timestamp}`;
	};

	const loadData = () => {
		setDanhSachDonHang(loadFromStorage());
	};

	const themDonHang = (data: Omit<QuanLyDonHang.DonHang, 'maDonHang'>): boolean => {
		const current = loadFromStorage();
		const donMoi: QuanLyDonHang.DonHang = { maDonHang: taoMaTuDong(current), ...data };
		const danhSachMoi = [...current, donMoi];
		setDanhSachDonHang(danhSachMoi);
		saveToStorage(danhSachMoi);
		notification.success({ message: 'Thêm đơn hàng thành công!' });
		return true;
	};

	const suaDonHang = (maDonHang: string, data: Omit<QuanLyDonHang.DonHang, 'maDonHang'>): boolean => {
		const current = loadFromStorage();
		const danhSachMoi = current.map((dh) => (dh.maDonHang === maDonHang ? { ...dh, ...data } : dh));
		setDanhSachDonHang(danhSachMoi);
		saveToStorage(danhSachMoi);
		notification.success({ message: 'Cập nhật đơn hàng thành công!' });
		return true;
	};

	const huyDonHang = (maDonHang: string): boolean => {
		const current = loadFromStorage();
		const donHang = current.find((dh) => dh.maDonHang === maDonHang);
		if (!donHang) {
			notification.error({ message: 'Không tìm thấy đơn hàng!' });
			return false;
		}
		if (donHang.trangThai !== 'cho_xac_nhan') {
			notification.error({
				message: 'Không thể hủy!',
				description: 'Chỉ được phép hủy đơn hàng ở trạng thái "Chờ xác nhận".',
			});
			return false;
		}
		const danhSachMoi = current.map((dh) =>
			dh.maDonHang === maDonHang ? { ...dh, trangThai: 'huy' as QuanLyDonHang.TrangThai } : dh,
		);
		setDanhSachDonHang(danhSachMoi);
		saveToStorage(danhSachMoi);
		notification.success({ message: 'Hủy đơn hàng thành công!' });
		return true;
	};

	return {
		danhSachDonHang,
		loadData,
		themDonHang,
		suaDonHang,
		huyDonHang,
	};
};
