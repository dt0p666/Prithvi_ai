import React, { useState, useEffect } from 'react';
import { Search, Filter, Compass, Thermometer, Trees, Wind, Droplets, Zap, Activity, Info } from 'lucide-react';
import type { CityRecord } from '../../types';

export const ClimateExplorerPage: React.FC = () => {
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLandCover, setSelectedLandCover] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<CityRecord | null>(null);
  const [sortBy, setSortBy] = useState<'temp_desc' | 'temp_asc' | 'green_desc'>('temp_desc');

  useEffect(() => {
    // Attempt fetching real observations from API; fall back to demo observations if backend pipeline is in progress
    fetch('/api/observations?limit=50')
      .then((res) => {
        if (!res.ok) throw new Error('API pending');
        return res.json();
      })
      .then((data) => {
        if (data && data.items) {
          setCities(data.items);
          setSelectedCity(data.items[0]);
        }
      })
      .catch(() => {
        // High-fidelity fallback representing actual dataset structure
        const demoCities: CityRecord[] = [
          { 'City Name': 'City_1', Latitude: -22.58, Longitude: 71.34, 'Elevation (m)': 833, 'Temperature (°C)': 22.98, 'Land Cover': 'Water', 'Population Density (people/km²)': 2544, 'Energy Consumption (kWh)': 7160, 'Air Quality Index (AQI)': 158, 'Urban Greenness Ratio (%)': 50.45, 'Health Impact (Mortality Rate/100k)': 14.47, 'Wind Speed (km/h)': 15.54, 'Humidity (%)': 63.67, 'Annual Rainfall (mm)': 1799, 'GDP per Capita (USD)': 7228 },
          { 'City Name': 'City_2', Latitude: 81.13, Longitude: 12.99, 'Elevation (m)': 2438, 'Temperature (°C)': 34.20, 'Land Cover': 'Urban', 'Population Density (people/km²)': 9240, 'Energy Consumption (kWh)': 42117, 'Air Quality Index (AQI)': 174, 'Urban Greenness Ratio (%)': 11.20, 'Health Impact (Mortality Rate/100k)': 38.50, 'Wind Speed (km/h)': 5.20, 'Humidity (%)': 42.10, 'Annual Rainfall (mm)': 850, 'GDP per Capita (USD)': 28400 },
          { 'City Name': 'City_3', Latitude: 41.76, Longitude: -68.57, 'Elevation (m)': 3928, 'Temperature (°C)': 10.64, 'Land Cover': 'Green Space', 'Population Density (people/km²)': 1016, 'Energy Consumption (kWh)': 4875, 'Air Quality Index (AQI)': 32, 'Urban Greenness Ratio (%)': 58.13, 'Health Impact (Mortality Rate/100k)': 8.20, 'Wind Speed (km/h)': 18.50, 'Humidity (%)': 66.67, 'Annual Rainfall (mm)': 2156, 'GDP per Capita (USD)': 18882 },
          { 'City Name': 'City_4', Latitude: 12.97, Longitude: 77.59, 'Elevation (m)': 920, 'Temperature (°C)': 31.85, 'Land Cover': 'Industrial', 'Population Density (people/km²)': 8450, 'Energy Consumption (kWh)': 39500, 'Air Quality Index (AQI)': 182, 'Urban Greenness Ratio (%)': 14.80, 'Health Impact (Mortality Rate/100k)': 41.20, 'Wind Speed (km/h)': 8.40, 'Humidity (%)': 55.30, 'Annual Rainfall (mm)': 970, 'GDP per Capita (USD)': 14200 },
          { 'City Name': 'City_5', Latitude: 28.61, Longitude: 77.20, 'Elevation (m)': 216, 'Temperature (°C)': 35.10, 'Land Cover': 'Urban', 'Population Density (people/km²)': 9890, 'Energy Consumption (kWh)': 46200, 'Air Quality Index (AQI)': 195, 'Urban Greenness Ratio (%)': 8.40, 'Health Impact (Mortality Rate/100k)': 47.90, 'Wind Speed (km/h)': 4.10, 'Humidity (%)': 38.50, 'Annual Rainfall (mm)': 680, 'GDP per Capita (USD)': 19800 },
          { 'City Name': 'City_6', Latitude: -33.86, Longitude: 151.20, 'Elevation (m)': 58, 'Temperature (°C)': 24.30, 'Land Cover': 'Water', 'Population Density (people/km²)': 4120, 'Energy Consumption (kWh)': 18400, 'Air Quality Index (AQI)': 65, 'Urban Greenness Ratio (%)': 39.50, 'Health Impact (Mortality Rate/100k)': 15.30, 'Wind Speed (km/h)': 21.00, 'Humidity (%)': 71.20, 'Annual Rainfall (mm)': 1220, 'GDP per Capita (USD)': 42100 },
          { 'City Name': 'City_7', Latitude: 35.67, Longitude: 139.65, 'Elevation (m)': 44, 'Temperature (°C)': 28.70, 'Land Cover': 'Urban', 'Population Density (people/km²)': 8900, 'Energy Consumption (kWh)': 38000, 'Air Quality Index (AQI)': 110, 'Urban Greenness Ratio (%)': 21.40, 'Health Impact (Mortality Rate/100k)': 24.10, 'Wind Speed (km/h)': 11.20, 'Humidity (%)': 58.00, 'Annual Rainfall (mm)': 1530, 'GDP per Capita (USD)': 39500 },
          { 'City Name': 'City_8', Latitude: 52.52, Longitude: 13.40, 'Elevation (m)': 34, 'Temperature (°C)': 19.50, 'Land Cover': 'Green Space', 'Population Density (people/km²)': 3800, 'Energy Consumption (kWh)': 15200, 'Air Quality Index (AQI)': 48, 'Urban Greenness Ratio (%)': 46.20, 'Health Impact (Mortality Rate/100k)': 12.00, 'Wind Speed (km/h)': 14.80, 'Humidity (%)': 64.00, 'Annual Rainfall (mm)': 570, 'GDP per Capita (USD)': 45000 },
        ];
        setCities(demoCities);
        setSelectedCity(demoCities[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = cities
    .filter((c) => {
      const matchSearch = c['City Name'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        c['Land Cover'].toLowerCase().includes(searchQuery.toLowerCase());
      const matchCover = selectedLandCover === 'ALL' || c['Land Cover'] === selectedLandCover;
      return matchSearch && matchCover;
    })
    .sort((a, b) => {
      if (sortBy === 'temp_desc') return b['Temperature (°C)'] - a['Temperature (°C)'];
      if (sortBy === 'temp_asc') return a['Temperature (°C)'] - b['Temperature (°C)'];
      return b['Urban Greenness Ratio (%)'] - a['Urban Greenness Ratio (%)'];
    });

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      backgroundColor: '#0c0a07',
      padding: '2.5rem 3rem',
      color: '#e2d7c5'
    }}>
      {/* Title & Introduction */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          fontSize: '0.7rem',
          letterSpacing: '0.28em',
          color: '#9e855c',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          DATA OBSERVATION &amp; MULTI-VARIABLE INTELLIGENCE
        </div>
        <h1 style={{
          fontSize: '2.4rem',
          fontFamily: "'Cinzel', Georgia, serif",
          color: '#f4ede2',
          letterSpacing: '0.04em',
          margin: 0
        }}>
          Climate Explorer
        </h1>
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: '#998a76',
          fontSize: '0.9rem',
          marginTop: '0.4rem',
          maxWidth: '720px'
        }}>
          Explore 500 simulated city nodes across 15 atmospheric, spatial, and socioeconomic variables. Filter by land-cover classification and observe empirical distributions.
        </p>
      </div>

      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        background: '#140f0a',
        border: '1px solid #281e14',
        borderRadius: '6px',
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px' }}>
          <Search size={16} color="#9e855c" />
          <input
            type="text"
            placeholder="Search by city name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f4ede2',
              fontSize: '0.85rem',
              width: '100%',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          />
        </div>

        {/* Land Cover Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#887762', textTransform: 'uppercase' }}>
            Land Cover:
          </span>
          {['ALL', 'Urban', 'Green Space', 'Industrial', 'Water'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedLandCover(type)}
              style={{
                background: selectedLandCover === type ? '#3a2d1d' : 'transparent',
                border: selectedLandCover === type ? '1px solid #d4af37' : '1px solid #231b14',
                color: selectedLandCover === type ? '#f4ede2' : '#887762',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontFamily: "'Cinzel', Georgia, serif",
                letterSpacing: '0.08em'
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#887762', textTransform: 'uppercase' }}>
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              background: '#1d1710',
              border: '1px solid #3d2d1e',
              color: '#c5a059',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '0.75rem',
              outline: 'none'
            }}
          >
            <option value="temp_desc">Highest Temperature</option>
            <option value="temp_asc">Lowest Temperature</option>
            <option value="green_desc">Highest Greenness</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Cities List & Selected District Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }} className="grid-cols-1 lg:grid-cols-[1.4fr_1fr]">

        {/* Left: Interactive Cities Table / Cards */}
        <div style={{
          background: '#110d08',
          border: '1px solid #231b14',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #231b14',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: '#887762',
            letterSpacing: '0.1em'
          }}>
            <span>MATCHING OBSERVATIONS ({filtered.length})</span>
            <span>CLICK TO INSPECT NODE</span>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filtered.map((city) => {
              const isSelected = selectedCity?.['City Name'] === city['City Name'];
              const isHot = city['Temperature (°C)'] > 30;
              const isCool = city['Temperature (°C)'] < 20;

              return (
                <div
                  key={city['City Name']}
                  onClick={() => setSelectedCity(city)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid #1a140d',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(58, 45, 29, 0.45)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #d4af37' : '3px solid transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  className="hover:bg-[#18130d]"
                >
                  <div>
                    <div style={{
                      fontFamily: "'Cinzel', Georgia, serif",
                      color: isSelected ? '#f4ede2' : '#d8cbba',
                      fontSize: '0.95rem',
                      fontWeight: 600
                    }}>
                      {city['City Name']}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#7f6f5d',
                      marginTop: '2px',
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    }}>
                      {city['Land Cover']} · Lat {city.Latitude.toFixed(1)}°, Lon {city.Longitude.toFixed(1)}° · Elev {Math.round(city['Elevation (m)'])}m
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.1rem',
                      fontFamily: "'Cinzel', Georgia, serif",
                      fontWeight: 700,
                      color: isHot ? '#e74c3c' : isCool ? '#58d68d' : '#f4ede2'
                    }}>
                      {city['Temperature (°C)'].toFixed(1)}°C
                    </div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: '#58d68d',
                      marginTop: '2px',
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    }}>
                      {city['Urban Greenness Ratio (%)'].toFixed(1)}% Canopy
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Node Deep Inspection Card */}
        {selectedCity ? (
          <div style={{
            background: 'radial-gradient(ellipse at top, #1c150e, #110d08)',
            border: '1px solid #3d2d1e',
            borderRadius: '6px',
            padding: '1.75rem',
            position: 'sticky',
            top: '90px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid #281e14',
              paddingBottom: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: '#9e855c', textTransform: 'uppercase' }}>
                  NODE TELEMETRY
                </span>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  color: '#f4ede2',
                  margin: '0.2rem 0'
                }}>
                  {selectedCity['City Name']}
                </h2>
                <span style={{
                  display: 'inline-block',
                  background: '#281e14',
                  color: '#c5a059',
                  borderRadius: '3px',
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  {selectedCity['Land Cover']} Zone
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: '#7a6b57', letterSpacing: '0.1em' }}>SURFACE HEAT</div>
                <div style={{
                  fontSize: '2rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontWeight: 700,
                  color: selectedCity['Temperature (°C)'] > 30 ? '#e74c3c' : '#58d68d'
                }}>
                  {selectedCity['Temperature (°C)'].toFixed(1)}°C
                </div>
              </div>
            </div>

            {/* 6 Metric Panels */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}>
              <div style={{ background: '#16110b', border: '1px solid #231b14', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7a6b57', fontSize: '0.7rem' }}>
                  <Trees size={12} color="#58d68d" />
                  <span>URBAN GREENNESS</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: '#58d68d', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Urban Greenness Ratio (%)'].toFixed(1)}%
                </div>
              </div>

              <div style={{ background: '#16110b', border: '1px solid #231b14', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7a6b57', fontSize: '0.7rem' }}>
                  <Activity size={12} color="#e74c3c" />
                  <span>AIR QUALITY (AQI)</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: '#e6c875', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Air Quality Index (AQI)']}
                </div>
              </div>

              <div style={{ background: '#16110b', border: '1px solid #231b14', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7a6b57', fontSize: '0.7rem' }}>
                  <Zap size={12} color="#c5a059" />
                  <span>ENERGY CONSUMPTION</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: '#f4ede2', fontWeight: 600, marginTop: '4px' }}>
                  {Math.round(selectedCity['Energy Consumption (kWh)']).toLocaleString()} kWh
                </div>
              </div>

              <div style={{ background: '#16110b', border: '1px solid #231b14', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7a6b57', fontSize: '0.7rem' }}>
                  <Wind size={12} color="#9e855c" />
                  <span>WIND SPEED</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: '#f4ede2', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Wind Speed (km/h)'].toFixed(1)} km/h
                </div>
              </div>

              <div style={{ background: '#16110b', border: '1px solid #231b14', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7a6b57', fontSize: '0.7rem' }}>
                  <Droplets size={12} color="#3498db" />
                  <span>HUMIDITY</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: '#f4ede2', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Humidity (%)'].toFixed(1)}%
                </div>
              </div>

              <div style={{ background: '#16110b', border: '1px solid #231b14', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7a6b57', fontSize: '0.7rem' }}>
                  <Compass size={12} color="#c5a059" />
                  <span>POPULATION DENSITY</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: '#f4ede2', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Population Density (people/km²)'].toLocaleString()} /km²
                </div>
              </div>
            </div>

            {/* Scientific Caveat Banner */}
            <div style={{
              background: '#15100a',
              border: '1px solid #281e14',
              borderRadius: '4px',
              padding: '10px 12px',
              fontSize: '0.75rem',
              color: '#887762',
              display: 'flex',
              gap: '8px',
              lineHeight: 1.5,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}>
              <Info size={16} color="#c5a059" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Scientific Integrity Note:</strong> The attributes above are observational covariates from the synthetic UHI dataset. Statistical associations between greenness and surface temperature do not prove instant causal cooling.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#7a6b57', textAlign: 'center', padding: '3rem' }}>
            Select an observation to inspect details.
          </div>
        )}

      </div>
    </div>
  );
};
