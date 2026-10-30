import React, { useState, useEffect } from 'react';
import type { CityRecord } from '../../types';
import { Search, Compass, Trees, Wind, Droplets, Zap, Activity, Info, Map as MapIcon, List, Eye } from 'lucide-react';
import { InteractiveClimateMap } from '../../components/maps/InteractiveClimateMap';

// Initial fallback to ensure zero blank states if network delay occurs
const INITIAL_DEMO_CITIES: CityRecord[] = [
  { 'City Name': 'City_1', Latitude: -22.58, Longitude: 71.34, 'Elevation (m)': 833, 'Temperature (°C)': 22.98, 'Land Cover': 'Water', 'Population Density (people/km²)': 2544, 'Energy Consumption (kWh)': 7160, 'Air Quality Index (AQI)': 158, 'Urban Greenness Ratio (%)': 50.45, 'Health Impact (Mortality Rate/100k)': 14.47, 'Wind Speed (km/h)': 15.54, 'Humidity (%)': 63.67, 'Annual Rainfall (mm)': 1799, 'GDP per Capita (USD)': 7228 },
  { 'City Name': 'City_2', Latitude: 81.13, Longitude: 12.99, 'Elevation (m)': 2438, 'Temperature (°C)': 34.20, 'Land Cover': 'Urban', 'Population Density (people/km²)': 9240, 'Energy Consumption (kWh)': 42117, 'Air Quality Index (AQI)': 174, 'Urban Greenness Ratio (%)': 11.20, 'Health Impact (Mortality Rate/100k)': 38.50, 'Wind Speed (km/h)': 5.20, 'Humidity (%)': 42.10, 'Annual Rainfall (mm)': 850, 'GDP per Capita (USD)': 28400 },
  { 'City Name': 'City_3', Latitude: 41.76, Longitude: -68.57, 'Elevation (m)': 3928, 'Temperature (°C)': 10.64, 'Land Cover': 'Green Space', 'Population Density (people/km²)': 1016, 'Energy Consumption (kWh)': 4875, 'Air Quality Index (AQI)': 32, 'Urban Greenness Ratio (%)': 58.13, 'Health Impact (Mortality Rate/100k)': 8.20, 'Wind Speed (km/h)': 18.50, 'Humidity (%)': 66.67, 'Annual Rainfall (mm)': 2156, 'GDP per Capita (USD)': 18882 },
  { 'City Name': 'City_4', Latitude: 12.97, Longitude: 77.59, 'Elevation (m)': 920, 'Temperature (°C)': 31.85, 'Land Cover': 'Industrial', 'Population Density (people/km²)': 8450, 'Energy Consumption (kWh)': 39500, 'Air Quality Index (AQI)': 182, 'Urban Greenness Ratio (%)': 14.80, 'Health Impact (Mortality Rate/100k)': 41.20, 'Wind Speed (km/h)': 8.40, 'Humidity (%)': 55.30, 'Annual Rainfall (mm)': 970, 'GDP per Capita (USD)': 14200 },
  { 'City Name': 'City_5', Latitude: 28.61, Longitude: 77.20, 'Elevation (m)': 216, 'Temperature (°C)': 35.10, 'Land Cover': 'Urban', 'Population Density (people/km²)': 9890, 'Energy Consumption (kWh)': 46200, 'Air Quality Index (AQI)': 195, 'Urban Greenness Ratio (%)': 8.40, 'Health Impact (Mortality Rate/100k)': 47.90, 'Wind Speed (km/h)': 4.10, 'Humidity (%)': 38.50, 'Annual Rainfall (mm)': 680, 'GDP per Capita (USD)': 19800 },
  { 'City Name': 'City_6', Latitude: -33.86, Longitude: 151.20, 'Elevation (m)': 58, 'Temperature (°C)': 24.30, 'Land Cover': 'Water', 'Population Density (people/km²)': 4120, 'Energy Consumption (kWh)': 18400, 'Air Quality Index (AQI)': 65, 'Urban Greenness Ratio (%)': 39.50, 'Health Impact (Mortality Rate/100k)': 15.30, 'Wind Speed (km/h)': 21.00, 'Humidity (%)': 71.20, 'Annual Rainfall (mm)': 1220, 'GDP per Capita (USD)': 42100 },
  { 'City Name': 'City_7', Latitude: 35.67, Longitude: 139.65, 'Elevation (m)': 44, 'Temperature (°C)': 28.70, 'Land Cover': 'Urban', 'Population Density (people/km²)': 8900, 'Energy Consumption (kWh)': 38000, 'Air Quality Index (AQI)': 110, 'Urban Greenness Ratio (%)': 21.40, 'Health Impact (Mortality Rate/100k)': 24.10, 'Wind Speed (km/h)': 11.20, 'Humidity (%)': 58.00, 'Annual Rainfall (mm)': 1530, 'GDP per Capita (USD)': 39500 },
  { 'City Name': 'City_8', Latitude: 52.52, Longitude: 13.40, 'Elevation (m)': 34, 'Temperature (°C)': 19.50, 'Land Cover': 'Green Space', 'Population Density (people/km²)': 3800, 'Energy Consumption (kWh)': 15200, 'Air Quality Index (AQI)': 48, 'Urban Greenness Ratio (%)': 46.20, 'Health Impact (Mortality Rate/100k)': 12.00, 'Wind Speed (km/h)': 14.80, 'Humidity (%)': 64.00, 'Annual Rainfall (mm)': 570, 'GDP per Capita (USD)': 45000 },
];

