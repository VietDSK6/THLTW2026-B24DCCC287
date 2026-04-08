declare global {
	namespace DanhGia {
		export interface IPhanHoi {
			noiDung: string;
			ngayPhanHoi: string;
			nguoiPhanHoi: string;
		}

		export interface IRecord {
			_id: string;
			lichHenId: string;
			nhanVienId: string;
			dichVuIds: string[];
			khachHang: string;
			diem: number;
			noiDung?: string;
			phanHoi?: IPhanHoi;
			createdAt?: string;
			updatedAt?: string;
		}
	}
}

export {};
