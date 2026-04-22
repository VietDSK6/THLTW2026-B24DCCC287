export const DANH_SACH_KHACH_HANG = [
	'Nguyễn Văn An',
	'Trần Thị Bình',
	'Lê Hoàng Cường',
	'Phạm Thị Dung',
	'Hoàng Minh Đức',
	'Ngô Thị Phương',
	'Vũ Văn Giang',
	'Đặng Thị Hoa',
	'Bùi Quốc Hùng',
	'Lý Thị Kim',
];

export const DANH_SACH_SAN_PHAM: QuanLyDonHang.SanPham[] = [
	{ maSanPham: 'SP001', tenSanPham: 'Áo thun nam', donGia: 250000 },
	{ maSanPham: 'SP002', tenSanPham: 'Quần jeans nữ', donGia: 450000 },
	{ maSanPham: 'SP003', tenSanPham: 'Giày thể thao', donGia: 850000 },
	{ maSanPham: 'SP004', tenSanPham: 'Túi xách da', donGia: 1200000 },
	{ maSanPham: 'SP005', tenSanPham: 'Mũ lưỡi trai', donGia: 150000 },
	{ maSanPham: 'SP006', tenSanPham: 'Kính râm thời trang', donGia: 350000 },
	{ maSanPham: 'SP007', tenSanPham: 'Đồng hồ nam', donGia: 2500000 },
	{ maSanPham: 'SP008', tenSanPham: 'Váy liền nữ', donGia: 550000 },
	{ maSanPham: 'SP009', tenSanPham: 'Áo khoác gió', donGia: 680000 },
	{ maSanPham: 'SP010', tenSanPham: 'Balo laptop', donGia: 750000 },
];

export const TRANG_THAI_OPTIONS: { label: string; value: QuanLyDonHang.TrangThai; color: string }[] = [
	{ label: 'Chờ xác nhận', value: 'cho_xac_nhan', color: 'gold' },
	{ label: 'Đang giao', value: 'dang_giao', color: 'blue' },
	{ label: 'Hoàn thành', value: 'hoan_thanh', color: 'green' },
	{ label: 'Hủy', value: 'huy', color: 'red' },
];

export const STORAGE_KEY = 'qldh_don_hang';
export const PREFIX = 'DH';
