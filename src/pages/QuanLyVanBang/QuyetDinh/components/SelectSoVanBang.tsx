import * as SoVanBangService from '@/services/QuanLyVanBang/SoVanBang';
import { Select } from 'antd';
import { useEffect, useState } from 'react';

interface SelectSoVanBangProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

const SelectSoVanBang: React.FC<SelectSoVanBangProps> = ({ value, onChange, placeholder, disabled }) => {
	const [options, setOptions] = useState<any[]>([]);

	useEffect(() => {
		const data = SoVanBangService.getAll();
		const opts = data
			.filter((item) => item.trangThai === 'dang_su_dung')
			.sort((a, b) => b.namSo - a.namSo)
			.map((item) => ({
				value: item._id,
				label: `${item.tenSo} (${item.namSo})`,
			}));
		setOptions(opts);
	}, []);

	return (
		<Select
			value={value}
			onChange={onChange}
			placeholder={placeholder || 'Chọn sổ văn bằng'}
			options={options}
			disabled={disabled}
			showSearch
			optionFilterProp='label'
			allowClear
		/>
	);
};

export default SelectSoVanBang;
