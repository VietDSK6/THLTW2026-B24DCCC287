declare namespace TraCuuVanBang {
	interface ISearchParams {
		soHieuVanBang?: string;
		soVaoSo?: number;
		maSinhVien?: string;
		hoTen?: string;
		ngaySinh?: string;
	}

	interface ISearchResult extends ThongTinVanBang.IRecord {
		quyetDinhInfo?: QuyetDinh.IRecord;
	}
}
