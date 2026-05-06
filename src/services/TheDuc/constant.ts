export enum ELoaiBaiTap {
	CARDIO = 'CARDIO',
	STRENGTH = 'STRENGTH',
	YOGA = 'YOGA',
	HIIT = 'HIIT',
	OTHER = 'OTHER',
}

export enum ETrangThaiBuoiTap {
	HOAN_THANH = 'HOAN_THANH',
	BO_LO = 'BO_LO',
}

export enum ELoaiMucTieu {
	GIAM_CAN = 'GIAM_CAN',
	TANG_CO = 'TANG_CO',
	SUC_BEN = 'SUC_BEN',
	KHAC = 'KHAC',
}

export enum ETrangThaiMucTieu {
	DANG_THUC_HIEN = 'DANG_THUC_HIEN',
	DA_DAT = 'DA_DAT',
	DA_HUY = 'DA_HUY',
}

export enum EMucDoKho {
	DE = 'DE',
	TRUNG_BINH = 'TRUNG_BINH',
	KHO = 'KHO',
}

export enum ENhomCo {
	CHEST = 'CHEST',
	BACK = 'BACK',
	LEGS = 'LEGS',
	SHOULDERS = 'SHOULDERS',
	ARMS = 'ARMS',
	CORE = 'CORE',
	FULL_BODY = 'FULL_BODY',
}

export const LoaiBaiTapText: Record<ELoaiBaiTap, string> = {
	[ELoaiBaiTap.CARDIO]: 'Cardio',
	[ELoaiBaiTap.STRENGTH]: 'Strength',
	[ELoaiBaiTap.YOGA]: 'Yoga',
	[ELoaiBaiTap.HIIT]: 'HIIT',
	[ELoaiBaiTap.OTHER]: 'Khác',
};

export const TrangThaiBuoiTapText: Record<ETrangThaiBuoiTap, string> = {
	[ETrangThaiBuoiTap.HOAN_THANH]: 'Hoàn thành',
	[ETrangThaiBuoiTap.BO_LO]: 'Bỏ lỡ',
};

export const TrangThaiBuoiTapColor: Record<ETrangThaiBuoiTap, string> = {
	[ETrangThaiBuoiTap.HOAN_THANH]: 'green',
	[ETrangThaiBuoiTap.BO_LO]: 'red',
};

export const LoaiMucTieuText: Record<ELoaiMucTieu, string> = {
	[ELoaiMucTieu.GIAM_CAN]: 'Giảm cân',
	[ELoaiMucTieu.TANG_CO]: 'Tăng cơ',
	[ELoaiMucTieu.SUC_BEN]: 'Cải thiện sức bền',
	[ELoaiMucTieu.KHAC]: 'Khác',
};

export const TrangThaiMucTieuText: Record<ETrangThaiMucTieu, string> = {
	[ETrangThaiMucTieu.DANG_THUC_HIEN]: 'Đang thực hiện',
	[ETrangThaiMucTieu.DA_DAT]: 'Đã đạt',
	[ETrangThaiMucTieu.DA_HUY]: 'Đã hủy',
};

export const TrangThaiMucTieuColor: Record<ETrangThaiMucTieu, string> = {
	[ETrangThaiMucTieu.DANG_THUC_HIEN]: 'blue',
	[ETrangThaiMucTieu.DA_DAT]: 'green',
	[ETrangThaiMucTieu.DA_HUY]: 'red',
};

export const MucDoKhoText: Record<EMucDoKho, string> = {
	[EMucDoKho.DE]: 'Dễ',
	[EMucDoKho.TRUNG_BINH]: 'Trung bình',
	[EMucDoKho.KHO]: 'Khó',
};

export const MucDoKhoColor: Record<EMucDoKho, string> = {
	[EMucDoKho.DE]: 'green',
	[EMucDoKho.TRUNG_BINH]: 'orange',
	[EMucDoKho.KHO]: 'red',
};

export const NhomCoText: Record<ENhomCo, string> = {
	[ENhomCo.CHEST]: 'Ngực',
	[ENhomCo.BACK]: 'Lưng',
	[ENhomCo.LEGS]: 'Chân',
	[ENhomCo.SHOULDERS]: 'Vai',
	[ENhomCo.ARMS]: 'Tay',
	[ENhomCo.CORE]: 'Bụng',
	[ENhomCo.FULL_BODY]: 'Toàn thân',
};

