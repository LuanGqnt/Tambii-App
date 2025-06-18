import { supabase } from '@/integrations/supabase/client';
import { SpotData } from '@/types/spot';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useImageUpload } from './useImageUpload';

export interface DatabaseSpot {
  id: string;
  user_id: string;
  name: string;
  location: string;
  images: string[];
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  author: string;
  review_count: number;
  average_rating: number;
}

export interface Review {
  id: string;
  user_id: string;
  spot_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  author: string;
  media_attachments: { url: string; type: 'image' | 'video' }[];
}

const MAX_FILE_SIZE_MB = 5;

export const useSpots = () => {
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();
  const [userReviews, setUserReviews] = useState<Record<string, Review>>({});
  const [reviewsOfSpot, setReviewsOfSpot] = useState<Record<string, Review[]>>({});
  const { uploadMultipleImages } = useImageUpload();

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from('spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching spots:', error);
        return;
      }

      const formattedSpots: SpotData[] = (data as any[]).map(spot => ({
        id: spot.id,
        name: spot.name,
        location: spot.location,
        images: spot.images || [],
        description: spot.description,
        tags: spot.tags || [],
        author: spot.author ?? 'Anonymous',
        average_rating: spot.average_rating || 0,
        review_count: spot.review_count || 0,
      }));

      setSpots(formattedSpots);
    } catch (error) {
      console.error('Error in fetchSpots:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user.id);

    if (!error && Array.isArray(data)) {
      const reviews: Record<string, Review> = {};
      data.forEach((r) => {
        const mediaAttachments = Array.isArray(r.media_attachments) 
          ? r.media_attachments.map((item: any) => ({
              url: typeof item === 'object' && item.url ? item.url : '',
              type: typeof item === 'object' && (item.type === 'image' || item.type === 'video') ? item.type : 'image' as const
            }))
          : [];
          
        reviews[r.spot_id] = {
          ...r,
          media_attachments: mediaAttachments
        };
      });
      setUserReviews(reviews);
    }
  };

  const fetchReviewsOfSpot = async (spotId: string) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("spot_id", spotId)
      .order("created_at", { ascending: false });
      
    if (!error && Array.isArray(data)) {
      const reviewsWithMedia = data.map(review => {
        const mediaAttachments = Array.isArray(review.media_attachments) 
          ? review.media_attachments.map((item: any) => ({
              url: typeof item === 'object' && item.url ? item.url : '',
              type: typeof item === 'object' && (item.type === 'image' || item.type === 'video') ? item.type : 'image' as const
            }))
          : [];
          
        return {
          ...review,
          media_attachments: mediaAttachments
        };
      });
      setReviewsOfSpot(prev => ({ ...prev, [spotId]: reviewsWithMedia }));
    }
  };

  // Submit a review (1-5 stars), with comment (optional) and media attachments
  const submitReview = async (
    spotId: string,
    author: string,
    rating: number,
    comment: string,
    media_attachments: File[]
  ) => {
    if (!user) return { error: "User not authenticated" };

    try {
      // Upload media files to storage
      const mediaUrls = await uploadMultipleImages(media_attachments);
      
      // Create media attachments with proper URLs
      const mediaAttachments_ = mediaUrls.map((url, index) => ({
        url: url,
        type: media_attachments[index]?.type.startsWith('video/') ? 'video' as const : 'image' as const
      }));
  
      const { data, error } = await supabase.rpc("submit_review", {
        spot_id_input: spotId,
        user_id_input: user.id,
        author_input: author,
        rating_input: rating,
        comment_input: comment,
        media_attachments_input: mediaAttachments_,
      });
  
      if (error) {
        console.error("Error submitting review:", error);
        return { error };
      }
  
      // Re-fetch reviews and spot info for up-to-date data
      await fetchUserReviews();
      await fetchReviewsOfSpot(spotId);
      await fetchSpots();
    } catch(error) {
      alert(error);
    }
  };

  const hasUserReviewed = (spotId: string) => {
    return !!userReviews[spotId];
  };

  const createSpot = async (spotData: Omit<DatabaseSpot, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('spots')
        .insert([{
          ...spotData, 
          user_id: user.id
        }])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating spot:', error);
        return { error };
      }

      // Refresh spots after creating
      await fetchSpots();
      return { data };
    } catch (error) {
      console.error('Error in createSpot:', error);
      return { error };
    }
  };

  const seedMockData = async () => {
    if (!user) return;

    const mockSpots = [
      {
        name: "Siargao Cloud 9",
        location: "Siargao Island, Surigao del Norte",
        images: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
          "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        ],
        description: "Perfect surf spot with crystal clear waters and amazing waves. The ultimate chill vibe by the beach.",
        tags: ["beach", "surf", "tahimik", "aesthetic"],
        review_count: 0,
        average_rating: 0,
        author: "Luan",
      },
      {
        name: "La Union Surfing Break",
        location: "San Juan, La Union",
        images: [
          "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        ],
        description: "Epic waves and sunset views. Great for both beginners and pro surfers. Amazing food trucks nearby!",
        tags: ["surf", "sunset", "food-trip", "vibrant"],
        review_count: 0,
        average_rating: 0,
        author: "Luan",
      },
      {
        name: "Sagada Hanging Coffins",
        location: "Sagada, Mountain Province",
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        ],
        description: "Mystical mountain views and ancient traditions. Perfect for soul-searching and adventure.",
        tags: ["mountain", "adventure", "tahimik", "cultural"],
        review_count: 0,
        average_rating: 0,
        author: "Luan",
      }
    ];

    for (const spot of mockSpots) {
      await createSpot(spot);
    }
  };

  useEffect(() => {
    fetchSpots();
    if (user) {
      fetchUserReviews();
    }
    // eslint-disable-next-line
  }, [user]);

  return {
    spots,
    loading,
    fetchSpots,
    userReviews,
    createSpot,
    seedMockData,
    fetchUserReviews,
    submitReview,
    hasUserReviewed,
    fetchReviewsOfSpot,
    reviewsOfSpot,
  };
};
