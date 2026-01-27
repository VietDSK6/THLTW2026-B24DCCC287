import type { FC } from 'react';
import { useState } from 'react';
import { Tabs } from 'antd';
import { DashboardOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import styles from './index.less';

const QuanLyDonHang: FC = () => {
	const [activeTab, setActiveTab] = useState('dashboard');

	return (
		<div className={styles.container}>
			<Tabs activeKey={activeTab} onChange={setActiveTab}>
				<Tabs.TabPane
					key='dashboard'
					tab={
						<span>
							<DashboardOutlined />
							Tổng quan
						</span>
					}
				>
					<Dashboard />
				</Tabs.TabPane>
				<Tabs.TabPane
					key='products'
					tab={
						<span>
							<ShoppingOutlined />
							Quản lý Sản phẩm
						</span>
					}
				>
					<ProductManagement />
				</Tabs.TabPane>
				<Tabs.TabPane
					key='orders'
					tab={
						<span>
							<ShoppingCartOutlined />
							Quản lý Đơn hàng
						</span>
					}
				>
					<OrderManagement />
				</Tabs.TabPane>
			</Tabs>
		</div>
	);
};

export default QuanLyDonHang;
