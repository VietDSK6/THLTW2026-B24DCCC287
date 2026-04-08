import { ETrangThai } from '@/services/CauLacBo/constant';
import { message } from 'antd';
import moment from 'moment';
import { useState } from 'react';

const STORAGE_KEY = 'dondangky_list';

const getFromStorage = (): DonDangKy.IRecord[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
};

const saveToStorage = (data: DonDangKy.IRecord[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default () => {
	const [danhSach, setDanhSach] = useState<DonDangKy.IRecord[]>(getFromStorage());
	const [record, setRecord] = useState<DonDangKy.IRecord>();
	const [loading, setLoading] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [visibleForm, setVisibleForm] = useState(false);
	const [edit, setEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [visibleDuyet, setVisibleDuyet] = useState(false);
	const [visibleLichSu, setVisibleLichSu] = useState(false);
	const [filterCauLacBoId, setFilterCauLacBoId] = useState<string>();

	const getModel = async (cauLacBoId?: string) => {
		setLoading(true);
		let data = getFromStorage();
		if (cauLacBoId || filterCauLacBoId) {
			data = data.filter((item) => item.cauLacBoId === (cauLacBoId || filterCauLacBoId));
		}
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

	const postModel = async (payload: Partial<DonDangKy.IRecord>) => {
		setFormSubmiting(true);
		const newRecord: DonDangKy.IRecord = {
			...payload,
			_id: Date.now().toString(),
			trangThai: ETrangThai.PENDING,
			lichSu: [
				{
					thoiGian: new Date().toISOString(),
					hanhDong: ETrangThai.PENDING,
					nguoiThucHien: 'Hệ thống',
					ghiChu: 'Tạo đơn đăng ký mới',
				},
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		} as DonDangKy.IRecord;
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

	const putModel = async (id: string, payload: Partial<DonDangKy.IRecord>) => {
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

	const duyetDon = async (ids: string[], approved: boolean, ghiChu?: string) => {
		setFormSubmiting(true);
		const data = getFromStorage();
		const trangThai = approved ? ETrangThai.APPROVED : ETrangThai.REJECTED;
		const lichSuItem: DonDangKy.ILichSu = {
			thoiGian: new Date().toISOString(),
			hanhDong: trangThai,
			nguoiThucHien: 'Admin',
			ghiChu: ghiChu || (approved ? 'Đã duyệt đơn' : 'Từ chối đơn'),
		};

		ids.forEach((id) => {
			const index = data.findIndex((item) => item._id === id);
			if (index !== -1) {
				data[index].trangThai = trangThai;
				data[index].ghiChu = ghiChu;
				data[index].lichSu = [...(data[index].lichSu || []), lichSuItem];
				data[index].updatedAt = new Date().toISOString();
			}
		});

		saveToStorage(data);
		setDanhSach(data);
		message.success(`Đã ${approved ? 'duyệt' : 'từ chối'} ${ids.length} đơn`);
		setSelectedIds([]);
		setVisibleDuyet(false);
		setFormSubmiting(false);
	};

	const doiCauLacBo = async (ids: string[], cauLacBoIdMoi: string) => {
		setFormSubmiting(true);
		const data = getFromStorage();
		const lichSuItem: DonDangKy.ILichSu = {
			thoiGian: new Date().toISOString(),
			hanhDong: ETrangThai.APPROVED,
			nguoiThucHien: 'Admin',
			ghiChu: `Chuyển câu lạc bộ vào ${moment().format('HH:mm DD/MM/YYYY')}`,
		};

		ids.forEach((id) => {
			const index = data.findIndex((item) => item._id === id);
			if (index !== -1) {
				data[index].cauLacBoId = cauLacBoIdMoi;
				data[index].lichSu = [...(data[index].lichSu || []), lichSuItem];
				data[index].updatedAt = new Date().toISOString();
			}
		});

		saveToStorage(data);
		setDanhSach(data);
		message.success(`Đã chuyển ${ids.length} thành viên`);
		setSelectedIds([]);
		setFormSubmiting(false);
	};

	const handleEdit = (rec: DonDangKy.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec: DonDangKy.IRecord) => {
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
		selectedIds,
		setSelectedIds,
		visibleDuyet,
		setVisibleDuyet,
		visibleLichSu,
		setVisibleLichSu,
		filterCauLacBoId,
		setFilterCauLacBoId,
		getModel,
		getAllModel,
		postModel,
		putModel,
		deleteModel,
		duyetDon,
		doiCauLacBo,
		handleEdit,
		handleView,
	};
};
