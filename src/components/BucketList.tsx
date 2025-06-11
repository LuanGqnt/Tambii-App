
import { ArrowLeft, MapPin, Heart, MessageCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpotData } from "@/types/spot";

interface BucketListProps {
  spots: SpotData[];
  onBack: () => void;
}

const BucketList = ({ spots, onBack }: BucketListProps) => {
  const getMoodColor = (tag: string) => {
    const colors: Record<string, string> = {
      'tahimik': 'bg-blue-100 text-blue-700',
      'food-trip': 'bg-orange-100 text-orange-700',
      'aesthetic': 'bg-pink-100 text-pink-700',
      'vibrant': 'bg-yellow-100 text-yellow-700',
      'adventure': 'bg-green-100 text-green-700',
      'cultural': 'bg-purple-100 text-purple-700',
      'nature': 'bg-emerald-100 text-emerald-700',
      'beach': 'bg-cyan-100 text-cyan-700',
      'surf': 'bg-teal-100 text-teal-700',
      'sunset': 'bg-red-100 text-red-700',
      'mountain': 'bg-slate-100 text-slate-700',
      'photo-op': 'bg-indigo-100 text-indigo-700',
      'iconic': 'bg-violet-100 text-violet-700',
      'lake': 'bg-sky-100 text-sky-700',
      'swimming': 'bg-blue-100 text-blue-700',
      'paradise': 'bg-emerald-100 text-emerald-700'
    };
    return colors[tag] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-tambii-orange hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-bold text-gray-800">My Bucket List</h1>
        <div className="w-16" /> {/* Spacer */}
      </header>

      <div className="p-4">
        {spots.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No spots saved yet
            </h2>
            <p className="text-gray-500">
              Swipe right on spots you want to visit to add them here!
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-1">
                {spots.length} {spots.length === 1 ? 'Tambayan' : 'Tambayans'} to Visit
              </h2>
              <p className="text-gray-500">
                Your saved hangout spots across the Philippines
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {spots.map((spot) => (
                <Card key={spot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={spot.image} 
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Location Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-tambii-orange" />
                      <span className="text-xs font-medium text-gray-700">
                        {spot.location.split(',')[1]?.trim() || spot.location}
                      </span>
                    </div>

                    {/* Added Badge */}
                    <div className="absolute top-3 right-3 bg-tambii-orange/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">{spot.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{spot.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {spot.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(tag)}`}
                        >
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {spot.tags.length > 3 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{spot.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span className="text-xs">{spot.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span className="text-xs">{spot.comments}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BucketList;
