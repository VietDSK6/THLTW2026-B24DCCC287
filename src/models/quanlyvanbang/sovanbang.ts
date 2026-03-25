import * as SoVanBangService from '@/services/QuanLyVanBang/SoVanBang';
import { notification } from 'antd';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState<SoVanBang.IRecord[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [visibleForm, setVisibleForm] = useState(false);
	const [record, setRecord] = useState<SoVanBang.IRecord>();
	const [edit, setEdit] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);

	const getModel = async () => {
		setLoading(true);
		try {
			const allData = SoVanBangService.getAll();
			const sorted = allData.sort((a, b) => b.namSo - a.namSo);
			const start = (page - 1) * limit;
			const end = start + limit;
			setData(sorted.slice(start, end));
			setTotal(sorted.length);
		} catch (error) {
			notification.error({ message: 'Lỗi khi tải dữ liệu' });
		} finally {
			setLoading(false);
		}
	};

	const postModel = async (values: Partial<SoVanBang.IRecord>) => {
		setFormSubmiting(true);
		try {
			SoVanBangService.create(values);
			notification.success({ message: 'Thêm mới sổ văn bằng thành công' });
			setVisibleForm(false);
			getModel();
		} catch (error) {
			notification.error({ message: 'Lỗi khi thêm mới' });
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, values: Partial<SoVanBang.IRecord>) => {
		setFormSubmiting(true);
		try {
			SoVanBangService.update(id, values);
			notification.success({ message: 'Cập nhật sổ văn bằng thành công' });
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
			const success = SoVanBangService.remove(id);
			if (success) {
				notification.success({ message: 'Xóa sổ văn bằng thành công' });
				getModel();
			} else {
				notification.error({ message: 'Không tìm thấy sổ văn bằng' });
			}
		} catch (error) {
			notification.error({ message: 'Lỗi khi xóa' });
		}
	};

	const handleEdit = (record: SoVanBang.IRecord) => {
		setRecord(record);
		setEdit(true);
		setVisibleForm(true);
	};

	const dongSo = async (id: string) => {
		try {
			SoVanBangService.dongSo(id);
			notification.success({ message: 'Đóng sổ văn bằng thành công' });
			getModel();
		} catch (error) {
			notification.error({ message: 'Lỗi khi đóng sổ' });
		}
	};

	const moSo = async (id: string) => {
		try {
			SoVanBangService.moSo(id);
			notification.success({ message: 'Mở sổ văn bằng thành công' });
			getModel();
		} catch (error) {
			notification.error({ message: 'Lỗi khi mở sổ' });
		}
	};

	return {
		data,
		total,
		loading,
		page,
		setPage,
		limit,
		setLimit,
		visibleForm,
		setVisibleForm,
		record,
		setRecord,
		edit,
		setEdit,
		formSubmiting,
		getModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
		dongSo,
		moSo,
	};
};
