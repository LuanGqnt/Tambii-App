
import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  max?: number;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, max = 5, className }) => (
  <div className={`flex items-center ${className || ""}`}>
    {[...Array(max)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating)
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-300"
        }`}
        fill={i < Math.round(rating) ? "currentColor" : "none"}
      />
    ))}
    <span className="ml-2 text-xs text-gray-600">{Number(rating).toFixed(1)}</span>
  </div>
);

export default RatingStars;
