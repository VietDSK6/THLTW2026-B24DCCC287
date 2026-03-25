import { generateId, getLocalStorage, setLocalStorage } from '@/utils/localStorageHelper';
import * as SoVanBangService from '../SoVanBang';
import { LOCAL_STORAGE_KEY } from './constant';

export const getAll = (): QuyetDinh.IRecord[] => {
	return getLocalStorage<QuyetDinh.IRecord>(LOCAL_STORAGE_KEY);
};

export const getById = (id: string): QuyetDinh.IRecord | undefined => {
	const data = getAll();
	return data.find((item) => item._id === id);
};

export const getBySoVanBangId = (soVanBangId: string): QuyetDinh.IRecord[] => {
	const data = getAll();
	return data.filter((item) => item.soVanBangId === soVanBangId);
};

export const create = (values: Partial<QuyetDinh.IRecord>): QuyetDinh.IRecord => {
	const data = getAll();
	const now = new Date().toISOString();

	const soVanBang = SoVanBangService.getById(values.soVanBangId!);

	const newRecord: QuyetDinh.IRecord = {
		_id: generateId(),
		soQuyetDinh: values.soQuyetDinh!,
		ngayBanHanh: values.ngayBanHanh!,
		trichYeu: values.trichYeu!,
		soVanBangId: values.soVanBangId!,
		soVanBangTen: soVanBang?.tenSo,
		namSo: soVanBang?.namSo,
		soLuongVanBang: 0,
		soLuotTraCuu: 0,
		createdAt: now,
		updatedAt: now,
	};
	data.push(newRecord);
	setLocalStorage(LOCAL_STORAGE_KEY, data);
	return newRecord;
};

export const update = (id: string, values: Partial<QuyetDinh.IRecord>): QuyetDinh.IRecord | null => {
	const data = getAll();
	const index = data.findIndex((item) => item._id === id);
	if (index === -1) return null;

	let soVanBangTen = data[index].soVanBangTen;
	let namSo = data[index].namSo;

	if (values.soVanBangId && values.soVanBangId !== data[index].soVanBangId) {
		const soVanBang = SoVanBangService.getById(values.soVanBangId);
		soVanBangTen = soVanBang?.tenSo;
		namSo = soVanBang?.namSo;
	}

	const updated: QuyetDinh.IRecord = {
		...data[index],
		...values,
		soVanBangTen,
		namSo,
		updatedAt: new Date().toISOString(),
	};
	data[index] = updated;
	setLocalStorage(LOCAL_STORAGE_KEY, data);
	return updated;
};

export const remove = (id: string): boolean => {
	const data = getAll();
	const filtered = data.filter((item) => item._id !== id);
	if (filtered.length === data.length) return false;
	setLocalStorage(LOCAL_STORAGE_KEY, filtered);
	return true;
};

export const tangSoLuotTraCuu = (id: string): number => {
	const record = getById(id);
	if (!record) return 0;
	const soMoi = record.soLuotTraCuu + 1;
	update(id, { soLuotTraCuu: soMoi });
	return soMoi;
};

export const updateSoLuongVanBang = (quyetDinhId: string, soLuong: number): void => {
	update(quyetDinhId, { soLuongVanBang: soLuong });
};
