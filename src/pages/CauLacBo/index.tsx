import { BarChartOutlined, FileTextOutlined, TeamOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import DanhSachCLB from './DanhSachCLB';
import DonDangKy from './DonDangKy';
import ThanhVien from './ThanhVien';
import ThongKe from './ThongKe';
import './index.less';

const { TabPane } = Tabs;

const CauLacBoPage = () => {
	return (
		<Card className='cau-lac-bo-page'>
			<Tabs defaultActiveKey='1' type='card'>
				<TabPane
					tab={
						<span>
							<UnorderedListOutlined />
							Danh sách CLB
						</span>
					}
					key='1'
				>
					<DanhSachCLB />
				</TabPane>
				<TabPane
					tab={
						<span>
							<FileTextOutlined />
							Đơn đăng ký
						</span>
					}
					key='2'
				>
					<DonDangKy />
				</TabPane>
				<TabPane
					tab={
						<span>
							<TeamOutlined />
							Thành viên
						</span>
					}
					key='3'
				>
					<ThanhVien />
				</TabPane>
				<TabPane
					tab={
						<span>
							<BarChartOutlined />
							Thống kê
						</span>
					}
					key='4'
				>
					<ThongKe />
				</TabPane>
			</Tabs>
		</Card>
	);
};

export default CauLacBoPage;
