import * as QuyetDinhService from '@/services/QuanLyVanBang/QuyetDinh';
import { notification } from 'antd';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState<QuyetDinh.IRecord[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [visibleForm, setVisibleForm] = useState(false);
	const [record, setRecord] = useState<QuyetDinh.IRecord>();
	const [edit, setEdit] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [filterSoVanBangId, setFilterSoVanBangId] = useState<string>();

	const getModel = async () => {
		setLoading(true);
		try {
			let allData = QuyetDinhService.getAll();

			if (filterSoVanBangId) {
				allData = allData.filter((item) => item.soVanBangId === filterSoVanBangId);
			}

			const sorted = allData.sort((a, b) => new Date(b.ngayBanHanh).getTime() - new Date(a.ngayBanHanh).getTime());
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

	const postModel = async (values: Partial<QuyetDinh.IRecord>) => {
		setFormSubmiting(true);
		try {
			QuyetDinhService.create(values);
			notification.success({ message: 'Thêm mới quyết định thành công' });
			setVisibleForm(false);
			getModel();
		} catch (error) {
			notification.error({ message: 'Lỗi khi thêm mới' });
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, values: Partial<QuyetDinh.IRecord>) => {
		setFormSubmiting(true);
		try {
			QuyetDinhService.update(id, values);
			notification.success({ message: 'Cập nhật quyết định thành công' });
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
			const success = QuyetDinhService.remove(id);
			if (success) {
				notification.success({ message: 'Xóa quyết định thành công' });
				getModel();
			} else {
				notification.error({ message: 'Không tìm thấy quyết định' });
			}
		} catch (error) {
			notification.error({ message: 'Lỗi khi xóa' });
		}
	};

	const handleEdit = (record: QuyetDinh.IRecord) => {
		setRecord(record);
		setEdit(true);
		setVisibleForm(true);
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
		filterSoVanBangId,
		setFilterSoVanBangId,
		getModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
	};
};
