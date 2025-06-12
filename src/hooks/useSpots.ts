
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SpotData } from '@/types/spot';
import { useAuth } from '@/contexts/AuthContext';

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
  profiles?: {
    username: string;
    email: string;
  } | null;
}

export const useSpots = () => {
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from('spots')
        .select(`
          *,
          profiles!inner (
            username,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching spots:', error);
        return;
      }

      const formattedSpots: SpotData[] = (data || []).map(spot => ({
        id: parseInt(spot.id.split('-')[0], 16), // Convert UUID to number for compatibility
        name: spot.name,
        location: spot.location,
        image: spot.image,
        description: spot.description,
        tags: spot.tags,
        likes: spot.likes,
        comments: spot.comments,
        author: spot.profiles?.username || spot.profiles?.email || 'Anonymous'
      }));

      setSpots(formattedSpots);
    } catch (error) {
      console.error('Error in fetchSpots:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSpot = async (spotData: Omit<DatabaseSpot, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'profiles'>) => {
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
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        description: "Perfect surf spot with crystal clear waters and amazing waves. The ultimate chill vibe by the beach.",
        tags: ["beach", "surf", "tahimik", "aesthetic"],
        likes: 142,
        comments: 23
      },
      {
        name: "La Union Surfing Break",
        location: "San Juan, La Union",
        image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        description: "Epic waves and sunset views. Great for both beginners and pro surfers. Amazing food trucks nearby!",
        tags: ["surf", "sunset", "food-trip", "vibrant"],
        likes: 89,
        comments: 15
      },
      {
        name: "Sagada Hanging Coffins",
        location: "Sagada, Mountain Province",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        description: "Mystical mountain views and ancient traditions. Perfect for soul-searching and adventure.",
        tags: ["mountain", "adventure", "tahimik", "cultural"],
        likes: 201,
        comments: 45
      }
    ];

    for (const spot of mockSpots) {
      await createSpot(spot);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSpots();
    }
  }, [user]);

  return {
    spots,
    loading,
    fetchSpots,
    createSpot,
    seedMockData
  };
};
