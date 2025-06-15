import { supabase } from '@/integrations/supabase/client';
import { SpotData } from '@/types/spot';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export interface DatabaseSpot {
  id: string;
  user_id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  author: string;
}

export interface Review {
  id: string;
  user_id: string;
  spot_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export const useSpots = () => {
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [userReviews, setUserReviews] = useState<Record<string, Review>>({});
  const [reviewsOfSpot, setReviewsOfSpot] = useState<Record<string, Review[]>>({});

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
        image: spot.image,
        description: spot.description,
        tags: spot.tags || [],
        // Use average_rating and review_count instead of likes/comments
        likes: spot.average_rating || 0,
        comments: spot.review_count || 0,
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
        reviews[r.spot_id] = r;
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
      setReviewsOfSpot(prev => ({ ...prev, [spotId]: data }));
    }
  };

  // Submit a review (1-5 stars), with comment (optional)
  const submitReview = async (
    spotId: string,
    rating: number,
    comment: string
  ) => {
    if (!user) return { error: "User not authenticated" };
    const { data, error } = await supabase
      .from("reviews")
      .upsert([
        {
          user_id: user.id,
          spot_id: spotId,
          rating,
          comment,
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error submitting review:", error);
      return { error };
    }

    // Re-fetch reviews and spot info for up-to-date data
    await fetchUserReviews();
    await fetchReviewsOfSpot(spotId);
    await fetchSpots();
    return { data };
  };

  const hasUserReviewed = (spotId: string) => {
    return !!userReviews[spotId];
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
    fetchUserReviews,
    submitReview,
    hasUserReviewed,
    fetchReviewsOfSpot,
    reviewsOfSpot,
  };
};
