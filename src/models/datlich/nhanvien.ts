import { ETrangThaiNhanVien, GioLamViecMacDinh } from '@/services/DatLich/constant';
import { message } from 'antd';
import { useState } from 'react';

const STORAGE_KEY = 'datlich_nhanvien';

const getLocalData = (): NhanVien.IRecord[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

const saveLocalData = (data: NhanVien.IRecord[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateDefaultLichLamViec = (): NhanVien.ILichLamViec[] => {
	return Array.from({ length: 7 }, (_, i) => ({
		thu: i,
		gioMoCua: GioLamViecMacDinh.gioMoCua,
		gioDongCua: GioLamViecMacDinh.gioDongCua,
		nghiPhep: i === 0,
	}));
};

export default () => {
	const [danhSach, setDanhSach] = useState<NhanVien.IRecord[]>([]);
	const [record, setRecord] = useState<NhanVien.IRecord>();
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

	const postModel = async (payload: Partial<NhanVien.IRecord>) => {
		setFormSubmiting(true);
		const data = getLocalData();
		const newRecord: NhanVien.IRecord = {
			...payload,
			_id: Date.now().toString(),
			lichLamViec: payload.lichLamViec || generateDefaultLichLamViec(),
			trangThai: payload.trangThai || ETrangThaiNhanVien.HOAT_DONG,
			diemDanhGiaTB: 0,
			createdAt: new Date().toISOString(),
		} as NhanVien.IRecord;
		data.push(newRecord);
		saveLocalData(data);
		setDanhSach(data);
		message.success('Thêm mới thành công');
		setVisibleForm(false);
		setFormSubmiting(false);
		return newRecord;
	};

	const putModel = async (id: string, payload: Partial<NhanVien.IRecord>) => {
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

	const handleEdit = (rec: NhanVien.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	const updateDiemDanhGia = (nhanVienId: string, diemMoi: number) => {
		const data = getLocalData();
		const index = data.findIndex((item) => item._id === nhanVienId);
		if (index !== -1) {
			data[index].diemDanhGiaTB = diemMoi;
			saveLocalData(data);
			setDanhSach(data);
		}
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
		updateDiemDanhGia,
	};
};
