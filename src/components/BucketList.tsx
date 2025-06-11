
import { ArrowLeft, Heart, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpotData } from "@/types/spot";

interface BucketListProps {
  spots: SpotData[];
  onBack: () => void;
}

const BucketList = ({ spots, onBack }: BucketListProps) => {
  return (
    <div className="min-h-screen bg-tambii-gray">
      {/* Header */}
      <header className="relative z-10 flex items-center p-6 modern-card mx-4 mt-4 rounded-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-10 w-10 p-0 rounded-2xl hover:bg-gray-100 mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-tambii-dark" />
        </Button>
        <h1 className="text-2xl font-bold text-tambii-dark tracking-tight">
          Saved Places
        </h1>
      </header>

      <div className="p-6 space-y-4">
        {spots.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gray-100 flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-tambii-dark mb-3 tracking-tight">
              No places saved yet
            </h2>
            <p className="text-gray-600 text-lg">
              Start swiping to discover amazing tambayans!
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-gray-600">
                {spots.length} place{spots.length !== 1 ? 's' : ''} to visit
              </p>
            </div>
            
            <div className="grid gap-4">
              {spots.map((spot) => (
                <Card key={spot.id} className="modern-card border-0 shadow-lg rounded-2xl overflow-hidden">
                  <div className="flex">
                    {/* Image */}
                    <div className="w-32 h-32 flex-shrink-0">
                      <img 
                        src={spot.image} 
                        alt={spot.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <h3 className="text-lg font-bold text-tambii-dark mb-1 tracking-tight">
                        {spot.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="text-xs">{spot.location}</span>
                      </div>

                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {spot.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {spot.tags.slice(0, 2).map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="bg-gray-100 text-gray-700 rounded-full px-2 py-0 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {spot.tags.length > 2 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-100 text-gray-700 rounded-full px-2 py-0 text-xs"
                          >
                            +{spot.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-red-500 fill-current" />
                          <span>{spot.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3 text-blue-500" />
                          <span>{spot.comments}</span>
                        </div>
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
