import type { FC } from 'react';
import { useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { BookOutlined, AppstoreOutlined, QuestionCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import KhoiKienThuc from './KhoiKienThuc';
import MonHoc from './MonHoc';
import CauHoi from './CauHoi';
import DeThi from './DeThi';
import styles from './index.less';

const { TabPane } = Tabs;

const QuanLyDeThi: FC = () => {
	const { loadTatCaData } = useModel('quanlydethi');

	useEffect(() => {
		loadTatCaData();
	}, []);

	return (
		<div className={styles.container}>
			<Card>
				<div className={styles.header}>
					<h1 className={styles.title}>Hệ thống Quản Lý Đề Thi</h1>
					<p className={styles.subtitle}>Quản lý ngân hàng câu hỏi và tạo đề thi tự động</p>
				</div>

				<Tabs defaultActiveKey='1' type='card'>
					<TabPane
						tab={
							<span>
								<AppstoreOutlined />
								Khối kiến thức
							</span>
						}
						key='1'
					>
						<KhoiKienThuc />
					</TabPane>

					<TabPane
						tab={
							<span>
								<BookOutlined />
								Môn học
							</span>
						}
						key='2'
					>
						<MonHoc />
					</TabPane>

					<TabPane
						tab={
							<span>
								<QuestionCircleOutlined />
								Câu hỏi
							</span>
						}
						key='3'
					>
						<CauHoi />
					</TabPane>

					<TabPane
						tab={
							<span>
								<FileTextOutlined />
								Đề thi
							</span>
						}
						key='4'
					>
						<DeThi />
					</TabPane>
				</Tabs>
			</Card>
		</div>
	);
};

export default QuanLyDeThi;
