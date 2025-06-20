
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSpots } from "@/hooks/useSpots";
import { useAuth } from "@/contexts/AuthContext";
import RatingStars from "@/components/RatingStars";

const MapView = () => {
  const navigate = useNavigate();
  const { spots, loading } = useSpots();
  const { user, userProfile } = useAuth();
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-tambii-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-tambii-dark flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-tambii-gray">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 modern-card mx-4 mt-4 rounded-3xl">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="h-10 w-10 p-0 rounded-2xl hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-tambii-dark" />
          </Button>
          <div className="w-10 h-10 rounded-2xl bg-tambii-dark flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-tambii-dark tracking-tight">Map View</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-sm text-tambii-dark font-medium">
            {userProfile?.username || user.email}
          </span>
        </div>
      </header>

      <div className="p-6">
        {/* Map placeholder - for now showing a list view */}
        <Card className="modern-card border-0 shadow-lg rounded-3xl p-6 mb-6">
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Interactive Map Coming Soon</h3>
            <p className="text-gray-500">
              Map integration will be added in the next update. For now, browse spots below.
            </p>
          </div>
        </Card>

        {/* Spots List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-tambii-dark mb-4">All Spots ({spots.length})</h2>
          
          {spots.length === 0 ? (
            <Card className="modern-card border-0 shadow-lg rounded-2xl p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No spots available</h3>
              <p className="text-gray-500 mb-4">
                Be the first to share a spot with the community!
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-tambii-dark hover:bg-tambii-dark/90 rounded-2xl"
              >
                Add a Spot
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {spots.map((spot) => (
                <Card 
                  key={spot.id} 
                  className="modern-card border-0 shadow-lg rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => navigate(`/spot/${spot.id}`)}
                >
                  <div className="flex space-x-4">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                      <img 
                        src={spot.images[0] || '/placeholder.svg'} 
                        alt={spot.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-tambii-dark text-lg mb-1 truncate">
                        {spot.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{spot.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <RatingStars rating={spot.average_rating || 0} />
                          <span className="text-sm text-gray-600">
                            ({spot.review_count || 0})
                          </span>
                        </div>
                        
                        {spot.tags.length > 0 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {spot.tags[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
