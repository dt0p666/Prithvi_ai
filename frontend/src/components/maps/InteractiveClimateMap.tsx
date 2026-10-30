import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { CityRecord } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Thermometer, Trees, Wind, Activity } from 'lucide-react';

interface MapProps {
  cities: CityRecord[];
  selectedCity: CityRecord | null;
  onSelectCity: (city: CityRecord) => void;
  activeMetric: 'temp' | 'green' | 'aqi' | 'energy';
  onChangeMetric: (metric: 'temp' | 'green' | 'aqi' | 'energy') => void;
  selectedLandCover: string;
}

export const InteractiveClimateMap: React.FC<MapProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  activeMetric,
  onChangeMetric,
  selectedLandCover
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCity, setHoveredCity] = useState<CityRecord | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Map coordinates projection: Equirectangular
  // Lon: -180 to +180 -> x: 0 to 100%
  // Lat: +90 to -90  -> y: 0 to 100%
  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const getMetricColor = (city: CityRecord) => {
    if (activeMetric === 'temp') {
      const t = city['Temperature (°C)'];
      if (t >= 32) return '#e74c3c'; // Severe Heat
      if (t >= 26) return '#e67e22'; // Moderate Warmth
      if (t >= 18) return '#f1c40f'; // Mild
      return '#2ecc71'; // Cool
    }
    if (activeMetric === 'green') {
      const g = city['Urban Greenness Ratio (%)'];
      if (g >= 40) return '#27ae60'; // High Canopy
      if (g >= 20) return '#2ecc71'; // Moderate
      return '#d35400'; // Sparse
    }
    if (activeMetric === 'aqi') {
      const aqi = city['Air Quality Index (AQI)'];
      if (aqi >= 150) return '#c0392b';
      if (aqi >= 100) return '#e67e22';
      return '#27ae60';
    }
    // Energy
    return city['Energy Consumption (kWh)'] > 30000 ? '#e67e22' : '#3498db';
  };

  const getMetricValue = (city: CityRecord) => {
    if (activeMetric === 'temp') return `${city['Temperature (°C)'].toFixed(1)}°C`;
    if (activeMetric === 'green') return `${city['Urban Greenness Ratio (%)'].toFixed(1)}% Green`;
    if (activeMetric === 'aqi') return `AQI ${city['Air Quality Index (AQI)']}`;
    return `${Math.round(city['Energy Consumption (kWh)']).toLocaleString()} kWh`;
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Simplified continent path outlines for environmental geography feel
  const continents = [
    // North America
    "M 160 80 Q 220 70 260 120 Q 240 180 180 200 Q 150 160 160 80 Z",
    // South America
    "M 280 260 Q 340 280 320 380 Q 290 440 260 380 Q 250 300 280 260 Z",
    // Eurasia & Africa
    "M 460 70 Q 650 60 780 110 Q 720 220 580 200 Q 480 180 460 70 Z",
    // Africa
    "M 470 200 Q 560 210 560 310 Q 520 400 480 340 Q 450 250 470 200 Z",
    // Australia
    "M 740 320 Q 820 310 830 380 Q 760 410 740 320 Z"
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '520px',
      background: 'radial-gradient(ellipse at center, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      border: '1px solid var(--border-color)',
      borderRadius: '6px',
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      {/* Top Map Layer Selector & Metric Toggles */}
      <div style={{
        position: 'absolute',
        top: '14px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 20,
        background: 'rgba(20, 15, 10, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-accent)',
        borderRadius: '6px',
        padding: '4px 6px'
      }}>
        <button
          onClick={() => onChangeMetric('temp')}
          style={{
            background: activeMetric === 'temp' ? 'var(--gold-primary)' : 'transparent',
            color: activeMetric === 'temp' ? '#1a1208' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Thermometer size={12} />
          <span>Surface Heat</span>
        </button>

        <button
          onClick={() => onChangeMetric('green')}
          style={{
            background: activeMetric === 'green' ? '#27ae60' : 'transparent',
            color: activeMetric === 'green' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Trees size={12} />
          <span>Canopy Greenness</span>
        </button>

        <button
          onClick={() => onChangeMetric('aqi')}
          style={{
            background: activeMetric === 'aqi' ? '#e67e22' : 'transparent',
            color: activeMetric === 'aqi' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Activity size={12} />
          <span>Air Quality</span>
        </button>
      </div>

      {/* Map Zoom Controls */}
      <div style={{
        position: 'absolute',
        top: '14px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 20
      }}>
        <button
          onClick={() => setZoom(z => Math.min(3.5, z + 0.35))}
          title="Zoom In"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-accent)',
            color: 'var(--text-primary)',
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

        <button
          onClick={() => setZoom(z => Math.max(0.8, z - 0.35))}
          title="Zoom Out"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-accent)',
            color: 'var(--text-primary)',
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

        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          title="Reset Camera"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-accent)',
            color: 'var(--text-primary)',
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

      {/* SVG Canvas Map Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative'
        }}
      >
        <svg
          viewBox="0 0 1000 500"
          style={{
            width: '100%',
            height: '100%',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          <defs>
            {/* Latitude Grid lines */}
            <pattern id="grid" width="100" height="50" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 50" fill="none" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="500" fill="url(#grid)" />

          {/* Continent Archetype Silhouettes */}
          {continents.map((path, i) => (
            <path
              key={i}
              d={path}
              fill="rgba(42, 33, 24, 0.45)"
              stroke="rgba(212, 175, 55, 0.22)"
              strokeWidth="0.8"
            />
          ))}

          {/* Equator & Prime Meridian markers */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(212, 175, 55, 0.25)" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(212, 175, 55, 0.25)" strokeDasharray="3 3" strokeWidth="0.8" />

          {/* City Nodes (Thermal Points) */}
          {cities.map((city) => {
            const { x, y } = projectCoords(city.Latitude, city.Longitude);
            const isSelected = selectedCity?.['City Name'] === city['City Name'];
            const color = getMetricColor(city);
            const matchesCover = selectedLandCover === 'ALL' || city['Land Cover'] === selectedLandCover;

            return (
              <g
                key={city['City Name']}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCity(city);
                }}
                onMouseEnter={(e) => {
                  setHoveredCity(city);
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (rect) {
                    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }
                }}
                onMouseLeave={() => setHoveredCity(null)}
                style={{ cursor: 'pointer', opacity: matchesCover ? 1 : 0.18, transition: 'opacity 0.2s ease' }}
              >
                {/* Glow ring for selected or hovered */}
                {(isSelected || hoveredCity?.['City Name'] === city['City Name']) && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 10 : 7}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />
                )}

                {/* Heat node point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 5 : matchesCover ? 3.5 : 2}
                  fill={color}
                  stroke="#100c08"
                  strokeWidth="0.8"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredCity && (
          <div style={{
            position: 'absolute',
            left: `${tooltipPos.x + 12}px`,
            top: `${tooltipPos.y - 12}px`,
            background: 'rgba(18, 14, 10, 0.95)',
            border: '1px solid var(--border-accent)',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '11px',
            color: 'var(--text-primary)',
            pointerEvents: 'none',
            zIndex: 30,
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)'
          }}>
            <div style={{ fontFamily: "'Cinzel', Georgia, serif", fontWeight: 700, color: 'var(--gold-primary)' }}>
              {hoveredCity['City Name']}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {hoveredCity['Land Cover']} · Lat {hoveredCity.Latitude.toFixed(1)}°, Lon {hoveredCity.Longitude.toFixed(1)}°
            </div>
            <div style={{ marginTop: '4px', fontWeight: 600, color: getMetricColor(hoveredCity) }}>
              {getMetricValue(hoveredCity)}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(16, 12, 8, 0.88)',
        backdropFilter: 'blur(6px)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        padding: '6px 14px',
        fontSize: '10px',
        color: 'var(--text-muted)',
        zIndex: 10
      }}>
        <span>Showing: {cities.length} Monitored Cities</span>
        <span>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71' }} />
          <span>Low</span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f1c40f' }} />
          <span>Moderate</span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e74c3c' }} />
          <span>Elevated</span>
        </div>
      </div>
    </div>
  );
};
