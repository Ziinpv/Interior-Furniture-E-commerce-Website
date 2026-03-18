import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, Sparkles, Ruler, Users, Calculator } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ui/ProductCard';
import { products, styles } from '../data/products';
import { Button } from '../components/ui/Button';
import { ConsultationForm } from '../components/ConsultationForm';

export function Home() {
  const featuredProducts = products.slice(0, 3);
  const trendingProducts = products.slice(3, 6);
  const [showConsultation, setShowConsultation] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-neutral-50">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1759722667394-000072b59a3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwZnVybml0dXJlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzM0MDMzNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hero"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
              Không Gian Sống
              <br />
              <span className="text-neutral-300">Tinh Tế & Hiện Đại</span>
            </h1>
            <p className="text-xl mb-8 text-neutral-200">
              Khám phá bộ sưu tập nội thất cao cấp với thiết kế minimalist,
              mang đến sự sang trọng và tiện nghi cho ngôi nhà của bạn.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg">
                  Khám phá ngay <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/room-planner">
                <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-neutral-900">
                  Thiết kế phòng <Ruler className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Phong Cách Thiết Kế</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Chọn phong cách phù hợp với cá tính và không gian của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style, index) => (
              <motion.div
                key={style.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg bg-neutral-100 aspect-[4/3] cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl mb-2">{style.name}</h3>
                  <p className="text-neutral-200 text-sm">{style.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Suggestions */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <h2 className="text-4xl">Gợi Ý Thông Minh</h2>
              </div>
              <p className="text-neutral-600">
                Dựa trên lịch sử xem và sở thích của bạn
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="h-8 w-8 text-neutral-900" />
              </div>
              <h3 className="text-xl mb-2">Room Planner</h3>
              <p className="text-neutral-600">
                Thiết kế và trực quan hóa không gian của bạn với công cụ mô phỏng 2D/3D
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-neutral-900" />
              </div>
              <h3 className="text-xl mb-2">Tùy Chỉnh Sản Phẩm</h3>
              <p className="text-neutral-600">
                Thay đổi màu sắc, chất liệu và kích thước theo ý muốn
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-neutral-900" />
              </div>
              <h3 className="text-xl mb-2">Cộng Đồng</h3>
              <p className="text-neutral-600">
                Chia sẻ và khám phá ý tưởng từ cộng đồng người dùng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl mb-2">Sản Phẩm Xu Hướng</h2>
              <p className="text-neutral-600">
                Những món đồ được yêu thích nhất tháng này
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl mb-6">
            Bắt Đầu Thiết Kế Không Gian Mơ Ước
          </h2>
          <p className="text-xl text-neutral-300 mb-8">
            Sử dụng Room Planner để tạo bố cục phòng hoàn hảo với các sản phẩm nội thất của chúng tôi
          </p>
          <Link to="/room-planner">
            <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
              Bắt đầu thiết kế <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Floating Consultation Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setShowConsultation(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-neutral-900 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-20"
        title="Nhận tư vấn"
      >
        <Calculator className="h-7 w-7" />
      </motion.button>

      <ConsultationForm
        isOpen={showConsultation}
        onClose={() => setShowConsultation(false)}
      />
    </div>
  );
}