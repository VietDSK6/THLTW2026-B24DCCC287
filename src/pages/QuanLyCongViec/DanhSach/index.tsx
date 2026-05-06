import {
	ClockCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	SearchOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Descriptions,
	Drawer,
	Input,
	Popconfirm,
	Select,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useModel } from 'umi';
import type { Task } from '@/models/quanlycongviec';
import FormTask from '../components/FormTask';

const { Text } = Typography;

const getPriorityColor = (priority: string) => {
	switch (priority) {
		case 'Cao':
			return 'red';
		case 'Trung bình':
			return 'orange';
		case 'Thấp':
			return 'green';
		default:
			return 'default';
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case 'Cần làm':
			return 'default';
		case 'Đang làm':
			return 'processing';
		case 'Hoàn thành':
			return 'success';
		default:
			return 'default';
	}
};

const DanhSach = () => {
	const { tasks, deleteTask, setVisibleForm, setEdit, setRecord } = useModel('quanlycongviec');
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
	const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			const matchName = task.name.toLowerCase().includes(searchText.toLowerCase());
			const matchStatus = statusFilter ? task.status === statusFilter : true;
			const matchPriority = priorityFilter ? task.priority === priorityFilter : true;
			return matchName && matchStatus && matchPriority;
		});
	}, [tasks, searchText, statusFilter, priorityFilter]);

	const now = moment();

	const columns = [
		{
			title: 'Tên công việc',
			dataIndex: 'name',
			key: 'name',
			width: 250,
			render: (name: string, record: Task) => {
				const isOverdue =
					record.status !== 'Hoàn thành' &&
					record.deadline &&
					moment(record.deadline).isBefore(now);
				return (
					<div>
						<Text strong>{name}</Text>
						{isOverdue && (
							<Tag color="error" style={{ marginLeft: 8 }}>
								<WarningOutlined /> Quá hạn
							</Tag>
						)}
						{record.description && (
							<div>
								<Text type="secondary" style={{ fontSize: 12 }} ellipsis>
									{record.description}
								</Text>
							</div>
						)}
					</div>
				);
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 130,
			render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			key: 'priority',
			width: 120,
			render: (priority: string) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			width: 180,
			sorter: (a: Task, b: Task) => {
				if (!a.deadline) return 1;
				if (!b.deadline) return -1;
				return moment(a.deadline).valueOf() - moment(b.deadline).valueOf();
			},
			render: (deadline: string, record: Task) => {
				if (!deadline) return <Text type="secondary">—</Text>;
				const isOverdue =
					record.status !== 'Hoàn thành' && moment(deadline).isBefore(now);
				return (
					<Tooltip title={moment(deadline).fromNow()}>
						<Text type={isOverdue ? 'danger' : undefined}>
							{isOverdue && <ClockCircleOutlined style={{ marginRight: 4 }} />}
							{moment(deadline).format('DD/MM/YYYY HH:mm')}
						</Text>
					</Tooltip>
				);
			},
		},
		{
			title: 'Tags',
			dataIndex: 'tags',
			key: 'tags',
			width: 200,
			render: (tags: string[]) =>
				tags?.length ? (
					<>
						{tags.map((tag) => (
							<Tag key={tag}>{tag}</Tag>
						))}
					</>
				) : (
					<Text type="secondary">—</Text>
				),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 140,
			fixed: 'right' as const,
			render: (_: any, record: Task) => (
				<Space>
					<Tooltip title="Xem chi tiết">
						<Button
							type="text"
							icon={<EyeOutlined />}
							onClick={() => {
								setSelectedTask(record);
								setDrawerVisible(true);
							}}
						/>
					</Tooltip>
					<Tooltip title="Chỉnh sửa">
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() => {
								setEdit(true);
								setRecord(record);
								setVisibleForm(true);
							}}
						/>
					</Tooltip>
					<Popconfirm
						title="Xóa công việc này?"
						onConfirm={() => deleteTask(record.id)}
						okText="Xóa"
						cancelText="Hủy"
					>
						<Tooltip title="Xóa">
							<Button type="text" danger icon={<DeleteOutlined />} />
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	const tongSo = filteredTasks.length;
	const soHoanThanh = filteredTasks.filter((t) => t.status === 'Hoàn thành').length;
	const soQuaHan = filteredTasks.filter(
		(t) => t.status !== 'Hoàn thành' && t.deadline && moment(t.deadline).isBefore(now),
	).length;

	return (
		<div>
			<Card bodyStyle={{ paddingBottom: 0 }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 16,
						flexWrap: 'wrap',
						gap: 8,
					}}
				>
					<Space wrap>
						<Input
							placeholder="Tìm kiếm theo tên..."
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
							style={{ width: 220 }}
						/>
						<Select
							placeholder="Trạng thái"
							allowClear
							value={statusFilter}
							onChange={setStatusFilter}
							style={{ width: 150 }}
						>
							<Select.Option value="Cần làm">Cần làm</Select.Option>
							<Select.Option value="Đang làm">Đang làm</Select.Option>
							<Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
						</Select>
						<Select
							placeholder="Mức ưu tiên"
							allowClear
							value={priorityFilter}
							onChange={setPriorityFilter}
							style={{ width: 150 }}
						>
							<Select.Option value="Cao">Cao</Select.Option>
							<Select.Option value="Trung bình">Trung bình</Select.Option>
							<Select.Option value="Thấp">Thấp</Select.Option>
						</Select>
					</Space>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => {
							setEdit(false);
							setRecord(undefined);
							setVisibleForm(true);
						}}
					>
						Thêm công việc
					</Button>
				</div>

				<div style={{ marginBottom: 16 }}>
					<Space size={24}>
						<Text type="secondary">
							Tổng: <Text strong>{tongSo}</Text>
						</Text>
						<Text type="secondary">
							Hoàn thành: <Text strong style={{ color: '#52c41a' }}>{soHoanThanh}</Text>
						</Text>
						{soQuaHan > 0 && (
							<Text type="danger">
								<WarningOutlined /> Quá hạn: <Text strong type="danger">{soQuaHan}</Text>
							</Text>
						)}
					</Space>
				</div>

				<Table
					columns={columns}
					dataSource={filteredTasks}
					rowKey="id"
					scroll={{ x: 1000 }}
					pagination={{
						pageSize: 10,
						showSizeChanger: true,
						showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} mục`,
					}}
				/>
			</Card>

			<Drawer
				title="Chi tiết công việc"
				placement="right"
				width={420}
				visible={drawerVisible}
				onClose={() => setDrawerVisible(false)}
			>
				{selectedTask && (
					<Descriptions column={1} bordered size="small">
						<Descriptions.Item label="Tên">{selectedTask.name}</Descriptions.Item>
						<Descriptions.Item label="Mô tả">
							{selectedTask.description || 'Không có mô tả'}
						</Descriptions.Item>
						<Descriptions.Item label="Trạng thái">
							<Tag color={getStatusColor(selectedTask.status)}>{selectedTask.status}</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="Ưu tiên">
							<Tag color={getPriorityColor(selectedTask.priority)}>
								{selectedTask.priority}
							</Tag>
						</Descriptions.Item>
						<Descriptions.Item label="Deadline">
							{selectedTask.deadline
								? moment(selectedTask.deadline).format('DD/MM/YYYY HH:mm')
								: 'Không có'}
						</Descriptions.Item>
						<Descriptions.Item label="Tags">
							{selectedTask.tags?.length
								? selectedTask.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
								: 'Không có'}
						</Descriptions.Item>
					</Descriptions>
				)}
				{selectedTask && (
					<div style={{ marginTop: 16 }}>
						<Button
							type="primary"
							icon={<EditOutlined />}
							block
							onClick={() => {
								setDrawerVisible(false);
								setEdit(true);
								setRecord(selectedTask);
								setVisibleForm(true);
							}}
						>
							Chỉnh sửa
						</Button>
					</div>
				)}
			</Drawer>

			<FormTask />
		</div>
	);
};

export default DanhSach;
