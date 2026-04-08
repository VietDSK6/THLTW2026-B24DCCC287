import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

interface Props {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	style?: React.CSSProperties;
	disabled?: boolean;
	allowClear?: boolean;
}

const SelectCauLacBo = (props: Props) => {
	const { value, onChange, placeholder, style, disabled, allowClear } = props;
	const { danhSach, getAllModel } = useModel('caulacbo.caulacbo');

	useEffect(() => {
		getAllModel();
	}, []);

	return (
		<Select
			value={value}
			onChange={onChange}
			placeholder={placeholder || 'Chọn câu lạc bộ'}
			style={style}
			disabled={disabled}
			allowClear={allowClear}
			showSearch
			optionFilterProp='children'
		>
			{danhSach
				?.filter((clb) => clb.hoatDong)
				?.map((clb) => (
					<Select.Option key={clb._id} value={clb._id}>
						{clb.tenCLB}
					</Select.Option>
				))}
		</Select>
	);
};

export default SelectCauLacBo;
