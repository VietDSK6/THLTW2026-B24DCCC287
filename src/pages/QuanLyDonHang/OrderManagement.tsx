import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { Table, Tag, Button, Modal, Form, Input, InputNumber, Select, Space, Card, Descriptions } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, ORDER_STATUS } from './constants';
import styles from './index.less';

interface OrderTableProps {
	orders: QuanLyDonHang.Order[];
	products: QuanLyDonHang.Product[];
	onUpdate: (orders: QuanLyDonHang.Order[]) => void;
	onProductUpdate: (products: QuanLyDonHang.Product[]) => void;
	filters: QuanLyDonHang.OrderFilter;
}

const OrderTable: FC<OrderTableProps> = ({ orders, products, onUpdate, onProductUpdate, filters }) => {
	const [detailOrder, setDetailOrder] = useState<QuanLyDonHang.Order | null>(null);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Chờ xử lý':
				return 'blue';
			case 'Đang giao':
				return 'orange';
			case 'Hoàn thành':
				return 'success';
			case 'Đã hủy':
				return 'error';
			default:
				return 'default';
		}
	};

	const filteredOrders = useMemo(() => {
		let result = [...orders];

		if (filters.search) {
			result = result.filter(
				(o) =>
					o.id.toLowerCase().includes(filters.search!.toLowerCase()) ||
					o.customerName.toLowerCase().includes(filters.search!.toLowerCase()),
			);
		}

		if (filters.status) {
			result = result.filter((o) => o.status === filters.status);
		}

		if (filters.dateRange && filters.dateRange.length === 2) {
			const [start, end] = filters.dateRange;
			result = result.filter((o) => o.createdAt >= start && o.createdAt <= end);
		}

		return result;
	}, [orders, filters]);

	const handleStatusChange = (orderId: string, newStatus: string) => {
		const order = orders.find((o) => o.id === orderId);
		if (!order) return;

		const oldStatus = order.status;
		const updatedOrders = orders.map((o) =>
			o.id === orderId ? { ...o, status: newStatus as QuanLyDonHang.Order['status'] } : o,
		);
		onUpdate(updatedOrders);

		if (newStatus === 'Hoàn thành' && oldStatus !== 'Hoàn thành') {
			const updatedProducts = products.map((p) => {
				const orderProduct = order.products.find((op) => op.productId === p.id);
				if (orderProduct) {
					return { ...p, quantity: p.quantity - orderProduct.quantity };
				}
				return p;
			});
			onProductUpdate(updatedProducts);
		}

		if (newStatus === 'Đã hủy' && oldStatus === 'Hoàn thành') {
			const updatedProducts = products.map((p) => {
				const orderProduct = order.products.find((op) => op.productId === p.id);
				if (orderProduct) {
					return { ...p, quantity: p.quantity + orderProduct.quantity };
				}
				return p;
			});
			onProductUpdate(updatedProducts);
		}
	};

	const columns: ColumnType<QuanLyDonHang.Order>[] = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'id',
			key: 'id',
			width: 120,
		},
		{
			title: 'Tên khách hàng',
			dataIndex: 'customerName',
			key: 'customerName',
		},
		{
			title: 'Số sản phẩm',
			key: 'productCount',
			render: (_: any, record: QuanLyDonHang.Order) => record.products.reduce((sum, p) => sum + p.quantity, 0),
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			sorter: (a, b) => a.totalAmount - b.totalAmount,
			render: (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`,
		},
		{
			title: 'Trạng thái',
			key: 'status',
			render: (_: any, record: QuanLyDonHang.Order) => (
				<Select value={record.status} style={{ width: 130 }} onChange={(value) => handleStatusChange(record.id, value)}>
					{ORDER_STATUS.map((status) => (
						<Select.Option key={status} value={status}>
							<Tag color={getStatusColor(status)}>{status}</Tag>
						</Select.Option>
					))}
				</Select>
			),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 100,
			render: (_: any, record: QuanLyDonHang.Order) => (
				<Button type='link' icon={<EyeOutlined />} onClick={() => setDetailOrder(record)}>
					Chi tiết
				</Button>
			),
		},
	];

	return (
		<>
			<Table columns={columns} dataSource={filteredOrders} rowKey='id' pagination={{ pageSize: 5 }} />
			<Modal
				title='Chi tiết đơn hàng'
				visible={!!detailOrder}
				onCancel={() => setDetailOrder(null)}
				footer={null}
				width={700}
			>
				{detailOrder && (
					<>
						<Descriptions bordered column={2}>
							<Descriptions.Item label='Mã đơn hàng'>{detailOrder.id}</Descriptions.Item>
							<Descriptions.Item label='Trạng thái'>
								<Tag color={getStatusColor(detailOrder.status)}>{detailOrder.status}</Tag>
							</Descriptions.Item>
							<Descriptions.Item label='Khách hàng'>{detailOrder.customerName}</Descriptions.Item>
							<Descriptions.Item label='Số điện thoại'>{detailOrder.phone}</Descriptions.Item>
							<Descriptions.Item label='Địa chỉ' span={2}>
								{detailOrder.address}
							</Descriptions.Item>
							<Descriptions.Item label='Ngày tạo'>{detailOrder.createdAt}</Descriptions.Item>
							<Descriptions.Item label='Tổng tiền'>
								{detailOrder.totalAmount.toLocaleString('vi-VN')} ₫
							</Descriptions.Item>
						</Descriptions>
						<Table
							style={{ marginTop: 16 }}
							columns={[
								{ title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
								{ title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
								{
									title: 'Giá',
									dataIndex: 'price',
									key: 'price',
									render: (price: number) => `${price.toLocaleString('vi-VN')} ₫`,
								},
								{
									title: 'Thành tiền',
									key: 'total',
									render: (_: any, record: QuanLyDonHang.OrderProduct) =>
										`${(record.quantity * record.price).toLocaleString('vi-VN')} ₫`,
								},
							]}
							dataSource={detailOrder.products}
							rowKey='productId'
							pagination={false}
						/>
					</>
				)}
			</Modal>
		</>
	);
};

interface CreateOrderFormProps {
	products: QuanLyDonHang.Product[];
	orders: QuanLyDonHang.Order[];
	onSubmit: (order: QuanLyDonHang.Order) => void;
}

const CreateOrderForm: FC<CreateOrderFormProps> = ({ products, orders, onSubmit }) => {
	const [form] = Form.useForm();
	const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
	const [quantities, setQuantities] = useState<Record<number, number>>({});

	const totalAmount = useMemo(() => {
		return selectedProducts.reduce((sum, productId) => {
			const product = products.find((p) => p.id === productId);
			const quantity = quantities[productId] || 0;
			return sum + (product?.price || 0) * quantity;
		}, 0);
	}, [selectedProducts, quantities, products]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			const newOrder: QuanLyDonHang.Order = {
				id: `DH${String(orders.length + 1).padStart(3, '0')}`,
				customerName: values.customerName,
				phone: values.phone,
				address: values.address,
				products: selectedProducts.map((productId) => {
					const product = products.find((p) => p.id === productId)!;
					return {
						productId,
						productName: product.name,
						quantity: quantities[productId],
						price: product.price,
					};
				}),
				totalAmount,
				status: 'Chờ xử lý',
				createdAt: new Date().toISOString().split('T')[0],
			};
			onSubmit(newOrder);
			form.resetFields();
			setSelectedProducts([]);
			setQuantities({});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Card title='Tạo đơn hàng mới' style={{ marginBottom: 24 }}>
			<Form form={form} layout='vertical'>
				<Form.Item
					label='Khách hàng'
					name='customerName'
					rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
				>
					<Input placeholder='Nguyễn Văn A' />
				</Form.Item>
				<Form.Item
					label='Số điện thoại'
					name='phone'
					rules={[
						{ required: true, message: 'Vui lòng nhập số điện thoại' },
						{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
					]}
				>
					<Input placeholder='0912345678' />
				</Form.Item>
				<Form.Item label='Địa chỉ' name='address' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
					<Input placeholder='123 Nguyễn Huệ, Q1, TP.HCM' />
				</Form.Item>
				<Form.Item label='Sản phẩm' name='products' rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}>
					<Select mode='multiple' placeholder='Chọn sản phẩm' onChange={(value) => setSelectedProducts(value)}>
						{products
							.filter((p) => p.quantity > 0)
							.map((p) => (
								<Select.Option key={p.id} value={p.id}>
									{p.name} (Còn: {p.quantity})
								</Select.Option>
							))}
					</Select>
				</Form.Item>
				{selectedProducts.map((productId) => {
					const product = products.find((p) => p.id === productId);
					return (
						<Form.Item
							key={productId}
							label={`Số lượng ${product?.name}`}
							required
							rules={[
								{ required: true, message: 'Vui lòng nhập số lượng' },
								{
									validator: async (_: any, value: number) => {
										if (value > (product?.quantity || 0)) {
											throw new Error('Số lượng vượt quá tồn kho');
										}
									},
								},
							]}
						>
							<InputNumber
								min={1}
								max={product?.quantity}
								value={quantities[productId]}
								onChange={(value) => setQuantities({ ...quantities, [productId]: value || 0 })}
								style={{ width: '100%' }}
							/>
						</Form.Item>
					);
				})}
				{totalAmount > 0 && (
					<div style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold' }}>
						Tổng tiền: {totalAmount.toLocaleString('vi-VN')} ₫
					</div>
				)}
				<Button type='primary' onClick={handleSubmit}>
					Tạo đơn hàng
				</Button>
			</Form>
		</Card>
	);
};

const OrderManagement: FC = () => {
	const [orders, setOrders] = useLocalStorage<QuanLyDonHang.Order[]>('orders', INITIAL_ORDERS);
	const [products, setProducts] = useLocalStorage<QuanLyDonHang.Product[]>('products', INITIAL_PRODUCTS);
	const [filters, setFilters] = useState<QuanLyDonHang.OrderFilter>({});

	const handleCreateOrder = (order: QuanLyDonHang.Order) => {
		setOrders([...orders, order]);
	};

	return (
		<div className={styles.container}>
			<CreateOrderForm products={products} orders={orders} onSubmit={handleCreateOrder} />
			<Card>
				<Space direction='vertical' size='middle' style={{ width: '100%' }}>
					<Space wrap>
						<Input.Search
							placeholder='Tìm theo mã hoặc tên KH'
							style={{ width: 250 }}
							allowClear
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
						/>
						<Select
							placeholder='Trạng thái'
							style={{ width: 150 }}
							allowClear
							onChange={(value) => setFilters({ ...filters, status: value })}
						>
							{ORDER_STATUS.map((status) => (
								<Select.Option key={status} value={status}>
									{status}
								</Select.Option>
							))}
						</Select>
					</Space>
					<OrderTable
						orders={orders}
						products={products}
						onUpdate={setOrders}
						onProductUpdate={setProducts}
						filters={filters}
					/>
				</Space>
			</Card>
		</div>
	);
};

export default OrderManagement;
