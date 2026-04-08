import { message } from 'antd';
import { useState } from 'react';

const STORAGE_KEY = 'caulacbo_list';

const getFromStorage = (): CauLacBo.IRecord[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
};

const saveToStorage = (data: CauLacBo.IRecord[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default () => {
	const [danhSach, setDanhSach] = useState<CauLacBo.IRecord[]>(getFromStorage());
	const [record, setRecord] = useState<CauLacBo.IRecord>();
	const [loading, setLoading] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [edit, setEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const getModel = async () => {
		setLoading(true);
		const data = getFromStorage();
		setDanhSach(data);
		setTotal(data.length);
		setLoading(false);
		return data;
	};

	const getAllModel = async () => {
		const data = getFromStorage();
		setDanhSach(data);
		return data;
	};

	const postModel = async (payload: Partial<CauLacBo.IRecord>) => {
		setFormSubmiting(true);
		const newRecord: CauLacBo.IRecord = {
			...payload,
			_id: Date.now().toString(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		} as CauLacBo.IRecord;
		const data = getFromStorage();
		data.unshift(newRecord);
		saveToStorage(data);
		setDanhSach(data);
		setTotal(data.length);
		message.success('Thêm mới thành công');
		setVisibleForm(false);
		setFormSubmiting(false);
		return newRecord;
	};

	const putModel = async (id: string, payload: Partial<CauLacBo.IRecord>) => {
		setFormSubmiting(true);
		const data = getFromStorage();
		const index = data.findIndex((item) => item._id === id);
		if (index !== -1) {
			data[index] = { ...data[index], ...payload, updatedAt: new Date().toISOString() };
			saveToStorage(data);
			setDanhSach(data);
			message.success('Cập nhật thành công');
		}
		setVisibleForm(false);
		setFormSubmiting(false);
		return data[index];
	};

	const deleteModel = async (id: string) => {
		setLoading(true);
		const data = getFromStorage().filter((item) => item._id !== id);
		saveToStorage(data);
		setDanhSach(data);
		setTotal(data.length);
		message.success('Xóa thành công');
		setLoading(false);
	};

	const handleEdit = (rec: CauLacBo.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec: CauLacBo.IRecord) => {
		setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	return {
		danhSach,
		setDanhSach,
		record,
		setRecord,
		loading,
		setLoading,
		formSubmiting,
		setFormSubmiting,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,
		isView,
		setIsView,
		total,
		setTotal,
		page,
		setPage,
		limit,
		setLimit,
		getModel,
		getAllModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
		handleView,
	};
};
