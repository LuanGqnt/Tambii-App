
export interface SpotData {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  author?: string;
}
