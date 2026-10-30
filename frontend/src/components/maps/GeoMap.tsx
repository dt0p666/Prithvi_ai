import React, { useEffect, useRef, useState } from 'react';
import type { CityRecord } from '../../types';
import L from 'leaflet';
import { Layers, Compass, ZoomIn, ZoomOut, RotateCcw, MapPin, Sparkles } from 'lucide-react';

interface GeoMapProps {
  cities: CityRecord[];
  selectedCity: CityRecord | null;
  onSelectCity: (city: CityRecord) => void;
  activeMetric: 'temp' | 'green' | 'aqi' | 'energy' | 'ndbi';
  selectedLandCover?: string;
  selectedState?: string;
}

export const GeoMap: React.FC<GeoMapProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  activeMetric,
  selectedLandCover = 'ALL',
  selectedState = 'ALL'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [is3D, setIs3D] = useState(false);
  const [mapType, setMapType] = useState<'voyager' | 'dark' | 'osm'>('voyager');

  // Initialize Leaflet Map centered on India
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.8, 79.2], // Center of India
      zoom: 5,
      minZoom: 3,
      maxZoom: 15,
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

  // Update 100% legal, keyless, open tile layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; OpenStreetMap contributors &copy; CARTO';

    if (mapType === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (mapType === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: 'abcd',
      attribution: attribution
    }).addTo(map);
  }, [mapType]);

  // Update Markers based on Indian Cities Dataset
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Group or filter unique city nodes to display accurately
    const filtered = cities.filter((c) => {
      const cState = (c as any).State || '';
      const matchState = selectedState === 'ALL' || cState.toLowerCase() === selectedState.toLowerCase();
      const matchCover = selectedLandCover === 'ALL' || (c as any)['Land Cover'] === selectedLandCover;
      return matchState && matchCover;
    });

    filtered.forEach((city) => {
      const cityName = city['City Name'] || (city as any).City || 'Indian City';
      const stateName = (city as any).State || '';
      const lat = city.Latitude;
      const lon = city.Longitude;
      const lst = (city as any)['LST (°C)'] ?? city['Temperature (°C)'] ?? 30.0;
      const ndvi = (city as any).NDVI ?? ((city['Urban Greenness Ratio (%)'] || 25) / 100);
      const ndbi = (city as any).NDBI ?? 0.05;
      const elevation = (city as any)['Elevation (m)'] ?? 200;

      // Color coding based on metric
      let color = '#d4af37'; // gold
      if (activeMetric === 'temp') {
        color = lst > 34 ? '#e74c3c' : lst > 29 ? '#f39c12' : '#27ae60';
      } else if (activeMetric === 'green') {
        color = ndvi > 0.35 ? '#27ae60' : ndvi > 0.2 ? '#f39c12' : '#e67e22';
      } else if (activeMetric === 'ndbi') {
        color = ndbi > 0.1 ? '#e74c3c' : '#27ae60';
      }

      const isSelected = (selectedCity?.['City Name'] || (selectedCity as any)?.City) === cityName;
      const radius = isSelected ? 9 : 5.5;

      const marker = L.circleMarker([lat, lon], {
        radius: radius,
        fillColor: color,
        color: isSelected ? '#ffffff' : '#1a140d',
        weight: isSelected ? 2.5 : 1.2,
        opacity: 0.95,
        fillOpacity: isSelected ? 0.95 : 0.8
      });

      marker.bindTooltip(`
        <div style="font-family: 'Cinzel', serif; font-weight: 700; color: #1a1208; font-size: 13px;">
          ${cityName}${stateName ? `, ${stateName}` : ''}
        </div>
        <div style="font-size: 11px; color: #332211; margin-top: 3px; font-family: sans-serif;">
          <strong>LST:</strong> ${lst.toFixed(1)}°C &nbsp;|&nbsp; 
          <strong>NDVI:</strong> ${ndvi.toFixed(2)} &nbsp;|&nbsp; 
          <strong>Elev:</strong> ${elevation}m
        </div>
      `, {
        className: 'custom-map-tooltip',
        direction: 'top',
        offset: [0, -6]
      });

      marker.on('click', () => {
        onSelectCity(city);
        map.flyTo([lat, lon], Math.max(map.getZoom(), 8), { duration: 1.2 });
      });

      markersLayer.addLayer(marker);
    });
  }, [cities, selectedCity, activeMetric, selectedLandCover, selectedState, onSelectCity]);

  // Center on selected city if changed externally
  useEffect(() => {
    if (selectedCity && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([selectedCity.Latitude, selectedCity.Longitude], { animate: true });
    }
  }, [selectedCity]);

  const resetView = () => {
    mapInstanceRef.current?.flyTo([22.8, 79.2], 5, { duration: 1.0 });
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '540px',
      borderRadius: '6px',
      overflow: 'hidden',
      border: '1px solid var(--border-accent)',
      boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
      perspective: '1200px'
    }}>
      {/* 3D oblique tilt container (simulating Google Maps / Earth 3D oblique angle) */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          transform: is3D ? 'rotateX(26deg) scale(1.06)' : 'none',
          transformOrigin: '50% 100%',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
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
          title="Toggle 3D Oblique Google Earth Angle"
          style={{
            background: is3D ? 'var(--gold-primary)' : 'var(--bg-card)',
            color: is3D ? '#1a1208' : 'var(--text-primary)',
            border: '1px solid var(--border-accent)',
            borderRadius: '4px',
            padding: '7px 11px',
            fontSize: '11px',
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <Compass size={13} />
          <span>{is3D ? '3D ACTIVE' : '3D PERSPECTIVE'}</span>
        </button>

        {/* Map Tile Theme Switcher (CARTO Voyager / Dark Matter / OSM) */}
        <button
          onClick={() => {
            const nextType = mapType === 'voyager' ? 'dark' : mapType === 'dark' ? 'osm' : 'voyager';
            setMapType(nextType);
          }}
          title="Switch Map Tiles (Keyless, Free & Legal)"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-accent)',
            borderRadius: '4px',
            padding: '7px 11px',
            fontSize: '11px',
            fontFamily: "'Cinzel', serif",
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}
        >
          <Layers size={13} />
          <span>
            {mapType === 'voyager' ? 'VOYAGER' : mapType === 'dark' ? 'DARK ATLAS' : 'STREETS'}
          </span>
        </button>

        {/* Reset View to India */}
        <button
          onClick={resetView}
          title="Reset to All India View"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-accent)',
            borderRadius: '4px',
            padding: '7px 11px',
            fontSize: '11px',
            fontFamily: "'Cinzel', serif",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}
        >
          <RotateCcw size={13} />
          <span>RESET</span>
        </button>

        {/* Zoom In / Out */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-accent)',
              borderRadius: '4px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-accent)',
              borderRadius: '4px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'rgba(16, 20, 18, 0.92)',
        border: '1px solid var(--border-accent)',
        borderRadius: '4px',
        padding: '8px 14px',
        fontSize: '10px',
        color: '#f4ede2',
        zIndex: 10,
        backdropFilter: 'blur(6px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.14em',
          color: 'var(--gold-primary)',
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          marginBottom: '4px'
        }}>
          {activeMetric === 'temp' ? 'LAND SURFACE TEMP (°C)' : activeMetric === 'green' ? 'VEGETATION INDEX (NDVI)' : 'BUILT-UP INDEX (NDBI)'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27ae60' }} />
            <span>Cool (&lt;29°C)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f39c12' }} />
            <span>Moderate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e74c3c' }} />
            <span>Hot (&gt;34°C)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
