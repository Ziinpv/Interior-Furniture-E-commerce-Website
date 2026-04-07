export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  colors: Array<{ name: string; hex: string; image?: string }>;
  materials: string[];
  sizes: Array<{ name: string; dimensions: string }>;
  rating: number;
  reviews: number;
  inStock: boolean;
  style: string;
  tags: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Sofa Scandinavian Premium',
    category: 'Phòng khách',
    price: 25900000,
    originalPrice: 32000000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    description: 'Sofa phong cách Scandinavian với thiết kế tối giản, chất liệu vải bền đẹp và đệm êm ái. Phù hợp cho không gian hiện đại.',
    colors: [
      { name: 'Xám nhạt', hex: '#D3D3D3' },
      { name: 'Be', hex: '#F5F5DC' },
      { name: 'Xanh dương nhạt', hex: '#B0C4DE' },
    ],
    materials: ['Vải bố cao cấp', 'Khung gỗ sồi', 'Đệm foam memory'],
    sizes: [
      { name: '2 chỗ', dimensions: '180cm x 90cm x 85cm' },
      { name: '3 chỗ', dimensions: '220cm x 90cm x 85cm' },
    ],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    style: 'Scandinavian',
    tags: ['Scandinavian', 'Tối giản', 'Flat-pack', 'Phòng nhỏ'],
  },
  {
    id: '2',
    name: 'Ghế Armchair Luxury',
    category: 'Phòng khách',
    price: 12500000,
    image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=1200&q=80',
    description: 'Ghế armchair cao cấp với thiết kế sang trọng, tay vịn êm ái. Hoàn hảo cho không gian đọc sách.',
    colors: [
      { name: 'Be', hex: '#F5F5DC' },
      { name: 'Xám đậm', hex: '#696969' },
      { name: 'Nâu caramel', hex: '#C68E63' },
    ],
    materials: ['Vải nhung cao cấp', 'Khung gỗ ash', 'Đệm mút đàn hồi'],
    sizes: [{ name: 'Standard', dimensions: '80cm x 85cm x 95cm' }],
    rating: 4.9,
    reviews: 87,
    inStock: true,
    style: 'Modern',
    tags: ['Modern', 'Sang trọng', 'Êm ái', 'Tối ưu góc đọc sách'],
  },
  {
    id: '3',
    name: 'Bàn ăn gỗ Modern',
    category: 'Phòng ăn',
    price: 18900000,
    image: 'https://images.unsplash.com/photo-1617098907765-95f0d2f2f2c8?auto=format&fit=crop&w=1200&q=80',
    description: 'Bàn ăn gỗ tự nhiên với thiết kế hiện đại, mặt bàn rộng rãi cho gia đình 6-8 người.',
    colors: [
      { name: 'Gỗ tự nhiên', hex: '#8B7355' },
      { name: 'Gỗ walnut', hex: '#5C4033' },
    ],
    materials: ['Gỗ sồi Mỹ', 'Sơn PU cao cấp'],
    sizes: [
      { name: '6 chỗ', dimensions: '160cm x 90cm x 75cm' },
      { name: '8 chỗ', dimensions: '200cm x 100cm x 75cm' },
    ],
    rating: 4.7,
    reviews: 95,
    inStock: true,
    style: 'Modern',
    tags: ['Modern', 'Gỗ tự nhiên', 'Gia đình 6-8 người', 'Bền chắc'],
  },
  {
    id: '4',
    name: 'Giường ngủ Minimalist',
    category: 'Phòng ngủ',
    price: 22000000,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    description: 'Giường ngủ phong cách tối giản với đầu giường bọc nệm, thiết kế tinh tế và sang trọng.',
    colors: [
      { name: 'Trắng', hex: '#FFFFFF' },
      { name: 'Xám', hex: '#808080' },
      { name: 'Be', hex: '#F5F5DC' },
    ],
    materials: ['Gỗ công nghiệp MDF', 'Vải bọc nhung', 'Sơn chống trầy'],
    sizes: [
      { name: '1m6', dimensions: '160cm x 200cm' },
      { name: '1m8', dimensions: '180cm x 200cm' },
    ],
    rating: 4.6,
    reviews: 78,
    inStock: true,
    style: 'Minimalist',
    tags: ['Minimalist', 'Ngủ sâu', 'Tông trung tính', 'Dễ phối'],
  },
  {
    id: '5',
    name: 'Bàn làm việc Contemporary',
    category: 'Phòng làm việc',
    price: 8900000,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
    description: 'Bàn làm việc hiện đại với ngăn kéo tiện dụng, thiết kế gọn gàng phù hợp cho văn phòng tại nhà.',
    colors: [
      { name: 'Đen', hex: '#000000' },
      { name: 'Trắng', hex: '#FFFFFF' },
      { name: 'Gỗ sồi', hex: '#B5A88D' },
    ],
    materials: ['Gỗ MDF phủ melamine', 'Chân thép sơn tĩnh điện'],
    sizes: [{ name: 'Standard', dimensions: '120cm x 60cm x 75cm' }],
    rating: 4.5,
    reviews: 62,
    inStock: true,
    style: 'Contemporary',
    tags: ['Contemporary', 'Làm việc tại nhà', 'Gọn gàng', 'Tiết kiệm diện tích'],
  },
  {
    id: '6',
    name: 'Kệ sách Modern Industrial',
    category: 'Phòng làm việc',
    price: 15500000,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80',
    description: 'Kệ sách kết hợp gỗ và kim loại, phong cách industrial hiện đại với nhiều ngăn lưu trữ.',
    colors: [
      { name: 'Gỗ tự nhiên + Đen', hex: '#8B7355' },
      { name: 'Gỗ walnut + Xám', hex: '#5C4033' },
    ],
    materials: ['Gỗ công nghiệp cao cấp', 'Khung thép sơn tĩnh điện'],
    sizes: [
      { name: 'Medium', dimensions: '120cm x 40cm x 180cm' },
      { name: 'Large', dimensions: '160cm x 40cm x 200cm' },
    ],
    rating: 4.8,
    reviews: 56,
    inStock: true,
    style: 'Industrial',
    tags: ['Industrial', 'Lưu trữ lớn', 'Khung thép', 'Cá tính'],
  },
  {
    id: '7',
    name: 'Tủ lavabo treo tường Aqua',
    category: 'Phòng tắm',
    price: 11900000,
    originalPrice: 13900000,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    description:
      'Tủ lavabo treo tường chống ẩm với thiết kế hiện đại, tối ưu không gian lưu trữ cho phòng tắm gia đình.',
    colors: [
      { name: 'Trắng mờ', hex: '#F5F5F5' },
      { name: 'Gỗ sáng', hex: '#C8B79C' },
      { name: 'Xám đá', hex: '#9CA3AF' },
    ],
    materials: ['Gỗ MDF chống ẩm', 'Mặt đá nhân tạo', 'Phụ kiện inox 304'],
    sizes: [
      { name: '80cm', dimensions: '80cm x 46cm x 50cm' },
      { name: '100cm', dimensions: '100cm x 46cm x 50cm' },
    ],
    rating: 4.7,
    reviews: 43,
    inStock: true,
    style: 'Modern',
    tags: ['Modern', 'Chống ẩm', 'Phòng tắm nhỏ', 'Dễ vệ sinh'],
  },
];

export const categories = [
  'Tất cả',
  'Phòng khách',
  'Phòng ngủ',
  'Phòng ăn',
  'Phòng làm việc',
  'Phòng tắm',
];

export const styles = [
  {
    name: 'Scandinavian',
    description: 'Tối giản, sáng, tự nhiên',
    image: 'https://images.unsplash.com/photo-1616594039964-3d0d6f8dcf58?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Modern',
    description: 'Hiện đại, tinh tế, sang trọng',
    image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Minimalist',
    description: 'Tối giản, gọn gàng, tinh khiết',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Indochine',
    description: 'Đông Dương, cổ điển, ấm cúng',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Industrial',
    description: 'Công nghiệp, kim loại, cá tính',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=80',
  },
];
