import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Copy, Check, ShieldCheck, Mail, ArrowUp } from 'lucide-react';
import { PrithviLogo } from '../common/PrithviLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 3rem 2rem 3rem',
      color: 'var(--text-muted)',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }} className="grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr]">

        {/* Brand & Manifesto */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <PrithviLogo size="sm" showLabel={true} interactive={true} />
          </div>
          <p style={{ fontSize: '0.84rem', lineHeight: 1.6, maxWidth: '420px', color: 'var(--text-muted)' }}>
            Earth-centered planetary intelligence analyzing urban microclimates, thermal exposure, and environmental resilience.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <div style={{
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            color: '#c5a059',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontFamily: "'Cinzel', Georgia, serif"
          }}>
            EXPLORATION PATHS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
            <NavLink to="/explorer" className="hover:text-[#f4ede2] transition-colors" style={{ textDecoration: 'none', color: '#8b7a66' }}>
              Climate Explorer
            </NavLink>
            <NavLink to="/comparison" className="hover:text-[#f4ede2] transition-colors" style={{ textDecoration: 'none', color: '#8b7a66' }}>
              Then / Now Analysis
            </NavLink>
            <NavLink to="/scenario" className="hover:text-[#f4ede2] transition-colors" style={{ textDecoration: 'none', color: '#8b7a66' }}>
              Scenario Lab
            </NavLink>
            <NavLink to="/about" className="hover:text-[#f4ede2] transition-colors" style={{ textDecoration: 'none', color: '#8b7a66' }}>
              Methodology &amp; Provenance
            </NavLink>
          </div>
        </div>

        {/* Governance & Compliance */}
        <div>
          <div style={{
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            color: '#c5a059',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontFamily: "'Cinzel', Georgia, serif"
          }}>
            GOVERNANCE AUDIT
          </div>
          <div style={{ fontSize: '0.78rem', lineHeight: 1.6, color: '#6e5e4c' }}>
            <div>• Open Data: CC0 Urban Heat Island Dataset</div>
            <div>• Session Replay: Disabled</div>
            <div>• Privacy: Zero Personal Profiling</div>
            <div>• DMCA: Designated Agent Procedures in Place</div>
            <div style={{ marginTop: '0.5rem', color: '#9e855c' }}>Last Updated: October 2026</div>
          </div>
        </div>

      </div>

      {/* Bottom Sub-Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid #1a140d',
        paddingTop: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.72rem',
        color: '#5b4e3e'
      }}>
        <div>© 2026 PRITHVI Intelligence. Open-source climate research engine.</div>
        <button
          onClick={scrollToTop}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8b7a66',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.72rem'
          }}
          className="hover:text-[#d4af37]"
        >
          <span>Back to Top</span>
          <ArrowUp size={12} />
        </button>
      </div>
    </footer>
  );
};
