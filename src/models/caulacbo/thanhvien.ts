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
	const [danhSach, setDanhSach] = useState<DonDangKy.IRecord[]>([]);
	const [record, setRecord] = useState<DonDangKy.IRecord>();
	const [loading, setLoading] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [visibleDoiCLB, setVisibleDoiCLB] = useState(false);
	const [filterCauLacBoId, setFilterCauLacBoId] = useState<string>();

	const getModel = async (cauLacBoId?: string) => {
		setLoading(true);
		let data = getFromStorage().filter((item) => item.trangThai === ETrangThai.APPROVED);
		if (cauLacBoId || filterCauLacBoId) {
			data = data.filter((item) => item.cauLacBoId === (cauLacBoId || filterCauLacBoId));
		}
		setDanhSach(data);
		setTotal(data.length);
		setLoading(false);
		return data;
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
		message.success(`Đã chuyển ${ids.length} thành viên`);
		setSelectedIds([]);
		setVisibleDoiCLB(false);
		setFormSubmiting(false);
		getModel();
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
		total,
		setTotal,
		page,
		setPage,
		limit,
		setLimit,
		selectedIds,
		setSelectedIds,
		visibleDoiCLB,
		setVisibleDoiCLB,
		filterCauLacBoId,
		setFilterCauLacBoId,
		getModel,
		doiCauLacBo,
	};
};
