import * as ThongTinVanBangService from '@/services/QuanLyVanBang/ThongTinVanBang';
import { notification } from 'antd';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState<ThongTinVanBang.IRecord[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [visibleForm, setVisibleForm] = useState(false);
	const [visibleDetail, setVisibleDetail] = useState(false);
	const [record, setRecord] = useState<ThongTinVanBang.IRecord>();
	const [edit, setEdit] = useState(false);
	const [formSubmiting, setFormSubmiting] = useState(false);
	const [filterQuyetDinhId, setFilterQuyetDinhId] = useState<string>();

	const getModel = async () => {
		setLoading(true);
		try {
			let allData = ThongTinVanBangService.getAll();

			if (filterQuyetDinhId) {
				allData = allData.filter((item) => item.quyetDinhId === filterQuyetDinhId);
			}

			const sorted = allData.sort((a, b) => b.soVaoSo - a.soVaoSo);
			const start = (page - 1) * limit;
			const end = start + limit;
			setData(sorted.slice(start, end));
			setTotal(sorted.length);
		} catch (error) {
			notification.error({ message: 'Lỗi khi tải dữ liệu' });
		} finally {
			setLoading(false);
		}
	};

	const postModel = async (values: Partial<ThongTinVanBang.IRecord>) => {
		setFormSubmiting(true);
		try {
			ThongTinVanBangService.create(values);
			notification.success({ message: 'Thêm mới văn bằng thành công' });
			setVisibleForm(false);
			getModel();
		} catch (error) {
			notification.error({ message: 'Lỗi khi thêm mới' });
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, values: Partial<ThongTinVanBang.IRecord>) => {
		setFormSubmiting(true);
		try {
			ThongTinVanBangService.update(id, values);
			notification.success({ message: 'Cập nhật văn bằng thành công' });
			setVisibleForm(false);
			getModel();
		} catch (error) {
			notification.error({ message: 'Lỗi khi cập nhật' });
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string) => {
		try {
			const success = ThongTinVanBangService.remove(id);
			if (success) {
				notification.success({ message: 'Xóa văn bằng thành công' });
				getModel();
			} else {
				notification.error({ message: 'Không tìm thấy văn bằng' });
			}
		} catch (error) {
			notification.error({ message: 'Lỗi khi xóa' });
		}
	};

	const handleEdit = (record: ThongTinVanBang.IRecord) => {
		setRecord(record);
		setEdit(true);
		setVisibleForm(true);
	};

	const handleViewDetail = (record: ThongTinVanBang.IRecord) => {
		setRecord(record);
		setVisibleDetail(true);
	};

	return {
		data,
		total,
		loading,
		page,
		setPage,
		limit,
		setLimit,
		visibleForm,
		setVisibleForm,
		visibleDetail,
		setVisibleDetail,
		record,
		setRecord,
		edit,
		setEdit,
		formSubmiting,
		filterQuyetDinhId,
		setFilterQuyetDinhId,
		getModel,
		postModel,
		putModel,
		deleteModel,
		handleEdit,
		handleViewDetail,
	};
};
