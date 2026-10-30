import React, { useState, useRef } from 'react';
import type { CityRecord } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw, Thermometer, Trees, Activity, Building2 } from 'lucide-react';

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
  // Center initial view over Indian subcontinent
  const [zoom, setZoom] = useState(2.2);
  const [pan, setPan] = useState({ x: -220, y: 70 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCity, setHoveredCity] = useState<CityRecord | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const getMetricColor = (city: CityRecord) => {
    const t = city['LST (°C)'] ?? city['Temperature (°C)'] ?? 30;
    if (activeMetric === 'temp') {
      if (t >= 34) return '#e74c3c'; // Severe Heat
      if (t >= 29) return '#f39c12'; // Moderate Warmth
      if (t >= 24) return '#e6c875'; // Mild
      return '#2ecc71'; // Cool
    }
    if (activeMetric === 'green') {
      const g = (city.NDVI ?? 0.25) * 100;
      if (g >= 35) return '#27ae60'; // High Canopy
      if (g >= 20) return '#2ecc71'; // Moderate
      return '#d35400'; // Sparse
    }
    if (activeMetric === 'aqi') {
      const ndbi = city.NDBI ?? 0.1;
      if (ndbi >= 0.2) return '#c0392b';
      if (ndbi >= 0.05) return '#e67e22';
      return '#27ae60';
    }
    // Energy / Built-up
    return (city.NDBI ?? 0) > 0.1 ? '#e67e22' : '#3498db';
  };

  const getMetricValue = (city: CityRecord) => {
    const t = city['LST (°C)'] ?? city['Temperature (°C)'] ?? 30;
    if (activeMetric === 'temp') return `LST ${t.toFixed(1)}°C`;
    if (activeMetric === 'green') return `NDVI ${Number(city.NDVI || 0.25).toFixed(2)}`;
    if (activeMetric === 'aqi') return `NDBI ${Number(city.NDBI || 0.1).toFixed(2)} (Built-up)`;
    return `Elevation ${city['Elevation (m)']}m`;
  };

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
      {/* Top Map Metric Toggles */}
      <div style={{
        position: 'absolute',
        top: '14px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 20,
        background: 'rgba(20, 15, 10, 0.88)',
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
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Thermometer size={12} />
          <span>Surface LST (°C)</span>
        </button>

        <button
          onClick={() => onChangeMetric('green')}
          style={{
            background: activeMetric === 'green' ? '#27ae60' : 'transparent',
            color: activeMetric === 'green' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Trees size={12} />
          <span>Vegetation (NDVI)</span>
        </button>

        <button
          onClick={() => onChangeMetric('aqi')}
          style={{
            background: activeMetric === 'aqi' ? '#e67e22' : 'transparent',
            color: activeMetric === 'aqi' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Building2 size={12} />
          <span>Built-up (NDBI)</span>
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
          onClick={() => setZoom(z => Math.min(4.5, z + 0.4))}
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
          onClick={() => setZoom(z => Math.max(0.8, z - 0.4))}
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
          onClick={() => { setZoom(2.2); setPan({ x: -220, y: 70 }); }}
          title="Reset to India Subcontinent"
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
            <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 25" fill="none" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="0.6" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="500" fill="url(#grid)" />

          {/* South Asia / India Peninsula Silhouette Outline */}
          <path
            d="M 685 155 Q 700 135 730 140 Q 755 145 770 170 Q 770 210 740 255 Q 725 285 715 285 Q 700 250 685 200 Z"
            fill="rgba(42, 33, 24, 0.55)"
            stroke="rgba(212, 175, 55, 0.35)"
            strokeWidth="1.2"
          />

          {/* Latitude / Longitude lines */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(212, 175, 55, 0.2)" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1="715" y1="0" x2="715" y2="500" stroke="rgba(212, 175, 55, 0.2)" strokeDasharray="3 3" strokeWidth="0.8" />

          {/* City Nodes */}
          {cities.map((city, idx) => {
            const { x, y } = projectCoords(city.Latitude, city.Longitude);
            const cityName = city['City Name'] || city.City || `City_${idx}`;
            const isSelected = (selectedCity?.['City Name'] || selectedCity?.City) === cityName;
            const color = getMetricColor(city);

            return (
              <g
                key={`${cityName}-${idx}`}
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
                style={{ cursor: 'pointer' }}
              >
                {/* Glow ring */}
                {(isSelected || hoveredCity?.City === city.City) && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 9 : 6}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.6"
                    strokeOpacity="0.85"
                  />
                )}

                {/* Node point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 4.5 : 3}
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
              {hoveredCity['City Name'] || hoveredCity.City}
              {hoveredCity.State ? `, ${hoveredCity.State}` : ''}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Lat {hoveredCity.Latitude.toFixed(2)}°, Lon {hoveredCity.Longitude.toFixed(2)}° · {hoveredCity.Month} {hoveredCity.Year}
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
        background: 'rgba(16, 12, 8, 0.9)',
        backdropFilter: 'blur(6px)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        padding: '6px 14px',
        fontSize: '10px',
        color: 'var(--text-muted)',
        zIndex: 10
      }}>
        <span>India Cities ({cities.length} observations)</span>
        <span>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71' }} />
          <span>Cool (&lt;29°C)</span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f39c12' }} />
          <span>Moderate</span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e74c3c' }} />
          <span>Elevated (&gt;34°C)</span>
        </div>
      </div>
    </div>
  );
};
