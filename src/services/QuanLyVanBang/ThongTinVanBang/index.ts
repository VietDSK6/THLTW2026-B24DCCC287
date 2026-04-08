import { generateId, generateSoHieu, getLocalStorage, setLocalStorage } from '@/utils/localStorageHelper';
import * as QuyetDinhService from '../QuyetDinh';
import * as SoVanBangService from '../SoVanBang';
import { LOCAL_STORAGE_KEY } from './constant';

export const getAll = (): ThongTinVanBang.IRecord[] => {
	return getLocalStorage<ThongTinVanBang.IRecord>(LOCAL_STORAGE_KEY);
};

export const getById = (id: string): ThongTinVanBang.IRecord | undefined => {
	const data = getAll();
	return data.find((item) => item._id === id);
};

export const getByQuyetDinhId = (quyetDinhId: string): ThongTinVanBang.IRecord[] => {
	const data = getAll();
	return data.filter((item) => item.quyetDinhId === quyetDinhId);
};

export const create = (values: Partial<ThongTinVanBang.IRecord>): ThongTinVanBang.IRecord => {
	const data = getAll();
	const now = new Date().toISOString();

	const quyetDinh = QuyetDinhService.getById(values.quyetDinhId!);
	const soVanBang = SoVanBangService.getById(quyetDinh!.soVanBangId);

	const soVaoSo = SoVanBangService.tangSoHienTai(quyetDinh!.soVanBangId);
	const soHieuVanBang = generateSoHieu(soVanBang!.tienToSoHieu, soVaoSo);

	const newRecord: ThongTinVanBang.IRecord = {
		_id: generateId(),
		soVaoSo,
		soHieuVanBang,
		quyetDinhId: values.quyetDinhId!,
		quyetDinhSo: quyetDinh?.soQuyetDinh,
		soVanBangId: quyetDinh!.soVanBangId,
		maSinhVien: values.maSinhVien!,
		hoTen: values.hoTen!,
		ngaySinh: values.ngaySinh!,
		dynamicData: values.dynamicData || {},
		ngayCap: values.ngayCap!,
		nguoiCap: values.nguoiCap,
		createdAt: now,
		updatedAt: now,
	};

	data.push(newRecord);
	setLocalStorage(LOCAL_STORAGE_KEY, data);

	const countByQD = data.filter((item) => item.quyetDinhId === values.quyetDinhId).length;
	QuyetDinhService.updateSoLuongVanBang(values.quyetDinhId!, countByQD);

	return newRecord;
};

export const update = (id: string, values: Partial<ThongTinVanBang.IRecord>): ThongTinVanBang.IRecord | null => {
	const data = getAll();
	const index = data.findIndex((item) => item._id === id);
	if (index === -1) return null;

	const updated: ThongTinVanBang.IRecord = {
		...data[index],
		...values,
		soVaoSo: data[index].soVaoSo,
		soHieuVanBang: data[index].soHieuVanBang,
		updatedAt: new Date().toISOString(),
	};
	data[index] = updated;
	setLocalStorage(LOCAL_STORAGE_KEY, data);
	return updated;
};

export const remove = (id: string): boolean => {
	const data = getAll();
	const record = data.find((item) => item._id === id);
	if (!record) return false;

	const filtered = data.filter((item) => item._id !== id);
	setLocalStorage(LOCAL_STORAGE_KEY, filtered);

	const countByQD = filtered.filter((item) => item.quyetDinhId === record.quyetDinhId).length;
	QuyetDinhService.updateSoLuongVanBang(record.quyetDinhId, countByQD);

	return true;
};

export const search = (params: TraCuuVanBang.ISearchParams): ThongTinVanBang.IRecord[] => {
	const data = getAll();
	let results = [...data];

	if (params.soHieuVanBang) {
		results = results.filter((item) => item.soHieuVanBang.toLowerCase().includes(params.soHieuVanBang!.toLowerCase()));
	}

	if (params.soVaoSo) {
		results = results.filter((item) => item.soVaoSo === params.soVaoSo);
	}

	if (params.maSinhVien) {
		results = results.filter((item) => item.maSinhVien.toLowerCase().includes(params.maSinhVien!.toLowerCase()));
	}

	if (params.hoTen) {
		results = results.filter((item) => item.hoTen.toLowerCase().includes(params.hoTen!.toLowerCase()));
	}

	if (params.ngaySinh) {
		results = results.filter((item) => item.ngaySinh === params.ngaySinh);
	}

	return results;
};
