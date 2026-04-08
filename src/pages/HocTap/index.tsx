import { Card, Tabs } from 'antd';
import DanhMucMonHoc from './components/DanhMucMonHoc';
import TienDoHocTap from './components/TienDoHocTap';
import MucTieuHangThang from './components/MucTieuHangThang';
import './index.less';

const { TabPane } = Tabs;

const HocTap: React.FC = () => {
	return (
		<Card>
			<div className='hoctap-wrapper'>
				<Tabs defaultActiveKey='1' type='card'>
					<TabPane tab='Danh mục môn học' key='1'>
						<DanhMucMonHoc />
					</TabPane>
					<TabPane tab='Tiến độ học tập' key='2'>
						<TienDoHocTap />
					</TabPane>
					<TabPane tab='Mục tiêu hàng tháng' key='3'>
						<MucTieuHangThang />
					</TabPane>
				</Tabs>
			</div>
		</Card>
	);
};

export default HocTap;
