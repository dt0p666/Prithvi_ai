import React, { useState } from 'react';
import { ArrowLeftRight, AlertCircle, TrendingDown, TrendingUp, Info } from 'lucide-react';

interface Archetype {
  id: string;
  name: string;
  category: string;
  temp: number;
  greenness: number;
  aqi: number;
  energy: number;
  density: number;
  health: number;
  description: string;
}

const ARCHETYPES: Record<string, Archetype> = {
  urban_core: {
    id: 'urban_core',
    name: 'High-Density Concrete Core',
    category: 'Urban Fabric',
    temp: 34.6,
    greenness: 9.8,
    aqi: 178,
    energy: 44200,
    density: 9400,
    health: 44.2,
    description: 'Paved surfaces, minimal vegetative shade, intense anthropogenic heat release.'
  },
  industrial_belt: {
    id: 'industrial_belt',
    name: 'Heavy Industrial Belt',
    category: 'Industrial',
    temp: 32.8,
    greenness: 13.5,
    aqi: 192,
    energy: 48500,
    density: 6800,
    health: 46.8,
    description: 'High energy consumption, elevated particulates, severe heat-retaining tarmac.'
  },
  green_canopy: {
    id: 'green_canopy',
    name: 'Regenerative Forest Canopy',
    category: 'Green Space',
    temp: 21.2,
    greenness: 54.8,
    aqi: 38,
    energy: 9800,
    density: 1800,
    health: 9.4,
    description: 'Expansive tree canopy, natural evapotranspiration cooling, low particulate index.'
  },
  waterfront: {
    id: 'waterfront',
    name: 'Riparian Buffer Zone',
    category: 'Water / Wetland',
    temp: 24.1,
    greenness: 42.1,
    aqi: 62,
    energy: 16500,
    density: 3200,
    health: 14.8,
    description: 'Thermal inertia from open water body with mixed shoreline vegetation.'
  }
};

