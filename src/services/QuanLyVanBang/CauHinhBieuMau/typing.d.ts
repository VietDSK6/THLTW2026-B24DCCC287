declare namespace CauHinhBieuMau {
	interface IRecord {
		_id: string;
		soVanBangId: string;
		tenTruong: string;
		maTruong: string;
		kieuDuLieu: 'String' | 'Number' | 'Date';
		thuTu: number;
		batBuoc: boolean;
		ghiChu?: string;
		laMacDinh: boolean;
		createdAt: string;
		updatedAt: string;
	}

	interface IFilter {
		soVanBangId?: string;
	}
}
