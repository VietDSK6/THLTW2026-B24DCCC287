import { ETrangThaiLichHen } from '@/services/DatLich/constant';
import { message } from 'antd';
import { useState } from 'react';

const STORAGE_KEY = 'datlich_lichhen';

const getLocalData = (): LichHen.IRecord[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

const saveLocalData = (data: LichHen.IRecord[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateMaLichHen = (): string => {
	const now = new Date();
	return `LH${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(
		2,
		'0',
	)}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(
		now.getSeconds(),
	).padStart(2, '0')}`;
};

export default () => {
	const [danhSach, setDanhSach] = useState<LichHen.IRecord[]>([]);
	const [record, setRecord] = useState<LichHen.IRecord>();
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

	const postModel = async (payload: Partial<LichHen.IRecord>) => {
		setFormSubmiting(true);
		const data = getLocalData();
		const newRecord: LichHen.IRecord = {
			...payload,
			_id: Date.now().toString(),
			ma: generateMaLichHen(),
			trangThai: ETrangThaiLichHen.CHO_DUYET,
			createdAt: new Date().toISOString(),
		} as LichHen.IRecord;
		data.push(newRecord);
		saveLocalData(data);
		setDanhSach(data);
		message.success('Đặt lịch thành công');
		setVisibleForm(false);
		setFormSubmiting(false);
		return newRecord;
	};

	const putModel = async (id: string, payload: Partial<LichHen.IRecord>) => {
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

	const updateTrangThai = async (id: string, trangThai: ETrangThaiLichHen) => {
		const data = getLocalData();
		const index = data.findIndex((item) => item._id === id);
		if (index !== -1) {
			data[index].trangThai = trangThai;
			data[index].updatedAt = new Date().toISOString();
			saveLocalData(data);
			setDanhSach(data);
			message.success('Cập nhật trạng thái thành công');
		}
		return data[index];
	};

	const handleEdit = (rec: LichHen.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	const checkTrungLich = (nhanVienId: string, ngayHen: string, gioHen: string, excludeId?: string): boolean => {
		const data = getLocalData();
		return data.some(
			(item) =>
				item.nhanVienId === nhanVienId &&
				item.ngayHen === ngayHen &&
				item.gioHen === gioHen &&
				item.trangThai !== ETrangThaiLichHen.HUY &&
				item._id !== excludeId,
		);
	};

	const getLichHenByNhanVien = (nhanVienId: string, ngayHen: string): LichHen.IRecord[] => {
		const data = getLocalData();
		return data.filter(
			(item) => item.nhanVienId === nhanVienId && item.ngayHen === ngayHen && item.trangThai !== ETrangThaiLichHen.HUY,
		);
	};

	const countLichHenByNhanVien = (nhanVienId: string, ngayHen: string): number => {
		return getLichHenByNhanVien(nhanVienId, ngayHen).length;
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
		updateTrangThai,
		checkTrungLich,
		getLichHenByNhanVien,
		countLichHenByNhanVien,
	};
};