export const SEED_BAI_TAP: BaiTap.IRecord[] = [
	{
		_id: 'seed_1',
		ten: 'Chạy bộ',
		nhomCo: ENhomCo.LEGS,
		mucDoKho: EMucDoKho.DE,
		moTa: 'Bài tập cardio cơ bản giúp tăng cường sức bền tim mạch.',
		caloTrungBinh: 600,
		huongDan: 'Khởi động 5 phút đi bộ nhanh. Chạy với tốc độ vừa phải trong 20-30 phút. Giữ nhịp thở đều đặn, hít vào bằng mũi thở ra bằng miệng. Hạ nhiệt bằng 5 phút đi bộ chậm và giãn cơ.',
	},
	{
		_id: 'seed_2',
		ten: 'Gập bụng (Crunch)',
		nhomCo: ENhomCo.CORE,
		mucDoKho: EMucDoKho.DE,
		moTa: 'Bài tập cơ bản cho cơ bụng trên.',
		caloTrungBinh: 300,
		huongDan: 'Nằm ngửa, co đầu gối, bàn chân đặt sát sàn. Hai tay đặt sau gáy hoặc bắt chéo trước ngực. Siết cơ bụng nâng vai lên khỏi sàn. Giữ 1 giây rồi hạ xuống. Thực hiện 3 hiệp x 15-20 lần.',
	},
	{
		_id: 'seed_3',
		ten: 'Plank',
		nhomCo: ENhomCo.CORE,
		mucDoKho: EMucDoKho.TRUNG_BINH,
		moTa: 'Bài tập đẳng trường tăng cường sức mạnh cơ lõi.',
		caloTrungBinh: 250,
		huongDan: 'Chống khuỷu tay xuống sàn, vai thẳng hàng với khuỷu tay. Duỗi thẳng chân, chống mũi chân. Giữ cơ thể thẳng từ đầu đến gót chân. Siết cơ bụng và giữ tư thế 30-60 giây. Thực hiện 3-4 hiệp.',
	},
	{
		_id: 'seed_4',
		ten: 'Squat',
		nhomCo: ENhomCo.LEGS,
		mucDoKho: EMucDoKho.TRUNG_BINH,
		moTa: 'Bài tập compound cho chân và mông.',
		caloTrungBinh: 400,
		huongDan: 'Đứng thẳng, hai chân rộng bằng vai. Hạ người xuống như ngồi ghế, đùi song song mặt đất. Giữ lưng thẳng, đầu gối không vượt quá mũi chân. Đẩy người lên bằng gót chân. Thực hiện 3 hiệp x 12-15 lần.',
	},
	{
		_id: 'seed_5',
		ten: 'Push-up',
		nhomCo: ENhomCo.CHEST,
		mucDoKho: EMucDoKho.TRUNG_BINH,
		moTa: 'Bài tập cơ bản cho ngực, vai và tay sau.',
		caloTrungBinh: 350,
		huongDan: 'Chống tay xuống sàn rộng hơn vai. Duỗi thẳng người từ đầu đến chân. Hạ ngực xuống gần sàn, khuỷu tay tạo góc 45 độ. Đẩy người lên trở về vị trí ban đầu. Thực hiện 3 hiệp x 10-15 lần.',
	},
	{
		_id: 'seed_6',
		ten: 'Deadlift',
		nhomCo: ENhomCo.BACK,
		mucDoKho: EMucDoKho.KHO,
		moTa: 'Bài tập compound cho lưng dưới, mông và đùi sau.',
		caloTrungBinh: 500,
		huongDan: 'Đứng thẳng, chân rộng bằng hông, thanh tạ trước ống chân. Gập hông đẩy mông ra sau, nắm thanh tạ. Giữ lưng thẳng, siết cơ lõi. Đẩy hông về phía trước nâng tạ lên. Hạ tạ xuống kiểm soát. Thực hiện 3 hiệp x 8-10 lần.',
	},
	{
		_id: 'seed_7',
		ten: 'Burpee',
		nhomCo: ENhomCo.FULL_BODY,
		mucDoKho: EMucDoKho.KHO,
		moTa: 'Bài tập HIIT toàn thân cường độ cao.',
		caloTrungBinh: 700,
		huongDan: 'Đứng thẳng, hạ người xuống tư thế squat. Đặt tay xuống sàn, bật chân ra sau thành tư thế plank. Thực hiện 1 cái push-up. Bật chân về tư thế squat. Nhảy lên cao, hai tay vươn qua đầu. Thực hiện 3 hiệp x 10 lần.',
	},
	{
		_id: 'seed_8',
		ten: 'Yoga Sun Salutation',
		nhomCo: ENhomCo.FULL_BODY,
		mucDoKho: EMucDoKho.DE,
		moTa: 'Chuỗi động tác yoga cơ bản giúp linh hoạt toàn thân.',
		caloTrungBinh: 200,
		huongDan: 'Bắt đầu tư thế Mountain Pose. Hít vào nâng tay lên trời. Thở ra gập người về phía trước. Hít vào nâng nửa người lên. Thở ra bước chân ra sau thành Plank. Hạ người xuống, ngẩng đầu lên (Cobra). Đẩy hông lên (Downward Dog). Bước chân về phía trước, đứng lên. Lặp lại 5-10 vòng.',
	},
	{
		_id: 'seed_9',
		ten: 'Shoulder Press',
		nhomCo: ENhomCo.SHOULDERS,
		mucDoKho: EMucDoKho.TRUNG_BINH,
		moTa: 'Bài tập ép vai với tạ đơn hoặc tạ đòn.',
		caloTrungBinh: 350,
		huongDan: 'Ngồi hoặc đứng thẳng, cầm tạ ngang vai. Đẩy tạ lên trên đầu cho đến khi tay duỗi thẳng. Hạ tạ từ từ về vị trí ban đầu. Giữ cơ lõi siết chặt trong suốt động tác. Thực hiện 3 hiệp x 10-12 lần.',
	},
	{
		_id: 'seed_10',
		ten: 'Bicep Curl',
		nhomCo: ENhomCo.ARMS,
		mucDoKho: EMucDoKho.DE,
		moTa: 'Bài tập cơ tay trước với tạ đơn.',
		caloTrungBinh: 250,
		huongDan: 'Đứng thẳng, hai tay cầm tạ buông xuôi. Giữ khuỷu tay sát thân, cuộn tạ lên ngang vai. Siết cơ bắp tay ở đỉnh động tác. Hạ tạ từ từ xuống vị trí ban đầu. Thực hiện 3 hiệp x 12-15 lần mỗi tay.',
	},
];
