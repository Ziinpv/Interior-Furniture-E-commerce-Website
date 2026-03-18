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
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Sofa Scandinavian Premium',
    category: 'Phòng khách',
    price: 25900000,
    originalPrice: 32000000,
    image: 'https://images.unsplash.com/photo-1753791913941-efa7de4e1b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBpbnRlcmlvciUyMGRlc2lnbiUyMHNvZmF8ZW58MXx8fHwxNzczNDAzMzY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
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
  },
  {
    id: '2',
    name: 'Ghế Armchair Luxury',
    category: 'Phòng khách',
    price: 12500000,
    image: 'https://images.unsplash.com/photo-1768946131536-39b5f3ec329d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmdXJuaXR1cmUlMjBjaGFpciUyMGJlaWdlfGVufDF8fHx8MTc3MzQwMzM2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
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
  },
  {
    id: '3',
    name: 'Bàn ăn gỗ Modern',
    category: 'Phòng ăn',
    price: 18900000,
    image: 'https://images.unsplash.com/photo-1758977404096-20d813c73329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkaW5pbmclMjB0YWJsZSUyMHdvb2R8ZW58MXx8fHwxNzczNDAzMzY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
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
  },
  {
    id: '4',
    name: 'Giường ngủ Minimalist',
    category: 'Phòng ngủ',
    price: 22000000,
    image: 'https://images.unsplash.com/photo-1586310520462-658e93388399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NzMzNDMxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
  },
  {
    id: '5',
    name: 'Bàn làm việc Contemporary',
    category: 'Phòng làm việc',
    price: 8900000,
    image: 'https://images.unsplash.com/photo-1764755932155-dabbee87df7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBvZmZpY2UlMjBkZXNrJTIwc2V0dXB8ZW58MXx8fHwxNzczNDAzMzY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
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
  },
  {
    id: '6',
    name: 'Kệ sách Modern Industrial',
    category: 'Phòng làm việc',
    price: 15500000,
    image: 'https://images.unsplash.com/photo-1756037020659-6f9d3418f6b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rc2hlbGYlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzM0MDMzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
  { name: 'Scandinavian', description: 'Tối giản, sáng, tự nhiên' },
  { name: 'Modern', description: 'Hiện đại, tinh tế, sang trọng' },
  { name: 'Minimalist', description: 'Tối giản, gọn gàng, tinh khiết' },
  { name: 'Indochine', description: 'Đông Dương, cổ điển, ấm cúng' },
  { name: 'Industrial', description: 'Công nghiệp, kim loại, cá tính' },
];
