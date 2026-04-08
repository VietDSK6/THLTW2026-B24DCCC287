declare module CauLacBo {
	export interface IRecord {
		_id: string;
		anhDaiDien?: { fileList: any[] };
		tenCLB: string;
		ngayThanhLap: string;
		moTa?: string;
		chuNhiem: string;
		hoatDong: boolean;
		createdAt?: string;
		updatedAt?: string;
	}
}

declare module DonDangKy {
	export type ETrangThai = 'PENDING' | 'APPROVED' | 'REJECTED';

	export interface ILichSu {
		thoiGian: string;
		hanhDong: ETrangThai;
		nguoiThucHien: string;
		ghiChu?: string;
	}

	export interface IRecord {
		_id: string;
		hoTen: string;
		email: string;
		soDienThoai: string;
		gioiTinh: 'Nam' | 'Nu' | 'Khac';
		diaChi?: string;
		soTruong?: string;
		cauLacBoId: string;
		lyDoDangKy?: string;
		trangThai: ETrangThai;
		ghiChu?: string;
		lichSu: ILichSu[];
		createdAt?: string;
		updatedAt?: string;
	}
}
