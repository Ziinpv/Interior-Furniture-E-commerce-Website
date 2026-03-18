import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Save, RotateCcw, Grid3x3, Eye, Maximize2, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

interface FurnitureItem {
  id: string;
  name: string;
  icon: string;
  width: number;
  height: number;
  color: string;
}

interface PlacedItem extends FurnitureItem {
  x: number;
  y: number;
  rotation: number;
}

const furnitureLibrary: FurnitureItem[] = [
  { id: 'sofa', name: 'Sofa', icon: '🛋️', width: 200, height: 90, color: '#8B7355' },
  { id: 'chair', name: 'Ghế', icon: '🪑', width: 70, height: 70, color: '#A0826D' },
  { id: 'table', name: 'Bàn', icon: '🪑', width: 160, height: 90, color: '#654321' },
  { id: 'bed', name: 'Giường', icon: '🛏️', width: 180, height: 200, color: '#8B6F47' },
  { id: 'desk', name: 'Bàn làm việc', icon: '🖥️', width: 120, height: 60, color: '#704214' },
  { id: 'bookshelf', name: 'Kệ sách', icon: '📚', width: 120, height: 40, color: '#5C4033' },
  { id: 'plant', name: 'Cây cảnh', icon: '🪴', width: 50, height: 50, color: '#228B22' },
  { id: 'lamp', name: 'Đèn', icon: '💡', width: 40, height: 40, color: '#FFD700' },
];

function DraggableFurniture({ item }: { item: FurnitureItem }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'furniture',
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 bg-white border-2 border-neutral-200 rounded-lg cursor-move hover:border-neutral-900 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="text-3xl text-center mb-2">{item.icon}</div>
      <p className="text-xs text-center text-neutral-700">{item.name}</p>
      <p className="text-xs text-center text-neutral-500">
        {item.width}×{item.height}cm
      </p>
    </div>
  );
}

