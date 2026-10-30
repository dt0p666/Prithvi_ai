import React, { useState } from 'react';

export const FutureScenarioBlob: React.FC = () => {
  const [treeOffset, setTreeOffset] = useState(25);
  const coolingDelta = (treeOffset * 0.12).toFixed(1);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '560px',
      height: '420px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none'
    }}>
      {/* Background radial gradient glow */}
      <div style={{
        position: 'absolute',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184, 82, 51, 0.25) 0%, transparent 70%)',
        filter: 'blur(30px)'
      }} />

      {/* Amorphous Bronze/Terracotta Sculptural Blob (Matching Figma) */}
      <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id="blobGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#dcb374" />
            <stop offset="40%" stopColor="#b88349" />
            <stop offset="75%" stopColor="#7a4725" />
            <stop offset="100%" stopColor="#3d1d0c" />
          </radialGradient>
          <filter id="blobShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="20" stdDeviation="15" floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Sculptural Organic Shape */}
        <path
          d={`M 120 180 Q ${160 + treeOffset} 80 280 120 Q 360 180 340 280 Q 280 370 180 340 Q 70 280 120 180 Z`}
          fill="url(#blobGrad)"
          filter="url(#blobShadow)"
          style={{ transition: 'd 0.3s ease-out' }}
        />

        {/* Interactive Point (+ Trees) */}
        <g style={{ cursor: 'pointer' }}>
          <circle cx={190 + treeOffset} cy={160} r="6" fill="#f4ede2" />
          <circle cx={190 + treeOffset} cy={160} r="14" fill="none" stroke="#f4ede2" strokeWidth="1" strokeDasharray="2 2" />
          <text
            x={190 + treeOffset + 18}
            y={164}
            fill="rgba(244, 237, 226, 0.75)"
            fontSize="10"
            fontFamily="'Cinzel', Georgia, serif"
            letterSpacing="1"
          >
            + Trees ({treeOffset}%)
          </text>
        </g>

        {/* Target Result (- Heat) */}
        <g>
          <text
            x={280}
            y={290}
            fill="rgba(244, 237, 226, 0.65)"
            fontSize="10"
            fontFamily="'Cinzel', Georgia, serif"
            letterSpacing="1"
          >
            - {coolingDelta}°C Heat
          </text>
        </g>
      </svg>

      {/* Interactive slider control directly on the blob */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(8, 28, 20, 0.85)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '999px',
        padding: '6px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backdropFilter: 'blur(6px)'
      }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#c5a059', textTransform: 'uppercase' }}>
          Perturb Canopy:
        </span>
        <input
          type="range"
          min="5"
          max="50"
          value={treeOffset}
          onChange={(e) => setTreeOffset(parseInt(e.target.value))}
          style={{ width: '100px', accentColor: '#d4af37', cursor: 'pointer' }}
        />
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#58d68d' }}>
          -{coolingDelta}°C
        </span>
      </div>
    </div>
  );
};
