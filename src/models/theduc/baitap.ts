import { SEED_BAI_TAP } from '@/services/TheDuc/constant';
import { message } from 'antd';
import { useState } from 'react';

const STORAGE_KEY = 'theduc_baitap';

const getLocalData = (): BaiTap.IRecord[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BAI_TAP));
		return SEED_BAI_TAP;
	}
	return JSON.parse(data);
};

const saveLocalData = (data: BaiTap.IRecord[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default () => {
	const [danhSach, setDanhSach] = useState<BaiTap.IRecord[]>([]);
	const [record, setRecord] = useState<BaiTap.IRecord>();
	const [loading, setLoading] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const getModel = async () => {
		setLoading(true);
		const data = getLocalData();
		setDanhSach(data);
		setLoading(false);
		return data;
	};

	const postModel = async (payload: Partial<BaiTap.IRecord>) => {
		setFormSubmiting(true);
		const data = getLocalData();
		const newRecord: BaiTap.IRecord = {
			...payload,
			_id: Date.now().toString(),
			createdAt: new Date().toISOString(),
		} as BaiTap.IRecord;
		data.unshift(newRecord);
		saveLocalData(data);
		setDanhSach(data);
		message.success('Thêm bài tập thành công');
		setVisibleForm(false);
		setFormSubmiting(false);
		return newRecord;
	};

	const putModel = async (id: string, payload: Partial<BaiTap.IRecord>) => {
		setFormSubmiting(true);
		const data = getLocalData();
		const index = data.findIndex((item) => item._id === id);
		if (index !== -1) {
			data[index] = { ...data[index], ...payload, updatedAt: new Date().toISOString() };
			saveLocalData(data);
			setDanhSach(data);
			message.success('Cập nhật thành công');
		}
		setVisibleForm(false);
		setFormSubmiting(false);
		return data[index];
	};

	const deleteModel = async (id: string) => {
		setLoading(true);
		const data = getLocalData().filter((item) => item._id !== id);
		saveLocalData(data);
		setDanhSach(data);
		message.success('Xóa thành công');
		setLoading(false);
	};

	const handleEdit = (rec: BaiTap.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	return {
		danhSach,
		setDanhSach,
		record,
		setRecord,
		loading,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,
		formSubmiting,
		getModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
	};
};
