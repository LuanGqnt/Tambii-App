import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: 'foryou' | 'map';
  onTabChange: (tab: 'foryou' | 'map') => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="modern-card rounded-full px-6 py-3 shadow-lg flex items-center space-x-4">
        <Button
          variant={activeTab === 'foryou' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('foryou')}
          className={`rounded-full px-4 py-2 font-medium ${
            activeTab === 'foryou' 
              ? 'bg-tambii-dark text-white hover:bg-tambii-dark/90' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className="w-4 h-4 mr-2" />
          For You
        </Button>
        <Button
          variant={activeTab === 'map' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('map')}
          className={`rounded-full px-4 py-2 font-medium ${
            activeTab === 'map' 
              ? 'bg-tambii-dark text-white hover:bg-tambii-dark/90' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Map
        </Button>
      </div>
    </div>
  );
};

export default BottomNavigation;
