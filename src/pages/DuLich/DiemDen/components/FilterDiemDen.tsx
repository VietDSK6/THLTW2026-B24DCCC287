import { LOAI_HINH_OPTIONS } from '@/services/DuLich/constant';
import { Col, Input, Rate, Row, Select } from 'antd';

interface FilterDiemDenProps {
	filters: { loaiHinh?: DiemDen.LoaiHinh; rating?: number; search?: string };
	setFilters: (filters: any) => void;
}

const FilterDiemDen = ({ filters, setFilters }: FilterDiemDenProps) => {
	return (
		<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
			<Col xs={24} sm={12} md={8}>
				<Input.Search
					placeholder='Tìm kiếm điểm đến...'
					allowClear
					value={filters.search}
					onChange={(e) => setFilters({ ...filters, search: e.target.value })}
					onSearch={(value) => setFilters({ ...filters, search: value })}
				/>
			</Col>
			<Col xs={12} sm={6} md={4}>
				<Select
					placeholder='Loại hình'
					allowClear
					style={{ width: '100%' }}
					value={filters.loaiHinh}
					onChange={(value) => setFilters({ ...filters, loaiHinh: value })}
					options={LOAI_HINH_OPTIONS}
				/>
			</Col>
			<Col xs={12} sm={6} md={4}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<span style={{ whiteSpace: 'nowrap' }}>Từ:</span>
					<Rate
						allowHalf
						value={filters.rating || 0}
						onChange={(value) => setFilters({ ...filters, rating: value || undefined })}
						style={{ fontSize: 16 }}
					/>
				</div>
			</Col>
		</Row>
	);
};

export default FilterDiemDen;
