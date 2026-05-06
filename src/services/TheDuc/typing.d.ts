import type { ELoaiBaiTap, ELoaiMucTieu, EMucDoKho, ENhomCo, ETrangThaiBuoiTap, ETrangThaiMucTieu } from './constant';

declare global {
	namespace BuoiTap {
		export interface IRecord {
			_id: string;
			ngay: string;
			loaiBaiTap: ELoaiBaiTap;
			thoiLuong: number;
			calo: number;
			ghiChu?: string;
			trangThai: ETrangThaiBuoiTap;
			createdAt?: string;
			updatedAt?: string;
		}
	}

	namespace ChiSoSucKhoe {
		export interface IRecord {
			_id: string;
			ngay: string;
			canNang: number;
			chieuCao: number;
			bmi: number;
			nhipTim?: number;
			gioNgu?: number;
			createdAt?: string;
			updatedAt?: string;
		}
	}

	namespace MucTieu {
		export interface IRecord {
			_id: string;
			ten: string;
			loai: ELoaiMucTieu;
			giaTriMucTieu: number;
			giaTriHienTai: number;
			deadline: string;
			trangThai: ETrangThaiMucTieu;
			createdAt?: string;
			updatedAt?: string;
		}
	}

	namespace BaiTap {
		export interface IRecord {
			_id: string;
			ten: string;
			nhomCo: ENhomCo;
			mucDoKho: EMucDoKho;
			moTa: string;
			caloTrungBinh: number;
			huongDan: string;
			createdAt?: string;
			updatedAt?: string;
		}
	}
}

export {};
