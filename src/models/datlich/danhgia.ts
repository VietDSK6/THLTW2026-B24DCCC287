import { message } from 'antd';
import { useState } from 'react';

const STORAGE_KEY = 'datlich_danhgia';

const getLocalData = (): DanhGia.IRecord[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

const saveLocalData = (data: DanhGia.IRecord[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default () => {
	const [danhSach, setDanhSach] = useState<DanhGia.IRecord[]>([]);
	const [record, setRecord] = useState<DanhGia.IRecord>();
	const [loading, setLoading] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [visiblePhanHoi, setVisiblePhanHoi] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);

	const getModel = async () => {
		setLoading(true);
		const data = getLocalData();
		setDanhSach(data);
		setLoading(false);
		return data;
	};

	const postModel = async (payload: Partial<DanhGia.IRecord>) => {
		setFormSubmiting(true);
		const data = getLocalData();
		const newRecord: DanhGia.IRecord = {
			...payload,
			_id: Date.now().toString(),
			createdAt: new Date().toISOString(),
		} as DanhGia.IRecord;
		data.push(newRecord);
		saveLocalData(data);
		setDanhSach(data);
		message.success('Đánh giá thành công');
		setVisibleForm(false);
		setFormSubmiting(false);
		return newRecord;
	};

	const putModel = async (id: string, payload: Partial<DanhGia.IRecord>) => {
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

	const addPhanHoi = async (id: string, phanHoi: DanhGia.IPhanHoi) => {
		const data = getLocalData();
		const index = data.findIndex((item) => item._id === id);
		if (index !== -1) {
			data[index].phanHoi = phanHoi;
			data[index].updatedAt = new Date().toISOString();
			saveLocalData(data);
			setDanhSach(data);
			message.success('Phản hồi thành công');
		}
		setVisiblePhanHoi(false);
		return data[index];
	};

	const handleEdit = (rec: DanhGia.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	const handlePhanHoi = (rec: DanhGia.IRecord) => {
		setRecord(rec);
		setVisiblePhanHoi(true);
	};

	const getDanhGiaByNhanVien = (nhanVienId: string): DanhGia.IRecord[] => {
		const data = getLocalData();
		return data.filter((item) => item.nhanVienId === nhanVienId);
	};

	const getDiemTrungBinhNhanVien = (nhanVienId: string): number => {
		const danhGias = getDanhGiaByNhanVien(nhanVienId);
		if (danhGias.length === 0) return 0;
		const tongDiem = danhGias.reduce((sum, item) => sum + item.diem, 0);
		return Math.round((tongDiem / danhGias.length) * 10) / 10;
	};

	const checkDaDanhGia = (lichHenId: string): boolean => {
		const data = getLocalData();
		return data.some((item) => item.lichHenId === lichHenId);
	};

	return {
		danhSach,
		setDanhSach,
		record,
		setRecord,
		loading,
		visibleForm,
		setVisibleForm,
		visiblePhanHoi,
		setVisiblePhanHoi,
		edit,
		setEdit,
		formSubmiting,
		getModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
		handlePhanHoi,
		addPhanHoi,
		getDanhGiaByNhanVien,
		getDiemTrungBinhNhanVien,
		checkDaDanhGia,
	};
};
