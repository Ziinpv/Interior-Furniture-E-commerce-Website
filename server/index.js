const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'noithat-jwt-secret-2026';

app.use(cors());
app.use(express.json());

// ── Data helpers ──

const DATA_DIR = path.join(__dirname, 'data');

function read(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function write(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ── Auth middleware ──

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Yêu cầu đăng nhập' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập' });
  }
  next();
}

// ── Initialize sample data ──

function initData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(path.join(DATA_DIR, 'users.json'))) {
    write('users.json', [
      {
        id: '1',
        name: 'Admin NoiThat',
        email: 'admin@noithat.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        phone: '0901234567',
        address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        name: 'Nguyễn Thị Mai',
        email: 'user@noithat.com',
        password: bcrypt.hashSync('user123', 10),
        role: 'customer',
        phone: '0909876543',
        address: '456 Đường Lê Lợi, Quận 3, TP.HCM',
        createdAt: '2026-02-15T00:00:00.000Z',
      },
      {
        id: '3',
        name: 'Trần Văn Hùng',
        email: 'hung@email.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'customer',
        phone: '0912345678',
        address: '789 Đường CMT8, Quận 10, TP.HCM',
        createdAt: '2026-01-20T00:00:00.000Z',
      },
      {
        id: '4',
        name: 'Lê Thị Hương',
        email: 'huong@email.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'customer',
        phone: '0923456789',
        address: '12 Đường Hai Bà Trưng, Quận 1, TP.HCM',
        createdAt: '2026-02-01T00:00:00.000Z',
      },
      {
        id: '5',
        name: 'Phạm Đức Anh',
        email: 'anh@email.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'customer',
        phone: '0934567890',
        address: '34 Đường Pasteur, Quận 3, TP.HCM',
        createdAt: '2026-02-28T00:00:00.000Z',
      },
    ]);
  }

  if (!fs.existsSync(path.join(DATA_DIR, 'products.json'))) {
    write('products.json', [
      {
        id: '1', name: 'Sofa Scandinavian Premium', category: 'Phòng khách',
        price: 25900000, originalPrice: 32000000,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        description: 'Sofa phong cách Scandinavian với thiết kế tối giản, chất liệu vải bền đẹp và đệm êm ái.',
        colors: [{ name: 'Xám nhạt', hex: '#D3D3D3' }, { name: 'Be', hex: '#F5F5DC' }, { name: 'Xanh dương nhạt', hex: '#B0C4DE' }],
        materials: ['Vải bố cao cấp', 'Khung gỗ sồi', 'Đệm foam memory'],
        sizes: [{ name: '2 chỗ', dimensions: '180x90x85cm' }, { name: '3 chỗ', dimensions: '220x90x85cm' }],
        rating: 4.8, reviews: 124, inStock: true, style: 'Scandinavian',
        tags: ['Scandinavian', 'Tối giản', 'Flat-pack', 'Phòng nhỏ'],
      },
      {
        id: '2', name: 'Ghế Armchair Luxury', category: 'Phòng khách',
        price: 12500000, originalPrice: null,
        image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=1200&q=80',
        description: 'Ghế armchair cao cấp với thiết kế sang trọng, tay vịn êm ái.',
        colors: [{ name: 'Be', hex: '#F5F5DC' }, { name: 'Xám đậm', hex: '#696969' }, { name: 'Nâu caramel', hex: '#C68E63' }],
        materials: ['Vải nhung cao cấp', 'Khung gỗ ash', 'Đệm mút đàn hồi'],
        sizes: [{ name: 'Standard', dimensions: '80x85x95cm' }],
        rating: 4.9, reviews: 87, inStock: true, style: 'Modern',
        tags: ['Modern', 'Sang trọng', 'Êm ái', 'Tối ưu góc đọc sách'],
      },
      {
        id: '3', name: 'Bàn ăn gỗ Modern', category: 'Phòng ăn',
        price: 18900000, originalPrice: null,
        image: 'https://images.unsplash.com/photo-1617098907765-95f0d2f2f2c8?auto=format&fit=crop&w=1200&q=80',
        description: 'Bàn ăn gỗ tự nhiên với thiết kế hiện đại, mặt bàn rộng rãi cho gia đình 6-8 người.',
        colors: [{ name: 'Gỗ tự nhiên', hex: '#8B7355' }, { name: 'Gỗ walnut', hex: '#5C4033' }],
        materials: ['Gỗ sồi Mỹ', 'Sơn PU cao cấp'],
        sizes: [{ name: '6 chỗ', dimensions: '160x90x75cm' }, { name: '8 chỗ', dimensions: '200x100x75cm' }],
        rating: 4.7, reviews: 95, inStock: true, style: 'Modern',
        tags: ['Modern', 'Gỗ tự nhiên', 'Gia đình 6-8 người', 'Bền chắc'],
      },
      {
        id: '4', name: 'Giường ngủ Minimalist', category: 'Phòng ngủ',
        price: 22000000, originalPrice: null,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        description: 'Giường ngủ phong cách tối giản với đầu giường bọc nệm, thiết kế tinh tế.',
        colors: [{ name: 'Trắng', hex: '#FFFFFF' }, { name: 'Xám', hex: '#808080' }, { name: 'Be', hex: '#F5F5DC' }],
        materials: ['Gỗ công nghiệp MDF', 'Vải bọc nhung', 'Sơn chống trầy'],
        sizes: [{ name: '1m6', dimensions: '160x200cm' }, { name: '1m8', dimensions: '180x200cm' }],
        rating: 4.6, reviews: 78, inStock: true, style: 'Minimalist',
        tags: ['Minimalist', 'Ngủ sâu', 'Tông trung tính', 'Dễ phối'],
      },
      {
        id: '5', name: 'Bàn làm việc Contemporary', category: 'Phòng làm việc',
        price: 8900000, originalPrice: null,
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
        description: 'Bàn làm việc hiện đại với ngăn kéo tiện dụng.',
        colors: [{ name: 'Đen', hex: '#000000' }, { name: 'Trắng', hex: '#FFFFFF' }, { name: 'Gỗ sồi', hex: '#B5A88D' }],
        materials: ['Gỗ MDF phủ melamine', 'Chân thép sơn tĩnh điện'],
        sizes: [{ name: 'Standard', dimensions: '120x60x75cm' }],
        rating: 4.5, reviews: 62, inStock: true, style: 'Contemporary',
        tags: ['Contemporary', 'Làm việc tại nhà', 'Gọn gàng', 'Tiết kiệm diện tích'],
      },
      {
        id: '6', name: 'Kệ sách Modern Industrial', category: 'Phòng làm việc',
        price: 15500000, originalPrice: null,
        image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80',
        description: 'Kệ sách kết hợp gỗ và kim loại, phong cách industrial hiện đại.',
        colors: [{ name: 'Gỗ tự nhiên + Đen', hex: '#8B7355' }, { name: 'Gỗ walnut + Xám', hex: '#5C4033' }],
        materials: ['Gỗ công nghiệp cao cấp', 'Khung thép sơn tĩnh điện'],
        sizes: [{ name: 'Medium', dimensions: '120x40x180cm' }, { name: 'Large', dimensions: '160x40x200cm' }],
        rating: 4.8, reviews: 56, inStock: true, style: 'Industrial',
        tags: ['Industrial', 'Lưu trữ lớn', 'Khung thép', 'Cá tính'],
      },
      {
        id: '7', name: 'Tủ lavabo treo tường Aqua', category: 'Phòng tắm',
        price: 11900000, originalPrice: 13900000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
        description: 'Tủ lavabo treo tường chống ẩm với thiết kế hiện đại, tối ưu không gian lưu trữ cho phòng tắm gia đình.',
        colors: [{ name: 'Trắng mờ', hex: '#F5F5F5' }, { name: 'Gỗ sáng', hex: '#C8B79C' }, { name: 'Xám đá', hex: '#9CA3AF' }],
        materials: ['Gỗ MDF chống ẩm', 'Mặt đá nhân tạo', 'Phụ kiện inox 304'],
        sizes: [{ name: '80cm', dimensions: '80x46x50cm' }, { name: '100cm', dimensions: '100x46x50cm' }],
        rating: 4.7, reviews: 43, inStock: true, style: 'Modern',
        tags: ['Modern', 'Chống ẩm', 'Phòng tắm nhỏ', 'Dễ vệ sinh'],
      },
    ]);
  }

  if (!fs.existsSync(path.join(DATA_DIR, 'orders.json'))) {
    write('orders.json', [
      { id: 'ORD-001', userId: '2', customerName: 'Nguyễn Thị Mai', customerEmail: 'user@noithat.com',
        items: [{ productId: '1', name: 'Sofa Scandinavian Premium', price: 25900000, quantity: 1 }],
        total: 25900000, status: 'delivered', paymentMethod: 'Chuyển khoản',
        shippingAddress: '456 Đường Lê Lợi, Quận 3, TP.HCM',
        createdAt: '2026-01-15T10:00:00.000Z' },
      { id: 'ORD-002', userId: '3', customerName: 'Trần Văn Hùng', customerEmail: 'hung@email.com',
        items: [{ productId: '3', name: 'Bàn ăn gỗ Modern', price: 18900000, quantity: 1 }, { productId: '2', name: 'Ghế Armchair Luxury', price: 12500000, quantity: 2 }],
        total: 43900000, status: 'delivered', paymentMethod: 'COD',
        shippingAddress: '789 Đường CMT8, Quận 10, TP.HCM',
        createdAt: '2026-01-22T14:30:00.000Z' },
      { id: 'ORD-003', userId: '4', customerName: 'Lê Thị Hương', customerEmail: 'huong@email.com',
        items: [{ productId: '4', name: 'Giường ngủ Minimalist', price: 22000000, quantity: 1 }],
        total: 22000000, status: 'delivered', paymentMethod: 'Chuyển khoản',
        shippingAddress: '12 Đường Hai Bà Trưng, Quận 1, TP.HCM',
        createdAt: '2026-02-05T09:00:00.000Z' },
      { id: 'ORD-004', userId: '2', customerName: 'Nguyễn Thị Mai', customerEmail: 'user@noithat.com',
        items: [{ productId: '5', name: 'Bàn làm việc Contemporary', price: 8900000, quantity: 1 }, { productId: '6', name: 'Kệ sách Modern Industrial', price: 15500000, quantity: 1 }],
        total: 24400000, status: 'delivered', paymentMethod: 'Thẻ tín dụng',
        shippingAddress: '456 Đường Lê Lợi, Quận 3, TP.HCM',
        createdAt: '2026-02-14T11:00:00.000Z' },
      { id: 'ORD-005', userId: '5', customerName: 'Phạm Đức Anh', customerEmail: 'anh@email.com',
        items: [{ productId: '1', name: 'Sofa Scandinavian Premium', price: 25900000, quantity: 1 }, { productId: '3', name: 'Bàn ăn gỗ Modern', price: 18900000, quantity: 1 }],
        total: 44800000, status: 'delivered', paymentMethod: 'Chuyển khoản',
        shippingAddress: '34 Đường Pasteur, Quận 3, TP.HCM',
        createdAt: '2026-02-20T15:00:00.000Z' },
      { id: 'ORD-006', userId: '3', customerName: 'Trần Văn Hùng', customerEmail: 'hung@email.com',
        items: [{ productId: '6', name: 'Kệ sách Modern Industrial', price: 15500000, quantity: 1 }],
        total: 15500000, status: 'shipping', paymentMethod: 'COD',
        shippingAddress: '789 Đường CMT8, Quận 10, TP.HCM', trackingNumber: 'VN987654321',
        createdAt: '2026-03-01T08:30:00.000Z', estimatedDelivery: '2026-03-10' },
      { id: 'ORD-007', userId: '4', customerName: 'Lê Thị Hương', customerEmail: 'huong@email.com',
        items: [{ productId: '2', name: 'Ghế Armchair Luxury', price: 12500000, quantity: 2 }],
        total: 25000000, status: 'shipping', paymentMethod: 'Thẻ tín dụng',
        shippingAddress: '12 Đường Hai Bà Trưng, Quận 1, TP.HCM', trackingNumber: 'VN123456789',
        createdAt: '2026-03-05T10:00:00.000Z', estimatedDelivery: '2026-03-12' },
      { id: 'ORD-008', userId: '2', customerName: 'Nguyễn Thị Mai', customerEmail: 'user@noithat.com',
        items: [{ productId: '4', name: 'Giường ngủ Minimalist', price: 22000000, quantity: 1 }],
        total: 22000000, status: 'processing', paymentMethod: 'Chuyển khoản',
        shippingAddress: '456 Đường Lê Lợi, Quận 3, TP.HCM',
        createdAt: '2026-03-10T16:00:00.000Z' },
      { id: 'ORD-009', userId: '5', customerName: 'Phạm Đức Anh', customerEmail: 'anh@email.com',
        items: [{ productId: '5', name: 'Bàn làm việc Contemporary', price: 8900000, quantity: 2 }],
        total: 17800000, status: 'processing', paymentMethod: 'COD',
        shippingAddress: '34 Đường Pasteur, Quận 3, TP.HCM',
        createdAt: '2026-03-12T13:00:00.000Z' },
      { id: 'ORD-010', userId: '3', customerName: 'Trần Văn Hùng', customerEmail: 'hung@email.com',
        items: [{ productId: '1', name: 'Sofa Scandinavian Premium', price: 25900000, quantity: 1 }, { productId: '2', name: 'Ghế Armchair Luxury', price: 12500000, quantity: 1 }],
        total: 38400000, status: 'processing', paymentMethod: 'Thẻ tín dụng',
        shippingAddress: '789 Đường CMT8, Quận 10, TP.HCM',
        createdAt: '2026-03-13T09:00:00.000Z' },
    ]);
  }
}

