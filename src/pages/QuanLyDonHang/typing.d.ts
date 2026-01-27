declare namespace QuanLyDonHang {
	export interface Product {
		id: number;
		name: string;
		category: string;
		price: number;
		quantity: number;
	}

	export interface OrderProduct {
		productId: number;
		productName: string;
		quantity: number;
		price: number;
	}

	export interface Order {
		id: string;
		customerName: string;
		phone: string;
		address: string;
		products: OrderProduct[];
		totalAmount: number;
		status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
		createdAt: string;
	}

	export interface ProductFilter {
		search?: string;
		category?: string;
		priceRange?: [number, number];
		status?: string;
	}

	export interface OrderFilter {
		search?: string;
		status?: string;
		dateRange?: [string, string];
	}

	export interface Statistics {
		totalProducts: number;
		totalInventoryValue: number;
		totalOrders: number;
		revenue: number;
		ordersByStatus: Record<string, number>;
	}
}
