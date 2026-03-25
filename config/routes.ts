export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	// QUAN LY VAN BANG
	{
		name: 'QuanLyVanBang',
		path: '/quan-ly-van-bang',
		icon: 'BookOutlined',
		routes: [
			{
				name: 'SoVanBang',
				path: 'so-van-bang',
				component: './QuanLyVanBang/SoVanBang',
			},
			{
				name: 'QuyetDinh',
				path: 'quyet-dinh',
				component: './QuanLyVanBang/QuyetDinh',
			},
			{
				name: 'CauHinhBieuMau',
				path: 'cau-hinh-bieu-mau',
				component: './QuanLyVanBang/CauHinhBieuMau',
			},
			{
				name: 'ThongTinVanBang',
				path: 'thong-tin-van-bang',
				component: './QuanLyVanBang/ThongTinVanBang',
			},
		],
	},
	{
		name: 'TraCuuVanBang',
		path: '/tra-cuu-van-bang',
		component: './TraCuuVanBang',
		icon: 'SearchOutlined',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
