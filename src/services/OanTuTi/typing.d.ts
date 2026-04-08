declare module OanTuTi {
	type LuaChon = 'keo' | 'bua' | 'bao';
	type KetQua = 'thang' | 'thua' | 'hoa';

	interface VanDau {
		id: string;
		nguoiChoi: LuaChon;
		mayTinh: LuaChon;
		ketQua: KetQua;
		thoiGian: number;
	}

	interface ThongKe {
		tongVan: number;
		soVanThang: number;
		soVanThua: number;
		soVanHoa: number;
		tiLeThang: number;
	}

}
