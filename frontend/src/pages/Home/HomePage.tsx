import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, ShieldAlert, Cpu } from 'lucide-react';
import { CityCanvas } from '../../components/3d/CityCanvas';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'relative',
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '1.5rem 3rem',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 70% 30%, #1a130b 0%, #0c0a07 70%)'
    }}>
      {/* Outer Ornamental Frame (Matching Figma Framing) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '82vh',
        border: '1px solid rgba(212, 175, 55, 0.28)',
        borderRadius: '4px',
        padding: '2.5rem 3rem',
        display: 'grid',
        gridTemplateColumns: '1.05fr 1.35fr',
        alignItems: 'center',
        gap: '2.5rem',
        boxSizing: 'border-box'
      }} className="grid-cols-1 lg:grid-cols-[1.05fr_1.35fr]">

        {/* Diamond Star Corner Accents (Figma ✦ ornaments) */}
        <div style={{ position: 'absolute', top: '-6px', left: '-6px', color: '#e6c875', fontSize: '12px' }}>✦</div>
        <div style={{ position: 'absolute', top: '-6px', right: '-6px', color: '#e6c875', fontSize: '12px' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '-6px', left: '-6px', color: '#e6c875', fontSize: '12px' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', color: '#e6c875', fontSize: '12px' }}>✦</div>

        {/* Left Side Fine Pinstripe Hatching */}
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '20px',
          bottom: '20px',
          width: '8px',
          backgroundImage: 'repeating-linear-gradient(to right, rgba(212, 175, 55, 0.18), rgba(212, 175, 55, 0.18) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none'
        }} />

        {/* Right Side Fine Pinstripe Hatching */}
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '20px',
          bottom: '20px',
          width: '8px',
          backgroundImage: 'repeating-linear-gradient(to right, rgba(212, 175, 55, 0.18), rgba(212, 175, 55, 0.18) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none'
        }} />

        {/* LEFT COLUMN: HERO TYPOGRAPHY & STORY */}
        <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          
          {/* Sub-label */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.68rem',
            letterSpacing: '0.3em',
            color: '#a89069',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            URBAN HEAT &amp; CLIMATE INTELLIGENCE
          </div>

          {/* Sanskrit Title (Figma: पृथ्वी · Earth) */}
          <div style={{
            fontSize: '1.05rem',
            fontFamily: "'Cinzel', Georgia, serif",
            color: '#bfa270',
            letterSpacing: '0.2em',
            margin: '0.1rem 0 -0.5rem 0'
          }}>
            पृथ्वी · Earth
          </div>

          {/* Monumental Headline: PRITHVI (Figma Monumental Gold Serif) */}
          <h1 style={{
            fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '0.06em',
            margin: 0,
            background: 'linear-gradient(180deg, #fff7e6 0%, #ecd08c 28%, #c59f48 65%, #6a4f1a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.85))'
          }}>
            PRITHVI
          </h1>

          {/* Subtitle (Figma: THE EARTH REMEMBERS EVERYTHING.) */}
          <div style={{
            fontSize: 'clamp(0.9rem, 1.6vw, 1.35rem)',
            fontFamily: "'Cinzel', Georgia, serif",
            letterSpacing: '0.18em',
            color: '#e4d6bf',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            THE EARTH REMEMBERS EVERYTHING.
          </div>

          {/* Description (Figma: ENTER A LIVING ATLAS OF HEAT...) */}
          <p style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: '0.92rem',
            lineHeight: 1.65,
            color: '#9e8e7a',
            maxWidth: '460px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            ENTER A LIVING ATLAS OF HEAT, VEGETATION AND URBAN CHANGE.
          </p>

          {/* CTA Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {/* Primary Pill Button (Figma: ENTER THE ATLAS →) */}
            <button
              onClick={() => navigate('/explorer')}
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
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                transition: 'all 0.25s ease'
              }}
              className="hover:scale-105 hover:shadow-[0_10px_30px_rgba(212,175,55,0.5)]"
            >
              <span>ENTER THE ATLAS</span>
              <ArrowRight size={16} />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => navigate('/scenario')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                color: '#c5a059',
                border: '1px solid #4a3826',
                borderRadius: '999px',
                padding: '13px 26px',
                fontSize: '0.78rem',
                fontFamily: "'Cinzel', Georgia, serif",
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover:border-[#c5a059] hover:bg-[#1a140d]"
            >
              <Cpu size={14} />
              <span>SCENARIO LAB</span>
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #231b14',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: '0.75rem',
            color: '#80715d'
          }}>
            <div><strong style={{ color: '#d4af37' }}>500</strong> Simulated Cities</div>
            <div>•</div>
            <div><strong style={{ color: '#d4af37' }}>15</strong> Environmental Metrics</div>
            <div>•</div>
            <div><strong style={{ color: '#58d68d' }}>LightGBM &amp; RF</strong> Trained</div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE 3D ISOMETRIC CITY */}
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

      {/* Bottom Sub-Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        fontSize: '0.72rem',
        color: '#6e5e4c',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif' letterSpacing: '0.08em'"
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={13} color="#9e855c" />
          <span>ISOMETRIC TERRAIN SIMULATION · MODEL TARGET: TEMPERATURE (°C)</span>
        </div>
        <div>
          <span>PROVENANCE: VERIFIED URBAN HEAT ISLAND BENCHMARK</span>
        </div>
      </div>
    </div>
  );
};
