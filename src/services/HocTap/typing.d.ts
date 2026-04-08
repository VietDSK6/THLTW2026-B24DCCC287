declare module HocTap {
	export interface MonHoc {
		id: string;
		ten: string;
	}

	export interface BuoiHoc {
		id: string;
		monHocId: string;
		thoiGian: string;
		thoiLuong: number;
		noiDung: string;
		ghiChu: string;
	}

	export interface MucTieu {
		id: string;
		monHocId: string;
		thang: string;
		thoiLuongMucTieu: number;
	}
}
