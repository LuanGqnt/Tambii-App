
export interface SpotData {
  id: string;
  name: string;
  location: string;
  coordinates: number[]; // [longitude, latitude]
  user_tier: string;
  images: string[];
  description: string;
  tags: string[];
  author: string;
  average_rating?: number;
  review_count?: number;
}
