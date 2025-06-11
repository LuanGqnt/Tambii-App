
import { useState } from "react";
import { MapPin, Heart, MessageCircle, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SpotData } from "@/types/spot";

interface SwipeCardProps {
  spot: SpotData;
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeCard = ({ spot, onSwipe }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offset = e.clientX - centerX;
    setDragOffset(offset);
    
    if (Math.abs(offset) > 50) {
      setSwipeDirection(offset > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(dragOffset) > 100) {
      const direction = dragOffset > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
    
    setDragOffset(0);
    setSwipeDirection(null);
  };

  const getMoodColor = (tag: string) => {
    const colors: Record<string, string> = {
      'tahimik': 'bg-blue-100 text-blue-700',
      'food-trip': 'bg-orange-100 text-orange-700',
      'aesthetic': 'bg-pink-100 text-pink-700',
      'vibrant': 'bg-yellow-100 text-yellow-700',
      'adventure': 'bg-green-100 text-green-700',
      'cultural': 'bg-purple-100 text-purple-700',
      'nature': 'bg-emerald-100 text-emerald-700',
      'beach': 'bg-cyan-100 text-cyan-700',
      'surf': 'bg-teal-100 text-teal-700',
      'sunset': 'bg-red-100 text-red-700',
      'mountain': 'bg-slate-100 text-slate-700',
      'photo-op': 'bg-indigo-100 text-indigo-700',
      'iconic': 'bg-violet-100 text-violet-700',
      'lake': 'bg-sky-100 text-sky-700',
      'swimming': 'bg-blue-100 text-blue-700',
      'paradise': 'bg-emerald-100 text-emerald-700'
    };
    return colors[tag] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <Card 
        className={`
          swipe-card relative overflow-hidden shadow-2xl border-0 cursor-grab active:cursor-grabbing
          ${swipeDirection === 'right' ? 'shadow-green-200' : ''}
          ${swipeDirection === 'left' ? 'shadow-red-200' : ''}
        `}
        style={{
          transform: `translateX(${dragOffset * 0.5}px) rotate(${dragOffset * 0.1}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Swipe Indicators */}
        {swipeDirection && (
          <div className={`
            absolute inset-0 z-10 flex items-center justify-center
            ${swipeDirection === 'right' ? 'bg-green-500/20' : 'bg-red-500/20'}
          `}>
            <div className={`
              text-6xl font-bold transform rotate-12
              ${swipeDirection === 'right' ? 'text-green-500' : 'text-red-500'}
            `}>
              {swipeDirection === 'right' ? '💖' : '👎'}
            </div>
          </div>
        )}

        {/* Image */}
        <div className="relative h-72 overflow-hidden">
          <img 
            src={spot.image} 
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Location Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-tambii-orange" />
            <span className="text-xs font-medium text-gray-700">
              {spot.location.split(',')[1]?.trim() || spot.location}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{spot.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{spot.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {spot.tags.map((tag) => (
              <span 
                key={tag}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(tag)}`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{spot.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{spot.comments}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400">Tap and drag to swipe</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SwipeCard;
