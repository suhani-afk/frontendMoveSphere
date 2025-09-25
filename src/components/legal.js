import React, { useState } from 'react';
import '../styles/style.css';

const LegalSupport = () => {
  const [city, setCity] = useState('');
  const [caseType, setCaseType] = useState('contract');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Placeholder: replace with API call to fetch legal support data
    const dummyResults = [
      `Legal support for ${caseType} cases`,
      city ? `Filtered by city: ${city}` : 'No city filter applied',
      'Court: District Court Hall 4',
      'Lawyer: John Doe - contact: 123456789',
      'Applicable Acts: Trade Disputes Act, 1929',
    ];
    setResults(dummyResults);
  };

  return (
    <section className="section">
      <h2>Legal & court support</h2>
      <p className="muted">
        Find relevant courts, hall numbers, lawyers, and related acts for trade disputes.
      </p>

      <div className="filters">
        <input
          id="legalCity"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <select
          id="caseType"
          value={caseType}
          onChange={(e) => setCaseType(e.target.value)}
        >
          <option value="contract">Contract disputes</option>
          <option value="customs">Customs & trade</option>
          <option value="transport">Transport compliance</option>
          <option value="environment">Environment & NOC</option>
        </select>

        <button className="btn btn-primary" id="searchLegal" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div id="legalResults" className="list">
        {results.length > 0 ? (
          <ul>
            {results.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No search results yet.</p>
        )}
      </div>
    </section>
  );
};

export default LegalSupport;
