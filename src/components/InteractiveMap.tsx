
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SpotData } from '@/types/spot';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';

interface InteractiveMapProps {
  spots: SpotData[];
  onSpotClick: (spotId: string) => void;
}

const InteractiveMap = ({ spots, onSpotClick }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [121.0244, 14.5995], // Default to Manila
      zoom: 6
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for spots that have coordinates
    spots.forEach((spot) => {
      if (spot.coordinates) {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 bg-tambii-dark rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg';
        el.innerHTML = '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
        
        el.addEventListener('click', () => {
          onSpotClick(spot.id);
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat(spot.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold text-tambii-dark">${spot.name}</h3>
                  <p class="text-sm text-gray-600">${spot.location}</p>
                  <div class="flex items-center mt-1">
                    <span class="text-yellow-500">★</span>
                    <span class="text-sm ml-1">${spot.average_rating?.toFixed(1) || 'No rating'}</span>
                  </div>
                </div>
              `)
          )
          .addTo(map.current!);

        markers.current.push(marker);
      }
    });

    // Fit map to show all markers
    if (markers.current.length > 0) {
      const coordinates = spots
        .filter(spot => spot.coordinates)
        .map(spot => spot.coordinates!);
      
      if (coordinates.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach(coord => bounds.extend(coord));
        map.current.fitBounds(bounds, { padding: 50 });
      }
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, spots]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="bg-white rounded-2xl p-6 m-4 max-w-md w-full shadow-lg">
          <div className="text-center mb-4">
            <MapPin className="w-12 h-12 text-tambii-dark mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-tambii-dark">Map Configuration</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 text-center">
            Enter your Mapbox public token to view spots on the map. 
            Get one from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-tambii-dark underline"
            >
              mapbox.com
            </a>
          </p>
          
          <div className="space-y-4">
            <Input
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
              className="rounded-2xl"
            />
            <Button
              onClick={handleTokenSubmit}
              disabled={!mapboxToken.trim()}
              className="w-full bg-tambii-dark hover:bg-tambii-dark/90 rounded-2xl"
            >
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default InteractiveMap;
