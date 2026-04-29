import type { FC } from 'react';
import React, { useEffect, useMemo } from 'react';
import { Button, Card, Col, Divider, Row, Tag } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import moment from 'moment';
import styles from './index.less';

const TAG_COLORS = ['blue', 'green', 'orange', 'purple', 'cyan', 'magenta', 'red', 'volcano', 'gold', 'geekblue'];

const ChiTietBaiViet: FC<{ match: { params: { slug: string } } }> = ({ match }) => {
	const { slug } = match.params;
	const { dsBaiViet, dsTag, loadBaiViet, loadTags, tangLuotXem } = useModel('blog');

	useEffect(() => {
		loadBaiViet();
		loadTags();
	}, []);

	const post = useMemo(() => dsBaiViet.find((p) => p.slug === slug), [dsBaiViet, slug]);

	useEffect(() => {
		if (post) {
			tangLuotXem(post.id);
		}
	}, [post?.id]);

	const relatedPosts = useMemo(() => {
		if (!post) return [];
		return dsBaiViet.filter(
			(p) => p.id !== post.id && p.trangThai === 'published' && p.tags.some((t) => post.tags.includes(t)),
		).slice(0, 3);
	}, [dsBaiViet, post]);

	if (!post) {
		return (
			<div style={{ textAlign: 'center', padding: 60 }}>
				<h2>Không tìm thấy bài viết</h2>
				<Button type="primary" onClick={() => history.push('/blog/trang-chu')}>
					Quay lại
				</Button>
			</div>
		);
	}



	return (
		<div className={styles.blogDetail}>
			<Button
				className={styles.backButton}
				icon={<ArrowLeftOutlined />}
				onClick={() => history.push('/blog/trang-chu')}
			>
				Quay lại danh sách
			</Button>

			<img className={styles.coverImage} src={post.anhDaiDien} alt={post.tieuDe} />

			<h1 className={styles.postTitle}>{post.tieuDe}</h1>

			<div className={styles.postMeta}>
				<span><UserOutlined /> {post.tacGia}</span>
				<span><CalendarOutlined /> {moment(post.ngayTao).format('DD/MM/YYYY')}</span>
				<span><EyeOutlined /> {post.luotXem} lượt xem</span>
			</div>

			<div className={styles.postTags}>
				{post.tags.map((tag) => (
					<Tag key={tag} color={TAG_COLORS[dsTag.findIndex((t) => t.ten === tag) % TAG_COLORS.length]}>
						{tag}
					</Tag>
				))}
			</div>

			<Divider />

			<div
				className={styles.postContent}
				dangerouslySetInnerHTML={{ __html: post.noiDung }}
			/>

			{relatedPosts.length > 0 && (
				<div className={styles.relatedSection}>
					<h2 className={styles.relatedTitle}>Bài viết liên quan</h2>
					<Row gutter={[16, 16]}>
						{relatedPosts.map((rp) => (
							<Col xs={24} sm={8} key={rp.id}>
								<Card
									className={styles.relatedCard}
									hoverable
									cover={<img className={styles.relatedCover} alt={rp.tieuDe} src={rp.anhDaiDien} />}
									onClick={() => history.push(`/blog/bai-viet/${rp.slug}`)}
								>
									<Card.Meta title={rp.tieuDe} description={moment(rp.ngayTao).format('DD/MM/YYYY')} />
								</Card>
							</Col>
						))}
					</Row>
				</div>
			)}
		</div>
	);
};

export default ChiTietBaiViet;
