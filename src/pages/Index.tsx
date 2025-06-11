
import { useState } from "react";
import { Heart, MapPin, Tag, List, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import SwipeCard from "@/components/SwipeCard";
import BucketList from "@/components/BucketList";
import { SpotData } from "@/types/spot";

// Mock data for tambayans
const mockSpots: SpotData[] = [
  {
    id: 1,
    name: "Siargao Cloud 9",
    location: "Siargao Island, Surigao del Norte",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Perfect surf spot with crystal clear waters and amazing waves. The ultimate chill vibe by the beach.",
    tags: ["beach", "surf", "tahimik", "aesthetic"],
    likes: 142,
    comments: 23
  },
  {
    id: 2,
    name: "La Union Surfing Break",
    location: "San Juan, La Union",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Epic waves and sunset views. Great for both beginners and pro surfers. Amazing food trucks nearby!",
    tags: ["surf", "sunset", "food-trip", "vibrant"],
    likes: 89,
    comments: 15
  },
  {
    id: 3,
    name: "Sagada Hanging Coffins",
    location: "Sagada, Mountain Province",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Mystical mountain views and ancient traditions. Perfect for soul-searching and adventure.",
    tags: ["mountain", "adventure", "tahimik", "cultural"],
    likes: 201,
    comments: 45
  },
  {
    id: 4,
    name: "Bohol Chocolate Hills",
    location: "Carmen, Bohol",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Iconic rolling hills that turn chocolate brown in dry season. Breathtaking views and photo ops!",
    tags: ["nature", "aesthetic", "photo-op", "iconic"],
    likes: 167,
    comments: 32
  },
  {
    id: 5,
    name: "Coron Kayangan Lake",
    location: "Coron, Palawan",
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Crystal clear waters surrounded by limestone cliffs. Paradise for swimming and snorkeling.",
    tags: ["lake", "swimming", "tahimik", "paradise"],
    likes: 234,
    comments: 56
  }
];

const Index = () => {
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const [bucketList, setBucketList] = useState<SpotData[]>([]);
  const [showBucketList, setShowBucketList] = useState(false);

  const currentSpot = mockSpots[currentSpotIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentSpot) {
      setBucketList(prev => [...prev, currentSpot]);
    }
    
    setTimeout(() => {
      setCurrentSpotIndex(prev => prev + 1);
    }, 300);
  };

  if (showBucketList) {
    return (
      <BucketList 
        spots={bucketList} 
        onBack={() => setShowBucketList(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full gradient-tambii flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-tambii-orange">Tambii</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBucketList(true)}
          className="border-orange-200 text-tambii-orange hover:bg-orange-50"
        >
          <List className="w-4 h-4 mr-2" />
          Bucket List ({bucketList.length})
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
        {currentSpotIndex < mockSpots.length ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Discover Amazing Tambayans
              </h2>
              <p className="text-gray-500">
                Swipe right to add to your bucket list!
              </p>
            </div>

            <SwipeCard
              spot={currentSpot}
              onSwipe={handleSwipe}
            />

            {/* Action Buttons */}
            <div className="flex space-x-8 mt-8">
              <Button
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-red-400 hover:bg-red-50"
                onClick={() => handleSwipe('left')}
              >
                <span className="text-2xl">👎</span>
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full gradient-tambii hover:scale-105 transition-transform"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="w-6 h-6 text-white" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-tambii flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              You've seen all spots!
            </h2>
            <p className="text-gray-500 mb-6">
              Check out your bucket list or come back later for more tambayans.
            </p>
            <Button
              onClick={() => setShowBucketList(true)}
              className="gradient-tambii hover:scale-105 transition-transform"
            >
              <List className="w-4 h-4 mr-2" />
              View My Bucket List ({bucketList.length})
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation Hint */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-orange-100">
          <p className="text-sm text-gray-600">
            👈 Skip • 💖 Add to List
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
