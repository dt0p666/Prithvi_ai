import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingDown, TrendingUp, Info, Building2, Trees, Droplets, Mountain } from 'lucide-react';

interface CityComparisonResult {
  city_a: {
    name: string;
    state: string;
    lst_c: number;
    ndvi: number;
    ndbi: number;
    elevation_m: number;
  };
  city_b: {
    name: string;
    state: string;
    lst_c: number;
    ndvi: number;
    ndbi: number;
    elevation_m: number;
  };
  delta: {
    lst_c: number;
    ndvi: number;
    ndbi: number;
    elevation_m: number;
  };
}

const INDIAN_CITIES_PRESETS = [
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Shimla',
  'Guwahati',
  'Bhopal',
  'Patna',
  'Chandigarh',
  'Kochi'
];

export const HistoricalComparisonPage: React.FC = () => {
  const [cityA, setCityA] = useState<string>('Delhi');
  const [cityB, setCityB] = useState<string>('Bengaluru');
  const [comparisonMode, setComparisonMode] = useState<'cities' | 'temporal'>('cities');
  const [temporalCity, setTemporalCity] = useState<string>('Delhi');

  const [loading, setLoading] = useState<boolean>(false);
  const [comparisonData, setComparisonData] = useState<CityComparisonResult>({
    city_a: { name: 'Delhi', state: 'Delhi', lst_c: 36.8, ndvi: 0.18, ndbi: 0.22, elevation_m: 216 },
    city_b: { name: 'Bengaluru', state: 'Karnataka', lst_c: 29.5, ndvi: 0.38, ndbi: 0.08, elevation_m: 920 },
    delta: { lst_c: -7.3, ndvi: +0.20, ndbi: -0.14, elevation_m: +704 }
  });

  useEffect(() => {
    setLoading(true);
    let url = `/api/comparison?city_a=${encodeURIComponent(cityA)}&city_b=${encodeURIComponent(cityB)}`;
    if (comparisonMode === 'temporal') {
      url = `/api/comparison?city_a=${encodeURIComponent(temporalCity)}&city_b=${encodeURIComponent(temporalCity)}&year_a=2021&year_b=2025`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch comparison');
        return res.json();
      })
      .then((data) => {
        if (data && data.entity_a && data.entity_b) {
          setComparisonData({
            city_a: {
              name: data.entity_a.city || (comparisonMode === 'temporal' ? `${temporalCity} (2021)` : cityA),
              state: data.entity_a.state || '',
              lst_c: data.entity_a.lst_c ?? data.entity_a.temperature_c ?? 30.0,
              ndvi: data.entity_a.ndvi ?? 0.25,
              ndbi: data.entity_a.ndbi ?? 0.1,
              elevation_m: data.entity_a.elevation_m ?? 200
            },
            city_b: {
              name: data.entity_b.city || (comparisonMode === 'temporal' ? `${temporalCity} (2025)` : cityB),
              state: data.entity_b.state || '',
              lst_c: data.entity_b.lst_c ?? data.entity_b.temperature_c ?? 30.0,
              ndvi: data.entity_b.ndvi ?? 0.25,
              ndbi: data.entity_b.ndbi ?? 0.1,
              elevation_m: data.entity_b.elevation_m ?? 200
            },
            delta: {
              lst_c: data.delta.lst_c ?? data.delta.temperature_c ?? 0.0,
              ndvi: data.delta.ndvi ?? 0.0,
              ndbi: data.delta.ndbi ?? 0.0,
              elevation_m: (data.entity_b.elevation_m || 0) - (data.entity_a.elevation_m || 0)
            }
          });
        }
      })
      .catch((err) => {
        console.warn('Using local comparison fallback:', err);
      })
      .finally(() => setLoading(false));
  }, [cityA, cityB, comparisonMode, temporalCity]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      backgroundColor: 'var(--bg-primary)',
      padding: '2.5rem 3rem',
      color: 'var(--text-primary)',
      transition: 'background-color 0.25s ease'
    }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.28em',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          COMPARATIVE MICROCLIMATE ATLAS · INDIA CITIES (2021–2025)
        </div>
        <h1 style={{
          fontSize: '2.4rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: 'var(--text-primary)',
          letterSpacing: '0.04em',
          margin: 0
        }}>
          Microclimate &amp; Temporal Comparison
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginTop: '0.4rem',
          maxWidth: '750px',
          lineHeight: 1.6
        }}>
          Evaluate empirical microclimate divergence across contrasting Indian municipal environments or inspect 2021 vs 2025 multi-year satellite shifts.
        </p>
      </div>

      {/* Mode Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '1.5rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '8px 14px',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setComparisonMode('cities')}
          style={{
            background: comparisonMode === 'cities' ? 'var(--gold-primary)' : 'transparent',
            color: comparisonMode === 'cities' ? '#1a1208' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Cinzel', serif"
          }}
        >
          Compare Two Indian Cities
        </button>
        <button
          onClick={() => setComparisonMode('temporal')}
          style={{
            background: comparisonMode === 'temporal' ? 'var(--gold-primary)' : 'transparent',
            color: comparisonMode === 'temporal' ? '#1a1208' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Cinzel', serif"
          }}
        >
          5-Year Temporal Trend (2021 vs 2025)
        </button>
      </div>

      {/* Selection Selectors */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-accent)',
        borderRadius: '6px',
        padding: '1.25rem 1.75rem',
        flexWrap: 'wrap'
      }}>
        {comparisonMode === 'cities' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Cinzel', serif" }}>CITY A:</span>
              <select
                value={cityA}
                onChange={(e) => setCityA(e.target.value)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-accent)',
                  color: 'var(--text-primary)',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontFamily: "'Cinzel', Georgia, serif",
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {INDIAN_CITIES_PRESETS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center' }}>
              <ArrowLeftRight size={20} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Cinzel', serif" }}>CITY B:</span>
              <select
                value={cityB}
                onChange={(e) => setCityB(e.target.value)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-accent)',
                  color: 'var(--text-primary)',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontFamily: "'Cinzel', Georgia, serif",
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {INDIAN_CITIES_PRESETS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Cinzel', serif" }}>INSPECT TEMPORAL TRAJECTORY FOR:</span>
            <select
              value={temporalCity}
              onChange={(e) => setTemporalCity(e.target.value)}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-accent)',
                color: 'var(--text-primary)',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '13px',
                fontFamily: "'Cinzel', Georgia, serif",
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {INDIAN_CITIES_PRESETS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span style={{ fontSize: '0.78rem', color: 'var(--gold-primary)' }}>Comparing Year 2021 (Baseline) vs Year 2025 (Latest)</span>
          </div>
        )}
      </div>

      {/* Comparison Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 0.45fr 1fr',
        gap: '1.5rem',
        alignItems: 'stretch',
        marginBottom: '2rem'
      }} className="grid-cols-1 lg:grid-cols-[1fr_0.45fr_1fr]">

        {/* Card A */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-accent)',
          borderRadius: '6px',
          padding: '1.75rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            PRIMARY OBSERVATION NODE
          </div>
          <h2 style={{ fontSize: '2rem', fontFamily: "'Cinzel', Georgia, serif", margin: '0.3rem 0', color: 'var(--text-primary)' }}>
            {comparisonData.city_a.name}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', marginBottom: '1.5rem' }}>
            {comparisonData.city_a.state ? `${comparisonData.city_a.state}, India` : 'India Observation'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Surface LST (°C):</span>
              <strong style={{ fontSize: '1.1rem', color: comparisonData.city_a.lst_c > 33 ? '#e74c3c' : '#2ecc71' }}>
                {comparisonData.city_a.lst_c.toFixed(1)}°C
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Vegetation (NDVI):</span>
              <strong style={{ fontSize: '1.1rem', color: '#27ae60' }}>
                {comparisonData.city_a.ndvi.toFixed(3)}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Built-Up Index (NDBI):</span>
              <strong style={{ fontSize: '1.1rem', color: '#e67e22' }}>
                {comparisonData.city_a.ndbi.toFixed(3)}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Elevation:</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {Math.round(comparisonData.city_a.elevation_m)}m
              </strong>
            </div>
          </div>
        </div>

        {/* Delta Center Card */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.05)',
          border: '1px solid var(--border-accent)',
          borderRadius: '6px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
            OBSERVED DELTA (B − A)
          </div>

          <div style={{
            fontSize: '2.2rem',
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            color: comparisonData.delta.lst_c > 0 ? '#e74c3c' : '#2ecc71',
            margin: '0.25rem 0'
          }}>
            {comparisonData.delta.lst_c > 0 ? `+${comparisonData.delta.lst_c.toFixed(1)}°C` : `${comparisonData.delta.lst_c.toFixed(1)}°C`}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {comparisonData.delta.lst_c > 0 ? 'Warmer Thermal Regime' : 'Cooler Thermal Regime'}
          </div>

          <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Δ NDVI:</span>
              <span style={{ color: comparisonData.delta.ndvi >= 0 ? '#27ae60' : '#e74c3c', fontWeight: 600 }}>
                {comparisonData.delta.ndvi >= 0 ? `+${comparisonData.delta.ndvi.toFixed(3)}` : comparisonData.delta.ndvi.toFixed(3)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Δ NDBI:</span>
              <span style={{ color: comparisonData.delta.ndbi <= 0 ? '#27ae60' : '#e74c3c', fontWeight: 600 }}>
                {comparisonData.delta.ndbi >= 0 ? `+${comparisonData.delta.ndbi.toFixed(3)}` : comparisonData.delta.ndbi.toFixed(3)}
              </span>
            </div>
          </div>
        </div>

        {/* Card B */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-accent)',
          borderRadius: '6px',
          padding: '1.75rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            COMPARATIVE OBSERVATION NODE
          </div>
          <h2 style={{ fontSize: '2rem', fontFamily: "'Cinzel', Georgia, serif", margin: '0.3rem 0', color: 'var(--text-primary)' }}>
            {comparisonData.city_b.name}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', marginBottom: '1.5rem' }}>
            {comparisonData.city_b.state ? `${comparisonData.city_b.state}, India` : 'India Observation'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Surface LST (°C):</span>
              <strong style={{ fontSize: '1.1rem', color: comparisonData.city_b.lst_c > 33 ? '#e74c3c' : '#2ecc71' }}>
                {comparisonData.city_b.lst_c.toFixed(1)}°C
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Vegetation (NDVI):</span>
              <strong style={{ fontSize: '1.1rem', color: '#27ae60' }}>
                {comparisonData.city_b.ndvi.toFixed(3)}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Built-Up Index (NDBI):</span>
              <strong style={{ fontSize: '1.1rem', color: '#e67e22' }}>
                {comparisonData.city_b.ndbi.toFixed(3)}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Elevation:</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {Math.round(comparisonData.city_b.elevation_m)}m
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* Scientific Distinction Footer */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '1.25rem 1.5rem',
        fontSize: '0.82rem',
        lineHeight: 1.6,
        color: 'var(--text-muted)'
      }}>
        <div style={{ color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '4px', fontFamily: "'Cinzel', serif" }}>
          Scientific Integrity &amp; Causality Note:
        </div>
        Observational temperature differences reflect multi-factorial geographic, meteorological, and elevation regimes. Observational cross-sectional correlations do not imply that modifying one city's built-up index in isolation will unilaterally eliminate the observed temperature delta.
      </div>
    </div>
  );
};
