import { ETrangThaiNhanVien } from '../constant';

declare global {
	namespace NhanVien {
		export interface ILichLamViec {
			thu: number;
			gioMoCua: string;
			gioDongCua: string;
			nghiPhep?: boolean;
		}

		export interface IRecord {
			_id: string;
			ma: string;
			hoTen: string;
			soDienThoai: string;
			email?: string;
			avatar?: string;
			soKhachToiDa: number;
			dichVu: string[];
			lichLamViec: ILichLamViec[];
			diemDanhGiaTB?: number;
			trangThai: ETrangThaiNhanVien;
			createdAt?: string;
			updatedAt?: string;
		}
	}
}

export {};
