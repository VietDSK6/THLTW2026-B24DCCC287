import * as QuyetDinhService from '@/services/QuanLyVanBang/QuyetDinh';
import { Select } from 'antd';
import { useEffect, useState } from 'react';

interface SelectQuyetDinhProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

const SelectQuyetDinh: React.FC<SelectQuyetDinhProps> = ({ value, onChange, placeholder, disabled }) => {
	const [options, setOptions] = useState<any[]>([]);

	useEffect(() => {
		const data = QuyetDinhService.getAll();
		const opts = data
			.sort((a, b) => new Date(b.ngayBanHanh).getTime() - new Date(a.ngayBanHanh).getTime())
			.map((item) => ({
				value: item._id,
				label: `${item.soQuyetDinh} - ${item.trichYeu}`,
				item,
			}));
		setOptions(opts);
	}, []);

	return (
		<Select
			value={value}
			onChange={onChange}
			placeholder={placeholder || 'Chọn quyết định tốt nghiệp'}
			options={options}
			disabled={disabled}
			showSearch
			optionFilterProp='label'
			allowClear
		/>
	);
};

export default SelectQuyetDinh;
