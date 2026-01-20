declare namespace QuanLySanPham {
	interface Product {
		id: number;
		name: string;
		price: number;
		quantity: number;
	}

	interface ProductFormValues {
		name: string;
		price: number;
		quantity: number;
	}
}
