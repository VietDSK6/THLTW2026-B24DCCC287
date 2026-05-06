import {
	CalendarOutlined,
	ClockCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { Badge, Button, Popconfirm, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useModel } from 'umi';
import FormTask from '../components/FormTask';
import styles from './index.less';

const { Text } = Typography;

const COLUMNS = [
	{ id: 'Cần làm', title: 'Cần làm', className: styles.canLam, icon: <CalendarOutlined /> },
	{ id: 'Đang làm', title: 'Đang làm', className: styles.dangLam, icon: <ClockCircleOutlined /> },
	{ id: 'Hoàn thành', title: 'Hoàn thành', className: styles.hoanThanh, icon: <></> },
];

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

const KanbanBoard = () => {
	const { tasks, setTasks, deleteTask, setVisibleForm, setEdit, setRecord } =
		useModel('quanlycongviec');

	const onDragEnd = (result: any) => {
		if (!result.destination) return;
		const { source, destination, draggableId } = result;
		if (source.droppableId === destination.droppableId && source.index === destination.index)
			return;

		const sourceItems = tasks.filter((t) => t.status === source.droppableId);
		const destItems =
			source.droppableId === destination.droppableId
				? sourceItems
				: tasks.filter((t) => t.status === destination.droppableId);

		const draggedTask = sourceItems[source.index];
		if (!draggedTask) return;

		const newTasks = tasks.filter((t) => t.id !== draggedTask.id);

		const updatedTask = { ...draggedTask, status: destination.droppableId as any };

		const destInNew = newTasks.filter((t) => t.status === destination.droppableId);
		const otherTasks = newTasks.filter((t) => t.status !== destination.droppableId);

		destInNew.splice(destination.index, 0, updatedTask);
		setTasks([...otherTasks, ...destInNew]);
	};

	const handleAdd = () => {
		setEdit(false);
		setRecord(undefined);
		setVisibleForm(true);
	};

	const handleEdit = (task: any, e?: React.MouseEvent) => {
		e?.stopPropagation();
		setEdit(true);
		setRecord(task);
		setVisibleForm(true);
	};

	const now = moment();

	return (
		<div className={styles.kanbanContainer}>
			<div className={styles.toolbar}>
				<div>
					<Text strong style={{ fontSize: 16 }}>
						Bảng công việc
					</Text>
					<Text type="secondary" style={{ marginLeft: 8 }}>
						Kéo thả để thay đổi trạng thái
					</Text>
				</div>
				<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm công việc
				</Button>
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<div className={styles.columnsRow}>
					{COLUMNS.map((column) => {
						const columnTasks = tasks.filter((t) => t.status === column.id);

						return (
							<div key={column.id} className={`${styles.kanbanColumn} ${column.className}`}>
								<div className={styles.columnHeader}>
									<span className={styles.columnTitle}>
										{column.icon}
										{column.title}
									</span>
									<Badge count={columnTasks.length} style={{ backgroundColor: '#8c8c8c' }} />
								</div>

								<Droppable droppableId={column.id}>
									{(provided) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className={styles.columnBody}
										>
											{columnTasks.map((task, index) => {
												const isOverdue =
													task.status !== 'Hoàn thành' &&
													task.deadline &&
													moment(task.deadline).isBefore(now);

												return (
													<Draggable key={task.id} draggableId={task.id} index={index}>
														{(dp) => (
															<div
																ref={dp.innerRef}
																{...dp.draggableProps}
																{...dp.dragHandleProps}
																style={{ ...dp.draggableProps.style }}
																className={`${styles.taskCard} ${isOverdue ? styles.overdue : ''}`}
															>
																<div className={styles.taskName}>{task.name}</div>

																{task.description && (
																	<div className={styles.taskDesc}>{task.description}</div>
																)}

																<div className={styles.taskMeta}>
																	<Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>

																	{task.deadline && (
																		<Tooltip
																			title={moment(task.deadline).format('DD/MM/YYYY HH:mm')}
																		>
																			<Text
																				type={isOverdue ? 'danger' : 'secondary'}
																				style={{ fontSize: 12 }}
																			>
																				{isOverdue && (
																					<WarningOutlined style={{ marginRight: 2 }} />
																				)}
																				{moment(task.deadline).fromNow()}
																			</Text>
																		</Tooltip>
																	)}
																</div>

																{task.tags && task.tags.length > 0 && (
																	<div className={styles.taskTags}>
																		{task.tags.map((tag) => (
																			<Tag
																				key={tag}
																				style={{ fontSize: 11, margin: 0 }}
																			>
																				{tag}
																			</Tag>
																		))}
																	</div>
																)}

																<div
																	style={{
																		marginTop: 8,
																		display: 'flex',
																		justifyContent: 'flex-end',
																		gap: 4,
																	}}
																>
																	<Tooltip title="Chỉnh sửa">
																		<Button
																			type="text"
																			size="small"
																			icon={<EditOutlined />}
																			onClick={(e) => handleEdit(task, e)}
																		/>
																	</Tooltip>
																	<Popconfirm
																		title="Xóa công việc này?"
																		onConfirm={(e) => {
																			e?.stopPropagation();
																			deleteTask(task.id);
																		}}
																		okText="Xóa"
																		cancelText="Hủy"
																	>
																		<Tooltip title="Xóa">
																			<Button
																				type="text"
																				size="small"
																				danger
																				icon={<DeleteOutlined />}
																				onClick={(e) => e.stopPropagation()}
																			/>
																		</Tooltip>
																	</Popconfirm>
																</div>
															</div>
														)}
													</Draggable>
												);
											})}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						);
					})}
				</div>
			</DragDropContext>

			<FormTask />
		</div>
	);
};

export default KanbanBoard;
