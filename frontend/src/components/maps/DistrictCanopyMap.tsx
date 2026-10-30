import React, { useState } from 'react';
import { Sliders, Sparkles, ShieldCheck, Thermometer, Trees, Info } from 'lucide-react';

interface District {
  id: string;
  name: string;
  baseCanopyPct: number;
  baseTempC: number;
  path: string;
  labelPos: { x: number; y: number };
  baseFill: string;
  coolerFill: string;
  areaKm2: number;
  populationEstimate: number;
}

const DISTRICTS: District[] = [
  {
    id: 'river_ward',
    name: 'RIVER WARD',
    baseCanopyPct: 48.5,
    baseTempC: 26.8,
    path: 'M 30 50 L 170 80 L 140 180 L 40 160 Z',
    labelPos: { x: 95, y: 110 },
    baseFill: '#153e28',
    coolerFill: '#0b2e1b',
    areaKm2: 14.2,
    populationEstimate: 142000
  },
  {
    id: 'old_market',
    name: 'OLD MARKET',
    baseCanopyPct: 32.0,
    baseTempC: 30.4,
    path: 'M 170 80 L 290 120 L 260 210 L 140 180 Z',
    labelPos: { x: 215, y: 145 },
    baseFill: '#245938',
    coolerFill: '#143d24',
    areaKm2: 18.6,
    populationEstimate: 310000
  },
  {
    id: 'east_works',
    name: 'EAST WORKS',
    baseCanopyPct: 14.8,
    baseTempC: 34.9,
    path: 'M 290 120 L 440 150 L 390 260 L 260 210 Z',
    labelPos: { x: 345, y: 180 },
    baseFill: '#51684c',
    coolerFill: '#1d4830',
    areaKm2: 24.1,
    populationEstimate: 485000
  },
  {
    id: 'south_commons',
    name: 'SOUTH COMMONS',
    baseCanopyPct: 58.2,
    baseTempC: 24.2,
    path: 'M 40 160 L 140 180 L 260 210 L 390 260 L 350 340 L 50 320 Z',
    labelPos: { x: 210, y: 275 },
    baseFill: '#103420',
    coolerFill: '#082114',
    areaKm2: 36.8,
    populationEstimate: 215000
  }
];

