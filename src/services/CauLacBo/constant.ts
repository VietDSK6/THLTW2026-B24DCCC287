export const ETrangThai = {
	PENDING: 'PENDING',
	APPROVED: 'APPROVED',
	REJECTED: 'REJECTED',
} as const;

export const TrangThaiLabel: Record<string, string> = {
	PENDING: 'Chờ duyệt',
	APPROVED: 'Đã duyệt',
	REJECTED: 'Từ chối',
};

export const TrangThaiColor: Record<string, string> = {
	PENDING: 'orange',
	APPROVED: 'green',
	REJECTED: 'red',
};

export const GioiTinhLabel: Record<string, string> = {
	Nam: 'Nam',
	Nu: 'Nữ',
	Khac: 'Khác',
};

export const GioiTinhOptions = [
	{ value: 'Nam', label: 'Nam' },
	{ value: 'Nu', label: 'Nữ' },
	{ value: 'Khac', label: 'Khác' },
];
