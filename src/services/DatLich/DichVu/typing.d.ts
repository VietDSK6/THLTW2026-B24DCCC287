import { ETrangThaiDichVu } from '../constant';

declare global {
	namespace DichVu {
		export interface IRecord {
			_id: string;
			ma: string;
			ten: string;
			moTa?: string;
			gia: number;
			thoiGianThucHien: number;
			hinhAnh?: string;
			trangThai: ETrangThaiDichVu;
			createdAt?: string;
			updatedAt?: string;
		}
	}
}

export {};
