declare namespace Blog {
	interface BaiViet {
		id: string;
		tieuDe: string;
		slug: string;
		tomTat: string;
		noiDung: string;
		anhDaiDien: string;
		tacGia: string;
		tags: string[];
		trangThai: 'draft' | 'published';
		luotXem: number;
		ngayTao: string;
		ngayCapNhat: string;
	}

	interface Tag {
		id: string;
		ten: string;
	}
}
