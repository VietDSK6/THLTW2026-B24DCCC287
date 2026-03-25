declare namespace SoVanBang {
	interface IRecord {
		_id: string;
		namSo: number;
		tenSo: string;
		tienToSoHieu: string;
		soHienTai: number;
		trangThai: 'dang_su_dung' | 'da_dong';
		ngayMoSo: string;
		ngayDongSo?: string;
		createdAt: string;
		updatedAt: string;
	}

	interface IFilter {
		namSo?: number;
		trangThai?: 'dang_su_dung' | 'da_dong';
	}
}
