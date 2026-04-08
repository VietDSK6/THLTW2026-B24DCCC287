import type { FC } from 'react';
import { Card, Form, Select, Button, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { MUC_DO_KHO_OPTIONS } from '@/services/QuanLyDeThi/constants';

interface FilterPanelProps {
	onFilter: (filter: QuanLyDeThi.FilterCauHoi) => void;
	onReset: () => void;
}

const FilterPanel: FC<FilterPanelProps> = ({ onFilter, onReset }) => {
	const [form] = Form.useForm();
	const { danhSachMonHoc, danhSachKhoiKT } = useModel('quanlydethi');

	const handleFilter = () => {
		const values = form.getFieldsValue();
		onFilter(values);
	};

	const handleReset = () => {
		form.resetFields();
		onReset();
	};

	return (
		<Card size='small' style={{ marginBottom: 16 }}>
			<Form form={form} layout='vertical'>
				<Row gutter={16}>
					<Col xs={24} sm={8}>
						<Form.Item label='Môn học' name='maMon'>
							<Select placeholder='Chọn môn học' allowClear>
								{danhSachMonHoc.map((mh) => (
									<Select.Option key={mh.maMon} value={mh.maMon}>
										{mh.tenMon}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={8}>
						<Form.Item label='Mức độ khó' name='mucDoKho'>
							<Select placeholder='Chọn mức độ' allowClear>
								{MUC_DO_KHO_OPTIONS.map((opt) => (
									<Select.Option key={opt.value} value={opt.value}>
										{opt.label}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={8}>
						<Form.Item label='Khối kiến thức' name='khoiKienThuc'>
							<Select placeholder='Chọn khối' allowClear>
								{danhSachKhoiKT.map((kk) => (
									<Select.Option key={kk.ma} value={kk.ma}>
										{kk.ten}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button type='primary' icon={<SearchOutlined />} onClick={handleFilter} style={{ marginRight: 8 }}>
							Lọc
						</Button>
						<Button icon={<ReloadOutlined />} onClick={handleReset}>
							Đặt lại
						</Button>
					</Col>
				</Row>
			</Form>
		</Card>
	);
};

export default FilterPanel;