export const ClimateExplorerPage: React.FC = () => {
  const [cities, setCities] = useState<CityRecord[]>(INITIAL_DEMO_CITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLandCover, setSelectedLandCover] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<CityRecord | null>(INITIAL_DEMO_CITIES[0]);
  const [sortBy, setSortBy] = useState<'temp_desc' | 'temp_asc' | 'green_desc'>('temp_desc');
  const [activeMetric, setActiveMetric] = useState<'temp' | 'green' | 'aqi' | 'energy'>('temp');
  const [viewMode, setViewMode] = useState<'map' | 'split'>('split');
  const [showRegistryInfo, setShowRegistryInfo] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('limit', '500'); // fetch complete dataset records for map
    if (selectedLandCover !== 'ALL') {
      params.set('land_cover', selectedLandCover);
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    params.set('sort_by', sortBy);

    fetch(`/api/observations?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('API fetch error');
        return res.json();
      })
      .then((data) => {
        if (data && data.items && data.items.length > 0) {
          setCities(data.items);
          if (!selectedCity) {
            setSelectedCity(data.items[0]);
          }
        }
      })
      .catch((err) => {
        console.warn('Using local observations fallback:', err);
      });
  }, [selectedLandCover, searchQuery, sortBy]);

  const filtered = cities.filter((c) => {
    const matchSearch = c['City Name'].toLowerCase().includes(searchQuery.toLowerCase()) ||
      c['Land Cover'].toLowerCase().includes(searchQuery.toLowerCase());
    const matchCover = selectedLandCover === 'ALL' || c['Land Cover'] === selectedLandCover;
    return matchSearch && matchCover;
  });

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      backgroundColor: 'var(--bg-primary)',
      padding: '2.5rem 3rem',
      color: 'var(--text-primary)',
      transition: 'background-color 0.25s ease'
    }}>
      {/* Title & Introduction */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{
            fontSize: '0.7rem',
            letterSpacing: '0.28em',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            GEOSPATIAL HEAT ATLAS &amp; MULTI-VARIABLE INTELLIGENCE
          </div>
          <h1 style={{
            fontSize: '2.4rem',
            fontFamily: "'Cinzel', Georgia, serif",
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            margin: 0
          }}>
            Climate Explorer &amp; Heat Map
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginTop: '0.4rem',
            maxWidth: '740px'
          }}>
            Explore 500 monitored city nodes across atmospheric, topographic, and socioeconomic indicators. Observe how changing land-cover and thermal regimes shifts the live atlas map below.
          </p>
        </div>

        {/* Minimal Cities & Metrics Guide Toggle */}
        <button
          onClick={() => setShowRegistryInfo(!showRegistryInfo)}
          style={{
            background: showRegistryInfo ? 'var(--gold-primary)' : 'var(--bg-secondary)',
            color: showRegistryInfo ? '#1a1208' : 'var(--text-secondary)',
            border: '1px solid var(--border-accent)',
            borderRadius: '6px',
            padding: '8px 14px',
            fontSize: '0.78rem',
            fontFamily: "'Cinzel', Georgia, serif",
            letterSpacing: '0.08em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Info size={14} />
          <span>{showRegistryInfo ? 'Hide Cities Registry Guide' : 'About the 500 Cities & Metrics'}</span>
        </button>
      </div>

      {/* MINIMAL GUIDE PANEL (Explaining What Cities & Metrics Exist) */}
      {showRegistryInfo && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-accent)',
          borderRadius: '6px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          fontSize: '0.84rem',
          lineHeight: 1.6,
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="grid-cols-1 md:grid-cols-3">
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px', fontFamily: "'Cinzel', serif" }}>
                What Cities Are Monitored?
              </div>
              <div>
                500 simulated city nodes (<code style={{ color: 'var(--text-secondary)' }}>City_1</code> to <code style={{ color: 'var(--text-secondary)' }}>City_500</code>) distributed across global latitudes (-88° to +88°) and longitudes, spanning coastal, valley, and high-altitude elevations up to 4,500m.
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px', fontFamily: "'Cinzel', serif" }}>
                Land-Cover Archetypes
              </div>
              <div>
                • <strong>Urban:</strong> High-density concrete fabric (30°C–35°C)<br />
                • <strong>Green Space:</strong> Vegetative canopy cooling (10°C–24°C)<br />
                • <strong>Industrial:</strong> High energy and heat-trapping tarmac<br />
                • <strong>Water:</strong> Riparian &amp; shoreline thermal buffering
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px', fontFamily: "'Cinzel', serif" }}>
                Key Monitored Metrics
              </div>
              <div>
                • <strong>Surface Heat:</strong> 10.0°C to 35.0°C (Model Target)<br />
                • <strong>Urban Greenness:</strong> 0.1% to 60.0% canopy cover<br />
                • <strong>Air Quality:</strong> 0 to 199 AQI index<br />
                • <strong>Energy:</strong> 1,000 to 50,000 kWh anthropogenic load
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', flex: '1 1 200px' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search by city name (e.g. City_12)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              width: '100%',
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          />
        </div>

        {/* Land Cover Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Land Cover:
          </span>
          {['ALL', 'Urban', 'Green Space', 'Industrial', 'Water'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedLandCover(type)}
              style={{
                background: selectedLandCover === type ? 'var(--gold-primary)' : 'transparent',
                border: selectedLandCover === type ? '1px solid var(--gold-primary)' : '1px solid var(--border-color)',
                color: selectedLandCover === type ? '#1a1208' : 'var(--text-muted)',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: selectedLandCover === type ? 700 : 500,
                cursor: 'pointer',
                fontFamily: "'Cinzel', Georgia, serif",
                letterSpacing: '0.08em',
                transition: 'all 0.15s ease'
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* View Mode Toggle (Map vs Split) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-input)', padding: '2px', borderRadius: '4px' }}>
          <button
            onClick={() => setViewMode('split')}
            style={{
              background: viewMode === 'split' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'split' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <MapIcon size={12} />
            <span>Map &amp; Registry</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            style={{
              background: viewMode === 'map' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'map' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Eye size={12} />
            <span>Map Focus</span>
          </button>
        </div>
      </div>

      {/* 1. INTERACTIVE CLIMATE HEAT MAP */}
      <div style={{ marginBottom: '2rem' }}>
        <InteractiveClimateMap
          cities={filtered}
          selectedCity={selectedCity}
          onSelectCity={(city) => setSelectedCity(city)}
          activeMetric={activeMetric}
          onChangeMetric={(m) => setActiveMetric(m)}
          selectedLandCover={selectedLandCover}
        />
      </div>

      {/* 2. SPLIT VIEW: REGISTRY LIST & SELECTED TELEMETRY CARD */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'map' ? '1fr' : '1.3fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }} className="grid-cols-1 lg:grid-cols-[1.3fr_1fr]">

        {/* Left: Observations Table */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em'
          }}>
            <span>MATCHING OBSERVATIONS ({filtered.length})</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-accent)',
                  color: 'var(--text-secondary)',
                  borderRadius: '3px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  outline: 'none'
                }}
              >
                <option value="temp_desc">Highest Temperature</option>
                <option value="temp_asc">Lowest Temperature</option>
                <option value="green_desc">Highest Greenness</option>
              </select>
            </div>
          </div>

          <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
            {filtered.map((city) => {
              const isSelected = selectedCity?.['City Name'] === city['City Name'];
              const isHot = city['Temperature (°C)'] > 30;
              const isCool = city['Temperature (°C)'] < 20;

              return (
                <div
                  key={city['City Name']}
                  onClick={() => setSelectedCity(city)}
                  style={{
                    padding: '0.9rem 1.25rem',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-card)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--gold-primary)' : '3px solid transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  className="hover:bg-[var(--bg-card)]"
                >
                  <div>
                    <div style={{
                      fontFamily: "'Cinzel', Georgia, serif",
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontSize: '0.92rem',
                      fontWeight: 600
                    }}>
                      {city['City Name']}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '2px'
                    }}>
                      {city['Land Cover']} · Lat {city.Latitude.toFixed(1)}°, Lon {city.Longitude.toFixed(1)}° · Elev {Math.round(city['Elevation (m)'])}m
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.05rem',
                      fontFamily: "'Cinzel', Georgia, serif",
                      fontWeight: 700,
                      color: isHot ? '#e74c3c' : isCool ? '#2ecc71' : 'var(--text-primary)'
                    }}>
                      {city['Temperature (°C)'].toFixed(1)}°C
                    </div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: '#27ae60',
                      marginTop: '2px'
                    }}>
                      {city['Urban Greenness Ratio (%)'].toFixed(1)}% Canopy
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Node Telemetry Inspector */}
        {selectedCity && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-accent)',
            borderRadius: '6px',
            padding: '1.75rem',
            position: 'sticky',
            top: '90px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  NODE TELEMETRY
                </span>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  color: 'var(--text-primary)',
                  margin: '0.2rem 0'
                }}>
                  {selectedCity['City Name']}
                </h2>
                <span style={{
                  display: 'inline-block',
                  background: 'var(--bg-input)',
                  color: 'var(--text-secondary)',
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
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>SURFACE HEAT</div>
                <div style={{
                  fontSize: '2rem',
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontWeight: 700,
                  color: selectedCity['Temperature (°C)'] > 30 ? '#e74c3c' : '#2ecc71'
                }}>
                  {selectedCity['Temperature (°C)'].toFixed(1)}°C
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <Trees size={12} color="#27ae60" />
                  <span>URBAN GREENNESS</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: '#27ae60', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Urban Greenness Ratio (%)'].toFixed(1)}%
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <Activity size={12} color="#e74c3c" />
                  <span>AIR QUALITY (AQI)</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: 'var(--gold-primary)', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Air Quality Index (AQI)']}
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <Zap size={12} color="var(--gold-primary)" />
                  <span>ENERGY CONSUMPTION</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '4px' }}>
                  {Math.round(selectedCity['Energy Consumption (kWh)']).toLocaleString()} kWh
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <Wind size={12} color="var(--text-secondary)" />
                  <span>WIND SPEED</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Wind Speed (km/h)'].toFixed(1)} km/h
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <Droplets size={12} color="#3498db" />
                  <span>HUMIDITY</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Humidity (%)'].toFixed(1)}%
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <Compass size={12} color="var(--gold-primary)" />
                  <span>POPULATION DENSITY</span>
                </div>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '4px' }}>
                  {selectedCity['Population Density (people/km²)'].toLocaleString()} /km²
                </div>
              </div>
            </div>

            {/* Coordinates & Scientific Note */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '10px 12px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '8px',
              lineHeight: 1.5
            }}>
              <Info size={16} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                Location plotted at Latitude {selectedCity.Latitude.toFixed(2)}°, Longitude {selectedCity.Longitude.toFixed(2)}°. Observational covariates reflect the Kaggle urban climate benchmark.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
