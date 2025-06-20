import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { MapPin, X } from 'lucide-react';

interface MapLocationPickerProps {
  onLocationSelect: (location: string, coordinates: [number, number]) => void;
  onClose: () => void;
  initialLocation?: string;
  initialCoordinates?: [number, number];
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaW1sdWFuIiwiYSI6ImNtYzRleWNycjBmaDkyam9peGZqdHZsaTEifQ.JPRdolOSAp3lDT2nXc7nQQ'

const MapLocationPicker = ({ 
  onLocationSelect, 
  onClose, 
  initialLocation = "", 
  initialCoordinates 
}: MapLocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(initialCoordinates || null);
  const [locationName, setLocationName] = useState(initialLocation);

  const initializeMap = () => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCoordinates || [121.0244, 14.5995], // Default to Manila
      zoom: 6
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler to place marker
    map.current.on('click', async (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }

      // Add new marker
      marker.current = new mapboxgl.Marker({ color: '#1a365d' })
        .setLngLat(coords)
        .addTo(map.current!);

      setSelectedCoords(coords);

      // Reverse geocode to get location name
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${MAPBOX_TOKEN}&types=poi,address,place`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const place = data.features[0];
          setLocationName(place.place_name);
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    });

    // Add initial marker if coordinates provided
    if (initialCoordinates) {
      marker.current = new mapboxgl.Marker({ color: '#1a365d' })
        .setLngLat(initialCoordinates)
        .addTo(map.current);
    }
  };

  useEffect(() => {
    if (MAPBOX_TOKEN) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [MAPBOX_TOKEN]);

  const handleConfirm = () => {
    if (selectedCoords && locationName) {
      onLocationSelect(locationName, selectedCoords);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl m-4 w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-tambii-dark">Select Location</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          <div ref={mapContainer} className="absolute inset-0 rounded-b-3xl overflow-hidden" />
        </div>
        
        {selectedCoords && (
          <div className="p-4 border-t bg-gray-50 rounded-b-3xl">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-4 h-4 text-tambii-dark" />
              <span className="text-sm font-medium text-tambii-dark">Selected Location:</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{locationName}</p>
            <div className="flex space-x-2">
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-tambii-dark hover:bg-tambii-dark/90 rounded-2xl"
              >
                Confirm Location
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCoords(null);
                  setLocationName('');
                  if (marker.current) {
                    marker.current.remove();
                  }
                }}
                className="rounded-2xl"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
        
        {!selectedCoords && (
          <div className="p-4 border-t bg-gray-50 rounded-b-3xl">
            <p className="text-sm text-gray-600 text-center">
              Click on the map to select a location
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLocationPicker;
