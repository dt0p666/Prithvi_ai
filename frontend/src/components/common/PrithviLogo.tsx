import React, { useState } from 'react';

interface PrithviLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const PrithviLogo: React.FC<PrithviLogoProps> = ({
  size = 'md',
  showLabel = false,
  interactive = true,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const dimMap = {
    sm: { px: 38, text: '1.15rem', sub: '0.62rem' },
    md: { px: 48, text: '1.35rem', sub: '0.68rem' },
    lg: { px: 68, text: '1.8rem', sub: '0.78rem' },
    xl: { px: 110, text: '2.5rem', sub: '0.9rem' }
  };

  const { px, text, sub } = dimMap[size];

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.85rem',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        position: 'relative'
      }}
      title="PRITHVI (पृथ्वी) · The Living Planetary Earth"
    >
      {/* Interactive Sacred Planetary Gyroscope Insignia */}
      <div style={{
        position: 'relative',
        width: `${px}px`,
        height: `${px}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'scale(1.08)' : 'scale(1)'
      }}>
        {/* Pulsing Aura on Hover/Click */}
        {interactive && (
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(184, 82, 51, 0.15) 50%, transparent 75%)',
            opacity: isHovered || isClicked ? 1 : 0,
            transform: isClicked ? 'scale(1.3)' : 'scale(1)',
            transition: 'all 0.4s ease',
            pointerEvents: 'none'
          }} />
        )}

        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))'
          }}
        >
          <defs>
            <linearGradient id="prithviGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3cc" />
              <stop offset="35%" stopColor="#d4af37" />
              <stop offset="70%" stopColor="#aa771c" />
              <stop offset="100%" stopColor="#664610" />
            </linearGradient>

            <linearGradient id="prithviTerracotta" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e27a5b" />
              <stop offset="60%" stopColor="#b85233" />
              <stop offset="100%" stopColor="#6e2b17" />
            </linearGradient>

            <linearGradient id="prithviEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#58d68d" />
              <stop offset="70%" stopColor="#1e6b37" />
              <stop offset="100%" stopColor="#0b3117" />
            </linearGradient>

            <radialGradient id="earthDisc" cx="42%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#2e2217" />
              <stop offset="55%" stopColor="#18110b" />
              <stop offset="100%" stopColor="#0b0805" />
            </radialGradient>
          </defs>

          {/* Outer Astrological / Geospatial Ring */}
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="url(#earthDisc)"
            stroke="url(#prithviGold)"
            strokeWidth="1.8"
          />

          {/* 8 Cardinal Points (Ashta-Dikpalas compass markings) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <circle
              key={deg}
              cx={50 + 44 * Math.cos((deg * Math.PI) / 180)}
              cy={50 + 44 * Math.sin((deg * Math.PI) / 180)}
              r={deg % 90 === 0 ? 1.6 : 1.0}
              fill={deg % 90 === 0 ? '#f7e7b4' : '#aa771c'}
            />
          ))}

          {/* Gyroscopic Latitude Coordinate Ring (Rotates smoothly on hover) */}
          <ellipse
            cx="50"
            cy="50"
            rx="41"
            ry="18"
            fill="none"
            stroke="url(#prithviGold)"
            strokeWidth="0.9"
            strokeDasharray="2.5 3"
            opacity="0.75"
            style={{
              transformOrigin: '50px 50px',
              transform: isHovered ? 'rotate(180deg)' : 'rotate(25deg)',
              transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />

          {/* Counter-Rotating Longitude Gyroscope Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="18"
            ry="41"
            fill="none"
            stroke="url(#prithviTerracotta)"
            strokeWidth="0.9"
            strokeDasharray="3 3.5"
            opacity="0.8"
            style={{
              transformOrigin: '50px 50px',
              transform: isHovered ? 'rotate(-180deg)' : 'rotate(-30deg)',
              transition: 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />

          {/* Inner Thermal & Vegetation Ring */}
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke="url(#prithviEmerald)"
            strokeWidth="1.2"
            opacity={isHovered ? 0.95 : 0.65}
            style={{ transition: 'opacity 0.3s ease' }}
          />

          {/* Central Prithvi Symbol: Fusion of Sanskrit 'पृ' seed & Serif 'P' */}
          <g style={{
            transformOrigin: '50px 50px',
            transform: isClicked ? 'scale(1.12)' : 'scale(1)',
            transition: 'transform 0.25s ease'
          }}>
            {/* Serif P Stem */}
            <path
              d="M 37 28 L 52 28 C 63 28, 69 34, 69 42 C 69 50, 62 55, 52 55 L 45 55 L 45 68 L 37 68 Z M 45 35 L 45 48 L 51 48 C 57 48, 61 46, 61 41.5 C 61 37, 57 35, 51 35 Z"
              fill="url(#prithviGold)"
            />
            {/* Sanskrit 'ृ' (Ri-kar) downward Earth root flourish evoking sprout/soil */}
            <path
              d="M 45 68 C 45 74, 51 77, 57 75 C 60 74, 62 71, 62 69 C 62 67, 60 67, 59 68 C 58 69, 56 70, 54 70 C 50 70, 48 67, 48 64 Z"
              fill="url(#prithviEmerald)"
            />
            {/* Bindu (Center Point of Earth's Core) */}
            <circle cx="50" cy="41.5" r="2.2" fill="#fff3cc" />
          </g>
        </svg>

        {/* Floating Tooltip badge on hover */}
        {interactive && isHovered && (
          <div style={{
            position: 'absolute',
            bottom: '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(18, 14, 10, 0.96)',
            border: '1px solid #d4af37',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '9.5px',
            fontFamily: "'Cinzel', serif",
            color: '#f7e7b4',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            zIndex: 100
          }}>
            पृथ्वी · THE LIVING EARTH
          </div>
        )}
      </div>

      {/* Typography Label */}
      {showLabel && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px'
          }}>
            <span style={{
              fontSize: text,
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              letterSpacing: '0.22em',
              background: 'linear-gradient(135deg, #f7e7b4 0%, #d4af37 50%, #aa771c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))'
            }}>
              PRITHVI
            </span>
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              fontFamily: "'Cinzel', Georgia, serif",
              letterSpacing: '0.08em'
            }}>
              · पृथ्वी
            </span>
          </div>
          <span style={{
            fontSize: sub,
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginTop: '-2px'
          }}>
            Urban Climate Atlas
          </span>
        </div>
      )}
    </div>
  );
};
