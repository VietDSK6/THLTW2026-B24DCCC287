import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Empty, Input, Pagination, Row, Tag } from 'antd';
import { CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import moment from 'moment';
import styles from './index.less';

const TAG_COLORS = ['blue', 'green', 'orange', 'purple', 'cyan', 'magenta', 'red', 'volcano', 'gold', 'geekblue'];

const TrangChuBlog: FC = () => {
	const { dsBaiViet, dsTag, loadBaiViet, loadTags } = useModel('blog');
	const [searchText, setSearchText] = useState('');
	const [selectedTag, setSelectedTag] = useState<string>('');
	const [currentPage, setCurrentPage] = useState(1);
	const [debounceText, setDebounceText] = useState('');

	useEffect(() => {
		loadBaiViet();
		loadTags();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounceText(searchText);
			setCurrentPage(1);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchText]);

	const filteredPosts = useMemo(() => {
		return dsBaiViet.filter((post) => {
			if (post.trangThai !== 'published') return false;
			if (selectedTag && !post.tags.includes(selectedTag)) return false;
			if (debounceText) {
				const keyword = debounceText.toLowerCase();
				return (
					post.tieuDe.toLowerCase().includes(keyword) || post.tomTat.toLowerCase().includes(keyword)
				);
			}
			return true;
		});
	}, [dsBaiViet, selectedTag, debounceText]);

	const pageSize = 9;
	const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const handleTagClick = (tagName: string) => {
		setSelectedTag(selectedTag === tagName ? '' : tagName);
		setCurrentPage(1);
	};

	return (
		<div className={styles.blogHome}>
			<div className={styles.headerSection}>
				<Input.Search
					className={styles.searchBox}
					placeholder="Tìm kiếm bài viết..."
					allowClear
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					size="large"
				/>
				<div className={styles.tagFilter}>
					{dsTag.map((tag, index) => (
						<Tag
							key={tag.id}
							color={selectedTag === tag.ten ? TAG_COLORS[index % TAG_COLORS.length] : undefined}
							onClick={() => handleTagClick(tag.ten)}
						>
							{tag.ten}
						</Tag>
					))}
					{selectedTag && (
						<Tag onClick={() => { setSelectedTag(''); setCurrentPage(1); }}>
							✕ Bỏ lọc
						</Tag>
					)}
				</div>
			</div>

			{paginatedPosts.length === 0 ? (
				<div className={styles.empty}>
					<Empty description="Không tìm thấy bài viết nào" />
				</div>
			) : (
				<>
					<Row gutter={[20, 20]}>
						{paginatedPosts.map((post) => (
							<Col xs={24} sm={12} lg={8} key={post.id}>
								<Card
									className={styles.postCard}
									hoverable
									cover={<img className={styles.coverImage} alt={post.tieuDe} src={post.anhDaiDien} />}
									onClick={() => history.push(`/blog/bai-viet/${post.slug}`)}
								>
									<div className={styles.postMeta}>
										<span><UserOutlined /> {post.tacGia}</span>
										<span><CalendarOutlined /> {moment(post.ngayTao).format('DD/MM/YYYY')}</span>
									</div>
									<div className={styles.postTitle}>{post.tieuDe}</div>
									<div className={styles.postSummary}>{post.tomTat}</div>
									<div className={styles.postTags}>
										{post.tags.map((tag) => (
											<Tag key={tag} color={TAG_COLORS[dsTag.findIndex((t) => t.ten === tag) % TAG_COLORS.length]}>
												{tag}
											</Tag>
										))}
										<span style={{ float: 'right', color: '#999', fontSize: 12 }}>
											<EyeOutlined /> {post.luotXem}
										</span>
									</div>
								</Card>
							</Col>
						))}
					</Row>
					<div className={styles.pagination}>
						<Pagination
							current={currentPage}
							total={filteredPosts.length}
							pageSize={pageSize}
							onChange={(page) => setCurrentPage(page)}
							showTotal={(total) => `Tổng ${total} bài viết`}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default TrangChuBlog;
