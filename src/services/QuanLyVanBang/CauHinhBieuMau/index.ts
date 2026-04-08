import { generateId, getLocalStorage, setLocalStorage } from '@/utils/localStorageHelper';
import { LOCAL_STORAGE_KEY, MAC_DINH_FIELDS } from './constant';

export const getAll = (): CauHinhBieuMau.IRecord[] => {
	return getLocalStorage<CauHinhBieuMau.IRecord>(LOCAL_STORAGE_KEY);
};

export const getById = (id: string): CauHinhBieuMau.IRecord | undefined => {
	const data = getAll();
	return data.find((item) => item._id === id);
};

export const getBySoVanBangId = (soVanBangId: string): CauHinhBieuMau.IRecord[] => {
	const data = getAll();
	const customFields = data.filter((item) => item.soVanBangId === soVanBangId);

	const macDinhFields: CauHinhBieuMau.IRecord[] = MAC_DINH_FIELDS.map((field, index) => ({
		_id: `mac_dinh_${index}`,
		soVanBangId,
		...field,
		kieuDuLieu: field.kieuDuLieu as 'String' | 'Number' | 'Date',
		batBuoc: true,
		createdAt: '',
		updatedAt: '',
	}));

	return [...macDinhFields, ...customFields].sort((a, b) => a.thuTu - b.thuTu);
};

export const create = (values: Partial<CauHinhBieuMau.IRecord>): CauHinhBieuMau.IRecord => {
	const data = getAll();
	const now = new Date().toISOString();

	const existingFields = getBySoVanBangId(values.soVanBangId!);
	const maxThuTu = Math.max(...existingFields.map((f) => f.thuTu), 0);

	const newRecord: CauHinhBieuMau.IRecord = {
		_id: generateId(),
		soVanBangId: values.soVanBangId!,
		tenTruong: values.tenTruong!,
		maTruong: values.maTruong!,
		kieuDuLieu: values.kieuDuLieu!,
		thuTu: maxThuTu + 1,
		batBuoc: values.batBuoc ?? false,
		ghiChu: values.ghiChu,
		laMacDinh: false,
		createdAt: now,
		updatedAt: now,
	};
	data.push(newRecord);
	setLocalStorage(LOCAL_STORAGE_KEY, data);
	return newRecord;
};

export const update = (id: string, values: Partial<CauHinhBieuMau.IRecord>): CauHinhBieuMau.IRecord | null => {
	const data = getAll();
	const index = data.findIndex((item) => item._id === id);
	if (index === -1) return null;

	const updated: CauHinhBieuMau.IRecord = {
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

export const updateThuTu = (soVanBangId: string, orderedIds: string[]): void => {
	const data = getAll();

	const updatedData = data.map((item) => {
		if (item.soVanBangId === soVanBangId) {
			const newIndex = orderedIds.indexOf(item._id);
			if (newIndex !== -1) {
				return { ...item, thuTu: newIndex + 6 };
			}
		}
		return item;
	});

	setLocalStorage(LOCAL_STORAGE_KEY, updatedData);
};
