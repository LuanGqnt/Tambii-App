
export interface SpotData {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  author: string;
  average_rating?: number; // Add for reviews-based stats
  review_count?: number;   // Add for reviews-based stats
}
