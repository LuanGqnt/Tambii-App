import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSpots } from "@/hooks/useSpots";
import { useAuth } from "@/contexts/AuthContext";
import InteractiveMap from "@/components/InteractiveMap";
import BottomNavigation from '@/components/BottomNavigation';

const MapView = ({ activeTab, setActiveTab, handleTabChange }) => {
  const navigate = useNavigate();
  const { spots, loading } = useSpots();
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSpotClick = (spotId: string) => {
    navigate(`/spot/${spotId}`);
  };

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
            onClick={() => handleTabChange('foryou')}
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
        {/* Interactive Map */}
        <Card className="modern-card border-0 shadow-lg rounded-3xl p-6 mb-6">
          <div className="h-[70vh]">
            <InteractiveMap spots={spots} onSpotClick={handleSpotClick} />
          </div>
        </Card>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default MapView;
