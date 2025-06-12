
import { useState, useEffect } from "react";
import { Heart, MapPin, List, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SwipeCard from "@/components/SwipeCard";
import BucketList from "@/components/BucketList";
import UserProfile from "@/components/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useSpots } from "@/hooks/useSpots";
import { useBucketList } from "@/hooks/useBucketList";

const Index = () => {
  const { user, loading: authLoading, userProfile } = useAuth();
  const { spots, loading: spotsLoading } = useSpots();
  const { bucketList, addToBucketList } = useBucketList();
  const navigate = useNavigate();
  
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const [showBucketList, setShowBucketList] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const currentSpot = spots[currentSpotIndex];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (direction === 'right' && currentSpot) {
      await addToBucketList(currentSpot);
    }
    
    setTimeout(() => {
      setCurrentSpotIndex(prev => prev + 1);
    }, 300);
  };

  if (authLoading || spotsLoading) {
    return (
      <div className="min-h-screen bg-tambii-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-tambii-dark flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (showProfile) {
    return <UserProfile onBack={() => setShowProfile(false)} />;
  }

  if (showBucketList) {
    return (
      <BucketList 
        spots={bucketList} 
        onBack={() => setShowBucketList(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-tambii-gray relative">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 modern-card mx-4 mt-4 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-tambii-dark flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-tambii-dark tracking-tight">Tambii</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfile(true)}
              className="h-10 w-10 p-0 rounded-2xl hover:bg-gray-100"
            >
              <User className="w-5 h-5 text-tambii-dark" />
            </Button>
            <span className="text-sm text-tambii-dark font-medium">
              {userProfile?.username || user.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBucketList(true)}
            className="rounded-2xl text-tambii-dark hover:bg-gray-100 px-4"
          >
            <List className="w-4 h-4 mr-2" />
            {bucketList.length}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-6">
        {currentSpotIndex < spots.length ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-tambii-dark mb-3 tracking-tight">
                Discover places
              </h2>
              <p className="text-gray-600 text-lg">
                Find your next tambayan
              </p>
            </div>

            <SwipeCard
              spot={currentSpot}
              onSwipe={handleSwipe}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-6 mt-8">
              <Button
                variant="outline"
                size="lg"
                className="w-14 h-14 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 p-0"
                onClick={() => handleSwipe('left')}
              >
                <span className="text-xl">✕</span>
              </Button>
              <Button
                size="lg"
                className="w-14 h-14 rounded-2xl bg-tambii-dark hover:bg-tambii-dark/90 p-0"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="w-6 h-6 text-white" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-tambii-dark flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-tambii-dark mb-4 tracking-tight">
              All done!
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              {spots.length === 0 
                ? "No spots available. Add some demo spots from your profile!"
                : "Check out your saved places or explore more tomorrow."
              }
            </p>
            <Button
              onClick={() => setShowBucketList(true)}
              className="bg-tambii-dark hover:bg-tambii-dark/90 rounded-2xl px-8 py-3 text-base"
            >
              <List className="w-4 h-4 mr-2" />
              View Saved Places ({bucketList.length})
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="modern-card rounded-full px-6 py-3 shadow-lg">
          <p className="text-sm text-gray-600 font-medium">
            ✕ Pass • ♡ Save
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
