import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, Globe, Sparkles } from 'lucide-react';
import { PrithviLogo } from '../common/PrithviLogo';

interface NavbarProps {
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, isDark, onToggleTheme }) => {
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
      background: 'var(--bg-secondary)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.25s ease'
    }}>
      {/* Brand Identity with Interactive Sacred Logo */}
      <NavLink
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          textDecoration: 'none'
        }}
      >
        <PrithviLogo size="sm" showLabel={true} interactive={true} />
      </NavLink>

      {/* Center Tagline */}
      <div style={{
        display: 'none',
        fontSize: '0.68rem',
        letterSpacing: '0.28em',
        color: 'var(--text-secondary)',
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
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: isActive ? '1px solid var(--gold-primary)' : '1px solid transparent',
                paddingBottom: '4px',
                transition: 'all 0.2s ease',
              })}
              className="hover:text-[var(--text-primary)]"
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
              background: 'var(--bg-input)',
              border: '1px solid var(--border-accent)',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
            }}
          >
            <Search size={14} />
            <span className="hidden sm:inline">SEARCH</span>
          </button>

          {/* Theme Mode Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Sandstone Mode' : 'Switch to Dark Earth Mode'}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-accent)',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
            }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span className="hidden sm:inline">{isDark ? 'LIGHT' : 'DARK'}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
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
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
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
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                padding: '6px 0',
                borderBottom: '1px solid var(--border-color)'
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
