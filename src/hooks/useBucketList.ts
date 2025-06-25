import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SpotData } from '@/types/spot';
import { toast } from '@/hooks/use-toast';

export const useBucketList = () => {
  const [bucketList, setBucketList] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchBucketList = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bucket_list')
        .select(`
          spot_id,
          spots (
            id,
            name,
            location,
            images,
            description,
            tags,
            average_rating,
            review_count,
            author,
            coordinates
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const spots = data?.map(item => ({
        ...item.spots,
        // Add default coordinates if missing
        coordinates: item.spots.coordinates || [0, 0]
      })) || [];
      
      setBucketList(spots);
    } catch (error) {
      console.error('Error fetching bucket list:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your saved spots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBucketList();
  }, [user]);

  const addToBucketList = async (spot: SpotData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bucket_list')
        .insert({
          user_id: user.id,
          spot_id: spot.id
        });

      if (error) throw error;

      setBucketList(prev => [...prev, spot]);
      toast({
        title: "Added to bucket list!",
        description: `${spot.name} has been saved to your places.`
      });
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Already saved",
          description: "This spot is already in your bucket list"
        });
      } else {
        console.error('Error adding to bucket list:', error);
        toast({
          title: "Error",
          description: "Failed to add spot to bucket list",
          variant: "destructive"
        });
      }
    }
  };

  const removeFromBucketList = async (spotId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bucket_list')
        .delete()
        .eq('user_id', user.id)
        .eq('spot_id', spotId);

      if (error) throw error;

      setBucketList(prev => prev.filter(spot => spot.id !== spotId));
      toast({
        title: "Removed from bucket list",
        description: "Spot has been removed from your saved places."
      });
    } catch (error) {
      console.error('Error removing from bucket list:', error);
      toast({
        title: "Error",
        description: "Failed to remove spot from bucket list",
        variant: "destructive"
      });
    }
  };

  return {
    bucketList,
    loading,
    addToBucketList,
    removeFromBucketList,
    fetchBucketList
  };
};
