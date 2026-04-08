import { generateId, getLocalStorage, setLocalStorage } from '@/utils/localStorageHelper';
import { LOCAL_STORAGE_KEY } from './constant';

export const getAll = (): SoVanBang.IRecord[] => {
	return getLocalStorage<SoVanBang.IRecord>(LOCAL_STORAGE_KEY);
};

export const getById = (id: string): SoVanBang.IRecord | undefined => {
	const data = getAll();
	return data.find((item) => item._id === id);
};

export const create = (values: Partial<SoVanBang.IRecord>): SoVanBang.IRecord => {
	const data = getAll();
	const now = new Date().toISOString();
	const newRecord: SoVanBang.IRecord = {
		_id: generateId(),
		namSo: values.namSo!,
		tenSo: values.tenSo!,
		tienToSoHieu: values.tienToSoHieu!,
		soHienTai: 0,
		trangThai: 'dang_su_dung',
		ngayMoSo: values.ngayMoSo!,
		createdAt: now,
		updatedAt: now,
	};
	data.push(newRecord);
	setLocalStorage(LOCAL_STORAGE_KEY, data);
	return newRecord;
};

export const update = (id: string, values: Partial<SoVanBang.IRecord>): SoVanBang.IRecord | null => {
	const data = getAll();
	const index = data.findIndex((item) => item._id === id);
	if (index === -1) return null;

	const updated: SoVanBang.IRecord = {
		...data[index],
		...values,
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

export const dongSo = (id: string): SoVanBang.IRecord | null => {
	return update(id, {
		trangThai: 'da_dong',
		ngayDongSo: new Date().toISOString(),
	});
};

export const moSo = (id: string): SoVanBang.IRecord | null => {
	return update(id, {
		trangThai: 'dang_su_dung',
		ngayDongSo: undefined,
	});
};

export const tangSoHienTai = (id: string): number => {
	const record = getById(id);
	if (!record) return 0;
	const soMoi = record.soHienTai + 1;
	update(id, { soHienTai: soMoi });
	return soMoi;
};
