import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Database, Award, HelpCircle, ChevronDown, ChevronUp, ExternalLink, Cpu } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the provenance and scope of the PRITHVI dataset?',
      a: 'PRITHVI is powered by the verified India Cities Climate & Land Surface Temperature dataset (2021–2025). It covers 97 municipal centers across 23 Indian States and Union Territories, comprising 5,587 monthly satellite observations with zero synthetic substitutions.'
    },
    {
      q: 'Does an intervention in the Scenario Lab prove physical causal cooling?',
      a: 'No. Machine learning models identify observational statistical associations and multivariate empirical correlations. Observational regression does not establish microclimate fluid causality or physical thermodynamic guarantees.'
    },
    {
      q: 'Which machine learning architectures are deployed and evaluated?',
      a: 'The pipeline benchmarks four architectures: a Dummy Mean Baseline, Ridge Regression, Random Forest, and LightGBM. LightGBM achieved the top benchmark on unseen test data with an MAE of 1.24°C and R² of 0.923.'
    },
    {
      q: 'How does the Then / Now comparison work with multi-year data?',
      a: 'Because our dataset contains monthly passes from 2021 through 2025, users can inspect real 5-year empirical temporal trajectories for any Indian municipality, as well as spatial cross-sectional contrasts between diverse climatic zones.'
    }
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      backgroundColor: 'var(--bg-primary)',
      padding: '3rem 4rem',
      color: 'var(--text-primary)',
      maxWidth: '1100px',
      margin: '0 auto',
      transition: 'background-color 0.25s ease'
    }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.28em',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          SCIENTIFIC INTEGRITY &amp; SYSTEM ARCHITECTURE
        </div>
        <h1 style={{
          fontSize: '3rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: 'var(--text-primary)',
          letterSpacing: '0.04em',
          margin: 0
        }}>
          Methodology &amp; Provenance
        </h1>
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: 'var(--text-muted)',
          fontSize: '1rem',
          marginTop: '0.6rem',
          lineHeight: 1.7
        }}>
          PRITHVI blends earth aesthetics with computational climate intelligence. We uphold uncompromising transparency regarding data provenance, statistical boundaries, and machine learning inference.
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
          background: 'var(--bg-card)',
          border: '1px solid var(--border-accent)',
          borderRadius: '6px',
          padding: '1.5rem'
        }}>
          <Database size={24} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.15rem', fontFamily: "'Cinzel', Georgia, serif", color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Dataset Provenance
          </h2>
          <p style={{
            fontSize: '0.84rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            97 Indian cities across 23 States, capturing 5,587 monthly satellite passes from 2021 to 2025 across LST (°C), NDVI, NDBI, NDWI, and elevation.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-accent)',
          borderRadius: '6px',
          padding: '1.5rem'
        }}>
          <Award size={24} color="#27ae60" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.15rem', fontFamily: "'Cinzel', Georgia, serif", color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            LightGBM Model (R² 0.923)
          </h2>
          <p style={{
            fontSize: '0.84rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Supervised regression trained with 80/20 train/test hygiene. Outperformed Baseline and Ridge to reach MAE = 1.24°C and RMSE = 1.76°C.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-accent)',
          borderRadius: '6px',
          padding: '1.5rem'
        }}>
          <ShieldCheck size={24} color="#b85233" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.15rem', fontFamily: "'Cinzel', Georgia, serif", color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Non-Causal Humility
          </h2>
          <p style={{
            fontSize: '0.84rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            Clear epistemological boundary between observational statistical association and physical urban microclimate intervention.
          </p>
        </div>
      </div>

      {/* Model Benchmark Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-accent)',
        borderRadius: '6px',
        padding: '1.75rem',
        marginBottom: '3rem'
      }}>
        <h2 style={{
          fontSize: '1.4rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          Model Benchmark Matrix (Target: LST °C)
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-accent)', textAlign: 'left', color: 'var(--gold-primary)', fontFamily: "'Cinzel', serif" }}>
                <th style={{ padding: '10px 12px' }}>MODEL</th>
                <th style={{ padding: '10px 12px' }}>MAE (°C)</th>
                <th style={{ padding: '10px 12px' }}>RMSE (°C)</th>
                <th style={{ padding: '10px 12px' }}>R² SCORE</th>
                <th style={{ padding: '10px 12px' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>Dummy Mean Baseline</td>
                <td style={{ padding: '10px 12px' }}>4.87</td>
                <td style={{ padding: '10px 12px' }}>6.37</td>
                <td style={{ padding: '10px 12px' }}>0.000</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Baseline</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>Ridge Regression</td>
                <td style={{ padding: '10px 12px' }}>2.26</td>
                <td style={{ padding: '10px 12px' }}>2.97</td>
                <td style={{ padding: '10px 12px' }}>0.782</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Linear Benchmark</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>Random Forest Regressor</td>
                <td style={{ padding: '10px 12px' }}>1.70</td>
                <td style={{ padding: '10px 12px' }}>2.35</td>
                <td style={{ padding: '10px 12px' }}>0.864</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Ensemble</td>
              </tr>
              <tr style={{ background: 'rgba(39, 174, 96, 0.08)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>LightGBM Regressor</td>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#27ae60' }}>1.24</td>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#27ae60' }}>1.76</td>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#27ae60' }}>0.923</td>
                <td style={{ padding: '10px 12px', color: '#27ae60', fontWeight: 700 }}>Production Champion ★</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div>
        <h2 style={{
          fontSize: '1.4rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: "'Cinzel', Georgia, serif",
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} color="var(--gold-primary)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 1.5rem 1.25rem 1.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.65,
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
