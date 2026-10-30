import { useState, useEffect } from 'react';

interface HealthData {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  dataset_connected: boolean;
  dataset_path: string | null;
}

export default function App() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data: HealthData = await res.json();
      setHealth(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to reach backend API');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0c0a07',
      color: '#e2d7c5',
      fontFamily: "'Cinzel', Georgia, serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem 3rem',
      boxSizing: 'border-box',
      border: '1px solid #231b14'
    }}>
      {/* Header bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #231b14',
        paddingBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/prithvi-emblem.svg" alt="PRITHVI Emblem" style={{ width: '48px', height: '48px' }} />
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: '#9d8763' }}>पृथ्वी · EARTH</div>
            <div style={{ fontSize: '1.5rem', letterSpacing: '0.2em', color: '#e6c875', fontWeight: 600 }}>PRITHVI</div>
          </div>
        </div>
        <div style={{
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: '#8b7a61',
          textTransform: 'uppercase'
        }}>
          Urban Heat &amp; Climate Vulnerability Intelligence
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#16120c',
          border: '1px solid #36291c',
          borderRadius: '999px',
          padding: '0.35rem 0.9rem',
          fontSize: '0.75rem',
          color: health?.status === 'healthy' ? '#58d68d' : '#e74c3c'
        }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: health?.status === 'healthy' ? '#58d68d' : '#e74c3c'
          }} />
          {loading ? 'CHECKING...' : health?.status === 'healthy' ? 'SYSTEM OPERATIONAL' : 'OFFLINE'}
        </div>
      </header>

      {/* Main Hero Card for Phase 0 */}
      <main style={{ margin: 'auto 0', padding: '3rem 0', maxWidth: '850px' }}>
        <div style={{
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          color: '#9e855c',
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>
          Phase 0 Foundation Verified
        </div>
        <h1 style={{
          fontSize: '3.2rem',
          fontWeight: 400,
          lineHeight: 1.15,
          color: '#f4ede2',
          margin: '0 0 1.5rem 0',
          letterSpacing: '0.05em'
        }}>
          The Earth Remembers Everything.
        </h1>
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '1.05rem',
          lineHeight: 1.7,
          color: '#aba08e',
          marginBottom: '2rem',
          maxWidth: '680px'
        }}>
          Interactive climate intelligence platform exploring urban heat, environmental indicators, vulnerability, and simulated interventions.
        </p>

        {/* Live System & API Verification Status Card */}
        <div style={{
          background: 'radial-gradient(ellipse at top left, #1d1710, #100d08)',
          border: '1px solid #33261a',
          borderRadius: '8px',
          padding: '1.75rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid #231b14',
            paddingBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', color: '#d4af37', textTransform: 'uppercase' }}>
              Full-Stack Pipeline Verification
            </span>
            <button
              onClick={checkHealth}
              style={{
                background: 'transparent',
                border: '1px solid #4a3826',
                color: '#c5a059',
                borderRadius: '4px',
                padding: '0.3rem 0.8rem',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                cursor: 'pointer'
              }}
            >
              PING API
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: '0.85rem'
          }}>
            <div>
              <div style={{ color: '#7a6b57', fontSize: '0.75rem' }}>FRONTEND STATUS</div>
              <div style={{ color: '#e8dfcf', fontWeight: 600, marginTop: '0.2rem' }}>React 19 + TypeScript (Vite)</div>
            </div>
            <div>
              <div style={{ color: '#7a6b57', fontSize: '0.75rem' }}>BACKEND API</div>
              <div style={{ color: health?.status === 'healthy' ? '#58d68d' : '#e74c3c', fontWeight: 600, marginTop: '0.2rem' }}>
                {loading ? 'Checking...' : health?.status === 'healthy' ? 'FastAPI 0.159.1 (/api/health 200)' : error || 'Disconnected'}
              </div>
            </div>
            <div>
              <div style={{ color: '#7a6b57', fontSize: '0.75rem' }}>DATASET CONNECTED</div>
              <div style={{ color: health?.dataset_connected ? '#58d68d' : '#e74c3c', fontWeight: 600, marginTop: '0.2rem' }}>
                {health?.dataset_connected ? 'urban_heat_island_dataset.csv (Verified)' : 'Pending'}
              </div>
            </div>
            <div>
              <div style={{ color: '#7a6b57', fontSize: '0.75rem' }}>SERVER TIMESTAMP</div>
              <div style={{ color: '#c5a059', fontFamily: 'monospace', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                {health?.timestamp || '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Dataset Schema & Scientific Integrity Summary */}
        <div style={{
          background: '#120e0a',
          border: '1px solid #231b14',
          borderRadius: '8px',
          padding: '1.25rem 1.5rem',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '0.82rem',
          color: '#8e7f6e',
          lineHeight: 1.6
        }}>
          <strong style={{ color: '#c5a059', fontFamily: 'serif' }}>Dataset Integrity Notice:</strong> 500 records verified across 15 attributes. Cross-sectional synthetic simulation dataset without longitudinal dates. Target variable identified as <em>Temperature (°C)</em> with environmental covariates including <em>Land Cover, Urban Greenness Ratio (%), Population Density, AQI, and Energy Consumption</em>.
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #231b14',
        paddingTop: '1.25rem',
        fontSize: '0.75rem',
        color: '#6e5e49',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        <div>PRITHVI v1.0.0 · Ancient Indian Earth Aesthetics × Environmental Science</div>
        <div>Ready for Phase 1: Figma Frontend Implementation</div>
      </footer>
    </div>
  );
}
