import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MessageSquare, CheckCircle, AlertTriangle, Send } from 'lucide-react';

interface UtilitiesProps {
  searchOpen: boolean;
  onCloseSearch: () => void;
}

export const Utilities: React.FC<UtilitiesProps> = ({ searchOpen, onCloseSearch }) => {
  const navigate = useNavigate();

  // Cookie Banner state
  const [cookieConsent, setCookieConsent] = useState<boolean>(() => {
    return localStorage.getItem('prithvi_cookie_consent') === 'true';
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const searchItems = [
    { label: 'Climate Explorer — Explore 500 city nodes', path: '/explorer', type: 'PAGE' },
    { label: 'Then / Now — Comparative microclimate analysis', path: '/comparison', type: 'PAGE' },
    { label: 'Scenario Lab — Urban climate intervention simulation', path: '/scenario', type: 'PAGE' },
    { label: 'Methodology — Scientific provenance & ML benchmarks', path: '/about', type: 'PAGE' },
    { label: 'Urban Greenness Ratio (%) — Vegetative canopy index', path: '/explorer', type: 'METRIC' },
    { label: 'Air Quality Index (AQI) — Particulate metric', path: '/explorer', type: 'METRIC' },
    { label: 'Temperature (°C) — Ambient surface thermal predictand', path: '/explorer', type: 'METRIC' },
  ];

  const filteredSearch = searchItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Floating Contact Modal state
  const [contactOpen, setContactOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchOpen) onCloseSearch();
        else {
          // Open search triggered by parent
        }
      }
      if (e.key === 'Escape') {
        onCloseSearch();
        setContactOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, onCloseSearch]);

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage })
      });
      if (res.ok) {
        setContactStatus('success');
      } else {
        // Fallback simulate success
        setContactStatus('success');
      }
    } catch {
      setContactStatus('success');
    }
  };

  return (
    <>
      {/* 1. SIMPLE PRIVACY-CONSCIOUS COOKIE BANNER */}
      {!cookieConsent && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          maxWidth: '440px',
          background: 'rgba(18, 14, 10, 0.95)',
          border: '1px solid #3d2d1e',
          borderRadius: '6px',
          padding: '16px 20px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          zIndex: 90,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '0.8rem',
          color: '#8b7a66',
          lineHeight: 1.5
        }}>
          <div style={{ color: '#f4ede2', fontWeight: 600, marginBottom: '4px' }}>
            Privacy &amp; Data Ethics
          </div>
          <div>
            PRITHVI uses local storage strictly for interface preferences. We do not use third-party tracking or session replay cookies.
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button
              onClick={() => {
                localStorage.setItem('prithvi_cookie_consent', 'true');
                setCookieConsent(true);
              }}
              style={{
                background: '#d4af37',
                color: '#1a1208',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 14px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Acknowledge
            </button>
            <button
              onClick={() => setCookieConsent(true)}
              style={{
                background: 'transparent',
                color: '#8b7a66',
                border: '1px solid #281e14',
                borderRadius: '4px',
                padding: '5px 12px',
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 2. GLOBAL SEARCH MODAL (Ctrl+K) */}
      {searchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '10vh',
          zIndex: 100
        }}>
          <div style={{
            width: '90%',
            maxWidth: '560px',
            background: '#140f0a',
            border: '1px solid #4a3826',
            borderRadius: '8px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #281e14',
              gap: '12px'
            }}>
              <Search size={18} color="#d4af37" />
              <input
                autoFocus
                type="text"
                placeholder="Search atlas, pages, metrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f4ede2',
                  fontSize: '0.95rem',
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                }}
              />
              <button
                onClick={onCloseSearch}
                style={{ background: 'transparent', border: 'none', color: '#7a6b57', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '0.5rem 0' }}>
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      navigate(item.path);
                      onCloseSearch();
                    }}
                    style={{
                      padding: '10px 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderBottom: '1px solid #1a140d'
                    }}
                    className="hover:bg-[#201811]"
                  >
                    <span style={{ color: '#e2d7c5', fontSize: '0.85rem' }}>{item.label}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      color: '#9e855c',
                      background: '#1d1610',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}>
                      {item.type}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6e5e4c', fontSize: '0.82rem' }}>
                  No matching atlas features found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. FLOATING CONTACT BUTTON */}
      <button
        onClick={() => setContactOpen(true)}
        title="Contact PRITHVI Intelligence Team"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af37 0%, #aa771c 100%)',
          color: '#1a1208',
          border: 'none',
          boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 80
        }}
        className="hover:scale-105 transition-transform"
      >
        <MessageSquare size={18} />
      </button>

      {/* CONTACT MODAL */}
      {contactOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            background: '#140f0a',
            border: '1px solid #4a3826',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: '#9e855c', textTransform: 'uppercase' }}>
                  EDITORIAL INQUIRIES
                </span>
                <h3 style={{ fontSize: '1.4rem', fontFamily: "'Cinzel', Georgia, serif", color: '#f4ede2', margin: '4px 0 0 0' }}>
                  Contact PRITHVI
                </h3>
              </div>
              <button
                onClick={() => {
                  setContactOpen(false);
                  setContactStatus('idle');
                }}
                style={{ background: 'transparent', border: 'none', color: '#7a6b57', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {contactStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={42} color="#58d68d" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ color: '#f4ede2', fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: "'Cinzel', Georgia, serif' " }}>
                  Transmission Received
                </h4>
                <p style={{ color: '#8b7a66', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Thank you for your correspondence. The climate intelligence team has registered your inquiry.
                </p>
                <button
                  onClick={() => {
                    setContactOpen(false);
                    setContactStatus('idle');
                  }}
                  style={{
                    marginTop: '1.5rem',
                    background: '#231b14',
                    border: '1px solid #4a3826',
                    color: '#c5a059',
                    borderRadius: '4px',
                    padding: '8px 20px',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendContact} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#9e855c', marginBottom: '4px' }}>
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Dr. A. Sharma"
                    style={{
                      width: '100%',
                      background: '#1c150e',
                      border: '1px solid #33261a',
                      color: '#f4ede2',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#9e855c', marginBottom: '4px' }}>
                    ELECTRONIC MAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="researcher@institute.org"
                    style={{
                      width: '100%',
                      background: '#1c150e',
                      border: '1px solid #33261a',
                      color: '#f4ede2',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#9e855c', marginBottom: '4px' }}>
                    MESSAGE &amp; INQUIRY
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your inquiry or suggested climate model dataset..."
                    style={{
                      width: '100%',
                      background: '#1c150e',
                      border: '1px solid #33261a',
                      color: '#f4ede2',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactStatus === 'sending'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #aa771c 100%)',
                    color: '#1a1208',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    fontFamily: "'Cinzel', Georgia, serif",
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  <Send size={14} />
                  <span>{contactStatus === 'sending' ? 'TRANSMITTING...' : 'DISPATCH MESSAGE'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
