import { SAMPLE_DIEM_DEN } from '@/services/DuLich/constant';
import { message } from 'antd';
import { useState } from 'react';

const STORAGE_KEY = 'dulich_diemden';

const getInitialData = (): DiemDen.IRecord[] => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		return JSON.parse(stored);
	}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DIEM_DEN));
	return SAMPLE_DIEM_DEN;
};

export default () => {
	const [danhSach, setDanhSach] = useState<DiemDen.IRecord[]>([]);
	const [record, setRecord] = useState<DiemDen.IRecord>();
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [filters, setFilters] = useState<{ loaiHinh?: DiemDen.LoaiHinh; rating?: number; search?: string }>({});

	const getModel = async () => {
		setLoading(true);
		try {
			let data = getInitialData();

			if (filters.loaiHinh) {
				data = data.filter((item) => item.loaiHinh === filters.loaiHinh);
			}
			if (filters.rating) {
				data = data.filter((item) => item.rating >= filters.rating!);
			}
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				data = data.filter(
					(item) => item.ten.toLowerCase().includes(searchLower) || item.diaDiem.toLowerCase().includes(searchLower),
				);
			}

			setTotal(data.length);
			const start = (page - 1) * limit;
			const paginatedData = data.slice(start, start + limit);
			setDanhSach(paginatedData);
			return paginatedData;
		} finally {
			setLoading(false);
		}
	};

	const getAllModel = async (): Promise<DiemDen.IRecord[]> => {
		return getInitialData();
	};

	const postModel = async (payload: Partial<DiemDen.IRecord>) => {
		setFormSubmiting(true);
		try {
			const data = getInitialData();
			const newRecord: DiemDen.IRecord = {
				...payload,
				_id: Date.now().toString(),
				createdAt: new Date().toISOString(),
			} as DiemDen.IRecord;
			data.unshift(newRecord);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			message.success('Thêm mới thành công');
			setVisibleForm(false);
			getModel();
			return newRecord;
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, payload: Partial<DiemDen.IRecord>): Promise<DiemDen.IRecord | undefined> => {
		setFormSubmiting(true);
		try {
			const data = getInitialData();
			const index = data.findIndex((item) => item._id === id);
			if (index !== -1) {
				data[index] = { ...data[index], ...payload, updatedAt: new Date().toISOString() };
				localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
				message.success('Cập nhật thành công');
				setVisibleForm(false);
				getModel();
				return data[index];
			}
			return undefined;
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string) => {
		setLoading(true);
		try {
			const data = getInitialData();
			const newData = data.filter((item) => item._id !== id);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
			message.success('Xóa thành công');
			getModel();
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (rec: DiemDen.IRecord) => {
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
		setLoading,
		formSubmiting,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,
		total,
		setTotal,
		page,
		setPage,
		limit,
		setLimit,
		filters,
		setFilters,
		getModel,
		getAllModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
	};
};
