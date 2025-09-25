import React, { useState } from 'react';
import axios from 'axios';
import '../styles/style.css';

const Compliance = () => {
  const [category, setCategory] = useState('export');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postMessage, setPostMessage] = useState('');

  // GET request
  const loadComplianceSteps = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    setPostMessage('');
    try {
      const response = await axios.get('/api/compliance', {
        params: { category, city },
      });
      if (response.data && response.data.steps) {
        setResults(response.data.steps);
      } else {
        setResults(['No compliance steps found.']);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load compliance steps. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  // POST request
  const submitCompliance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPostMessage('');
    try {
      const response = await axios.post('/api/compliance', { category, city });
      if (response.data && response.data.message) {
        setPostMessage(response.data.message);
      } else {
        setPostMessage('Submitted successfully!');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit compliance data. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <h2>Compliance guidance</h2>
      <p className="muted">
        Pick a category to see step-by-step docs, portals, and nearest offices.
      </p>

      <form className="filters" onSubmit={submitCompliance}>
        <select
          id="complianceCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="export">Export logistics</option>
          <option value="road">Road transport (RTO/trucking)</option>
          <option value="aviation">Aviation cargo</option>
          <option value="ports">Ports & customs</option>
          <option value="environment">Pollution NOCs</option>
        </select>

        <input
          id="cityInput"
          placeholder="City or PIN (optional)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button className="btn btn-primary" id="loadCompliance" type="button" onClick={loadComplianceSteps}>
          {loading ? 'Loading...' : 'Load steps'}
        </button>
        <button className="btn btn-secondary" type="submit" disabled={loading}>
          Submit Compliance
        </button>
      </form>

      <div id="complianceResults" className="list">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {postMessage && <p style={{ color: 'green' }}>{postMessage}</p>}
        {results.length > 0 && !error ? (
          <ul>
            {results.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        ) : !loading && !error && !postMessage ? (
          <p>No compliance steps loaded yet.</p>
        ) : null}
      </div>
    </section>
  );
};

export default Compliance;
