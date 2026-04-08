import { Button, Form, Modal } from 'antd';
import { useModel } from 'umi';
import SelectCauLacBo from './SelectCauLacBo';

interface Props {
	visible: boolean;
	onCancel: () => void;
	selectedIds: string[];
	onSuccess: () => void;
}

const ModalDoiCLB = (props: Props) => {
	const { visible, onCancel, selectedIds, onSuccess } = props;
	const [form] = Form.useForm();
	const { doiCauLacBo, formSubmiting } = useModel('caulacbo.thanhvien');

	const handleOk = async () => {
		const values = await form.validateFields();
		await doiCauLacBo(selectedIds, values.cauLacBoId);
		form.resetFields();
		onSuccess();
		onCancel();
	};

	return (
		<Modal
			title='Đổi câu lạc bộ'
			visible={visible}
			onCancel={onCancel}
			footer={[
				<Button key='cancel' onClick={onCancel}>
					Hủy
				</Button>,
				<Button key='ok' type='primary' loading={formSubmiting} onClick={handleOk}>
					Xác nhận
				</Button>,
			]}
		>
			<p>
				Bạn đang chuyển <strong>{selectedIds.length}</strong> thành viên sang câu lạc bộ mới.
			</p>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='cauLacBoId'
					label='Chọn câu lạc bộ mới'
					rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
				>
					<SelectCauLacBo />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ModalDoiCLB;
