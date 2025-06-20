import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SpotData } from '@/types/spot';

interface InteractiveMapProps {
  spots: SpotData[];
  onSpotClick: (spotId: string) => void;
}

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaW1sdWFuIiwiYSI6ImNtYzRleWNycjBmaDkyam9peGZqdHZsaTEifQ.JPRdolOSAp3lDT2nXc7nQQ'
const ZOOM_THRESHOLD = 10;

const InteractiveMap = ({ spots, onSpotClick }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  const initializeMap = () => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [121.0244, 14.5995], // Default to Manila
      zoom: 6
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right'); // zoom in and zoom out

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
          .addTo(map.current!);

        markers.current.push(marker);
      }
    });

    const hideAndShowMarkersBasedOnZoom = () => {
      const currentZoom = map.current!.getZoom();
      markers.current.forEach((marker) => {
        const el = marker.getElement();
        el.style.display = currentZoom >= ZOOM_THRESHOLD ? 'flex' : 'none';
      });
    }

    // Hide/show markers based on zoom
    map.current.on('zoom', () => {
      hideAndShowMarkersBasedOnZoom();
    });
    
    hideAndShowMarkersBasedOnZoom();

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
    if (MAPBOX_TOKEN) {
      initializeMap();
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
      }
    };
  }, [MAPBOX_TOKEN, spots]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default InteractiveMap;
