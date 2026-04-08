import { Button, Form, Input, Modal } from 'antd';
import { useModel } from 'umi';

interface Props {
	visible: boolean;
	onCancel: () => void;
	isApprove: boolean;
	selectedIds: string[];
}

const ModalDuyetDon = (props: Props) => {
	const { visible, onCancel, isApprove, selectedIds } = props;
	const [form] = Form.useForm();
	const { duyetDon, formSubmiting } = useModel('caulacbo.dondangky');

	const handleOk = async () => {
		if (!isApprove) {
			const values = await form.validateFields();
			duyetDon(selectedIds, false, values.ghiChu);
		} else {
			duyetDon(selectedIds, true);
		}
		form.resetFields();
		onCancel();
	};

	return (
		<Modal
			title={isApprove ? 'Xác nhận duyệt đơn' : 'Xác nhận từ chối đơn'}
			visible={visible}
			onCancel={onCancel}
			footer={[
				<Button key='cancel' onClick={onCancel}>
					Hủy
				</Button>,
				<Button key='ok' type='primary' danger={!isApprove} loading={formSubmiting} onClick={handleOk}>
					{isApprove ? 'Duyệt' : 'Từ chối'}
				</Button>,
			]}
		>
			<p>
				Bạn có chắc chắn muốn <strong>{isApprove ? 'duyệt' : 'từ chối'}</strong> <strong>{selectedIds.length}</strong>{' '}
				đơn đăng ký?
			</p>
			{!isApprove && (
				<Form form={form} layout='vertical'>
					<Form.Item
						name='ghiChu'
						label='Lý do từ chối'
						rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
					>
						<Input.TextArea rows={3} placeholder='Nhập lý do từ chối' />
					</Form.Item>
				</Form>
			)}
		</Modal>
	);
};

export default ModalDuyetDon;
