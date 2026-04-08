declare namespace QuyetDinh {
	interface IRecord {
		_id: string;
		soQuyetDinh: string;
		ngayBanHanh: string;
		trichYeu: string;
		soVanBangId: string;
		soVanBangTen?: string;
		namSo?: number;
		soLuongVanBang: number;
		soLuotTraCuu: number;
		createdAt: string;
		updatedAt: string;
	}

	interface IFilter {
		soVanBangId?: string;
		namSo?: number;
	}
}
