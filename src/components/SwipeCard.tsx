
import { useState } from "react";
import { Heart, MessageCircle, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpotData } from "@/types/spot";

interface SwipeCardProps {
  spot: SpotData;
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeCard = ({ spot, onSwipe }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const currentX = e.clientX;
      const offset = currentX - startX;
      setDragOffset(offset);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      if (Math.abs(dragOffset) > 100) {
        onSwipe(dragOffset > 0 ? 'right' : 'left');
      }
      
      setDragOffset(0);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const offset = currentX - startX;
      setDragOffset(offset);
    };

    const handleTouchEnd = () => {
      if (Math.abs(dragOffset) > 100) {
        onSwipe(dragOffset > 0 ? 'right' : 'left');
      }
      
      setDragOffset(0);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <Card 
      className={`w-full max-w-sm mx-auto swipe-card cursor-grab active:cursor-grabbing relative overflow-hidden modern-card border-0 shadow-xl rounded-3xl ${
        dragOffset > 50 ? 'bg-green-50' : dragOffset < -50 ? 'bg-red-50' : ''
      }`}
      style={{
        transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Like/Dislike Indicators */}
      {dragOffset > 50 && (
        <div className="absolute top-8 left-8 z-20 bg-green-500 text-white px-4 py-2 rounded-2xl font-bold text-lg transform rotate-12">
          LIKE
        </div>
      )}
      
      {dragOffset < -50 && (
        <div className="absolute top-8 right-8 z-20 bg-red-500 text-white px-4 py-2 rounded-2xl font-bold text-lg transform -rotate-12">
          PASS
        </div>
      )}

      {/* Image */}
      <div className="relative h-80 overflow-hidden rounded-t-3xl">
        <img 
          src={spot.image} 
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Stats in top right */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span className="text-xs font-medium text-gray-800">{spot.likes}</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <MessageCircle className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-medium text-gray-800">{spot.comments}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and Location */}
        <div>
          <h3 className="text-2xl font-bold text-tambii-dark mb-2 tracking-tight">
            {spot.name}
          </h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{spot.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-base leading-relaxed">
          {spot.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {spot.tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full px-3 py-1 text-xs font-medium"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SwipeCard;
