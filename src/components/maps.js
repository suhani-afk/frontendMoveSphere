import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../styles/style.css';

// Example: Replace with your backend/database fetch later
const warehouseLocations = [
  { id: 1, name: 'Mumbai Office', position: { lat: 19.076, lng: 72.8777 } },
  { id: 2, name: 'Navi Mumbai Warehouse', position: { lat: 19.033, lng: 73.0297 } },
  { id: 3, name: 'Jawaharlal Nehru Port', position: { lat: 18.9465, lng: 72.952 } },
  { id: 4, name: 'Delhi Depot', position: { lat: 28.7041, lng: 77.1025 } },
  { id: 5, name: 'Kolkata Warehouse', position: { lat: 22.5726, lng: 88.3639 } },
];

const GPSMaps = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India center
  const [zoom, setZoom] = useState(5); // default zoom
  const [activeMarker, setActiveMarker] = useState(null); // marker to highlight

  const handleSearch = () => {
    const filtered = warehouseLocations.filter((loc) =>
      loc.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);

    if (filtered.length > 0) {
      setMapCenter(filtered[0].position);
      setZoom(12);
      setActiveMarker(filtered[0].id);

      // Stop bounce after 3 seconds
      setTimeout(() => setActiveMarker(null), 3000);
    }
  };

  const handleResultClick = (item) => {
    setMapCenter(item.position);
    setZoom(12);
    setActiveMarker(item.id);

    setTimeout(() => setActiveMarker(null), 3000);
  };

  return (
    <section className="section">
      <h2>GPS & Maps</h2>
      <p className="muted">
        Use live maps to find nearest offices, warehouses, ports, or depots.
      </p>

      {/* Search Bar */}
      <div className="filters">
        <input
          id="mapsQuery"
          placeholder="Search e.g., warehouse Mumbai"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" id="searchMaps" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Flex container: Results on left, Map on right */}
      <div className="map-layout">
        {/* Search Results */}
        <div className="results-panel">
          <h3>Search Results</h3>
          {results.length > 0 ? (
            <ul>
              {results.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleResultClick(item)}
                  style={{
                    cursor: 'pointer',
                    margin: '6px 0',
                    padding: '6px',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No search results yet.</p>
          )}
        </div>

        {/* Google Map Integration */}
        <div className="map-container">
          <LoadScript googleMapsApiKey="AIzaSyAQdYKsx9bubs4hEs9SqwQPyYyQralHPBo">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '600px', borderRadius: '12px' }}
              center={mapCenter}
              zoom={zoom}
            >
              {warehouseLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={loc.position}
                  title={loc.name}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  }}
                  animation={activeMarker === loc.id ? window.google.maps.Animation.BOUNCE : null}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </section>
  );
};

export default GPSMaps;
