const BLOG_POSTS_KEY = 'blog_posts';
const BLOG_TAGS_KEY = 'blog_tags';

const SAMPLE_TAGS: Blog.Tag[] = [
	{ id: '1', ten: 'Du lịch' },
	{ id: '2', ten: 'Ẩm thực' },
	{ id: '3', ten: 'Lối sống' },
	{ id: '4', ten: 'Cà phê' },
	{ id: '5', ten: 'Suy ngẫm' },
	{ id: '6', ten: 'Ký sự' },
];

const SAMPLE_POSTS: Blog.BaiViet[] = [
	{
		id: '1',
		tieuDe: 'Đà Lạt và những góc quán quen',
		slug: 'da-lat-va-nhung-goc-quan-quen',
		tomTat: 'Không phải những điểm check-in ồn ào, đây là hành trình tìm lại sự bình yên trong những góc nhỏ của thành phố sương mù.',
		noiDung: `<h1>Đà Lạt và những góc quán quen</h1>
<p>Có người đến Đà Lạt để chụp hình, có người đến để vui chơi, còn tôi đến Đà Lạt chỉ để... thở.</p>
<h2>Buổi sáng ở dốc nhà làng</h2>
<p>Sáng sớm, khi sương còn chưa tan hết trên những mái ngói cũ, tôi thích đi bộ dọc theo các con dốc. Tiếng chổi tre xào xạc của một bà cụ quét sân, mùi bánh căn nóng hổi lan tỏa trong không khí lạnh.</p>
<h3>Những quán cà phê không tên</h3>
<p>Tôi không tìm đến những quán "triệu view". Tôi thích:</p>
<ul>
<li>Một chiếc ghế gỗ cũ.</li>
<li>Ly cà phê phin đậm đặc.</li>
<li>Nhìn dòng người thưa thớt đi ngang qua.</li>
</ul>
<blockquote><p>"Đà Lạt không vội được đâu, cứ thong dong mà sống."</p></blockquote>
<h2>Một chút suy tư về sự thay đổi</h2>
<p>Đà Lạt đang thay đổi nhanh quá, nhưng nếu chịu khó len lỏi vào những con hẻm nhỏ, bạn vẫn sẽ tìm thấy cái "chất" cũ kỹ, mộc mạc của mười năm về trước.</p>`,
		anhDaiDien: 'https://images.unsplash.com/photo-1589551221003-8255018617f2?w=800&h=400&fit=crop',
		tacGia: 'Minh Tú',
		tags: ['Du lịch', 'Cà phê'],
		trangThai: 'published',
		luotXem: 452,
		ngayTao: '2026-03-15T08:00:00Z',
		ngayCapNhat: '2026-03-15T08:00:00Z',
	},
	{
		id: '2',
		tieuDe: 'Nghệ thuật của sự chậm rãi (Slow Living)',
		slug: 'nghe-thuat-cua-su-cham-rai',
		tomTat: 'Tại sao chúng ta luôn phải vội vã? Hãy cùng tìm hiểu cách để tận hưởng cuộc sống một cách trọn vẹn hơn giữa thế giới ồn ào.',
		noiDung: `<h1>Nghệ thuật của sự chậm rãi</h1>
<p>Chúng ta đang sống trong một thế giới mà "nhanh" được coi là tiêu chuẩn. Thức ăn nhanh, yêu nhanh, và cả thành công cũng phải nhanh.</p>
<h2>Slow Living là gì?</h2>
<p>Sống chậm không phải là lười biếng. Đó là sự lựa chọn <strong>ưu tiên chất lượng hơn số lượng</strong>.</p>
<ol>
<li><strong>Ăn chậm:</strong> Thưởng thức hương vị thay vì chỉ để no bụng.</li>
<li><strong>Làm ít nhưng sâu:</strong> Tập trung hoàn toàn vào một việc thay vì multitasking.</li>
<li><strong>Kết nối thật:</strong> Bỏ điện thoại xuống và nhìn vào mắt người đối diện.</li>
</ol>
<h3>Lợi ích không ngờ</h3>
<p>Khi bạn chậm lại, bạn sẽ thấy những điều mà trước đây bạn đã bỏ lỡ: tiếng chim hót buổi sáng, nụ cười của một người lạ, hay đơn giản là sự bình yên trong tâm hồn mình.</p>`,
		anhDaiDien: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
		tacGia: 'Lê An',
		tags: ['Lối sống', 'Suy ngẫm'],
		trangThai: 'published',
		luotXem: 890,
		ngayTao: '2026-03-20T10:00:00Z',
		ngayCapNhat: '2026-03-20T10:00:00Z',
	},
	{
		id: '3',
		tieuDe: 'Hành trình đi tìm hạt cà phê Specialty',
		slug: 'hanh-trinh-ca-phe-specialty',
		tomTat: 'Từ những trang trại ở Cầu Đất đến ly cà phê Pour-over trên tay bạn, đó là cả một câu chuyện về tâm huyết và sự tỉ mỉ.',
		noiDung: `<h1>Hành trình đi tìm hạt cà phê Specialty</h1>
<p>Bạn đã bao giờ tự hỏi tại sao một ly cà phê có giá 100.000đ trong khi ly khác chỉ 15.000đ?</p>
<h2>Không chỉ là thức uống</h2>
<p>Specialty Coffee là một định nghĩa về chất lượng. Nó bắt đầu từ khâu chọn giống, chăm sóc, thu hoạch những trái chín mọng nhất và sơ chế một cách nghiêm ngặt.</p>
<h3>Phương pháp Pour-over (V60)</h3>
<p>Đây là cách tốt nhất để cảm nhận hết hương vị của hạt cà phê:</p>
<ul>
<li><strong>Hương thơm:</strong> Có thể là mùi hoa nhài, mùi cam chanh hoặc chocolate.</li>
<li><strong>Vị chua:</strong> Thanh khiết như trái cây chín.</li>
<li><strong>Hậu vị:</strong> Ngọt ngào và kéo dài.</li>
</ul>
<p>Nếu bạn chưa thử, hãy ghé một quán cà phê Specialty gần nhất và yêu cầu một bình Ethiopia sơ chế khô nhé!</p>`,
		anhDaiDien: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop',
		tacGia: 'Hoàng Long',
		tags: ['Cà phê', 'Ẩm thực'],
		trangThai: 'published',
		luotXem: 320,
		ngayTao: '2026-03-25T14:00:00Z',
		ngayCapNhat: '2026-03-25T14:00:00Z',
	},
	{
		id: '4',
		tieuDe: 'Hà Nội - Những mùa hoa chưa bao giờ cũ',
		slug: 'ha-noi-nhung-mua-hoa',
		tomTat: 'Mỗi tháng, Hà Nội lại khoác lên mình một màu hoa mới. Một nét đẹp dịu dàng của thủ đô mà ai đi xa cũng nhớ.',
		noiDung: `<h1>Hà Nội - Những mùa hoa</h1>
<p>Hà Nội 12 mùa hoa, câu hát ấy không ngoa chút nào.</p>
<h2>Tháng 3: Hoa Sưa trắng muốt</h2>
<p>Khi những cơn mưa phùn vừa dứt, phố xá bỗng bừng sáng bởi sắc trắng tinh khôi của hoa sưa. Hoa rơi như tuyết, phủ nhẹ lên những chiếc xe đạp cũ.</p>
<h2>Tháng 4: Loa kèn xuống phố</h2>
<p>Những chiếc xe đạp chở đầy hoa loa kèn trắng muốt báo hiệu mùa hè sắp về. Nó thanh tao, nhẹ nhàng như chính cốt cách của người Tràng An.</p>
<table>
<thead><tr><th>Tháng</th><th>Loại hoa</th><th>Cảm giác</th></tr></thead>
<tbody>
<tr><td>1</td><td>Đào đỏ</td><td>Tết sum vầy</td></tr>
<tr><td>3</td><td>Hoa Sưa</td><td>Mong manh</td></tr>
<tr><td>11</td><td>Cúc họa mi</td><td>Chớm đông</td></tr>
</tbody>
</table>
<p>Hà Nội đôi khi chỉ cần nhìn vào giỏ hoa sau xe của một chị bán rong là biết đang là mùa nào.</p>`,
		anhDaiDien: 'https://images.unsplash.com/photo-1509011520625-2e6734c8913b?w=800&h=400&fit=crop',
		tacGia: 'Khánh Linh',
		tags: ['Du lịch', 'Ký sự'],
		trangThai: 'published',
		luotXem: 1205,
		ngayTao: '2026-04-01T09:00:00Z',
		ngayCapNhat: '2026-04-01T09:00:00Z',
	},
	{
		id: '5',
		tieuDe: 'Tại sao tôi chọn sống tối giản?',
		slug: 'tai-sao-toi-chon-song-toi-gian',
		tomTat: 'Vứt bỏ bớt đồ đạc không khiến cuộc sống nghèo đi, nó khiến tâm trí chúng ta giàu có hơn.',
		noiDung: `<h1>Tại sao tôi chọn sống tối giản?</h1>
<p>Hai năm trước, phòng tôi ngập tràn đồ đạc nhưng tôi vẫn thấy "không có gì để mặc" và "không có gì để làm".</p>
<h2>Bước ngoặt</h2>
<p>Tôi bắt đầu bằng việc thanh lý 50% tủ quần áo. Cảm giác lúc đó thật đáng sợ, nhưng sau đó lại là một sự nhẹ nhõm kỳ lạ.</p>
<h3>Những gì tôi học được:</h3>
<ol>
<li><strong>Ít đồ đạc = Ít phải lau dọn.</strong></li>
<li><strong>Ít lựa chọn = Ít mệt mỏi (Decision Fatigue).</strong></li>
<li><strong>Trân trọng những gì mình thực sự cần.</strong></li>
</ol>
<blockquote><p>Sống tối giản không phải là sở hữu ít hơn 100 món đồ, mà là loại bỏ những thứ không mang lại giá trị để tập trung vào điều quan trọng nhất.</p></blockquote>`,
		anhDaiDien: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=400&fit=crop',
		tacGia: 'Lê An',
		tags: ['Lối sống'],
		trangThai: 'published',
		luotXem: 2150,
		ngayTao: '2026-04-05T11:00:00Z',
		ngayCapNhat: '2026-04-05T11:00:00Z',
	},
	{
		id: '6',
		tieuDe: 'Dự án: Một ngày không dùng Internet',
		slug: 'mot-ngay-khong-internet',
		tomTat: 'Thử thách ngắt kết nối trong 24 giờ và những phát hiện thú vị về bản thân.',
		noiDung: `<h1>Một ngày không dùng Internet</h1>
<p>Đây là một bài viết nháp về trải nghiệm "Digital Detox" của tôi.</p>
<p><em>(Nội dung đang được cập nhật...)</em></p>
<p>Dự kiến sẽ viết về:</p>
<ul>
<li>Cảm giác bồn chồn trong 2 giờ đầu.</li>
<li>Việc đọc xong một cuốn sách 300 trang.</li>
<li>Cuộc trò chuyện thật sự với bố mẹ.</li>
</ul>`,
		anhDaiDien: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop',
		tacGia: 'Minh Tú',
		tags: ['Lối sống', 'Suy ngẫm'],
		trangThai: 'draft',
		luotXem: 0,
		ngayTao: '2026-04-10T16:00:00Z',
		ngayCapNhat: '2026-04-10T16:00:00Z',
	},
];

export function getBlogPosts(): Blog.BaiViet[] {
	const data = localStorage.getItem(BLOG_POSTS_KEY);
	if (!data) {
		localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(SAMPLE_POSTS));
		return SAMPLE_POSTS;
	}
	return JSON.parse(data);
}

export function saveBlogPosts(posts: Blog.BaiViet[]) {
	localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts));
}

export function getBlogTags(): Blog.Tag[] {
	const data = localStorage.getItem(BLOG_TAGS_KEY);
	if (!data) {
		localStorage.setItem(BLOG_TAGS_KEY, JSON.stringify(SAMPLE_TAGS));
		return SAMPLE_TAGS;
	}
	return JSON.parse(data);
}

export function saveBlogTags(tags: Blog.Tag[]) {
	localStorage.setItem(BLOG_TAGS_KEY, JSON.stringify(tags));
}
