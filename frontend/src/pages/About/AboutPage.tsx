import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Database, Award, HelpCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is the PRITHVI dataset composed of real satellite observations or simulated entities?',
      a: 'The underlying Kaggle Urban Heat Island (UHI) dataset contains 500 simulated city nodes with 15 cross-sectional attributes. All findings and visual models are explicitly presented as simulation-based research benchmarks.'
    },
    {
      q: 'Does an intervention in the Scenario Lab prove causal cooling in physical cities?',
      a: 'No. Machine learning models identify observational statistical associations and multivariate correlations. Observational models do not establish microclimate causality or microscale fluid thermodynamic guarantees.'
    },
    {
      q: 'Which machine learning architectures are utilized?',
      a: 'The pipeline trains and benchmarks four models: a Dummy baseline, Ridge Regression, Random Forest Regressor, and LightGBM Regressor. Validation is held out with strict split hygiene to avoid data leakage.'
    },
    {
      q: 'Why does the Then / Now page compare archetypes instead of years?',
      a: 'Because the verified dataset is purely cross-sectional without longitudinal date stamps, fabricating historical multi-year trends would violate scientific integrity. We instead offer comparative analysis between distinct land-cover regimes and microclimate clusters.'
    }
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      backgroundColor: '#0c0a07',
      padding: '3rem 4rem',
      color: '#e2d7c5',
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #281e14', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.28em',
          color: '#9e855c',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          SCIENTIFIC INTEGRITY &amp; SYSTEM ARCHITECTURE
        </div>
        <h1 style={{
          fontSize: '3rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: '#f4ede2',
          letterSpacing: '0.04em',
          margin: 0
        }}>
          Methodology &amp; Provenance
        </h1>
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: '#998a76',
          fontSize: '1rem',
          marginTop: '0.6rem',
          lineHeight: 1.7
        }}>
          PRITHVI blends ancient Indian earth aesthetics with computational climate intelligence. We uphold uncompromising transparency regarding data provenance, statistical boundaries, and machine learning inference.
        </p>
      </div>

      {/* 3 Core Methodology Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '3rem'
      }} className="grid-cols-1 md:grid-cols-3">

        <div style={{
          background: '#130e09',
          border: '1px solid #2a1f15',
          borderRadius: '6px',
          padding: '1.5rem'
        }}>
          <Database size={24} color="#d4af37" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.15rem', fontFamily: "'Cinzel', Georgia, serif", color: '#f4ede2', marginBottom: '0.5rem' }}>
            Dataset Provenance
          </h2>
          <p style={{
            fontSize: '0.84rem',
            color: '#8b7a66',
            lineHeight: 1.6,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            500 city entities across 15 atmospheric, topographic, and socioeconomic features. 0 missing values, verified distributions, released under open public research terms.
          </p>
        </div>

        <div style={{
          background: '#130e09',
          border: '1px solid #2a1f15',
          borderRadius: '6px',
          padding: '1.5rem'
        }}>
          <Award size={24} color="#58d68d" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.15rem', fontFamily: "'Cinzel', Georgia, serif", color: '#f4ede2', marginBottom: '0.5rem' }}>
            Model Benchmarks
          </h2>
          <p style={{
            fontSize: '0.84rem',
            color: '#8b7a66',
            lineHeight: 1.6,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Rigorous evaluation across Dummy, Ridge, Random Forest, and LightGBM regressors with MAE, RMSE, and R² tracking on strictly held-out test splits.
          </p>
        </div>

        <div style={{
          background: '#130e09',
          border: '1px solid #2a1f15',
          borderRadius: '6px',
          padding: '1.5rem'
        }}>
          <ShieldCheck size={24} color="#e6c875" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.15rem', fontFamily: "'Cinzel', Georgia, serif", color: '#f4ede2', marginBottom: '0.5rem' }}>
            Epistemic Boundaries
          </h2>
          <p style={{
            fontSize: '0.84rem',
            color: '#8b7a66',
            lineHeight: 1.6,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Explicit delineation between correlation and causation. No fabricated micro-coordinates, no synthetic time-series, and strict out-of-distribution guardrails.
          </p>
        </div>

      </div>

      {/* Deep Editorial Section */}
      <div style={{
        background: '#120d08',
        border: '1px solid #281e14',
        borderRadius: '6px',
        padding: '2rem',
        marginBottom: '3rem',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: 1.7,
        fontSize: '0.9rem',
        color: '#998a76'
      }}>
        <h2 style={{
          fontSize: '1.6rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: '#f4ede2',
          marginBottom: '1rem'
        }}>
          Understanding Urban Heat Island Dynamics
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Urban Heat Islands (UHI) develop when natural vegetative cover is displaced by high-thermal-mass pavements, asphalt, and concrete structures. These artificial materials absorb solar radiation during daylight hours and continuously re-radiate thermal energy into the nocturnal boundary layer.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          In PRITHVI, the primary predictand is <strong style={{ color: '#d4af37' }}>Temperature (°C)</strong>, conditioned upon land cover classifications (<em>Urban, Industrial, Green Space, Water</em>), vegetative canopy fractions (<em>Urban Greenness Ratio</em>), anthropogenic flux (<em>Energy Consumption in kWh</em>), and atmospheric indicators (<em>AQI, Wind Speed, Humidity</em>).
        </p>
      </div>

      {/* SIX LEGAL-RISK AUDITS SECTION */}
      <div style={{
        background: 'radial-gradient(ellipse at top, #1a130b, #110d08)',
        border: '1px solid #3d2d1e',
        borderRadius: '6px',
        padding: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          color: '#d4af37',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          COMPLIANCE &amp; LEGAL GOVERNANCE AUDIT
        </div>
        <h2 style={{
          fontSize: '1.6rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: '#f4ede2',
          marginBottom: '1.25rem'
        }}>
          Six Legal-Risk Disclosures
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '0.82rem'
        }} className="grid-cols-1 md:grid-cols-2">
          <div style={{ background: '#16110b', border: '1px solid #251c13', padding: '12px', borderRadius: '4px' }}>
            <strong style={{ color: '#c5a059' }}>1. Age Gate:</strong> Not Applicable. PRITHVI provides open informational exploration without personal accounts, user profiles, or age-restricted content.
          </div>

          <div style={{ background: '#16110b', border: '1px solid #251c13', padding: '12px', borderRadius: '4px' }}>
            <strong style={{ color: '#c5a059' }}>2. Font Privacy:</strong> Compliant. Web typography is styled with system font stacks and standard, privacy-conscious fallbacks with zero unconsented fingerprinting.
          </div>

          <div style={{ background: '#16110b', border: '1px solid #251c13', padding: '12px', borderRadius: '4px' }}>
            <strong style={{ color: '#c5a059' }}>3. Session Replay:</strong> Disabled by default. No behavioral screen-recording or keystroke loggers are active on PRITHVI.
          </div>

          <div style={{ background: '#16110b', border: '1px solid #251c13', padding: '12px', borderRadius: '4px' }}>
            <strong style={{ color: '#c5a059' }}>4. Marketing Communications:</strong> Opt-in only with transparent unsubscribe functionality on all dispatched updates.
          </div>

          <div style={{ background: '#16110b', border: '1px solid #251c13', padding: '12px', borderRadius: '4px' }}>
            <strong style={{ color: '#c5a059' }}>5. Subscription Renewals:</strong> Not Applicable. PRITHVI is open-access with no recurring payments or credit card processing.
          </div>

          <div style={{ background: '#16110b', border: '1px solid #251c13', padding: '12px', borderRadius: '4px' }}>
            <strong style={{ color: '#c5a059' }}>6. DMCA Designated Agent:</strong> Compliance instructions provided via U.S. Copyright Office directory guidelines (17 U.S.C. § 512(c)).
          </div>
        </div>
      </div>

      {/* Expandable FAQ */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.6rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: '#f4ede2',
          marginBottom: '1rem'
        }}>
          Frequently Asked Inquiries
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: '#130e09',
                border: '1px solid #281e14',
                borderRadius: '6px',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#f4ede2',
                  fontSize: '0.9rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  cursor: 'pointer'
                }}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={16} color="#d4af37" /> : <ChevronDown size={16} color="#887762" />}
              </button>

              {openFaq === idx && (
                <div style={{
                  padding: '0 1.25rem 1.25rem 1.25rem',
                  color: '#8b7a66',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
