import { useState } from 'react';
import { getBlogPosts, getBlogTags, saveBlogPosts, saveBlogTags } from '@/services/Blog/constant';

export default () => {
	const [dsBaiViet, setDsBaiViet] = useState<Blog.BaiViet[]>([]);
	const [dsTag, setDsTag] = useState<Blog.Tag[]>([]);

	const loadBaiViet = () => {
		setDsBaiViet(getBlogPosts());
	};

	const loadTags = () => {
		setDsTag(getBlogTags());
	};

	const themBaiViet = (baiViet: Omit<Blog.BaiViet, 'id' | 'luotXem' | 'ngayTao' | 'ngayCapNhat'>) => {
		const posts = getBlogPosts();
		const newPost: Blog.BaiViet = {
			...baiViet,
			id: Date.now().toString(),
			luotXem: 0,
			ngayTao: new Date().toISOString(),
			ngayCapNhat: new Date().toISOString(),
		};
		const updated = [newPost, ...posts];
		saveBlogPosts(updated);
		setDsBaiViet(updated);
	};

	const suaBaiViet = (id: string, data: Partial<Blog.BaiViet>) => {
		const posts = getBlogPosts();
		const updated = posts.map((p) => (p.id === id ? { ...p, ...data, ngayCapNhat: new Date().toISOString() } : p));
		saveBlogPosts(updated);
		setDsBaiViet(updated);
	};

	const xoaBaiViet = (id: string) => {
		const posts = getBlogPosts();
		const updated = posts.filter((p) => p.id !== id);
		saveBlogPosts(updated);
		setDsBaiViet(updated);
	};

	const tangLuotXem = (id: string) => {
		const posts = getBlogPosts();
		const updated = posts.map((p) => (p.id === id ? { ...p, luotXem: p.luotXem + 1 } : p));
		saveBlogPosts(updated);
		setDsBaiViet(updated);
	};

	const themTag = (ten: string) => {
		const tags = getBlogTags();
		const newTag: Blog.Tag = { id: Date.now().toString(), ten };
		const updated = [...tags, newTag];
		saveBlogTags(updated);
		setDsTag(updated);
	};

	const suaTag = (id: string, ten: string) => {
		const tags = getBlogTags();
		const oldTag = tags.find((t) => t.id === id);
		if (oldTag && oldTag.ten !== ten) {
			const posts = getBlogPosts();
			const updatedPosts = posts.map((p) => ({
				...p,
				tags: p.tags.map((t) => (t === oldTag.ten ? ten : t)),
			}));
			saveBlogPosts(updatedPosts);
			setDsBaiViet(updatedPosts);
		}
		const updated = tags.map((t) => (t.id === id ? { ...t, ten } : t));
		saveBlogTags(updated);
		setDsTag(updated);
	};

	const xoaTag = (id: string) => {
		const tags = getBlogTags();
		const tag = tags.find((t) => t.id === id);
		if (tag) {
			const posts = getBlogPosts();
			const updatedPosts = posts.map((p) => ({
				...p,
				tags: p.tags.filter((t) => t !== tag.ten),
			}));
			saveBlogPosts(updatedPosts);
			setDsBaiViet(updatedPosts);
		}
		const updated = tags.filter((t) => t.id !== id);
		saveBlogTags(updated);
		setDsTag(updated);
	};

	return {
		dsBaiViet,
		dsTag,
		loadBaiViet,
		loadTags,
		themBaiViet,
		suaBaiViet,
		xoaBaiViet,
		tangLuotXem,
		themTag,
		suaTag,
		xoaTag,
	};
};
