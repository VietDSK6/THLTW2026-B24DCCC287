import {
	CalendarOutlined,
	ExclamationCircleOutlined,
	FireOutlined,
	FlagOutlined,
} from '@ant-design/icons';
import { Col, DatePicker, Form, Input, Modal, Row, Select, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

const FormTask = () => {
	const { visibleForm, setVisibleForm, edit, record, addTask, updateTask } =
		useModel('quanlycongviec');
	const [form] = Form.useForm();

	useEffect(() => {
		if (visibleForm && edit && record) {
			form.setFieldsValue({
				...record,
				deadline: record.deadline ? moment(record.deadline) : undefined,
			});
		} else if (visibleForm) {
			form.resetFields();
		}
	}, [visibleForm, record, edit, form]);

	const onFinish = (values: any) => {
		const submitData = {
			...values,
			deadline: values.deadline ? values.deadline.toISOString() : undefined,
			status: edit ? record?.status : 'Cần làm',
		};

		if (edit && record) {
			updateTask(record.id, submitData);
		} else {
			addTask(submitData);
		}
		setVisibleForm(false);
		form.resetFields();
	};

	return (
		<Modal
			title={
				<span>
					{edit ? (
						<>
							<ExclamationCircleOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
							Chỉnh sửa công việc
						</>
					) : (
						<>
							<CalendarOutlined style={{ color: '#1890ff', marginRight: 8 }} />
							Thêm công việc mới
						</>
					)}
				</span>
			}
			visible={visibleForm}
			onCancel={() => {
				setVisibleForm(false);
				form.resetFields();
			}}
			onOk={() => form.submit()}
			okText={edit ? 'Cập nhật' : 'Tạo mới'}
			cancelText="Hủy"
			width={560}
			destroyOnClose
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item
					name="name"
					label="Tên công việc"
					rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
				>
					<Input placeholder="VD: Hoàn thành báo cáo cuối kỳ" prefix={<FlagOutlined />} />
				</Form.Item>

				<Form.Item name="description" label="Mô tả">
					<Input.TextArea placeholder="Mô tả chi tiết công việc cần làm..." rows={3} showCount maxLength={500} />
				</Form.Item>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name="deadline" label="Deadline">
							<DatePicker
								style={{ width: '100%' }}
								format="DD/MM/YYYY HH:mm"
								showTime={{ format: 'HH:mm' }}
								placeholder="Chọn thời hạn"
								suffixIcon={<CalendarOutlined />}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="priority"
							label="Mức độ ưu tiên"
							initialValue="Trung bình"
							rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
						>
							<Select>
								<Select.Option value="Cao">
									<Tag color="red" style={{ marginRight: 4 }}>
										<FireOutlined />
									</Tag>
									Cao
								</Select.Option>
								<Select.Option value="Trung bình">
									<Tag color="orange" style={{ marginRight: 4 }}>
										—
									</Tag>
									Trung bình
								</Select.Option>
								<Select.Option value="Thấp">
									<Tag color="green" style={{ marginRight: 4 }}>
										↓
									</Tag>
									Thấp
								</Select.Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				{edit && (
					<Form.Item name="status" label="Trạng thái">
						<Select>
							<Select.Option value="Cần làm">Cần làm</Select.Option>
							<Select.Option value="Đang làm">Đang làm</Select.Option>
							<Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
						</Select>
					</Form.Item>
				)}

				<Form.Item name="tags" label="Tags">
					<Select
						mode="tags"
						placeholder="Nhập và nhấn Enter để tạo tag"
						tokenSeparators={[',']}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormTask;
