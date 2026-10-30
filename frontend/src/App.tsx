import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Utilities } from './components/layout/Utilities';

import { HomePage } from './pages/Home/HomePage';
import { ClimateExplorerPage } from './pages/ClimateExplorer/ClimateExplorerPage';
import { HistoricalComparisonPage } from './pages/HistoricalComparison/HistoricalComparisonPage';
import { ScenarioLabPage } from './pages/ScenarioLab/ScenarioLabPage';
import { AboutPage } from './pages/About/AboutPage';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isAtmospheric, setIsAtmospheric] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        backgroundColor: isAtmospheric ? '#0c0a07' : '#14120e',
        color: '#e2d7c5',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Top Scroll Progress Indicator */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: '2px',
          background: 'linear-gradient(90deg, #aa771c, #d4af37, #f7e7b4)',
          zIndex: 100,
          transition: 'width 0.1s ease-out'
        }} />

        {/* Skip to Content Accessibility Link */}
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            top: '-100px',
            left: '16px',
            background: '#d4af37',
            color: '#1a1208',
            padding: '8px 16px',
            borderRadius: '4px',
            fontWeight: 600,
            zIndex: 999,
            transition: 'top 0.2s ease'
          }}
          onFocus={(e) => (e.currentTarget.style.top = '16px')}
          onBlur={(e) => (e.currentTarget.style.top = '-100px')}
        >
          Skip to main content
        </a>

        {/* Global Navigation */}
        <Navbar
          onOpenSearch={() => setSearchOpen(true)}
          isAtmospheric={isAtmospheric}
          onToggleTheme={() => setIsAtmospheric(!isAtmospheric)}
        />

        {/* Main Routed Page Content */}
        <div id="main-content" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explorer" element={<ClimateExplorerPage />} />
            <Route path="/comparison" element={<HistoricalComparisonPage />} />
            <Route path="/scenario" element={<ScenarioLabPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <Footer />

        {/* Utilities: Search Modal, Cookies, Contact */}
        <Utilities
          searchOpen={searchOpen}
          onCloseSearch={() => setSearchOpen(false)}
        />
      </div>
    </Router>
  );
}
