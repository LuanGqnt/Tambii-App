import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Map } from "lucide-react";
import MapLocationPicker from './MapLocationPicker';

interface LocationPickerProps {
  onLocationSelect: (location: string, coordinates?: [number, number]) => void;
  initialLocation?: string;
}

const LocationPicker = ({ onLocationSelect, initialLocation = "" }: LocationPickerProps) => {
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  // Simple location search using Nominatim (OpenStreetMap)
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ph`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching location:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 2) {  
      const timeoutId = setTimeout(() => searchLocation(value), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (suggestion: any) => {
    const locationName = suggestion.display_name.split(',').slice(0, 2).join(', ');
    setSearchQuery(locationName);
    onLocationSelect(locationName, [parseFloat(suggestion.lon), parseFloat(suggestion.lat)]);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleManualInput = () => {
    onLocationSelect(searchQuery);
    setShowSuggestions(false);
  };

  const handleMapLocationSelect = (location: string, coordinates: [number, number]) => {
    setSearchQuery(location);
    onLocationSelect(location, coordinates);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-tambii-dark mb-2">
        Location *
      </label>
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search for a location or type manually"
            className="rounded-2xl border-gray-200 pl-10 pr-10"
            required
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowMapPicker(true)}
          className="rounded-2xl px-4 flex-shrink-0"
        >
          <Map className="w-4 h-4 mr-2" />
          Map
        </Button>
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => selectLocation(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.display_name.split(',')[0]}
                  </div>
                  <div className="text-xs text-gray-500">
                    {suggestion.display_name.split(',').slice(1, 3).join(', ')}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Manual input confirmation */}
      {searchQuery && !showSuggestions && searchQuery !== initialLocation && (
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleManualInput}
            className="rounded-xl text-xs"
          >
            Use "{searchQuery}" as location
          </Button>
        </div>
      )}
      
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tambii-dark"></div>
        </div>
      )}

      {showMapPicker && (
        <MapLocationPicker
          onLocationSelect={handleMapLocationSelect}
          onClose={() => setShowMapPicker(false)}
          initialLocation={searchQuery}
        />
      )}
    </div>
  );
};

export default LocationPicker;
