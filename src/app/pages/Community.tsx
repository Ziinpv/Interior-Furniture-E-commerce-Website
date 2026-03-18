import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import Masonry from 'react-responsive-masonry';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

interface CommunityPost {
  id: string;
  user: string;
  avatar: string;
  image: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  tags: string[];
}

const communityPosts: CommunityPost[] = [
  {
    id: '1',
    user: 'Nguyễn Thị Mai',
    avatar: 'https://i.pravatar.cc/150?img=1',
    image: 'https://images.unsplash.com/photo-1600488999593-83309d5d766e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwaW50ZXJpb3IlMjBkZXNpZ24lMjBsaXZpbmclMjByb29tJTIwaW5zcGlyYXRpb258ZW58MXx8fHwxNzczNDAzNjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Phòng khách phong cách Minimalist',
    description: 'Không gian sống tối giản với tông màu trung tính, tạo cảm giác rộng rãi và thư thái',
    likes: 245,
    comments: 32,
    tags: ['Minimalist', 'Phòng khách', 'Scandinavian'],
  },
  {
    id: '2',
    user: 'Trần Văn Nam',
    avatar: 'https://i.pravatar.cc/150?img=12',
    image: 'https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MzM3ODc0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Phòng ngủ ấm cúng',
    description: 'Phòng ngủ với ánh sáng tự nhiên và tông màu be, tạo không gian thư giãn hoàn hảo',
    likes: 189,
    comments: 24,
    tags: ['Phòng ngủ', 'Modern', 'Cozy'],
  },
  {
    id: '3',
    user: 'Lê Thị Hương',
    avatar: 'https://i.pravatar.cc/150?img=5',
    image: 'https://images.unsplash.com/photo-1704428381527-71b82d7fc7d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjB3aGl0ZXxlbnwxfHx8fDE3NzMzODMyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Bếp hiện đại màu trắng',
    description: 'Thiết kế bếp tối giản với tủ bếp màu trắng và đảo bếp tiện dụng',
    likes: 312,
    comments: 45,
    tags: ['Nhà bếp', 'Modern', 'White'],
  },
  {
    id: '4',
    user: 'Phạm Minh Tuấn',
    avatar: 'https://i.pravatar.cc/150?img=8',
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGluaW5nJTIwcm9vbSUyMGRlY29yfGVufDF8fHx8MTc3MzQwMzY0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Góc ăn tối giản',
    description: 'Phòng ăn với bàn gỗ tự nhiên và ghế hiện đại, không gian sạch sẽ',
    likes: 156,
    comments: 18,
    tags: ['Phòng ăn', 'Minimalist', 'Wood'],
  },
  {
    id: '5',
    user: 'Hoàng Thu Hà',
    avatar: 'https://i.pravatar.cc/150?img=9',
    image: 'https://images.unsplash.com/photo-1669723008519-3b5043b5b826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlJTIwd29ya3NwYWNlJTIwc2V0dXB8ZW58MXx8fHwxNzczNDAzNjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Góc làm việc tại nhà',
    description: 'Setup văn phòng tại nhà với bàn làm việc gỗ và ánh sáng tự nhiên',
    likes: 198,
    comments: 27,
    tags: ['Văn phòng', 'Work from home', 'Desk'],
  },
  {
    id: '6',
    user: 'Đỗ Văn Hải',
    avatar: 'https://i.pravatar.cc/150?img=13',
    image: 'https://images.unsplash.com/photo-1665537826427-33b494cfc3b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2hlbWlhbiUyMGxpdmluZyUyMHJvb20lMjBwbGFudHN8ZW58MXx8fHwxNzczNDAzNjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Phòng khách Bohemian',
    description: 'Không gian sống với nhiều cây xanh và phụ kiện trang trí bohemian',
    likes: 267,
    comments: 38,
    tags: ['Bohemian', 'Plants', 'Colorful'],
  },
];

export function Community() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl mb-4">Cộng Đồng</h1>
            <p className="text-neutral-600">
              Khám phá và chia sẻ ý tưởng thiết kế nội thất từ cộng đồng
            </p>
          </div>
          <Button onClick={() => setShowUploadModal(true)}>
            <Plus className="h-5 w-5" />
            Đăng ảnh
          </Button>
        </div>

        {/* Filter Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['Tất cả', 'Minimalist', 'Modern', 'Scandinavian', 'Bohemian', 'Phòng khách', 'Phòng ngủ', 'Nhà bếp'].map(
            (tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full transition-colors ${
                  tag === 'Tất cả'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Masonry Grid */}
        <Masonry columnsCount={3} gutter="24px">
          {communityPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.avatar}
                    alt={post.user}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm">{post.user}</p>
                    <p className="text-xs text-neutral-500">2 ngày trước</p>
                  </div>
                </div>

                <h3 className="text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-2 text-neutral-700 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    <span className="text-sm">
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </span>
                  </button>
                  <button className="flex items-center gap-2 text-neutral-700 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-neutral-700 hover:text-green-500 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Đăng ảnh không gian của bạn"
        size="lg"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center hover:border-neutral-900 transition-colors cursor-pointer">
            <Plus className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-600 mb-2">Click để tải ảnh lên</p>
            <p className="text-sm text-neutral-500">
              PNG, JPG hoặc WEBP (tối đa 10MB)
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">Tiêu đề</label>
            <input
              type="text"
              placeholder="Tên không gian của bạn..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Mô tả</label>
            <textarea
              rows={4}
              placeholder="Mô tả về không gian..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Tags</label>
            <input
              type="text"
              placeholder="VD: Minimalist, Phòng khách..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowUploadModal(false)} className="flex-1">
              Hủy
            </Button>
            <Button className="flex-1">Đăng tải</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