function PlacedFurniture({
  item,
  onRemove,
  onRotate,
}: {
  item: PlacedItem;
  onRemove: () => void;
  onRotate: () => void;
}) {
  return (
    <div
      className="absolute cursor-move border-2 border-neutral-900 rounded flex items-center justify-center text-2xl group hover:border-blue-500 transition-colors"
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.rotation % 180 === 0 ? item.width : item.height}px`,
        height: `${item.rotation % 180 === 0 ? item.height : item.width}px`,
        backgroundColor: item.color + '40',
        transform: `rotate(${item.rotation}deg)`,
      }}
    >
      <span>{item.icon}</span>
      <div className="absolute -top-8 left-0 right-0 flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onRotate}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Xoay
        </button>
        <button
          onClick={onRemove}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

function Canvas({
  width,
  height,
  placedItems,
  onDrop,
  onRemoveItem,
  onRotateItem,
  showGrid,
}: {
  width: number;
  height: number;
  placedItems: PlacedItem[];
  onDrop: (item: FurnitureItem, x: number, y: number) => void;
  onRemoveItem: (index: number) => void;
  onRotateItem: (index: number) => void;
  showGrid: boolean;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: 'furniture',
    drop: (item: FurnitureItem, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left - item.width / 2;
        const y = offset.y - canvasRect.top - item.height / 2;
        onDrop(item, Math.max(0, Math.min(x, width - item.width)), Math.max(0, Math.min(y, height - item.height)));
      }
    },
  }));

  return (
    <div
      ref={(node) => {
        canvasRef.current = node;
        drop(node);
      }}
      className="relative bg-neutral-50 border-2 border-neutral-300 overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: showGrid
          ? 'linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)'
          : 'none',
        backgroundSize: showGrid ? '50px 50px' : 'auto',
      }}
    >
      {placedItems.map((item, index) => (
        <PlacedFurniture 
          key={index} 
          item={item} 
          onRemove={() => onRemoveItem(index)} 
          onRotate={() => onRotateItem(index)} 
        />
      ))}
    </div>
  );
}

export function RoomPlanner() {
  const [roomWidth, setRoomWidth] = useState(600);
  const [roomHeight, setRoomHeight] = useState(400);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleDrop = (item: FurnitureItem, x: number, y: number) => {
    setPlacedItems([
      ...placedItems,
      {
        ...item,
        x,
        y,
        rotation: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setPlacedItems(placedItems.filter((_, i) => i !== index));
  };

  const handleRotateItem = (index: number) => {
    setPlacedItems(
      placedItems.map((item, i) =>
        i === index ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const handleReset = () => {
    setPlacedItems([]);
  };

  const handleSave = () => {
    alert('Thiết kế đã được lưu!');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl mb-4">Room Planner</h1>
            <p className="text-neutral-600">
              Thiết kế và mô phỏng không gian phòng của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Furniture Library */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h2 className="text-xl mb-6">Thư viện đồ nội thất</h2>
                
                {/* Room Dimensions */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                  <h3 className="text-sm mb-3">Kích thước phòng (cm)</h3>
                  <div className="space-y-3">
                    <Input
                      type="number"
                      label="Chiều rộng"
                      value={roomWidth}
                      onChange={(e) => setRoomWidth(Math.max(300, Math.min(1000, parseInt(e.target.value) || 600)))}
                      min={300}
                      max={1000}
                    />
                    <Input
                      type="number"
                      label="Chiều dài"
                      value={roomHeight}
                      onChange={(e) => setRoomHeight(Math.max(300, Math.min(1000, parseInt(e.target.value) || 400)))}
                      min={300}
                      max={1000}
                    />
                  </div>
                </div>

                {/* Furniture Items */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {furnitureLibrary.map((item) => (
                    <DraggableFurniture key={item.id} item={item} />
                  ))}
                </div>

                {/* Controls */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <Grid3x3 className="h-4 w-4" />
                    {showGrid ? 'Ẩn lưới' : 'Hiện lưới'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setViewMode(viewMode === '2D' ? '3D' : '2D')}
                  >
                    <Eye className="h-4 w-4" />
                    Chế độ {viewMode === '2D' ? '3D' : '2D'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowInfoModal(true)}
                  >
                    <Info className="h-4 w-4" />
                    Hướng dẫn
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main Canvas */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl">Bố cục phòng ({viewMode})</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                      Đặt lại
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4" />
                      Lưu thiết kế
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center items-center overflow-auto p-8 bg-neutral-100 rounded-lg">
                  {viewMode === '2D' ? (
                    <Canvas
                      width={roomWidth}
                      height={roomHeight}
                      placedItems={placedItems}
                      onDrop={handleDrop}
                      onRemoveItem={handleRemoveItem}
                      onRotateItem={handleRotateItem}
                      showGrid={showGrid}
                    />
                  ) : (
                    <div
                      className="bg-neutral-200 rounded-lg flex items-center justify-center"
                      style={{ width: `${roomWidth}px`, height: `${roomHeight}px` }}
                    >
                      <div className="text-center p-8">
                        <Maximize2 className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
                        <p className="text-neutral-600">Chế độ 3D đang phát triển</p>
                        <p className="text-sm text-neutral-500 mt-2">
                          Tính năng này sẽ cho phép bạn xem phòng trong không gian 3D
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-lg text-center">
                    <p className="text-sm text-neutral-600">Diện tích phòng</p>
                    <p className="text-2xl mt-1">
                      {((roomWidth * roomHeight) / 10000).toFixed(1)} m²
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg text-center">
                    <p className="text-sm text-neutral-600">Đồ nội thất</p>
                    <p className="text-2xl mt-1">{placedItems.length}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg text-center">
                    <p className="text-sm text-neutral-600">Tỷ lệ lấp đầy</p>
                    <p className="text-2xl mt-1">
                      {placedItems.length > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (placedItems.reduce((acc, item) => acc + item.width * item.height, 0) /
                                (roomWidth * roomHeight)) *
                                100
                            )
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm mb-2 text-blue-900">💡 Mẹo sử dụng:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Kéo và thả các đồ nội thất từ thư viện vào canvas</li>
                    <li>• Hover vào đồ vật để xoay hoặc xóa</li>
                    <li>• Thay đổi kích thước phòng ở thanh bên trái</li>
                    <li>• Sử dụng lưới để căn chỉnh vị trí chính xác</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Modal */}
        <Modal
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          title="Hướng dẫn sử dụng Room Planner"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg mb-2">Bắt đầu</h3>
              <p className="text-neutral-700">
                Nhập kích thước phòng của bạn (chiều dài và chiều rộng tính bằng cm) ở thanh bên trái.
              </p>
            </div>
            <div>
              <h3 className="text-lg mb-2">Thêm đồ nội thất</h3>
              <p className="text-neutral-700">
                Kéo và thả các đồ vật từ thư viện nội thất vào canvas. Bạn có thể đặt bao nhiêu đồ vật tùy thích.
              </p>
            </div>
            <div>
              <h3 className="text-lg mb-2">Chỉnh sửa</h3>
              <p className="text-neutral-700">
                Hover chuột vào đồ vật đã đặt để hiển thị các nút xoay và xóa. Click "Xoay" để xoay đồ vật 90 độ.
              </p>
            </div>
            <div>
              <h3 className="text-lg mb-2">Lưu thiết kế</h3>
              <p className="text-neutral-700">
                Sau khi hoàn thành, click nút "Lưu thiết kế" để lưu bố cục của bạn.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </DndProvider>
  );
}