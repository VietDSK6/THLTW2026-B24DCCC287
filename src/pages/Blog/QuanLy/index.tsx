import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import FormBaiViet from './FormBaiViet';
import styles from './index.less';

const QuanLyBlog: FC = () => {
	const { dsBaiViet, loadBaiViet, xoaBaiViet } = useModel('blog');
	const [visible, setVisible] = useState(false);
	const [editingPost, setEditingPost] = useState<Blog.BaiViet | undefined>();
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string>('');

	useEffect(() => {
		loadBaiViet();
	}, []);

	const filteredData = useMemo(() => {
		return dsBaiViet.filter((post) => {
			if (filterStatus && post.trangThai !== filterStatus) return false;
			if (searchText && !post.tieuDe.toLowerCase().includes(searchText.toLowerCase())) return false;
			return true;
		});
	}, [dsBaiViet, searchText, filterStatus]);

	const columns = [
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			key: 'tieuDe',
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			width: 120,
			render: (val: string) => (
				<Tag color={val === 'published' ? 'green' : 'orange'}>
					{val === 'published' ? 'Đã đăng' : 'Nháp'}
				</Tag>
			),
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			key: 'tags',
			width: 200,
			render: (tags: string[]) => tags.map((t) => <Tag key={t}>{t}</Tag>),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'luotXem',
			key: 'luotXem',
			width: 100,
			sorter: (a: Blog.BaiViet, b: Blog.BaiViet) => a.luotXem - b.luotXem,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'ngayTao',
			key: 'ngayTao',
			width: 130,
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
			sorter: (a: Blog.BaiViet, b: Blog.BaiViet) =>
				new Date(a.ngayTao).getTime() - new Date(b.ngayTao).getTime(),
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 120,
			render: (_: any, record: Blog.BaiViet) => (
				<Space>
					<Button
						type="link"
						icon={<EditOutlined />}
						onClick={() => {
							setEditingPost(record);
							setVisible(true);
						}}
					/>
					<Popconfirm
						title="Bạn có chắc muốn xóa bài viết này?"
						onConfirm={() => xoaBaiViet(record.id)}
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
		<div className={styles.quanLyBlog}>
			<div className={styles.toolbar}>
				<div className={styles.toolbarLeft}>
					<Input.Search
						placeholder="Tìm theo tiêu đề..."
						allowClear
						style={{ width: 250 }}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<Select
						placeholder="Lọc trạng thái"
						allowClear
						style={{ width: 150 }}
						onChange={(val) => setFilterStatus(val || '')}
					>
						<Select.Option value="draft">Nháp</Select.Option>
						<Select.Option value="published">Đã đăng</Select.Option>
					</Select>
				</div>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => {
						setEditingPost(undefined);
						setVisible(true);
					}}
				>
					Thêm bài viết
				</Button>
			</div>

			<Table
				rowKey="id"
				columns={columns}
				dataSource={filteredData}
				pagination={{ pageSize: 10 }}
			/>

			<FormBaiViet
				visible={visible}
				editingPost={editingPost}
				onClose={() => {
					setVisible(false);
					setEditingPost(undefined);
					loadBaiViet();
				}}
			/>
		</div>
	);
};

export default QuanLyBlog;
