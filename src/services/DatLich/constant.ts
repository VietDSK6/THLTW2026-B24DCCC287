export enum ETrangThaiNhanVien {
	HOAT_DONG = 'HOAT_DONG',
	NGHI_VIEC = 'NGHI_VIEC',
}

export enum ETrangThaiDichVu {
	HOAT_DONG = 'HOAT_DONG',
	TAM_NGUNG = 'TAM_NGUNG',
}

export enum ETrangThaiLichHen {
	CHO_DUYET = 'CHO_DUYET',
	XAC_NHAN = 'XAC_NHAN',
	HOAN_THANH = 'HOAN_THANH',
	HUY = 'HUY',
}

export const TrangThaiNhanVienText: Record<ETrangThaiNhanVien, string> = {
	[ETrangThaiNhanVien.HOAT_DONG]: 'Hoạt động',
	[ETrangThaiNhanVien.NGHI_VIEC]: 'Nghỉ việc',
};

export const TrangThaiDichVuText: Record<ETrangThaiDichVu, string> = {
	[ETrangThaiDichVu.HOAT_DONG]: 'Hoạt động',
	[ETrangThaiDichVu.TAM_NGUNG]: 'Tạm ngưng',
};

export const TrangThaiLichHenText: Record<ETrangThaiLichHen, string> = {
	[ETrangThaiLichHen.CHO_DUYET]: 'Chờ duyệt',
	[ETrangThaiLichHen.XAC_NHAN]: 'Xác nhận',
	[ETrangThaiLichHen.HOAN_THANH]: 'Hoàn thành',
	[ETrangThaiLichHen.HUY]: 'Hủy',
};

export const TrangThaiLichHenColor: Record<ETrangThaiLichHen, string> = {
	[ETrangThaiLichHen.CHO_DUYET]: 'gold',
	[ETrangThaiLichHen.XAC_NHAN]: 'blue',
	[ETrangThaiLichHen.HOAN_THANH]: 'green',
	[ETrangThaiLichHen.HUY]: 'red',
};

export const ThuTrongTuan = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export const GioLamViecMacDinh = {
	gioMoCua: '08:00',
	gioDongCua: '17:00',
};
