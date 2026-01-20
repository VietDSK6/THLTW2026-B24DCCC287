import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const { Search } = Input;

// Dữ liệu mẫu khởi tạo
const initialProducts: QuanLySanPham.Product[] = [
	{ id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
	{ id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
	{ id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
	{ id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
	{ id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const QuanLySanPham: FC = () => {
	const [products, setProducts] = useState<QuanLySanPham.Product[]>(initialProducts);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [form] = Form.useForm();

	// Lọc sản phẩm theo từ khóa tìm kiếm
	const filteredProducts = useMemo(() => {
		if (!searchText) {
			return products;
		}
		return products.filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()));
	}, [products, searchText]);

	// Xử lý thêm sản phẩm mới
	const handleAddProduct = (values: QuanLySanPham.ProductFormValues) => {
		const newProduct: QuanLySanPham.Product = {
			id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
			name: values.name,
			price: values.price,
			quantity: values.quantity,
		};

		setProducts([...products, newProduct]);
		message.success('Thêm sản phẩm thành công!');
		setIsModalVisible(false);
		form.resetFields();
	};

	// Xử lý xóa sản phẩm
	const handleDeleteProduct = (id: number) => {
		setProducts(products.filter((product) => product.id !== id));
		message.success('Xóa sản phẩm thành công!');
	};

	// Xử lý tìm kiếm
	const handleSearch = (value: string) => {
		setSearchText(value);
	};

	// Định nghĩa các cột của bảng
	const columns: ColumnsType<QuanLySanPham.Product> = [
		{
			title: 'STT',
			key: 'index',
			width: 70,
			align: 'center',
			render: (_text, _record, index) => index + 1,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Giá (VNĐ)',
			dataIndex: 'price',
			key: 'price',
			width: 200,
			align: 'right',
			render: (price: number) => price.toLocaleString('vi-VN'),
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			width: 120,
			align: 'center',
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 120,
			align: 'center',
			render: (_text, record) => (
				<Popconfirm
					title='Bạn có chắc chắn muốn xóa sản phẩm này?'
					onConfirm={() => handleDeleteProduct(record.id)}
					okText='Xóa'
					cancelText='Hủy'
				>
					<Button type='primary' danger icon={<DeleteOutlined />}>
						Xóa
					</Button>
				</Popconfirm>
			),
		},
	];

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Quản lý Sản phẩm</h1>
			</div>

			<div className={styles.toolbar}>
				<Space size='middle'>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
						Thêm sản phẩm
					</Button>
					<Search
						placeholder='Tìm kiếm theo tên sản phẩm...'
						allowClear
						enterButton={<SearchOutlined />}
						onSearch={handleSearch}
						onChange={(e) => handleSearch(e.target.value)}
						style={{ width: 300 }}
					/>
				</Space>
			</div>

			<Table
				columns={columns}
				dataSource={filteredProducts}
				rowKey='id'
				pagination={{
					pageSize: 10,
					showTotal: (total) => `Tổng số: ${total} sản phẩm`,
					showSizeChanger: true,
					showQuickJumper: true,
				}}
			/>

			<Modal
				title='Thêm sản phẩm mới'
				visible={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					form.resetFields();
				}}
				footer={null}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={handleAddProduct} autoComplete='off'>
					<Form.Item
						label='Tên sản phẩm'
						name='name'
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập tên sản phẩm!',
							},
						]}
					>
						<Input placeholder='Nhập tên sản phẩm' />
					</Form.Item>

					<Form.Item
						label='Giá (VNĐ)'
						name='price'
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập giá sản phẩm!',
							},
							{
								type: 'number',
								min: 1,
								message: 'Giá phải là số dương!',
							},
						]}
					>
						<InputNumber
							placeholder='Nhập giá sản phẩm'
							style={{ width: '100%' }}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							min={1}
						/>
					</Form.Item>

					<Form.Item
						label='Số lượng'
						name='quantity'
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập số lượng!',
							},
							{
								type: 'number',
								min: 1,
								message: 'Số lượng phải là số nguyên dương!',
							},
						]}
					>
						<InputNumber placeholder='Nhập số lượng' style={{ width: '100%' }} min={1} precision={0} />
					</Form.Item>

					<Form.Item>
						<Space style={{ width: '100%', justifyContent: 'flex-end' }}>
							<Button
								onClick={() => {
									setIsModalVisible(false);
									form.resetFields();
								}}
							>
								Hủy
							</Button>
							<Button type='primary' htmlType='submit'>
								Thêm
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLySanPham;
