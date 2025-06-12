import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SpotData } from '@/types/spot';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseSpot } from './useSpots';

export const useBucketList = () => {
  const [bucketList, setBucketList] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBucketList = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_bucket_lists')
        .select((`
          spot_id,
          spots (
            id,
            name,
            location,
            image,
            description,
            tags,
            likes,
            comments,
            author
          )
        `))
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

        // .select(`
        //   spots!inner (
        //     *,
        //     profiles!inner (
        //       username,
        //       email
        //     )
        //   )
        // `)

      if (error) {
        console.error('Error fetching bucket list:', error);
        return;
      }

      const formattedSpots: SpotData[] = (data || [])
        .filter(item => item.spots) // Filter out any null spots
        .map(item => {
          const spot = item.spots as unknown as DatabaseSpot;
          return {
            id: parseInt(spot.id.split('-')[0], 16),
            name: spot.name,
            location: spot.location,
            image: spot.image,
            description: spot.description,
            tags: spot.tags,
            likes: spot.likes,
            comments: spot.comments,
            author: spot.author ?? 'Anonymous',
          };
        });

      setBucketList(formattedSpots);
    } catch (error) {
      console.error('Error in fetchBucketList:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToBucketList = async (spot: SpotData) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Convert the numeric ID back to UUID format for database lookup
      const { data: spotData, error: spotError } = await supabase
        .from('spots')
        .select('id')
        .eq('name', spot.name)
        .eq('location', spot.location)
        .single();

      if (spotError || !spotData) {
        console.error('Error finding spot:', spotError);
        return { error: 'Spot not found' };
      }

      const { error } = await supabase
        .from('user_bucket_lists')
        .insert([{
          user_id: user.id,
          spot_id: spotData.id
        }]);

      if (error) {
        console.error('Error adding to bucket list:', error);
        return { error };
      }

      // Refresh bucket list
      await fetchBucketList();
      return { success: true };
    } catch (error) {
      console.error('Error in addToBucketList:', error);
      return { error };
    }
  };

  const removeFromBucketList = async (spot: SpotData) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Convert the numeric ID back to UUID format for database lookup
      const { data: spotData, error: spotError } = await supabase
        .from('spots')
        .select('id')
        .eq('name', spot.name)
        .eq('location', spot.location)
        .single();

      if (spotError || !spotData) {
        console.error('Error finding spot:', spotError);
        return { error: 'Spot not found' };
      }

      const { error } = await supabase
        .from('user_bucket_lists')
        .delete()
        .eq('user_id', user.id)
        .eq('spot_id', spotData.id);

      if (error) {
        console.error('Error removing from bucket list:', error);
        return { error };
      }

      // Refresh bucket list
      await fetchBucketList();
      return { success: true };
    } catch (error) {
      console.error('Error in removeFromBucketList:', error);
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchBucketList();
    }
  }, [user]);

  return {
    bucketList,
    loading,
    addToBucketList,
    removeFromBucketList,
    fetchBucketList
  };
};
