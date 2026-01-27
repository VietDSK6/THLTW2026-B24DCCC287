import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { Table, Tag, Button, Modal, Form, Input, InputNumber, Select, Space, Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { INITIAL_PRODUCTS, CATEGORIES, PRODUCT_STATUS } from './constants';
import styles from './index.less';

interface ProductTableProps {
	products: QuanLyDonHang.Product[];
	onUpdate: (products: QuanLyDonHang.Product[]) => void;
	filters: QuanLyDonHang.ProductFilter;
}

const ProductTable: FC<ProductTableProps> = ({ products, onUpdate, filters }) => {
	const [editingProduct, setEditingProduct] = useState<QuanLyDonHang.Product | null>(null);
	const [form] = Form.useForm();

	const getProductStatus = (quantity: number) => {
		if (quantity === 0) return PRODUCT_STATUS.OUT_OF_STOCK;
		if (quantity <= 10) return PRODUCT_STATUS.LOW_STOCK;
		return PRODUCT_STATUS.IN_STOCK;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case PRODUCT_STATUS.IN_STOCK:
				return 'success';
			case PRODUCT_STATUS.LOW_STOCK:
				return 'warning';
			case PRODUCT_STATUS.OUT_OF_STOCK:
				return 'error';
			default:
				return 'default';
		}
	};

	const filteredProducts = useMemo(() => {
		let result = [...products];

		if (filters.search) {
			result = result.filter((p) => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
		}

		if (filters.category) {
			result = result.filter((p) => p.category === filters.category);
		}

		if (filters.priceRange) {
			const [min, max] = filters.priceRange;
			result = result.filter((p) => p.price >= min && p.price <= max);
		}

		if (filters.status) {
			result = result.filter((p) => getProductStatus(p.quantity) === filters.status);
		}

		return result;
	}, [products, filters]);

	const handleEdit = (product: QuanLyDonHang.Product) => {
		setEditingProduct(product);
		form.setFieldsValue(product);
	};

	const handleSave = async () => {
		try {
			const values = await form.validateFields();
			const updatedProducts = products.map((p) => (p.id === editingProduct?.id ? { ...p, ...values } : p));
			onUpdate(updatedProducts);
			setEditingProduct(null);
			form.resetFields();
		} catch (error) {
			console.error(error);
		}
	};

	const columns: ColumnType<QuanLyDonHang.Product>[] = [
		{
			title: 'STT',
			key: 'index',
			width: 60,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Danh mục',
			dataIndex: 'category',
			key: 'category',
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			sorter: (a, b) => a.price - b.price,
			render: (price: number) => `${price.toLocaleString('vi-VN')} ₫`,
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			sorter: (a, b) => a.quantity - b.quantity,
		},
		{
			title: 'Trạng thái',
			key: 'status',
			render: (_: any, record: QuanLyDonHang.Product) => {
				const status = getProductStatus(record.quantity);
				return <Tag color={getStatusColor(status)}>{status}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 100,
			render: (_: any, record: QuanLyDonHang.Product) => (
				<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)}>
					Sửa
				</Button>
			),
		},
	];

	return (
		<>
			<Table columns={columns} dataSource={filteredProducts} rowKey='id' pagination={{ pageSize: 5 }} />
			<Modal
				title='Chỉnh sửa sản phẩm'
				visible={!!editingProduct}
				onOk={handleSave}
				onCancel={() => {
					setEditingProduct(null);
					form.resetFields();
				}}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Danh mục' name='category' rules={[{ required: true }]}>
						<Select>
							{CATEGORIES.map((cat) => (
								<Select.Option key={cat} value={cat}>
									{cat}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label='Giá' name='price' rules={[{ required: true }]}>
						<InputNumber style={{ width: '100%' }} min={0} />
					</Form.Item>
					<Form.Item label='Số lượng' name='quantity' rules={[{ required: true }]}>
						<InputNumber style={{ width: '100%' }} min={0} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

const ProductManagement: FC = () => {
	const [products, setProducts] = useLocalStorage<QuanLyDonHang.Product[]>('products', INITIAL_PRODUCTS);
	const [filters, setFilters] = useState<QuanLyDonHang.ProductFilter>({});

	return (
		<div className={styles.container}>
			<Card>
				<Space direction='vertical' size='middle' style={{ width: '100%' }}>
					<Space wrap>
						<Input.Search
							placeholder='Tìm kiếm sản phẩm'
							style={{ width: 250 }}
							allowClear
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
						/>
						<Select
							placeholder='Danh mục'
							style={{ width: 150 }}
							allowClear
							onChange={(value) => setFilters({ ...filters, category: value })}
						>
							{CATEGORIES.map((cat) => (
								<Select.Option key={cat} value={cat}>
									{cat}
								</Select.Option>
							))}
						</Select>
						<Select
							placeholder='Trạng thái'
							style={{ width: 150 }}
							allowClear
							onChange={(value) => setFilters({ ...filters, status: value })}
						>
							<Select.Option value={PRODUCT_STATUS.IN_STOCK}>Còn hàng</Select.Option>
							<Select.Option value={PRODUCT_STATUS.LOW_STOCK}>Sắp hết</Select.Option>
							<Select.Option value={PRODUCT_STATUS.OUT_OF_STOCK}>Hết hàng</Select.Option>
						</Select>
					</Space>
					<ProductTable products={products} onUpdate={setProducts} filters={filters} />
				</Space>
			</Card>
		</div>
	);
};

export default ProductManagement;
