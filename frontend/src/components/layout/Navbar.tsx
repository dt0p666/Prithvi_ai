import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, Globe, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  isAtmospheric: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, isAtmospheric, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'CLIMATE EXPLORER', path: '/explorer' },
    { name: 'THEN / NOW', path: '/comparison' },
    { name: 'SCENARIO LAB', path: '/scenario' },
    { name: 'METHOD', path: '/about' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(12, 10, 7, 0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #231b14',
      padding: '0.85rem 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease'
    }}>
      {/* Brand Identity */}
      <NavLink
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          textDecoration: 'none'
        }}
      >
        <img
          src="/prithvi-emblem.svg"
          alt="PRITHVI Emblem"
          style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: '1.25rem',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: '#f4ede2',
            background: 'linear-gradient(135deg, #f7e7b4 0%, #d4af37 50%, #aa771c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            PRITHVI
          </span>
        </div>
      </NavLink>

      {/* Center Tagline (Figma: URBAN HEAT & CLIMATE INTELLIGENCE) */}
      <div style={{
        display: 'none',
        fontSize: '0.68rem',
        letterSpacing: '0.28em',
        color: '#9e855c',
        textTransform: 'uppercase',
        fontWeight: 500,
      }} className="md:block">
        URBAN HEAT &amp; CLIMATE INTELLIGENCE
      </div>

      {/* Right Navigation & Utility Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: '0.74rem',
                fontFamily: "'Cinzel', Georgia, serif",
                letterSpacing: '0.18em',
                textDecoration: 'none',
                color: isActive ? '#f4ede2' : '#9e855c',
                borderBottom: isActive ? '1px solid #d4af37' : '1px solid transparent',
                paddingBottom: '4px',
                transition: 'all 0.2s ease',
              })}
              className="hover:text-[#f4ede2]"
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            title="Search dataset and documentation (Ctrl+K)"
            style={{
              background: 'rgba(28, 22, 16, 0.7)',
              border: '1px solid #3d2d1e',
              color: '#c5a059',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
            }}
            className="hover:border-[#c5a059] transition-colors"
          >
            <Search size={14} />
            <span className="hidden sm:inline">SEARCH</span>
          </button>

          {/* Theme / Mood toggle */}
          <button
            onClick={onToggleTheme}
            title={isAtmospheric ? 'Switch to High Contrast Mode' : 'Switch to Atmospheric Earth Mode'}
            style={{
              background: 'rgba(28, 22, 16, 0.7)',
              border: '1px solid #3d2d1e',
              color: '#c5a059',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="hover:border-[#c5a059] transition-colors"
          >
            {isAtmospheric ? <Sparkles size={14} /> : <Moon size={14} />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#c5a059',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#120e0a',
          borderBottom: '1px solid #36281b',
          padding: '1.25rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 99
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                textDecoration: 'none',
                color: isActive ? '#f4ede2' : '#9e855c',
                padding: '6px 0',
                borderBottom: '1px solid #1e1710'
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};
