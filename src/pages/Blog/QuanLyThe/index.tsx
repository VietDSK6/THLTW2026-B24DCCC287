import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import styles from './index.less';

const QuanLyThe: FC = () => {
	const { dsBaiViet, dsTag, loadBaiViet, loadTags, themTag, suaTag, xoaTag } = useModel('blog');
	const [visible, setVisible] = useState(false);
	const [editingTag, setEditingTag] = useState<Blog.Tag | undefined>();
	const [form] = Form.useForm();

	useEffect(() => {
		loadBaiViet();
		loadTags();
	}, []);

	const tagWithCount = useMemo(() => {
		return dsTag.map((tag) => ({
			...tag,
			soBaiViet: dsBaiViet.filter((p) => p.tags.includes(tag.ten)).length,
		}));
	}, [dsTag, dsBaiViet]);

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			if (editingTag) {
				suaTag(editingTag.id, values.ten);
			} else {
				themTag(values.ten);
			}
			setVisible(false);
			form.resetFields();
			setEditingTag(undefined);
		});
	};

	const columns = [
		{
			title: 'Tên thẻ',
			dataIndex: 'ten',
			key: 'ten',
		},
		{
			title: 'Số bài viết',
			dataIndex: 'soBaiViet',
			key: 'soBaiViet',
			width: 120,
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 120,
			render: (_: any, record: Blog.Tag) => (
				<Space>
					<Button
						type="link"
						icon={<EditOutlined />}
						onClick={() => {
							setEditingTag(record);
							form.setFieldsValue({ ten: record.ten });
							setVisible(true);
						}}
					/>
					<Popconfirm
						title="Bạn có chắc muốn xóa thẻ này?"
						onConfirm={() => xoaTag(record.id)}
						okText="Xóa"
						cancelText="Hủy"
					>
						<Button type="link" danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className={styles.quanLyThe}>
			<div className={styles.toolbar}>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingTag(undefined);
						form.resetFields();
						setVisible(true);
					}}
				>
					Thêm thẻ
				</Button>
			</div>

			<Table
				rowKey="id"
				columns={columns}
				dataSource={tagWithCount}
				pagination={false}
			/>

			<Modal
				title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
				visible={visible}
				onOk={handleSubmit}
				onCancel={() => {
					setVisible(false);
					setEditingTag(undefined);
					form.resetFields();
				}}
				okText={editingTag ? 'Cập nhật' : 'Thêm'}
				cancelText="Hủy"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="ten"
						label="Tên thẻ"
						rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
					>
						<Input placeholder="Nhập tên thẻ" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyThe;
