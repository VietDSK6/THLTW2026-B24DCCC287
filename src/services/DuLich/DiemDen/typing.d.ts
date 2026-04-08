declare module DiemDen {
	export type LoaiHinh = 'bien' | 'nui' | 'thanh_pho';

	export interface ChiPhi {
		anUong: number;
		diChuyen: number;
		luuTru: number;
		veThamQuan: number;
	}

	export interface IRecord {
		_id: string;
		ten: string;
		moTa: string;
		diaDiem: string;
		loaiHinh: LoaiHinh;
		hinhAnh: string;
		rating: number;
		thoiGianThamQuan: number;
		chiPhi: ChiPhi;
		createdAt?: string;
		updatedAt?: string;
	}
}
