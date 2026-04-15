import { SAMPLE_LICH_TRINH } from '@/services/DuLich/constant';
import { message } from 'antd';
import { useState } from 'react';

const STORAGE_KEY = 'dulich_lichtrinh';
const DIEMDEN_KEY = 'dulich_diemden';

const getInitialData = (): LichTrinh.IRecord[] => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		return JSON.parse(stored);
	}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LICH_TRINH));
	return SAMPLE_LICH_TRINH;
};

const getDiemDenData = (): DiemDen.IRecord[] => {
	const stored = localStorage.getItem(DIEMDEN_KEY);
	return stored ? JSON.parse(stored) : [];
};

export default () => {
	const [danhSach, setDanhSach] = useState<LichTrinh.IRecord[]>([]);
	const [record, setRecord] = useState<LichTrinh.IRecord>();
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);

	const tinhNganSach = (chiTiet: LichTrinh.NgayTrongTrinh[]): LichTrinh.NganSachHangMuc => {
		const diemDenList = getDiemDenData();
		const result = { anUong: 0, diChuyen: 0, luuTru: 0, veThamQuan: 0 };

		chiTiet.forEach((ngay) => {
			ngay.diemDens.forEach((dd) => {
				const diemDen = diemDenList.find((d) => d._id === dd.diemDenId);
				if (diemDen) {
					result.anUong += diemDen.chiPhi.anUong;
					result.diChuyen += diemDen.chiPhi.diChuyen;
					result.luuTru += diemDen.chiPhi.luuTru;
					result.veThamQuan += diemDen.chiPhi.veThamQuan;
				}
			});
		});

		return result;
	};

	const getModel = async () => {
		setLoading(true);
		try {
			const data = getInitialData();
			setTotal(data.length);
			const start = (page - 1) * limit;
			const paginatedData = data.slice(start, start + limit);
			setDanhSach(paginatedData);
			return paginatedData;
		} finally {
			setLoading(false);
		}
	};

	const getAllModel = async (): Promise<LichTrinh.IRecord[]> => {
		return getInitialData();
	};

	const getByIdModel = async (id: string): Promise<LichTrinh.IRecord | undefined> => {
		const data = getInitialData();
		const found = data.find((item) => item._id === id);
		if (found) {
			setRecord(found);
		}
		return found;
	};

	const postModel = async (payload: Partial<LichTrinh.IRecord>) => {
		setFormSubmiting(true);
		try {
			const data = getInitialData();
			const nganSachTheoHangMuc = tinhNganSach(payload.chiTiet || []);
			const tongNganSachDuKien =
				nganSachTheoHangMuc.anUong +
				nganSachTheoHangMuc.diChuyen +
				nganSachTheoHangMuc.luuTru +
				nganSachTheoHangMuc.veThamQuan;

			const newRecord: LichTrinh.IRecord = {
				...payload,
				_id: Date.now().toString(),
				nganSachTheoHangMuc,
				nganSachDuKien: tongNganSachDuKien,
				tongNganSach: payload.tongNganSach || tongNganSachDuKien,
				createdAt: new Date().toISOString(),
			} as LichTrinh.IRecord;

			data.unshift(newRecord);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			message.success('Tạo lịch trình thành công');
			setVisibleForm(false);
			getModel();
			return newRecord;
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, payload: Partial<LichTrinh.IRecord>): Promise<LichTrinh.IRecord | undefined> => {
		setFormSubmiting(true);
		try {
			const data = getInitialData();
			const index = data.findIndex((item) => item._id === id);
			if (index !== -1) {
				const nganSachTheoHangMuc = tinhNganSach(payload.chiTiet || data[index].chiTiet);
				const tongNganSachDuKien =
					nganSachTheoHangMuc.anUong +
					nganSachTheoHangMuc.diChuyen +
					nganSachTheoHangMuc.luuTru +
					nganSachTheoHangMuc.veThamQuan;

				data[index] = {
					...data[index],
					...payload,
					nganSachTheoHangMuc,
					nganSachDuKien: tongNganSachDuKien,
					updatedAt: new Date().toISOString(),
				};
				localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
				message.success('Cập nhật lịch trình thành công');
				setVisibleForm(false);
				setRecord(data[index]);
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
			message.success('Xóa lịch trình thành công');
			getModel();
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (rec: LichTrinh.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	const addDiemDenToNgay = (lichTrinhId: string, ngay: number, diemDenId: string) => {
		const data = getInitialData();
		const index = data.findIndex((item) => item._id === lichTrinhId);
		if (index !== -1) {
			const lichTrinh = data[index];
			const ngayIndex = lichTrinh.chiTiet.findIndex((n) => n.ngay === ngay);
			if (ngayIndex !== -1) {
				const maxThuTu = Math.max(0, ...lichTrinh.chiTiet[ngayIndex].diemDens.map((d) => d.thuTu));
				lichTrinh.chiTiet[ngayIndex].diemDens.push({
					diemDenId,
					thuTu: maxThuTu + 1,
					thoiGianDiChuyen: Math.floor(Math.random() * 60) + 30,
				});
			}

			const nganSachTheoHangMuc = tinhNganSach(lichTrinh.chiTiet);
			lichTrinh.nganSachTheoHangMuc = nganSachTheoHangMuc;
			lichTrinh.nganSachDuKien =
				nganSachTheoHangMuc.anUong +
				nganSachTheoHangMuc.diChuyen +
				nganSachTheoHangMuc.luuTru +
				nganSachTheoHangMuc.veThamQuan;

			data[index] = lichTrinh;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			setRecord(lichTrinh);
		}
	};

	const removeDiemDenFromNgay = (lichTrinhId: string, ngay: number, diemDenId: string) => {
		const data = getInitialData();
		const index = data.findIndex((item) => item._id === lichTrinhId);
		if (index !== -1) {
			const lichTrinh = data[index];
			const ngayIndex = lichTrinh.chiTiet.findIndex((n) => n.ngay === ngay);
			if (ngayIndex !== -1) {
				lichTrinh.chiTiet[ngayIndex].diemDens = lichTrinh.chiTiet[ngayIndex].diemDens.filter(
					(d) => d.diemDenId !== diemDenId,
				);
			}

			const nganSachTheoHangMuc = tinhNganSach(lichTrinh.chiTiet);
			lichTrinh.nganSachTheoHangMuc = nganSachTheoHangMuc;
			lichTrinh.nganSachDuKien =
				nganSachTheoHangMuc.anUong +
				nganSachTheoHangMuc.diChuyen +
				nganSachTheoHangMuc.luuTru +
				nganSachTheoHangMuc.veThamQuan;

			data[index] = lichTrinh;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			setRecord(lichTrinh);
		}
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
		getModel,
		getAllModel,
		getByIdModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
		addDiemDenToNgay,
		removeDiemDenFromNgay,
		tinhNganSach,
	};
};