export const DistrictCanopyMap: React.FC = () => {
  const [activeDistrictId, setActiveDistrictId] = useState<string>('east_works');
  const [canopyAddPct, setCanopyAddPct] = useState<number>(15); // +15% intervention default

  const activeDistrict = DISTRICTS.find((d) => d.id === activeDistrictId) || DISTRICTS[2];

  // Dynamic calculations based on canopy addition
  // LightGBM physical correlation shows ~0.12°C cooling per 1% canopy gain
  const currentCanopy = Math.min(85, Math.round((activeDistrict.baseCanopyPct + canopyAddPct) * 10) / 10);
  const coolingDelta = Math.round(canopyAddPct * 0.12 * 10) / 10;
  const currentTemp = Math.round((activeDistrict.baseTempC - coolingDelta) * 10) / 10;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      width: '100%',
      maxWidth: '560px'
    }}>
      {/* Interactive Map Canvas Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '380px',
        background: '#0d120f',
        border: '1px solid var(--border-accent)',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 18px 45px rgba(0,0,0,0.55)',
        userSelect: 'none'
      }}>
        {/* Background microclimate grid pattern */}
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
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dashed Transit / Air Corridor Arcs */}
          <path d="M 10 240 Q 240 190 470 120" fill="none" stroke="rgba(244, 237, 226, 0.28)" strokeWidth="1.2" strokeDasharray="3 4" />
          <path d="M 120 40 Q 210 220 320 350" fill="none" stroke="rgba(244, 237, 226, 0.28)" strokeWidth="1.2" strokeDasharray="3 4" />

          {/* Districts */}
          {DISTRICTS.map((d) => {
            const isActive = activeDistrictId === d.id;
            // Interpolate color when intervention is active
            const fillColor = canopyAddPct > 0 ? d.coolerFill : d.baseFill;

            return (
              <g
                key={d.id}
                onClick={() => setActiveDistrictId(d.id)}
                onMouseEnter={() => setActiveDistrictId(d.id)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={d.path}
                  fill={fillColor}
                  stroke={isActive ? '#e6c875' : '#2d4b38'}
                  strokeWidth={isActive ? 2.5 : 1}
                  filter={isActive ? 'url(#goldGlow)' : undefined}
                  style={{
                    transition: 'fill 0.4s ease, stroke 0.2s ease, stroke-width 0.2s ease',
                    transformOrigin: `${d.labelPos.x}px ${d.labelPos.y}px`,
                    transform: isActive ? 'scale(1.008)' : 'scale(1)'
                  }}
                />

                {/* District Label */}
                <text
                  x={d.labelPos.x}
                  y={d.labelPos.y}
                  fill={isActive ? '#f4ede2' : '#8fa996'}
                  fontSize="9.5"
                  fontFamily="'Cinzel', Georgia, serif"
                  fontWeight={isActive ? 700 : 500}
                  letterSpacing="1.4"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none', transition: 'fill 0.2s ease' }}
                >
                  {d.name}
                </text>

                {/* Center Indicator Beacon */}
                <circle
                  cx={d.labelPos.x}
                  cy={d.labelPos.y + 12}
                  r={isActive ? 3.5 : 2}
                  fill={isActive ? '#e6c875' : '#8fa996'}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {isActive && (
                  <circle
                    cx={d.labelPos.x}
                    cy={d.labelPos.y + 12}
                    r="8"
                    fill="none"
                    stroke="#e6c875"
                    strokeWidth="0.8"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}

          {/* River Waves along base (Figma aesthetic) */}
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
          background: 'rgba(12, 16, 14, 0.92)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '4px',
          padding: '10px 14px',
          fontSize: '8.5px',
          letterSpacing: '0.18em',
          color: '#c5a059',
          backdropFilter: 'blur(6px)',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          <div style={{ fontWeight: 600, marginBottom: '6px' }}>VEGETATION SIGNAL</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8fa996', marginBottom: '3px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#153e28', display: 'inline-block' }} />
            <span>MORE CANOPY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c5a059' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#51684c', display: 'inline-block' }} />
            <span>LESS CANOPY</span>
          </div>
        </div>

        {/* Dynamic Tooltip Pill (Matching Figma: EAST WORKS 14.8% Canopy · 34.9°C) */}
        {activeDistrict && (
          <div style={{
            position: 'absolute',
            left: `${Math.min(380, Math.max(20, (activeDistrict.labelPos.x / 480) * 100))}%`,
            top: `${Math.min(70, Math.max(15, (activeDistrict.labelPos.y / 360) * 100 - 18))}%`,
            transform: 'translate(-30%, -50%)',
            background: 'rgba(14, 18, 16, 0.96)',
            border: '1px solid #d4af37',
            borderRadius: '4px',
            padding: '7px 12px',
            fontSize: '11px',
            color: '#f4ede2',
            fontFamily: "'Cinzel', Georgia, serif",
            boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap'
          }}>
            <div style={{ fontWeight: 700, letterSpacing: '0.08em' }}>{activeDistrict.name}</div>
            <div style={{ fontSize: '9.5px', color: '#58d68d', marginTop: '2px', fontFamily: 'sans-serif', display: 'flex', gap: '8px' }}>
              <span>{currentCanopy}% Canopy</span>
              <span>·</span>
              <span style={{ color: canopyAddPct > 0 ? '#68d391' : '#f4ede2' }}>{currentTemp}°C</span>
              {canopyAddPct > 0 && (
                <span style={{ color: '#68d391', fontWeight: 600 }}>(-{coolingDelta}°C)</span>
              )}
            </div>
          </div>
        )}

        {/* Bottom Coordinates & Live Status (Matching Figma: 28.6139° N, 77.2090° E) */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          fontSize: '9.5px',
          letterSpacing: '0.12em',
          color: 'rgba(244, 237, 226, 0.65)',
          fontFamily: 'monospace',
          lineHeight: 1.4
        }}>
          28.6139° N<br />77.2090° E
        </div>

        {/* Live Click Hint */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '16px',
          fontSize: '9px',
          letterSpacing: '0.14em',
          color: 'var(--gold-primary)',
          fontFamily: "'Cinzel', serif"
        }}>
          CLICK DISTRICT TO INSPECT
        </div>
      </div>

      {/* Interactive Microclimate Intervention Slider Bar */}
      <div style={{
        background: 'rgba(20, 26, 22, 0.85)',
        border: '1px solid var(--border-accent)',
        borderRadius: '6px',
        padding: '12px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: 'var(--text-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trees size={14} color="#58d68d" />
            <span style={{ fontWeight: 600 }}>CANOPY EXPANSION SIMULATION:</span>
            <span style={{ color: '#58d68d', fontWeight: 700 }}>+{canopyAddPct}% VEGETATION</span>
          </div>
          <div style={{ color: '#68d391', fontSize: '0.72rem', letterSpacing: '0.06em' }}>
            {coolingDelta > 0 ? `COOLING: -${coolingDelta}°C` : 'BASELINE CONDITIONS'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>0%</span>
          <input
            type="range"
            min="0"
            max="40"
            step="5"
            value={canopyAddPct}
            onChange={(e) => setCanopyAddPct(Number(e.target.value))}
            style={{
              flex: 1,
              accentColor: '#58d68d',
              cursor: 'pointer',
              height: '4px'
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+40%</span>
        </div>

        {/* Live Ward Telemetry Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginTop: '4px',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {DISTRICTS.map((d) => {
            const isSel = d.id === activeDistrictId;
            const distCanopy = Math.min(85, Math.round((d.baseCanopyPct + canopyAddPct) * 10) / 10);
            const distTemp = Math.round((d.baseTempC - coolingDelta) * 10) / 10;

            return (
              <button
                key={d.id}
                onClick={() => setActiveDistrictId(d.id)}
                style={{
                  background: isSel ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.2)',
                  border: isSel ? '1px solid var(--gold-primary)' : '1px solid transparent',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  fontSize: '8px',
                  color: isSel ? 'var(--gold-primary)' : 'var(--text-secondary)',
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {d.name}
                </div>
                <div style={{ fontSize: '11px', color: '#f4ede2', fontWeight: 700, marginTop: '2px' }}>
                  {distTemp}°C
                </div>
                <div style={{ fontSize: '9px', color: '#58d68d' }}>
                  {distCanopy}% canopy
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
