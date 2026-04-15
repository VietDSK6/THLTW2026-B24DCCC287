declare module LichTrinh {
	export interface DiemDenTrongNgay {
		diemDenId: string;
		diemDen?: DiemDen.IRecord;
		thuTu: number;
		thoiGianDiChuyen?: number;
	}

	export interface NgayTrongTrinh {
		ngay: number;
		diemDens: DiemDenTrongNgay[];
	}

	export interface NganSachHangMuc {
		anUong: number;
		diChuyen: number;
		luuTru: number;
		veThamQuan: number;
	}

	export interface IRecord {
		_id: string;
		ten: string;
		ngayBatDau: string;
		soNgay: number;
		chiTiet: NgayTrongTrinh[];
		tongNganSach: number;
		nganSachDuKien: number;
		nganSachTheoHangMuc: NganSachHangMuc;
		createdAt?: string;
		updatedAt?: string;
	}
}
