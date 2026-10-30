import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Compass } from 'lucide-react';
import { CityCanvas } from '../../components/3d/CityCanvas';
import { ThermalSphereCanvas } from '../../components/3d/ThermalSphereCanvas';
import { DistrictCanopyMap } from '../../components/maps/DistrictCanopyMap';
import { FutureScenarioBlob } from '../../components/3d/FutureScenarioBlob';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>

      {/* ========================================================
          SECTION 1 / HERO: PRITHVI (Image 2)
          ======================================================== */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem 3rem',
        background: 'var(--bg-primary)',
        boxSizing: 'border-box'
      }}>
        {/* Outer Ornamental Frame (Matching Figma Framing) */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '82vh',
          border: '1px solid var(--border-accent)',
          borderRadius: '4px',
          padding: '2.5rem 3rem',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.35fr',
          alignItems: 'center',
          gap: '2.5rem',
          boxSizing: 'border-box',
          background: 'var(--bg-card)'
        }} className="grid-cols-1 lg:grid-cols-[1.05fr_1.35fr]">

          {/* Diamond Star Corner Accents (Figma ✦ ornaments) */}
          <div style={{ position: 'absolute', top: '-6px', left: '-6px', color: 'var(--gold-primary)', fontSize: '12px' }}>✦</div>
          <div style={{ position: 'absolute', top: '-6px', right: '-6px', color: 'var(--gold-primary)', fontSize: '12px' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '-6px', left: '-6px', color: 'var(--gold-primary)', fontSize: '12px' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', color: 'var(--gold-primary)', fontSize: '12px' }}>✦</div>

          {/* Left Column: Hero Story */}
          <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Category tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.68rem',
              letterSpacing: '0.3em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              fontWeight: 600
            }}>
              URBAN HEAT &amp; CLIMATE INTELLIGENCE
            </div>

            {/* Sanskrit Title (Figma: पृथ्वी · Earth) */}
            <div style={{
              fontSize: '1.05rem',
              fontFamily: "'Cinzel', Georgia, serif",
              color: 'var(--text-secondary)',
              letterSpacing: '0.2em',
              margin: '0.1rem 0 -0.5rem 0'
            }}>
              पृथ्वी · Earth
            </div>

            {/* Monumental Headline: PRITHVI */}
            <h1 style={{
              fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '0.06em',
              margin: 0,
              background: 'linear-gradient(180deg, var(--gold-light) 0%, var(--gold-primary) 65%, #6a4f1a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.5))'
            }}>
              PRITHVI
            </h1>

            {/* Subtitle */}
            <div style={{
              fontSize: 'clamp(0.9rem, 1.6vw, 1.35rem)',
              fontFamily: "'Cinzel', Georgia, serif",
              letterSpacing: '0.18em',
              color: 'var(--text-primary)',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              THE EARTH REMEMBERS EVERYTHING.
            </div>

            {/* Description */}
            <p style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: '0.92rem',
              lineHeight: 1.65,
              color: 'var(--text-muted)',
              maxWidth: '460px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              ENTER A LIVING ATLAS OF HEAT, VEGETATION AND URBAN CHANGE.
            </p>

            {/* CTA Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/explorer')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'linear-gradient(135deg, var(--gold-primary) 0%, #aa771c 100%)',
                  color: '#1a1208',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '14px 34px',
                  fontSize: '0.82rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                  transition: 'all 0.25s ease'
                }}
                className="hover:scale-105"
              >
                <span>ENTER THE ATLAS</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/scenario')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '999px',
                  padding: '13px 26px',
                  fontSize: '0.78rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  letterSpacing: '0.15em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="hover:border-[var(--gold-primary)]"
              >
                <Cpu size={14} />
                <span>SCENARIO LAB</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginTop: '1rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <div><strong style={{ color: 'var(--gold-primary)' }}>500</strong> Monitored Cities</div>
              <div>•</div>
              <div><strong style={{ color: 'var(--gold-primary)' }}>15</strong> Indicators</div>
              <div>•</div>
              <div><strong style={{ color: '#27ae60' }}>LightGBM &amp; RF</strong> Trained</div>
            </div>
          </div>

          {/* Right Column: 3D Isometric City Scene */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '520px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CityCanvas />
          </div>
        </div>
      </section>


      {/* ========================================================
          SECTION 2 / THERMAL SIGNAL: THE GROUND HOLDS THE HEAT (Image 4)
          ======================================================== */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        alignItems: 'center',
        padding: '4rem 6rem',
        background: 'radial-gradient(circle at 35% 50%, rgba(138, 60, 34, 0.15) 0%, var(--bg-primary) 70%)',
        borderTop: '1px solid var(--border-color)',
        boxSizing: 'border-box'
      }} className="grid-cols-1 lg:grid-cols-[1.1fr_1fr]">

        {/* Left: 3D Terracotta Thermal Sphere */}
        <div style={{ width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ThermalSphereCanvas />
        </div>

        {/* Right: Editorial Typography */}
        <div style={{ paddingLeft: '2rem' }}>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            maxWidth: '480px',
            marginBottom: '1.5rem',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Stone, metal and asphalt gather the day's energy long after the sun has fallen.
          </p>

          <h2 style={{
            fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '0.04em',
            margin: '0 0 2rem 0',
            color: 'var(--text-primary)'
          }}>
            THE GROUND<br />
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 600,
              color: 'var(--terracotta)'
            }}>
              HOLDS
            </span><br />
            THE HEAT.
          </h2>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid var(--border-accent)',
            borderRadius: '999px',
            padding: '6px 16px',
            fontSize: '0.78rem',
            letterSpacing: '0.12em',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--terracotta)' }} />
            <span>THERMAL RETENTION INDEX · 34.6°C OBSERVED</span>
          </div>
        </div>
      </section>


      {/* ========================================================
          SECTION 3 / LIFE RETURNS: DISTRICT CANOPY MAP (Image 5)
          ======================================================== */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr',
        alignItems: 'center',
        padding: '5rem 6rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        boxSizing: 'border-box'
      }} className="grid-cols-1 lg:grid-cols-[1fr_1.25fr]">

        {/* Left: Life Returns Typography */}
        <div>
          <div style={{
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            color: 'var(--text-secondary)',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            03 / LIFE
          </div>

          <h2 style={{
            fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '0.04em',
            margin: '0 0 1.5rem 0',
            color: 'var(--text-primary)'
          }}>
            WHERE<br />
            LIFE<br />
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 600,
              color: 'var(--terracotta)'
            }}>
              RETURNS.
            </span>
          </h2>

          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.7,
            color: 'var(--text-muted)',
            maxWidth: '420px',
            marginBottom: '2rem',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Canopy traces the possibility of shade, moisture and refuge through the hard grain of the city.
          </p>

          <button
            onClick={() => navigate('/explorer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-accent)',
              borderRadius: '999px',
              padding: '10px 22px',
              fontSize: '0.78rem',
              fontFamily: "'Cinzel', Georgia, serif",
              letterSpacing: '0.12em',
              cursor: 'pointer'
            }}
            className="hover:border-[var(--gold-primary)]"
          >
            <span>INSPECT CANOPY ATLAS</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Right: Interactive District Canopy Polygon Map (Figma reproduction) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DistrictCanopyMap />
        </div>
      </section>


      {/* ========================================================
          SECTION 4 / THE FUTURE: NOT YET SET IN STONE (Image 3)
          ======================================================== */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1.15fr',
        alignItems: 'center',
        padding: '5rem 6rem',
        background: '#081c14', // Deep Forest Green as in Figma Image 3
        color: '#f4ede2',
        borderTop: '1px solid #1a3828',
        boxSizing: 'border-box'
      }} className="grid-cols-1 lg:grid-cols-[1fr_1.15fr]">

        {/* Left: Future Scenario Typography */}
        <div>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: '#a3c2b2',
            maxWidth: '460px',
            marginBottom: '1.5rem',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Observation shows us where we are.<br />
            Scenarios help us ask where we could go.
          </p>

          <h2 style={{
            fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '0.04em',
            margin: '0 0 2rem 0',
            color: '#f4ede2'
          }}>
            THE FUTURE<br />
            IS NOT YET<br />
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#d48364'
            }}>
              SET IN STONE.
            </span>
          </h2>

          <button
            onClick={() => navigate('/scenario')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #d4af37 0%, #aa771c 100%)',
              color: '#1a1208',
              border: 'none',
              borderRadius: '999px',
              padding: '14px 34px',
              fontSize: '0.82rem',
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              letterSpacing: '0.18em',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}
            className="hover:scale-105"
          >
            <span>TEST A SCENARIO</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right: Scenario Deformation Sculptural Blob */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FutureScenarioBlob />
        </div>
      </section>

    </div>
  );
};