// ── AUTH ROUTES ──

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });

  const users = read('users.json');
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safe } = user;
  res.json({ token, user: safe });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

  const users = read('users.json');
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email đã được sử dụng' });
  }

  const newUser = {
    id: String(Date.now()),
    name, email,
    password: bcrypt.hashSync(password, 10),
    role: 'customer',
    phone: phone || '',
    address: address || '',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  write('users.json', users);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safe } = newUser;
  res.status(201).json({ token, user: safe });
});

app.get('/api/auth/me', auth, (req, res) => {
  const users = read('users.json');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  const { password: _, ...safe } = user;
  res.json({ user: safe });
});

// ── PRODUCT ROUTES ──

app.get('/api/products', (req, res) => {
  let products = read('products.json');
  const { search, category, style, tag, minPrice, maxPrice, sort } = req.query;

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (category && category !== 'Tất cả') products = products.filter(p => p.category === category);
  if (style) products = products.filter(p => p.style === style);
  if (tag && tag !== 'Tất cả') products = products.filter(p => (p.tags || []).includes(tag));
  if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));

  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = read('products.json');
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  res.json(product);
});

app.post('/api/products', auth, adminOnly, (req, res) => {
  const products = read('products.json');
  const newProduct = {
    id: String(Date.now()),
    ...req.body,
    rating: req.body.rating || 0,
    reviews: req.body.reviews || 0,
    inStock: req.body.inStock !== false,
  };
  products.push(newProduct);
  write('products.json', products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', auth, adminOnly, (req, res) => {
  const products = read('products.json');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  products[idx] = { ...products[idx], ...req.body, id: req.params.id };
  write('products.json', products);
  res.json(products[idx]);
});

app.delete('/api/products/:id', auth, adminOnly, (req, res) => {
  let products = read('products.json');
  const len = products.length;
  products = products.filter(p => p.id !== req.params.id);
  if (products.length === len) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  write('products.json', products);
  res.json({ message: 'Đã xóa sản phẩm' });
});

// ── ORDER ROUTES ──

app.get('/api/orders', auth, (req, res) => {
  let orders = read('orders.json');
  if (req.user.role !== 'admin') {
    orders = orders.filter(o => o.userId === req.user.id);
  }
  const { status } = req.query;
  if (status) orders = orders.filter(o => o.status === status);
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

app.get('/api/orders/:id', auth, (req, res) => {
  const orders = read('orders.json');
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }
  res.json(order);
});

app.post('/api/orders', auth, (req, res) => {
  const orders = read('orders.json');
  const users = read('users.json');
  const user = users.find(u => u.id === req.user.id);
  const newOrder = {
    id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
    userId: req.user.id,
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    ...req.body,
    status: 'processing',
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  write('orders.json', orders);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', auth, adminOnly, (req, res) => {
  const orders = read('orders.json');
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
  orders[idx] = { ...orders[idx], ...req.body, id: req.params.id };
  write('orders.json', orders);
  res.json(orders[idx]);
});

// ── USER ROUTES (admin) ──

app.get('/api/users', auth, adminOnly, (req, res) => {
  const users = read('users.json');
  const orders = read('orders.json');
  const safe = users.map(({ password, ...u }) => {
    const userOrders = orders.filter(o => o.userId === u.id);
    return {
      ...u,
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, o) => sum + o.total, 0),
    };
  });
  res.json(safe);
});

app.get('/api/users/:id', auth, adminOnly, (req, res) => {
  const users = read('users.json');
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
  const { password, ...safe } = user;
  const orders = read('orders.json').filter(o => o.userId === user.id);
  res.json({ ...safe, orders });
});

// ── STATS (admin dashboard) ──

app.get('/api/stats', auth, adminOnly, (req, res) => {
  const orders = read('orders.json');
  const users = read('users.json');
  const products = read('products.json');
  const customers = users.filter(u => u.role === 'customer');

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const statusCount = { processing: 0, shipping: 0, delivered: 0, cancelled: 0 };
  orders.forEach(o => { if (statusCount[o.status] !== undefined) statusCount[o.status]++; });

  const monthlyRevenue = {};
  orders.forEach(o => {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + o.total;
  });

  const revenueChart = Object.entries(monthlyRevenue)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => {
      const [y, m] = month.split('-');
      return { month: `T${parseInt(m)}/${y}`, revenue };
    });

  const productSales = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!productSales[item.productId]) productSales[item.productId] = { name: item.name, sold: 0, revenue: 0 };
      productSales[item.productId].sold += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  res.json({
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalProducts: products.length,
    statusCount,
    revenueChart,
    topProducts,
    recentOrders,
  });
});

// ── Start ──

initData();
app.listen(PORT, () => {
  console.log(`\n  NoiThat API Server`);
  console.log(`  → http://localhost:${PORT}`);
  console.log(`\n  Test accounts:`);
  console.log(`  Admin: admin@noithat.com / admin123`);
  console.log(`  User:  user@noithat.com / user123\n`);
});