export const HistoricalComparisonPage: React.FC = () => {
  const [nodeA, setNodeA] = useState<string>('urban_core');
  const [nodeB, setNodeB] = useState<string>('green_canopy');

  const archA = ARCHETYPES[nodeA];
  const archB = ARCHETYPES[nodeB];

  const tempDelta = archB.temp - archA.temp;
  const greenDelta = archB.greenness - archA.greenness;
  const aqiDelta = archB.aqi - archA.aqi;
  const healthDelta = archB.health - archA.health;

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      backgroundColor: '#0c0a07',
      padding: '2.5rem 3rem',
      color: '#e2d7c5'
    }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.28em',
          color: '#9e855c',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          COMPARATIVE MICROCLIMATE ATLAS
        </div>
        <h1 style={{
          fontSize: '2.4rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: '#f4ede2',
          letterSpacing: '0.04em',
          margin: 0
        }}>
          Then / Now · Comparative Analysis
        </h1>
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: '#998a76',
          fontSize: '0.9rem',
          marginTop: '0.4rem',
          maxWidth: '750px'
        }}>
          Compare contrasting urban and environmental conditions. Because the verified Kaggle dataset is cross-sectional without longitudinal timestamps, this view contrasts empirical land-cover regimes and microclimate deltas rather than fabricated historical timelines.
        </p>
      </div>

      {/* Honest Scientific Limitation Notice */}
      <div style={{
        background: '#16110a',
        border: '1px solid #36281a',
        borderRadius: '6px',
        padding: '0.85rem 1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.8rem',
        color: '#c5a059',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        <AlertCircle size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>Provenance Transparency:</strong> Original dataset does not contain historical time-series or multi-year satellite passes. All comparative figures reflect cross-sectional differences across modeled urban archetypes.
        </div>
      </div>

      {/* Synchronized Archetype Selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '1.5rem',
        alignItems: 'center',
        marginBottom: '2rem'
      }} className="grid-cols-1 md:grid-cols-[1fr_auto_1fr]">

        {/* Node A Selection */}
        <div style={{
          background: '#140f0a',
          border: '1px solid #281e14',
          borderRadius: '6px',
          padding: '1.25rem'
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            color: '#9e855c',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            CONDITION A (BASELINE / "THEN")
          </label>
          <select
            value={nodeA}
            onChange={(e) => setNodeA(e.target.value)}
            style={{
              width: '100%',
              background: '#1f1811',
              border: '1px solid #3d2d1e',
              color: '#f4ede2',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.88rem',
              fontFamily: "'Cinzel', Georgia, serif",
              outline: 'none'
            }}
          >
            {Object.values(ARCHETYPES).map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.category})</option>
            ))}
          </select>
        </div>

        {/* Central Swap Icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
          color: '#d4af37'
        }}>
          <ArrowLeftRight size={24} />
        </div>

        {/* Node B Selection */}
        <div style={{
          background: '#140f0a',
          border: '1px solid #281e14',
          borderRadius: '6px',
          padding: '1.25rem'
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            color: '#9e855c',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            CONDITION B (CONTRAST / "NOW")
          </label>
          <select
            value={nodeB}
            onChange={(e) => setNodeB(e.target.value)}
            style={{
              width: '100%',
              background: '#1f1811',
              border: '1px solid #3d2d1e',
              color: '#f4ede2',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.88rem',
              fontFamily: "'Cinzel', Georgia, serif",
              outline: 'none'
            }}
          >
            {Object.values(ARCHETYPES).map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.category})</option>
            ))}
          </select>
        </div>

      </div>

      {/* Side-by-Side Comparison Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }} className="grid-cols-1 md:grid-cols-2">

        {/* Card A */}
        <div style={{
          background: 'radial-gradient(ellipse at top left, #1a130c, #110d08)',
          border: '1px solid #33261a',
          borderRadius: '6px',
          padding: '1.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#887762', textTransform: 'uppercase' }}>
                {archA.category}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontFamily: "'Cinzel', Georgia, serif", color: '#f4ede2', margin: '4px 0' }}>
                {archA.name}
              </h2>
            </div>
            <div style={{
              fontSize: '2.2rem',
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              color: archA.temp > 30 ? '#e74c3c' : '#58d68d'
            }}>
              {archA.temp.toFixed(1)}°C
            </div>
          </div>
          <p style={{
            fontSize: '0.82rem',
            color: '#8b7a66',
            marginTop: '0.5rem',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            {archA.description}
          </p>

          <div style={{
            marginTop: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: '0.85rem'
          }}>
            <div style={{ background: '#16110a', border: '1px solid #231b14', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: '#7a6b57' }}>CANOPY COVER</div>
              <div style={{ color: '#58d68d', fontWeight: 600, fontSize: '1.05rem', marginTop: '2px' }}>{archA.greenness}%</div>
            </div>
            <div style={{ background: '#16110a', border: '1px solid #231b14', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: '#7a6b57' }}>AIR QUALITY (AQI)</div>
              <div style={{ color: '#e6c875', fontWeight: 600, fontSize: '1.05rem', marginTop: '2px' }}>{archA.aqi}</div>
            </div>
            <div style={{ background: '#16110a', border: '1px solid #231b14', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: '#7a6b57' }}>ENERGY USAGE</div>
              <div style={{ color: '#f4ede2', fontWeight: 600, fontSize: '1.05rem', marginTop: '2px' }}>{archA.energy.toLocaleString()} kWh</div>
            </div>
            <div style={{ background: '#16110a', border: '1px solid #231b14', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: '#7a6b57' }}>HEALTH IMPACT</div>
              <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: '1.05rem', marginTop: '2px' }}>{archA.health} /100k</div>
            </div>
          </div>
        </div>

        {/* Card B */}
        <div style={{
          background: 'radial-gradient(ellipse at top left, #1a130c, #110d08)',
          border: '1px solid #33261a',
          borderRadius: '6px',
          padding: '1.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#887762', textTransform: 'uppercase' }}>
                {archB.category}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontFamily: "'Cinzel', Georgia, serif", color: '#f4ede2', margin: '4px 0' }}>
                {archB.name}
              </h2>
            </div>
            <div style={{
              fontSize: '2.2rem',
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              color: archB.temp > 30 ? '#e74c3c' : '#58d68d'
            }}>
              {archB.temp.toFixed(1)}°C
            </div>
          </div>
          <p style={{
            fontSize: '0.82rem',
            color: '#8b7a66',
            marginTop: '0.5rem',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            {archB.description}
          </p>

          <div style={{
            marginTop: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: '0.85rem'
          }}>
            <div style={{ background: '#16110a', border: '1px solid #231b14', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: '#7a6b57' }}>CANOPY COVER</div>
              <div style={{ color: '#58d68d', fontWeight: 600, fontSize: '1.05rem', marginTop: '2px' }}>{archB.greenness}%</div>
            </div>
            <div style={{ background: '#16110a', border: '1px solid #231b14', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: '#7a6b57' }}>AIR QUALITY (AQI)</div>
              <div style={{ color: '#e6c875', fontWeight: 600, fontSize: '1.05rem', marginTop: '2px' }}>{archB.aqi}</div>
            </div>
            <div style={{ background: '#16110a', border: '1px solid #231b14', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: '#7a6b57' }}>ENERGY USAGE</div>
              <div style={{ color: '#f4ede2', fontWeight: 600, fontSize: '1.05rem', marginTop: '2px' }}>{archB.energy.toLocaleString()} kWh</div>
            </div>
            <div style={{ background: '#16110a', border: '1px solid #231b14', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: '#7a6b57' }}>HEALTH IMPACT</div>
              <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: '1.05rem', marginTop: '2px' }}>{archB.health} /100k</div>
            </div>
          </div>
        </div>

      </div>

      {/* DELTA SUMMARY BAR */}
      <div style={{
        background: '#151009',
        border: '1px solid #3d2d1e',
        borderRadius: '6px',
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        textAlign: 'center',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }} className="grid-cols-2 md:grid-cols-4">
        <div>
          <div style={{ fontSize: '0.72rem', color: '#887762', textTransform: 'uppercase' }}>TEMPERATURE DELTA</div>
          <div style={{
            fontSize: '1.5rem',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            marginTop: '4px',
            color: tempDelta <= 0 ? '#58d68d' : '#e74c3c'
          }}>
            {tempDelta > 0 ? `+${tempDelta.toFixed(1)}°C` : `${tempDelta.toFixed(1)}°C`}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: '#887762', textTransform: 'uppercase' }}>CANOPY EXPANSION</div>
          <div style={{
            fontSize: '1.5rem',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            marginTop: '4px',
            color: greenDelta >= 0 ? '#58d68d' : '#e74c3c'
          }}>
            {greenDelta > 0 ? `+${greenDelta.toFixed(1)}%` : `${greenDelta.toFixed(1)}%`}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: '#887762', textTransform: 'uppercase' }}>AQI DIFFERENCE</div>
          <div style={{
            fontSize: '1.5rem',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            marginTop: '4px',
            color: aqiDelta <= 0 ? '#58d68d' : '#e74c3c'
          }}>
            {aqiDelta > 0 ? `+${aqiDelta}` : `${aqiDelta}`}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: '#887762', textTransform: 'uppercase' }}>MORTALITY BURDEN</div>
          <div style={{
            fontSize: '1.5rem',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            marginTop: '4px',
            color: healthDelta <= 0 ? '#58d68d' : '#e74c3c'
          }}>
            {healthDelta > 0 ? `+${healthDelta.toFixed(1)}` : `${healthDelta.toFixed(1)}`}
          </div>
        </div>
      </div>
    </div>
  );
};
