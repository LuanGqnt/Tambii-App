
import { useState } from "react";
import { Heart, MapPin, Tag, List, Home, Search } from "lucide-react";
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
  },
  {
    id: 6,
    name: "Baguio Session Road",
    location: "Baguio City, Benguet",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Cool mountain vibes, street food, and bustling nightlife. Perfect for food trips and people watching.",
    tags: ["city", "food-trip", "vibrant", "nightlife"],
    likes: 178,
    comments: 67
  },
  {
    id: 7,
    name: "El Nido Big Lagoon",
    location: "El Nido, Palawan",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Hidden lagoon surrounded by towering limestone cliffs. Kayaking and swimming in paradise.",
    tags: ["lagoon", "kayaking", "tahimik", "hidden-gem"],
    likes: 298,
    comments: 84
  },
  {
    id: 8,
    name: "Ilocos Norte Windmills",
    location: "Bangui, Ilocos Norte",
    image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Majestic windmills along the coastline. Perfect for Instagram photos and sunset views.",
    tags: ["windmills", "sunset", "aesthetic", "photo-op"],
    likes: 156,
    comments: 29
  },
  {
    id: 9,
    name: "Mayon Volcano View Deck",
    location: "Legazpi, Albay",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Perfect cone volcano view with ATV adventures and local cuisine. Nature and adrenaline combined.",
    tags: ["volcano", "adventure", "nature", "atv"],
    likes: 189,
    comments: 41
  },
  {
    id: 10,
    name: "Boracay White Beach",
    location: "Malay, Aklan",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "World-famous white sand beach with crystal clear waters. Beach parties and water sports galore.",
    tags: ["beach", "party", "vibrant", "water-sports"],
    likes: 445,
    comments: 123
  },
  {
    id: 11,
    name: "Taal Volcano Island",
    location: "Talisay, Batangas",
    image: "https://images.unsplash.com/photo-1506442741187-70d4d1b5b4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Unique volcano within a lake experience. Horseback riding and breathtaking crater views.",
    tags: ["volcano", "lake", "horseback", "unique"],
    likes: 134,
    comments: 38
  },
  {
    id: 12,
    name: "Intramuros Manila",
    location: "Manila, Metro Manila",
    image: "https://images.unsplash.com/photo-1555400499-4e79071765c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Historic walled city with Spanish colonial architecture. Museums, cafes, and cultural heritage.",
    tags: ["historical", "cultural", "museums", "heritage"],
    likes: 203,
    comments: 74
  },
  {
    id: 13,
    name: "Bantayan Island Beach",
    location: "Bantayan, Cebu",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Pristine white sand beaches with laid-back island vibes. Perfect for digital nomads and relaxation.",
    tags: ["beach", "tahimik", "island", "relaxation"],
    likes: 167,
    comments: 45
  },
  {
    id: 14,
    name: "Panglao Island Alona Beach",
    location: "Panglao, Bohol",
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Beach paradise with diving spots and beachfront bars. Great nightlife and underwater adventures.",
    tags: ["beach", "diving", "nightlife", "adventure"],
    likes: 289,
    comments: 92
  },
  {
    id: 15,
    name: "Camiguin White Island",
    location: "Camiguin Province",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    description: "Uninhabited white sandbar in the middle of the sea. Perfect for day trips and snorkeling.",
    tags: ["sandbar", "snorkeling", "day-trip", "pristine"],
    likes: 198,
    comments: 37
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
    <div className="min-h-screen bg-tambii-gray relative">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 modern-card mx-4 mt-4 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-tambii-dark flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-tambii-dark tracking-tight">tambii</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-2xl hover:bg-gray-100"
          >
            <Search className="w-5 h-5 text-tambii-dark" />
          </Button>
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
        {currentSpotIndex < mockSpots.length ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-tambii-dark mb-3 tracking-tight">
                Discover places
              </h2>
              <p className="text-gray-600 text-lg">
                Find the best course for you
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
              Check out your saved places or explore more tomorrow.
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
