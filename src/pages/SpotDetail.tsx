
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, MessageCircle, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useSpots } from "@/hooks/useSpots";
import { SpotData } from "@/types/spot";

const SpotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { spots, loading } = useSpots();
  const [spot, setSpot] = useState<SpotData | null>(null);

  useEffect(() => {
    if (!loading && spots.length > 0 && id) {
      const foundSpot = spots.find(s => s.id === parseInt(id));
      setSpot(foundSpot || null);
    }
  }, [id, spots, loading]);

  if (loading) {
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

  if (!spot) {
    return (
      <div className="min-h-screen bg-tambii-gray flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-tambii-dark mb-2">Spot not found</h2>
          <p className="text-gray-600 mb-4">The spot you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="bg-tambii-dark hover:bg-tambii-dark/90">
            Go back home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tambii-gray">
      {/* Header */}
      <header className="relative z-10 flex items-center p-6 modern-card mx-4 mt-4 rounded-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="h-10 w-10 p-0 rounded-2xl hover:bg-gray-100 mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-tambii-dark" />
        </Button>
        <h1 className="text-xl font-bold text-tambii-dark tracking-tight">
          {spot.name}
        </h1>
      </header>

      <div className="p-6 space-y-6">
        {/* Main Image */}
        <Card className="modern-card border-0 shadow-xl rounded-3xl overflow-hidden">
          <div className="relative h-80">
            <img 
              src={spot.image} 
              alt={spot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Stats overlay */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                <span className="text-xs font-medium text-gray-800">{spot.likes}</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                <MessageCircle className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-medium text-gray-800">{spot.comments}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Spot Information */}
        <Card className="modern-card border-0 shadow-lg rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-tambii-dark mb-3 tracking-tight">
                {spot.name}
              </h2>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{spot.location}</span>
              </div>
              {spot.author && (
                <div className="flex items-center text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">Posted by {spot.author}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-tambii-dark mb-2">Description</h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {spot.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-tambii-dark mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {spot.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full px-3 py-1 text-sm font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <Card className="modern-card border-0 shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-tambii-dark mb-4">
            Comments ({spot.comments})
          </h3>
          
          {/* Mock comments for demonstration */}
          <div className="space-y-4">
            {spot.comments > 0 ? (
              Array.from({ length: Math.min(spot.comments, 3) }).map((_, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-tambii-dark">
                          User {index + 1}
                        </span>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {index === 0 && "Amazing place! The vibes here are unmatched. Perfect for hanging out with friends."}
                        {index === 1 && "Love the aesthetic of this spot. Great for photos too!"}
                        {index === 2 && "Been here multiple times, never gets old. Highly recommend!"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SpotDetail;
