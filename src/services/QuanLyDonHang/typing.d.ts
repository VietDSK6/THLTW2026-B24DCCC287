declare module QuanLyDonHang {
	type TrangThai = 'cho_xac_nhan' | 'dang_giao' | 'hoan_thanh' | 'huy';

	interface SanPham {
		maSanPham: string;
		tenSanPham: string;
		donGia: number;
	}

	interface SanPhamTrongDon {
		maSanPham: string;
		tenSanPham: string;
		soLuong: number;
		donGia: number;
		thanhTien: number;
	}

	interface DonHang {
		maDonHang: string;
		khachHang: string;
		ngayDatHang: string;
		danhSachSanPham: SanPhamTrongDon[];
		tongTien: number;
		trangThai: TrangThai;
	}
}
