import React, { useState } from 'react';
import { Calculator, Home } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { products } from '../data/products';

interface ConsultationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationForm({ isOpen, onClose }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    roomType: '',
    area: '',
    budget: '',
    style: '',
  });
  const [recommendations, setRecommendations] = useState<typeof products>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple filtering logic
    const filtered = products.filter((product) => {
      const matchesRoom = !formData.roomType || product.category === formData.roomType;
      const matchesBudget = !formData.budget || product.price <= parseInt(formData.budget);
      const matchesStyle = !formData.style || product.style === formData.style;
      
      return matchesRoom && matchesBudget && matchesStyle;
    });

    setRecommendations(filtered);
    setShowResults(true);
  };

  const handleReset = () => {
    setFormData({
      roomType: '',
      area: '',
      budget: '',
      style: '',
    });
    setShowResults(false);
    setRecommendations([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tư vấn thiết kế" size="lg">
      {!showResults ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm text-blue-900 mb-1">
                  Công cụ gợi ý thông minh
                </h3>
                <p className="text-sm text-blue-800">
                  Nhập thông tin về phòng của bạn để nhận được gợi ý nội thất phù hợp nhất
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Loại phòng</label>
            <select
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
              required
            >
              <option value="">Chọn loại phòng...</option>
              <option value="Phòng khách">Phòng khách</option>
              <option value="Phòng ngủ">Phòng ngủ</option>
              <option value="Phòng ăn">Phòng ăn</option>
              <option value="Phòng làm việc">Phòng làm việc</option>
            </select>
          </div>

          <div>
            <Input
              type="number"
              label="Diện tích phòng (m²)"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="VD: 25"
              required
            />
          </div>

          <div>
            <Input
              type="number"
              label="Ngân sách (VNĐ)"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="VD: 50000000"
              required
            />
            <p className="text-xs text-neutral-500 mt-1">
              Hệ thống sẽ gợi ý các sản phẩm phù hợp với ngân sách của bạn
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">Phong cách ưa thích</label>
            <select
              value={formData.style}
              onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="">Tất cả phong cách</option>
              <option value="Scandinavian">Scandinavian</option>
              <option value="Modern">Modern</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Indochine">Indochine</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button type="submit" className="flex-1">
              Xem gợi ý
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-sm text-green-900 mb-1">
                  Tìm thấy {recommendations.length} sản phẩm phù hợp
                </h3>
                <p className="text-sm text-green-800">
                  Dựa trên diện tích {formData.area}m² và ngân sách{' '}
                  {parseInt(formData.budget).toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
              {recommendations.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg mb-1">{product.name}</h4>
                    <p className="text-sm text-neutral-600 mb-2">{product.category}</p>
                    <p className="text-lg text-neutral-900">
                      {product.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-600">
                Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với tiêu chí khác.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Tìm kiếm lại
            </Button>
            <Button onClick={onClose} className="flex-1">
              Đóng
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
