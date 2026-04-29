import type { FC } from 'react';
import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { useModel } from 'umi';
import TinyEditor from '@/components/TinyEditor';

interface Props {
	visible: boolean;
	editingPost?: Blog.BaiViet;
	onClose: () => void;
}

const FormBaiViet: FC<Props> = ({ visible, editingPost, onClose }) => {
	const [form] = Form.useForm();
	const { dsTag, loadTags, themBaiViet, suaBaiViet } = useModel('blog');

	useEffect(() => {
		loadTags();
	}, []);

	useEffect(() => {
		if (visible) {
			if (editingPost) {
				form.setFieldsValue(editingPost);
			} else {
				form.resetFields();
			}
		}
	}, [visible, editingPost]);

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			if (editingPost) {
				suaBaiViet(editingPost.id, values);
			} else {
				themBaiViet(values);
			}
			onClose();
		});
	};

	return (
		<Modal
			title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}
			visible={visible}
			onOk={handleSubmit}
			onCancel={onClose}
			okText={editingPost ? 'Cập nhật' : 'Thêm mới'}
			cancelText="Hủy"
			width={700}
			destroyOnClose
		>
			<Form form={form} layout="vertical">
				<Form.Item
					name="tieuDe"
					label="Tiêu đề"
					rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
				>
					<Input placeholder="Nhập tiêu đề bài viết" />
				</Form.Item>

				<Form.Item
					name="slug"
					label="Slug"
					rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
				>
					<Input placeholder="vd: bai-viet-dau-tien" />
				</Form.Item>

				<Form.Item
					name="tomTat"
					label="Tóm tắt"
					rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
				>
					<Input.TextArea rows={2} placeholder="Mô tả ngắn về bài viết" />
				</Form.Item>

				<Form.Item
					name="noiDung"
					label="Nội dung"
					rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
				>
					<TinyEditor height={400} />
				</Form.Item>

				<Form.Item
					name="anhDaiDien"
					label="Ảnh đại diện (URL)"
					rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
				>
					<Input placeholder="https://example.com/image.jpg" />
				</Form.Item>

				<Form.Item
					name="tacGia"
					label="Tác giả"
					rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
					initialValue="Nguyễn Văn A"
				>
					<Input placeholder="Tên tác giả" />
				</Form.Item>

				<Form.Item
					name="tags"
					label="Thẻ"
					rules={[{ required: true, message: 'Vui lòng chọn thẻ' }]}
				>
					<Select mode="multiple" placeholder="Chọn thẻ">
						{dsTag.map((tag) => (
							<Select.Option key={tag.id} value={tag.ten}>
								{tag.ten}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name="trangThai"
					label="Trạng thái"
					rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
					initialValue="draft"
				>
					<Select>
						<Select.Option value="draft">Nháp</Select.Option>
						<Select.Option value="published">Đã đăng</Select.Option>
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormBaiViet;
