import { message } from 'antd';
import { useState } from 'react';

const STORAGE_KEY = 'theduc_chisosuckhoe';

const getLocalData = (): ChiSoSucKhoe.IRecord[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

const saveLocalData = (data: ChiSoSucKhoe.IRecord[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default () => {
	const [danhSach, setDanhSach] = useState<ChiSoSucKhoe.IRecord[]>([]);
	const [record, setRecord] = useState<ChiSoSucKhoe.IRecord>();
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

	const postModel = async (payload: Partial<ChiSoSucKhoe.IRecord>) => {
		setFormSubmiting(true);
		const data = getLocalData();
		const canNang = payload.canNang || 0;
		const chieuCao = payload.chieuCao || 0;
		const bmi = chieuCao > 0 ? canNang / Math.pow(chieuCao / 100, 2) : 0;
		const newRecord: ChiSoSucKhoe.IRecord = {
			...payload,
			_id: Date.now().toString(),
			bmi: Math.round(bmi * 10) / 10,
			createdAt: new Date().toISOString(),
		} as ChiSoSucKhoe.IRecord;
		data.unshift(newRecord);
		saveLocalData(data);
		setDanhSach(data);
		message.success('Thêm chỉ số thành công');
		setVisibleForm(false);
		setFormSubmiting(false);
		return newRecord;
	};

	const putModel = async (id: string, payload: Partial<ChiSoSucKhoe.IRecord>) => {
		setFormSubmiting(true);
		const data = getLocalData();
		const index = data.findIndex((item) => item._id === id);
		if (index !== -1) {
			const canNang = payload.canNang || data[index].canNang;
			const chieuCao = payload.chieuCao || data[index].chieuCao;
			const bmi = chieuCao > 0 ? canNang / Math.pow(chieuCao / 100, 2) : 0;
			data[index] = {
				...data[index],
				...payload,
				bmi: Math.round(bmi * 10) / 10,
				updatedAt: new Date().toISOString(),
			};
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

	const handleEdit = (rec: ChiSoSucKhoe.IRecord) => {
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
