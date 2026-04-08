import * as CauHinhBieuMauService from '@/services/QuanLyVanBang/CauHinhBieuMau';
import { notification } from 'antd';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState<CauHinhBieuMau.IRecord[]>([]);
	const [loading, setLoading] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [record, setRecord] = useState<CauHinhBieuMau.IRecord>();
	const [edit, setEdit] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [selectedSoVanBangId, setSelectedSoVanBangId] = useState<string>();

	const getModel = async () => {
		if (!selectedSoVanBangId) {
			setData([]);
			return;
		}

		setLoading(true);
		try {
			const allData = CauHinhBieuMauService.getBySoVanBangId(selectedSoVanBangId);
			setData(allData);
		} catch (error) {
			notification.error({ message: 'Lỗi khi tải dữ liệu' });
		} finally {
			setLoading(false);
		}
	};

	const postModel = async (values: Partial<CauHinhBieuMau.IRecord>) => {
		setFormSubmiting(true);
		try {
			CauHinhBieuMauService.create({ ...values, soVanBangId: selectedSoVanBangId });
			notification.success({ message: 'Thêm mới trường thông tin thành công' });
			setVisibleForm(false);
			getModel();
		} catch (error) {
			notification.error({ message: 'Lỗi khi thêm mới' });
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, values: Partial<CauHinhBieuMau.IRecord>) => {
		setFormSubmiting(true);
		try {
			CauHinhBieuMauService.update(id, values);
			notification.success({ message: 'Cập nhật trường thông tin thành công' });
			setVisibleForm(false);
			getModel();
		} catch (error) {
			notification.error({ message: 'Lỗi khi cập nhật' });
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string) => {
		try {
			const success = CauHinhBieuMauService.remove(id);
			if (success) {
				notification.success({ message: 'Xóa trường thông tin thành công' });
				getModel();
			} else {
				notification.error({ message: 'Không tìm thấy trường thông tin' });
			}
		} catch (error) {
			notification.error({ message: 'Lỗi khi xóa' });
		}
	};

	const handleEdit = (record: CauHinhBieuMau.IRecord) => {
		setRecord(record);
		setEdit(true);
		setVisibleForm(true);
	};

	const updateThuTu = (orderedIds: string[]) => {
		if (!selectedSoVanBangId) return;
		CauHinhBieuMauService.updateThuTu(selectedSoVanBangId, orderedIds);
		getModel();
	};

	return {
		data,
		loading,
		visibleForm,
		setVisibleForm,
		record,
		setRecord,
		edit,
		setEdit,
		formSubmiting,
		selectedSoVanBangId,
		setSelectedSoVanBangId,
		getModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
		updateThuTu,
	};
};
