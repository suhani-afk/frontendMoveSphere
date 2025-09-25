import React, { useEffect, useState } from 'react';
import '../styles/style.css';

import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

axios.get(`${apiBaseUrl}/some-endpoint`)
  .then(response => {
    console.log(response.data);
  });


const Infrastructure = () => {
  const [city, setCity] = useState('');
  const [type, setType] = useState('warehouse');
  const [ownership, setOwnership] = useState('any');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Placeholder: Replace with actual API call and update results
    setResults([
      {
        id: 1,
        name: `${type} in ${city || 'any city'}`,
        ownership,
        description: `Sample description for ${type} owned by ${ownership}.`,
      },
    ]);
  };

  return (
    <section className="section">
      <h2>Infrastructure directory</h2>
      <p className="muted">
        Search warehouses, hangars, ports, and depots by city and filters.
      </p>

      <div className="filters">
        <input
          id="infraCity"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <select
          id="infraType"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="warehouse">Warehouse</option>
          <option value="hangar">Airport Hangar</option>
          <option value="port">Port/Harbour</option>
          <option value="depot">Truck Depot</option>
        </select>

        <select
          id="ownership"
          value={ownership}
          onChange={(e) => setOwnership(e.target.value)}
        >
          <option value="any">Any ownership</option>
          <option value="government">Government</option>
          <option value="private">Private</option>
        </select>

        <button className="btn btn-primary" id="searchInfra" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div id="infraResults" className="cards grid-list">
        {results.length > 0 ? (
          results.map(({ id, name, ownership, description }) => (
            <div key={id} className="card">
              <h3>{name}</h3>
              <p><strong>Ownership:</strong> {ownership}</p>
              <p>{description}</p>
            </div>
          ))
        ) : (
          <p>No results to display.</p>
        )}
      </div>
    </section>
  );
};

export default Infrastructure;
