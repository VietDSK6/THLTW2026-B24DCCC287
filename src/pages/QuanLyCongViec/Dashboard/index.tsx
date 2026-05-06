import DonutChart from '@/components/Chart/DonutChart';
import ColumnChart from '@/components/Chart/ColumnChart';
import {
	CalendarOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	FireOutlined,
	RiseOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { Card, Col, Empty, Progress, Row, Statistic, Tag, Timeline, Typography } from 'antd';
import moment from 'moment';
import { useMemo } from 'react';
import { useModel, history } from 'umi';
import type { Task } from '@/models/quanlycongviec';

const { Text, Title } = Typography;

const getPriorityColor = (priority: string) => {
	switch (priority) {
		case 'Cao':
			return '#f5222d';
		case 'Trung bình':
			return '#fa8c16';
		case 'Thấp':
			return '#52c41a';
		default:
			return '#999';
	}
};

const Dashboard = () => {
	const { tasks } = useModel('quanlycongviec');

	const now = moment();

	const totalTasks = tasks.length;
	const canLam = tasks.filter((t) => t.status === 'Cần làm').length;
	const dangLam = tasks.filter((t) => t.status === 'Đang làm').length;
	const hoanThanh = tasks.filter((t) => t.status === 'Hoàn thành').length;
	const quaHan = tasks.filter(
		(t) => t.status !== 'Hoàn thành' && t.deadline && moment(t.deadline).isBefore(now),
	).length;

	const tiLe = totalTasks > 0 ? Math.round((hoanThanh / totalTasks) * 100) : 0;

	const sapDenHan = useMemo(() => {
		return tasks
			.filter((t) => {
				if (t.status === 'Hoàn thành' || !t.deadline) return false;
				const deadline = moment(t.deadline);
				return deadline.isAfter(now) && deadline.diff(now, 'hours') <= 48;
			})
			.sort((a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf());
	}, [tasks]);

	const ganDayHoanThanh = useMemo(() => {
		return tasks
			.filter((t) => t.status === 'Hoàn thành')
			.slice(-5)
			.reverse();
	}, [tasks]);

	const donutData = useMemo(() => {
		return {
			xAxis: ['Cần làm', 'Đang làm', 'Hoàn thành'],
			yAxis: [[canLam, dangLam, hoanThanh]],
			yLabel: ['Số lượng'],
		};
	}, [canLam, dangLam, hoanThanh]);

	const priorityData = useMemo(() => {
		const cao = tasks.filter((t) => t.priority === 'Cao').length;
		const tb = tasks.filter((t) => t.priority === 'Trung bình').length;
		const thap = tasks.filter((t) => t.priority === 'Thấp').length;
		return {
			xAxis: ['Cao', 'Trung bình', 'Thấp'],
			yAxis: [[cao, tb, thap]],
			yLabel: ['Số lượng'],
		};
	}, [tasks]);

	const tasksSapToi = useMemo(() => {
		return tasks
			.filter((t) => t.status !== 'Hoàn thành' && t.deadline)
			.sort((a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf())
			.slice(0, 6);
	}, [tasks]);

	return (
		<div>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable onClick={() => history.push('/quan-ly-cong-viec/danh-sach')}>
						<Statistic
							title="Tổng công việc"
							value={totalTasks}
							prefix={<CalendarOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable onClick={() => history.push('/quan-ly-cong-viec/kanban')}>
						<Statistic
							title="Đang thực hiện"
							value={dangLam}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: '#fa8c16' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title="Hoàn thành"
							value={hoanThanh}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title="Quá hạn"
							value={quaHan}
							prefix={<WarningOutlined />}
							valueStyle={{ color: '#f5222d' }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} lg={6}>
					<Card style={{ height: '100%', textAlign: 'center' }}>
						<Title level={5} style={{ marginBottom: 16 }}>
							Tiến độ tổng quan
						</Title>
						<Progress
							type="dashboard"
							percent={tiLe}
							strokeColor={{
								'0%': '#108ee9',
								'100%': '#87d068',
							}}
							width={160}
						/>
						<div style={{ marginTop: 12 }}>
							<Text type="secondary">
								{hoanThanh}/{totalTasks} công việc hoàn thành
							</Text>
						</div>
					</Card>
				</Col>
				<Col xs={24} lg={10}>
					<Card title="Phân bổ theo trạng thái" style={{ height: '100%' }}>
						{totalTasks > 0 ? (
							<DonutChart
								xAxis={donutData.xAxis}
								yAxis={donutData.yAxis}
								height={220}
								colors={['#1890ff', '#fa8c16', '#52c41a']}
								formatY={(val: number) => `${val} task`}
								showTotal
							/>
						) : (
							<Empty description="Chưa có công việc nào" />
						)}
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card title="Phân bổ theo mức độ ưu tiên" style={{ height: '100%' }}>
						{totalTasks > 0 ? (
							<ColumnChart
								xAxis={priorityData.xAxis}
								yAxis={priorityData.yAxis}
								yLabel={priorityData.yLabel}
								height={220}
								colors={['#f5222d', '#fa8c16', '#52c41a']}
							/>
						) : (
							<Empty description="Chưa có dữ liệu" />
						)}
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={8}>
					<Card
						title={
							<span>
								<ExclamationCircleOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
								Sắp đến hạn (48h)
							</span>
						}
						style={{ height: '100%' }}
					>
						{sapDenHan.length > 0 ? (
							<Timeline>
								{sapDenHan.map((task) => (
									<Timeline.Item key={task.id} color="orange">
										<Text strong>{task.name}</Text>
										<br />
										<Text type="secondary" style={{ fontSize: 12 }}>
											<ClockCircleOutlined style={{ marginRight: 4 }} />
											{moment(task.deadline).format('DD/MM/YYYY HH:mm')}
											{' · '}
											{moment(task.deadline).fromNow()}
										</Text>
										<br />
										<Tag color={getPriorityColor(task.priority)} style={{ marginTop: 4 }}>
											{task.priority}
										</Tag>
									</Timeline.Item>
								))}
							</Timeline>
						) : (
							<Empty description="Không có công việc sắp đến hạn" image={Empty.PRESENTED_IMAGE_SIMPLE} />
						)}
					</Card>
				</Col>

				<Col xs={24} lg={8}>
					<Card
						title={
							<span>
								<RiseOutlined style={{ color: '#1890ff', marginRight: 8 }} />
								Công việc sắp tới
							</span>
						}
						style={{ height: '100%' }}
					>
						{tasksSapToi.length > 0 ? (
							tasksSapToi.map((task) => {
								const isOverdue =
									task.deadline && moment(task.deadline).isBefore(now);
								return (
									<div
										key={task.id}
										style={{
											padding: '8px 12px',
											marginBottom: 8,
											borderRadius: 6,
											border: '1px solid #f0f0f0',
											borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
											background: isOverdue ? '#fff1f0' : '#fff',
										}}
									>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<Text strong ellipsis style={{ flex: 1 }}>
												{task.name}
											</Text>
											<Tag
												color={
													task.status === 'Cần làm'
														? 'default'
														: task.status === 'Đang làm'
														? 'processing'
														: 'success'
												}
												style={{ marginLeft: 8 }}
											>
												{task.status}
											</Tag>
										</div>
										{task.deadline && (
											<Text
												type={isOverdue ? 'danger' : 'secondary'}
												style={{ fontSize: 12 }}
											>
												{isOverdue && <WarningOutlined style={{ marginRight: 4 }} />}
												{moment(task.deadline).format('DD/MM/YYYY HH:mm')}
											</Text>
										)}
									</div>
								);
							})
						) : (
							<Empty description="Không có công việc" image={Empty.PRESENTED_IMAGE_SIMPLE} />
						)}
					</Card>
				</Col>

				<Col xs={24} lg={8}>
					<Card
						title={
							<span>
								<FireOutlined style={{ color: '#52c41a', marginRight: 8 }} />
								Hoàn thành gần đây
							</span>
						}
						style={{ height: '100%' }}
					>
						{ganDayHoanThanh.length > 0 ? (
							<Timeline>
								{ganDayHoanThanh.map((task) => (
									<Timeline.Item key={task.id} color="green">
										<Text strong>{task.name}</Text>
										<br />
										<Text type="secondary" style={{ fontSize: 12 }}>
											{task.description || 'Không có mô tả'}
										</Text>
										{task.tags && task.tags.length > 0 && (
											<div style={{ marginTop: 4 }}>
												{task.tags.map((tag) => (
													<Tag key={tag} style={{ fontSize: 11 }}>
														{tag}
													</Tag>
												))}
											</div>
										)}
									</Timeline.Item>
								))}
							</Timeline>
						) : (
							<Empty description="Chưa hoàn thành công việc nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
