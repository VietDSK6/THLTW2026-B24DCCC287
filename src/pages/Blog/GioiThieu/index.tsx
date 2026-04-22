import type { FC } from 'react';
import { useState } from 'react';
import { Button, Form, Input, Tag } from 'antd';
import {
	CalendarOutlined,
	EditOutlined,
	EnvironmentOutlined,
	LinkOutlined,
	CheckOutlined,
	CloseOutlined,
	FacebookOutlined,
	InstagramOutlined,
} from '@ant-design/icons';
import styles from './index.less';

interface ProfileData {
	displayName: string;
	handle: string;
	bio: string;
	location: string;
	website: string;
	joinDate: string;
	following: number;
	followers: number;
	interests: string[];
	coverUrl: string;
	avatarUrl: string;
}

const DEFAULT_PROFILE: ProfileData = {
	displayName: 'Minh Tú',
	handle: '@minhtu.blog',
	bio: 'Kẻ mộng mơ | Người kể chuyện qua ảnh 📸\nSống tại Đà Lạt, viết về những điều nhỏ bé nhưng đẹp đẽ trong cuộc sống.\n"Cứ thong dong mà sống, chuyện gì đến rồi cũng sẽ đến." ✨',
	location: 'Đà Lạt, Việt Nam',
	website: 'minhtu.blog',
	joinDate: 'Tháng 1 năm 2024',
	following: 128,
	followers: 3420,
	interests: ['☕ Cà phê', '📸 Chụp ảnh', '✈️ Du lịch', '🎸 Indie', '📚 Đọc sách', '🌅 Hoàng hôn'],
	coverUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=300&fit=crop',
	avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
};

const TAG_COLORS = ['magenta', 'orange', 'gold', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

const STORAGE_KEY = 'blog_gioi_thieu';

function loadProfile(): ProfileData {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
}

function saveProfile(data: ProfileData) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const GioiThieu: FC = () => {
	const [profile, setProfile] = useState<ProfileData>(loadProfile);
	const [editing, setEditing] = useState(false);
	const [form] = Form.useForm();

	const startEdit = () => {
		form.setFieldsValue({
			...profile,
			interests: profile.interests.join(', '),
		});
		setEditing(true);
	};

	const handleSave = () => {
		form.validateFields().then((values) => {
			const updated: ProfileData = {
				...profile,
				...values,
				interests: values.interests
					? values.interests
							.split(',')
							.map((s: string) => s.trim())
							.filter(Boolean)
					: [],
			};
			setProfile(updated);
			saveProfile(updated);
			setEditing(false);
		});
	};

	const handleCancel = () => {
		setEditing(false);
	};

	return (
		<div className={styles.xProfile}>
			<img className={styles.cover} src={profile.coverUrl} alt='cover' />

			<div className={styles.profileHeader}>
				<div className={styles.avatarWrap}>
					<img className={styles.avatar} src={profile.avatarUrl} alt='avatar' />
				</div>

				{!editing ? (
					<Button className={styles.editBtn} onClick={startEdit} icon={<EditOutlined />}>
						Chỉnh sửa hồ sơ
					</Button>
				) : (
					<div className={styles.saveRow}>
						<Button icon={<CloseOutlined />} onClick={handleCancel}>
							Hủy
						</Button>
						<Button type='primary' icon={<CheckOutlined />} onClick={handleSave}>
							Lưu
						</Button>
					</div>
				)}
			</div>

			{!editing ? (
				<div className={styles.profileBody}>
					<p className={styles.displayName}>{profile.displayName}</p>
					<p className={styles.handle}>{profile.handle}</p>

					{profile.bio && <p className={styles.bio}>{profile.bio}</p>}

					<div className={styles.metaRow}>
						{profile.location && (
							<span className={styles.metaItem}>
								<EnvironmentOutlined /> {profile.location}
							</span>
						)}
						{profile.website && (
							<span className={styles.metaItem}>
								<LinkOutlined />{' '}
								<a href={`https://${profile.website}`} target='_blank' rel='noopener noreferrer'>
									{profile.website}
								</a>
							</span>
						)}
						{profile.joinDate && (
							<span className={styles.metaItem}>
								<CalendarOutlined /> Tham gia {profile.joinDate}
							</span>
						)}
					</div>

					<div className={styles.followRow}>
						<span>
							<strong>{profile.following.toLocaleString()}</strong> Đang theo dõi
						</span>
						<span>
							<strong>{profile.followers.toLocaleString()}</strong> Người theo dõi
						</span>
					</div>

					<div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
						<a href='#' style={{ color: '#1877F2', fontSize: 20 }}>
							<FacebookOutlined />
						</a>
						<a href='#' style={{ color: '#E1306C', fontSize: 20 }}>
							<InstagramOutlined />
						</a>
					</div>

					{profile.interests.length > 0 && (
						<div className={styles.interestsSection}>
							<p className={styles.interestsLabel}>Sở thích</p>
							<div className={styles.interestTags}>
								{profile.interests.map((item, i) => (
									<Tag key={item} color={TAG_COLORS[i % TAG_COLORS.length]}>
										{item}
									</Tag>
								))}
							</div>
						</div>
					)}
				</div>
			) : (
				<div className={styles.editForm}>
					<p className={styles.sectionLabel}>Chỉnh sửa hồ sơ</p>
					<Form form={form} layout='vertical'>
						<Form.Item name='displayName' label='Tên hiển thị' rules={[{ required: true }]}>
							<Input maxLength={50} showCount />
						</Form.Item>

						<Form.Item name='handle' label='Handle'>
							<Input placeholder='@username' maxLength={30} />
						</Form.Item>

						<Form.Item name='bio' label='Tiểu sử'>
							<Input.TextArea rows={3} maxLength={160} showCount placeholder='Viết vài dòng về bản thân...' />
						</Form.Item>

						<Form.Item name='location' label='Vị trí'>
							<Input placeholder='Thành phố, Quốc gia' maxLength={30} />
						</Form.Item>

						<Form.Item name='website' label='Website'>
							<Input placeholder='yourwebsite.com' maxLength={100} />
						</Form.Item>

						<Form.Item name='joinDate' label='Ngày tham gia'>
							<Input placeholder='Tháng 1 năm 2024' maxLength={30} />
						</Form.Item>

						<Form.Item name='following' label='Đang theo dõi'>
							<Input type='number' min={0} />
						</Form.Item>

						<Form.Item name='followers' label='Người theo dõi'>
							<Input type='number' min={0} />
						</Form.Item>

						<Form.Item name='coverUrl' label='Ảnh bìa (URL)'>
							<Input placeholder='https://...' />
						</Form.Item>

						<Form.Item
							name='interests'
							label='Sở thích (cách nhau bởi dấu phẩy)'
							extra='Ví dụ: ☕ Cà phê, 📸 Chụp ảnh, ✈️ Du lịch'
						>
							<Input.TextArea rows={2} placeholder='☕ Cà phê, 📸 Chụp ảnh' />
						</Form.Item>
					</Form>
				</div>
			)}
		</div>
	);
};

export default GioiThieu;
