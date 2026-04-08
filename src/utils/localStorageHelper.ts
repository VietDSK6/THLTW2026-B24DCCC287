export const getLocalStorage = <T>(key: string): T[] => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : [];
};

export const setLocalStorage = <T>(key: string, data: T[]): void => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const generateId = (): string => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const generateSoHieu = (tienTo: string, soVaoSo: number): string => {
	return `${tienTo}${soVaoSo.toString().padStart(3, '0')}`;
};
