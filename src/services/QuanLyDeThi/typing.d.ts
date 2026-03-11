declare module QuanLyDeThi {
	type MucDoKho = 'de' | 'trung_binh' | 'kho' | 'rat_kho';

	interface KhoiKienThuc {
		ma: string;
		ten: string;
		moTa?: string;
	}

	interface MonHoc {
		maMon: string;
		tenMon: string;
		soTinChi: number;
	}

	interface CauHoi {
		maCauHoi: string;
		maMon: string;
		khoiKienThuc: string;
		noiDung: string;
		mucDoKho: MucDoKho;
		ngayTao: number;
	}

	interface YeuCauCauHoi {
		mucDoKho: MucDoKho;
		khoiKienThuc: string;
		soLuong: number;
	}

	interface CauTrucDe {
		maCauTruc: string;
		tenCauTruc: string;
		maMon: string;
		danhSachYeuCau: YeuCauCauHoi[];
		ngayTao: number;
	}

	interface DeThi {
		maDe: string;
		tenDe: string;
		maMon: string;
		ngayTao: number;
		cauTruc?: string;
		danhSachCauHoi: string[];
		trangThai: 'nhap' | 'hoan_thanh';
	}

	interface FilterCauHoi {
		maMon?: string;
		mucDoKho?: MucDoKho;
		khoiKienThuc?: string;
	}
}
