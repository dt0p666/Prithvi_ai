import React, { useState } from 'react';

interface District {
  id: string;
  name: string;
  canopyPct: number;
  temp: string;
  path: string;
  labelPos: { x: number; y: number };
  fill: string;
}

const DISTRICTS: District[] = [
  {
    id: 'river_ward',
    name: 'RIVER WARD',
    canopyPct: 48.5,
    temp: '26.8°C',
    path: 'M 30 50 L 170 80 L 140 180 L 40 160 Z',
    labelPos: { x: 80, y: 110 },
    fill: '#153e28'
  },
  {
    id: 'old_market',
    name: 'OLD MARKET',
    canopyPct: 32.0,
    temp: '30.4°C',
    path: 'M 170 80 L 290 120 L 260 210 L 140 180 Z',
    labelPos: { x: 210, y: 145 },
    fill: '#245938'
  },
  {
    id: 'east_works',
    name: 'EAST WORKS',
    canopyPct: 14.8,
    temp: '34.9°C',
    path: 'M 290 120 L 440 150 L 390 260 L 260 210 Z',
    labelPos: { x: 335, y: 180 },
    fill: '#51684c'
  },
  {
    id: 'south_commons',
    name: 'SOUTH COMMONS',
    canopyPct: 58.2,
    temp: '24.2°C',
    path: 'M 40 160 L 140 180 L 260 210 L 390 260 L 350 340 L 50 320 Z',
    labelPos: { x: 210, y: 275 },
    fill: '#103420'
  }
];

export const DistrictCanopyMap: React.FC = () => {
  const [activeDistrict, setActiveDistrict] = useState<District>(DISTRICTS[2]); // East Works default hovered

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '560px',
      height: '380px',
      background: '#0d120f',
      border: '1px solid var(--border-accent)',
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
      userSelect: 'none'
    }}>
      {/* Background aerial texture / grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.18,
        backgroundImage: 'radial-gradient(circle at 50% 50%, #2e5a44 1px, transparent 1px)',
        backgroundSize: '16px 16px'
      }} />

      {/* SVG District Polygons */}
      <svg viewBox="0 0 480 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dashed Transit / Microclimate Arcs */}
        <path d="M 10 240 Q 240 190 470 120" fill="none" stroke="rgba(244, 237, 226, 0.28)" strokeWidth="1.2" strokeDasharray="3 4" />
        <path d="M 120 40 Q 210 220 320 350" fill="none" stroke="rgba(244, 237, 226, 0.28)" strokeWidth="1.2" strokeDasharray="3 4" />

        {/* Districts */}
        {DISTRICTS.map((d) => {
          const isActive = activeDistrict.id === d.id;
          return (
            <g
              key={d.id}
              onClick={() => setActiveDistrict(d)}
              onMouseEnter={() => setActiveDistrict(d)}
              style={{ cursor: 'pointer' }}
            >
              <path
                d={d.path}
                fill={d.fill}
                stroke={isActive ? '#e6c875' : '#2d4b38'}
                strokeWidth={isActive ? 2.5 : 1}
                filter={isActive ? 'url(#goldGlow)' : undefined}
                style={{ transition: 'all 0.2s ease' }}
              />

              {/* District Label */}
              <text
                x={d.labelPos.x}
                y={d.labelPos.y}
                fill={isActive ? '#f4ede2' : '#8fa996'}
                fontSize="9"
                fontFamily="'Cinzel', Georgia, serif"
                fontWeight={isActive ? 700 : 500}
                letterSpacing="1.2"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
              >
                {d.name}
              </text>

              {/* Dot Center Indicator */}
              <circle
                cx={d.labelPos.x}
                cy={d.labelPos.y + 10}
                r={isActive ? 3 : 2}
                fill={isActive ? '#f4ede2' : '#8fa996'}
              />
            </g>
          );
        })}

        {/* River Waves along base (matching Figma) */}
        <path
          d="M 0 310 Q 120 330 240 310 T 480 300 L 480 360 L 0 360 Z"
          fill="#16382b"
          opacity="0.85"
        />
        <path
          d="M 0 325 Q 140 345 280 325 T 480 315 L 480 360 L 0 360 Z"
          fill="#1c4535"
          opacity="0.9"
        />
      </svg>

      {/* Top Left Legend Box (Matching Figma VEGETATION SIGNAL) */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        background: 'rgba(12, 16, 14, 0.9)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '3px',
        padding: '10px 14px',
        fontSize: '8px',
        letterSpacing: '0.18em',
        color: '#c5a059',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        <div style={{ fontWeight: 600, marginBottom: '6px' }}>VEGETATION SIGNAL</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8fa996', marginBottom: '3px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#153e28', display: 'inline-block' }} />
          <span>MORE CANOPY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c5a059' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#51684c', display: 'inline-block' }} />
          <span>LESS CANOPY</span>
        </div>
      </div>

      {/* Active District Tooltip Tag (Matching Figma East Works pill) */}
      {activeDistrict && (
        <div style={{
          position: 'absolute',
          right: '24px',
          top: '38%',
          background: 'rgba(14, 18, 16, 0.95)',
          border: '1px solid #d4af37',
          borderRadius: '3px',
          padding: '6px 10px',
          fontSize: '11px',
          color: '#f4ede2',
          fontFamily: "'Cinzel', Georgia, serif",
          boxShadow: '0 6px 16px rgba(0,0,0,0.7)',
          pointerEvents: 'none'
        }}>
          <div>{activeDistrict.name}</div>
          <div style={{ fontSize: '9px', color: '#58d68d', marginTop: '2px', fontFamily: 'sans-serif' }}>
            {activeDistrict.canopyPct}% Canopy · {activeDistrict.temp}
          </div>
        </div>
      )}

      {/* Bottom Coordinates (Matching Figma: 28.6139° N, 77.2090° E) */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '16px',
        fontSize: '9px',
        letterSpacing: '0.12em',
        color: 'rgba(244, 237, 226, 0.65)',
        fontFamily: 'monospace'
      }}>
        28.6139° N<br />77.2090° E
      </div>
    </div>
  );
};
