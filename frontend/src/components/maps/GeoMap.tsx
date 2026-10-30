import React, { useEffect, useRef, useState } from 'react';
import type { CityRecord } from '../../types';
import L from 'leaflet';
import { Layers, Compass, ZoomIn, ZoomOut, RotateCcw, MapPin } from 'lucide-react';

interface GeoMapProps {
  cities: CityRecord[];
  selectedCity: CityRecord | null;
  onSelectCity: (city: CityRecord) => void;
  activeMetric: 'temp' | 'green' | 'aqi' | 'energy';
  selectedLandCover: string;
}

export const GeoMap: React.FC<GeoMapProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  activeMetric,
  selectedLandCover
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [is3D, setIs3D] = useState(false);
  const [mapType, setMapType] = useState<'carto' | 'satellite'>('carto');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629], // Initial central global view
      zoom: 3,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer based on mapType
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl = mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);
  }, [mapType]);

  // Update City Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const filtered = cities.filter((c) => {
      return selectedLandCover === 'ALL' || c['Land Cover'] === selectedLandCover;
    });

    filtered.forEach((city) => {
      let color = '#d4af37';
      if (activeMetric === 'temp') {
        color = city['Temperature (°C)'] > 30 ? '#e74c3c' : city['Temperature (°C)'] < 20 ? '#27ae60' : '#f39c12';
      } else if (activeMetric === 'green') {
        color = city['Urban Greenness Ratio (%)'] > 35 ? '#27ae60' : '#e67e22';
      } else if (activeMetric === 'aqi') {
        color = city['Air Quality Index (AQI)'] > 120 ? '#c0392b' : '#27ae60';
      }

      const isSelected = selectedCity?.['City Name'] === city['City Name'];
      const radius = isSelected ? 8 : 5;

      const marker = L.circleMarker([city.Latitude, city.Longitude], {
        radius: radius,
        fillColor: color,
        color: isSelected ? '#ffffff' : '#1a140d',
        weight: isSelected ? 2 : 1,
        opacity: 0.9,
        fillOpacity: 0.85
      });

      marker.bindTooltip(`
        <div style="font-family: 'Cinzel', serif; font-weight: 700; color: #1a1208;">
          ${city['City Name']} (${city['Land Cover']})
        </div>
        <div style="font-size: 11px; color: #443322;">
          ${city['Temperature (°C)'].toFixed(1)}°C · ${city['Urban Greenness Ratio (%)'].toFixed(1)}% Green
        </div>
      `, { className: 'custom-map-tooltip' });

      marker.on('click', () => {
        onSelectCity(city);
        map.flyTo([city.Latitude, city.Longitude], Math.max(map.getZoom(), 5), { duration: 1.2 });
      });

      markersLayer.addLayer(marker);
    });
  }, [cities, selectedCity, activeMetric, selectedLandCover, onSelectCity]);

  // Center on selected city if changed externally
  useEffect(() => {
    if (selectedCity && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([selectedCity.Latitude, selectedCity.Longitude], { animate: true });
    }
  }, [selectedCity]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '520px',
      borderRadius: '6px',
      overflow: 'hidden',
      border: '1px solid var(--border-accent)',
      boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
      perspective: '1000px'
    }}>
      {/* 3D oblique tilt container (simulating Google Maps / Earth 3D angle) */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          transform: is3D ? 'rotateX(25deg) scale(1.05)' : 'none',
          transformOrigin: '50% 100%',
          transition: 'transform 0.4s ease-out',
          zIndex: 1
        }}
      />

      {/* Floating Map Controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 10
      }}>
        {/* 3D Tilt Toggle */}
        <button
          onClick={() => setIs3D(!is3D)}
          title="Toggle 3D Perspective Angle"
          style={{
            background: is3D ? 'var(--gold-primary)' : 'var(--bg-secondary)',
            color: is3D ? '#1a1208' : 'var(--text-primary)',
            border: '1px solid var(--border-accent)',
            borderRadius: '4px',
            padding: '6px 10px',
            fontSize: '11px',
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <Compass size={12} />
          <span>{is3D ? '3D ON' : '3D TILT'}</span>
        </button>

        {/* Satellite vs Street Tile Toggle */}
        <button
          onClick={() => setMapType(mapType === 'carto' ? 'satellite' : 'carto')}
          title="Switch Map Tiles (Satellite / Cartographic)"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-accent)',
            borderRadius: '4px',
            padding: '6px 10px',
            fontSize: '11px',
            fontFamily: "'Cinzel', serif",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Layers size={12} />
          <span>{mapType === 'satellite' ? 'MAP' : 'SATELLITE'}</span>
        </button>

        {/* Zoom In */}
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-accent)',
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ZoomIn size={14} />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-accent)',
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ZoomOut size={14} />
        </button>

        {/* Reset */}
        <button
          onClick={() => {
            setIs3D(false);
            mapInstanceRef.current?.setView([20.5937, 78.9629], 3);
          }}
          title="Reset Global View"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-accent)',
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Selected City Telemetry Overlay at bottom-left */}
      {selectedCity && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          background: 'rgba(20, 15, 10, 0.92)',
          border: '1px solid var(--border-accent)',
          borderRadius: '4px',
          padding: '10px 14px',
          color: '#f4ede2',
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>
            SELECTED PINPOINT
          </div>
          <div style={{ fontSize: '14px', fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
            {selectedCity['City Name']} · {selectedCity['Land Cover']}
          </div>
          <div style={{ fontSize: '11px', color: '#58d68d', marginTop: '2px' }}>
            {selectedCity['Temperature (°C)'].toFixed(1)}°C · {selectedCity['Urban Greenness Ratio (%)'].toFixed(1)}% Canopy · Lat {selectedCity.Latitude.toFixed(2)}°, Lon {selectedCity.Longitude.toFixed(2)}°
          </div>
        </div>
      )}
    </div>
  );
};
