import { DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Alert, Button, Drawer, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useModel } from 'umi';
import Form from './components/Form';
import SelectSoVanBang from '../QuyetDinh/components/SelectSoVanBang';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999', marginRight: 8 }} />);

const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

const CauHinhBieuMauPage = () => {
	const {
		data,
		loading,
		visibleForm,
		setVisibleForm,
		setRecord,
		setEdit,
		selectedSoVanBangId,
		setSelectedSoVanBangId,
		getModel,
		deleteModel,
		handleEdit,
		updateThuTu,
	} = useModel('quanlyvanbang.cauhinhbieumau' as any);

	const [dataSource, setDataSource] = useState<CauHinhBieuMau.IRecord[]>([]);

	useEffect(() => {
		getModel();
	}, [selectedSoVanBangId]);

	useEffect(() => {
		setDataSource(data);
	}, [data]);

	const onSortEnd = ({ oldIndex, newIndex }: any) => {
		if (oldIndex !== newIndex) {
			const customData = dataSource.filter((item) => !item.laMacDinh);
			const newData = [...customData];
			const [movedItem] = newData.splice(oldIndex - 5, 1);
			newData.splice(newIndex - 5, 0, movedItem);

			const macDinhData = dataSource.filter((item) => item.laMacDinh);
			const finalData = [...macDinhData, ...newData];
			setDataSource(finalData);

			const orderedIds = newData.map((item) => item._id);
			updateThuTu(orderedIds);
		}
	};

	const DraggableContainer = (props: any) => (
		<SortableBody useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props} />
	);

	const DraggableBodyRow = ({ className, style, ...restProps }: any) => {
		const index = dataSource.findIndex((x) => x._id === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	const columns: any[] = [
		{
			title: '',
			dataIndex: 'sort',
			width: 40,
			render: (_: any, record: any) => (!record.laMacDinh ? <DragHandle /> : null),
		},
		{
			title: 'STT',
			dataIndex: 'thuTu',
			width: 60,
			align: 'center',
		},
		{
			title: 'Tên trường',
			dataIndex: 'tenTruong',
			width: 200,
		},
		{
			title: 'Mã trường',
			dataIndex: 'maTruong',
			width: 150,
			render: (val: any) => <code>{val}</code>,
		},
		{
			title: 'Kiểu dữ liệu',
			dataIndex: 'kieuDuLieu',
			width: 120,
			align: 'center',
			render: (val: any) => {
				const color = val === 'String' ? 'blue' : val === 'Number' ? 'green' : 'orange';
				return <Tag color={color}>{val}</Tag>;
			},
		},
		{
			title: 'Bắt buộc',
			dataIndex: 'batBuoc',
			width: 100,
			align: 'center',
			render: (val: any) => (val ? <Tag color='red'>Bắt buộc</Tag> : <Tag>Tùy chọn</Tag>),
		},
		{
			title: 'Loại',
			dataIndex: 'laMacDinh',
			width: 100,
			align: 'center',
			render: (val: any) => (val ? <Tag color='default'>Mặc định</Tag> : <Tag color='cyan'>Tùy chỉnh</Tag>),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 200,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CauHinhBieuMau.IRecord) =>
				record.laMacDinh ? (
					<span style={{ color: '#999' }}>Không thể sửa</span>
				) : (
					<Space>
						<Tooltip title='Chỉnh sửa'>
							<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} size='small' />
						</Tooltip>
						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id)}
								title='Bạn có chắc chắn muốn xóa trường này?'
								placement='topLeft'
							>
								<Button danger type='link' icon={<DeleteOutlined />} size='small' />
							</Popconfirm>
						</Tooltip>
					</Space>
				),
		},
	];

	return (
		<div>
			<Alert
				message='Hướng dẫn'
				description='Chọn sổ văn bằng để cấu hình các trường thông tin. Bạn có thể kéo thả các trường tùy chỉnh để sắp xếp thứ tự hiển thị.'
				type='info'
				showIcon
				style={{ marginBottom: 16 }}
			/>

			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
				<Button
					onClick={() => {
						setEdit(false);
						setRecord(undefined);
						setVisibleForm(true);
					}}
					type='primary'
					icon={<EditOutlined />}
					disabled={!selectedSoVanBangId}
				>
					Thêm trường mới
				</Button>

				<div style={{ width: 350 }}>
					<SelectSoVanBang value={selectedSoVanBangId} onChange={setSelectedSoVanBangId} />
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={loading}
				rowKey='_id'
				pagination={false}
				scroll={{ x: 1200 }}
				components={{
					body: {
						wrapper: DraggableContainer,
						row: DraggableBodyRow,
					},
				}}
			/>

			<Drawer
				title={(visibleForm ? 'Thêm mới' : 'Chỉnh sửa') + ' trường thông tin'}
				visible={visibleForm}
				onClose={() => setVisibleForm(false)}
				width={600}
				destroyOnClose
			>
				<Form />
			</Drawer>
		</div>
	);
};

export default CauHinhBieuMauPage;
