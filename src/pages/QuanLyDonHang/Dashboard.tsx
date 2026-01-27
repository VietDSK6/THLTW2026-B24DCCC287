import type { FC } from 'react';
import { useMemo } from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { ShoppingOutlined, DatabaseOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './constants';
import styles from './index.less';

const Dashboard: FC = () => {
	const [products] = useLocalStorage<QuanLyDonHang.Product[]>('products', INITIAL_PRODUCTS);
	const [orders] = useLocalStorage<QuanLyDonHang.Order[]>('orders', INITIAL_ORDERS);

	const statistics = useMemo(() => {
		const totalProducts = products.length;
		const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
		const totalOrders = orders.length;
		const revenue = orders.filter((o) => o.status === 'Hoàn thành').reduce((sum, o) => sum + o.totalAmount, 0);

		const ordersByStatus = orders.reduce((acc, order) => {
			acc[order.status] = (acc[order.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return {
			totalProducts,
			totalInventoryValue,
			totalOrders,
			revenue,
			ordersByStatus,
		};
	}, [products, orders]);

	const getStatusPercent = (status: string) => {
		const count = statistics.ordersByStatus[status] || 0;
		return statistics.totalOrders > 0 ? (count / statistics.totalOrders) * 100 : 0;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Chờ xử lý':
				return '#1890ff';
			case 'Đang giao':
				return '#fa8c16';
			case 'Hoàn thành':
				return '#52c41a';
			case 'Đã hủy':
				return '#ff4d4f';
			default:
				return '#d9d9d9';
		}
	};

	return (
		<div className={styles.container}>
			<Row gutter={16}>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng số sản phẩm' value={statistics.totalProducts} prefix={<ShoppingOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Giá trị tồn kho'
							value={statistics.totalInventoryValue}
							prefix={<DatabaseOutlined />}
							suffix='₫'
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng đơn hàng' value={statistics.totalOrders} prefix={<ShoppingCartOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Doanh thu' value={statistics.revenue} prefix={<DollarOutlined />} suffix='₫' />
					</Card>
				</Col>
			</Row>

			<Card title='Đơn hàng theo trạng thái' style={{ marginTop: 24 }}>
				<Row gutter={16}>
					{['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((status) => (
						<Col span={6} key={status}>
							<div style={{ marginBottom: 16 }}>
								<div style={{ marginBottom: 8 }}>
									{status}: {statistics.ordersByStatus[status] || 0}
								</div>
								<Progress
									percent={parseFloat(getStatusPercent(status).toFixed(1))}
									strokeColor={getStatusColor(status)}
								/>
							</div>
						</Col>
					))}
				</Row>
			</Card>
		</div>
	);
};

export default Dashboard;
