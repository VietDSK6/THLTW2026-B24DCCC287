import { Card, Col, Empty, Pagination, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import CardDiemDen from './components/CardDiemDen';
import FilterDiemDen from './components/FilterDiemDen';
import './index.less';

const DiemDenPage = () => {
	const { danhSach, loading, total, page, limit, setPage, setLimit, filters, setFilters, getModel } = useModel(
		'dulich.diemden' as any,
	);

	useEffect(() => {
		getModel();
	}, [page, limit, filters]);

	const handlePageChange = (p: number, l: number) => {
		setPage(p);
		setLimit(l);
	};

	return (
		<Card title='Khám phá điểm đến' className='diem-den-page'>
			<FilterDiemDen filters={filters} setFilters={setFilters} />

			<Spin spinning={loading}>
				{danhSach.length > 0 ? (
					<Row gutter={[16, 16]}>
						{danhSach.map((item: DiemDen.IRecord) => (
							<Col xs={24} sm={12} md={8} xxl={6} key={item._id}>
								<CardDiemDen record={item} />
							</Col>
						))}
					</Row>
				) : (
					<Empty description='Không tìm thấy điểm đến nào' />
				)}
			</Spin>

			{total > limit && (
				<Pagination
					current={page}
					pageSize={limit}
					total={total}
					showSizeChanger
					pageSizeOptions={['8', '12', '20']}
					onChange={handlePageChange}
					style={{ marginTop: 16, textAlign: 'center' }}
				/>
			)}
		</Card>
	);
};

export default DiemDenPage;
