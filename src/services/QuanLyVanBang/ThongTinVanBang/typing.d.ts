declare namespace ThongTinVanBang {
	interface IRecord {
		_id: string;
		soVaoSo: number;
		soHieuVanBang: string;
		quyetDinhId: string;
		quyetDinhSo?: string;
		soVanBangId: string;
		maSinhVien: string;
		hoTen: string;
		ngaySinh: string;
		dynamicData: Record<string, any>;
		ngayCap: string;
		nguoiCap?: string;
		createdAt: string;
		updatedAt: string;
	}

	interface IFilter {
		quyetDinhId?: string;
		soVanBangId?: string;
		maSinhVien?: string;
		hoTen?: string;
	}
}
