import { ETrangThaiLichHen } from '../constant';

declare global {
	namespace LichHen {
		export interface IKhachHang {
			hoTen: string;
			soDienThoai: string;
			email?: string;
		}

		export interface IRecord {
			_id: string;
			ma: string;
			khachHang: IKhachHang;
			nhanVienId: string;
			dichVuIds: string[];
			ngayHen: string;
			gioHen: string;
			gioKetThuc?: string;
			tongTien: number;
			tongThoiGian: number;
			ghiChu?: string;
			trangThai: ETrangThaiLichHen;
			createdAt?: string;
			updatedAt?: string;
		}
	}
}

export {};
