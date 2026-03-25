export const LOCAL_STORAGE_KEY = 'vanbang_cauhinh';

export const KIEU_DU_LIEU_OPTIONS = [
	{ value: 'String', label: 'Chuỗi' },
	{ value: 'Number', label: 'Số' },
	{ value: 'Date', label: 'Ngày tháng' },
];

export const MAC_DINH_FIELDS = [
	{ tenTruong: 'Số vào sổ', maTruong: 'soVaoSo', kieuDuLieu: 'Number', thuTu: 1, laMacDinh: true },
	{ tenTruong: 'Số hiệu văn bằng', maTruong: 'soHieuVanBang', kieuDuLieu: 'String', thuTu: 2, laMacDinh: true },
	{ tenTruong: 'Mã sinh viên', maTruong: 'maSinhVien', kieuDuLieu: 'String', thuTu: 3, laMacDinh: true },
	{ tenTruong: 'Họ tên', maTruong: 'hoTen', kieuDuLieu: 'String', thuTu: 4, laMacDinh: true },
	{ tenTruong: 'Ngày sinh', maTruong: 'ngaySinh', kieuDuLieu: 'Date', thuTu: 5, laMacDinh: true },
];
