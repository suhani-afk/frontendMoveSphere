// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/style.css';

// const Compliance = () => {
//   const [category, setCategory] = useState('export');
//   const [city, setCity] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [postMessage, setPostMessage] = useState('');

//   // GET request
//   const loadComplianceSteps = async () => {
//     setLoading(true);
//     setError('');
//     setResults([]);
//     setPostMessage('');
//     try {
//       const response = await axios.get('/api/compliance', {
//         params: { category, city },
//       });
//       if (response.data && response.data.steps) {
//         setResults(response.data.steps);
//       } else {
//         setResults(['No compliance steps found.']);
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Failed to load compliance steps. Try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // POST request
//   const submitCompliance = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setPostMessage('');
//     try {
//       const response = await axios.post('/api/compliance', { category, city });
//       if (response.data && response.data.message) {
//         setPostMessage(response.data.message);
//       } else {
//         setPostMessage('Submitted successfully!');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Failed to submit compliance data. Try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="section">
//       <h2>Compliance guidance</h2>
//       <p className="muted">
//         Pick a category to see step-by-step docs, portals, and nearest offices.
//       </p>

//       <form className="filters" onSubmit={submitCompliance}>
//         <select
//           id="complianceCategory"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         >
//           <option value="export">Export logistics</option>
//           <option value="road">Road transport (RTO/trucking)</option>
//           <option value="aviation">Aviation cargo</option>
//           <option value="ports">Ports & customs</option>
//           <option value="environment">Pollution NOCs</option>
//         </select>

//         <input
//           id="cityInput"
//           placeholder="City or PIN (optional)"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//         />

//         <button className="btn btn-primary" id="loadCompliance" type="button" onClick={loadComplianceSteps}>
//           {loading ? 'Loading...' : 'Load steps'}
//         </button>
//         <button className="btn btn-secondary" type="submit" disabled={loading}>
//           Submit Compliance
//         </button>
//       </form>

//       <div id="complianceResults" className="list">
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         {postMessage && <p style={{ color: 'green' }}>{postMessage}</p>}
//         {results.length > 0 && !error ? (
//           <ul>
//             {results.map((step, idx) => (
//               <li key={idx}>{step}</li>
//             ))}
//           </ul>
//         ) : !loading && !error && !postMessage ? (
//           <p>No compliance steps loaded yet.</p>
//         ) : null}
//       </div>
//     </section>
//   );
// };

// export default Compliance;
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../styles/style.css';

const SAMPLE_STEPS = [
  {
    id: 1,
    title: 'Business Registration',
    required: true,
    description: 'Register your business entity with the appropriate authorities.',
    documents: ['PAN Card', 'Address Proof', 'Identity Proof'],
    resources: [
      { label: 'MCA Portal', href: '#' },
      { label: 'ROC Filing', href: '#' }
    ],
    completed: false
  },
  {
    id: 2,
    title: 'GST Registration',
    required: true,
    description: 'Obtain Goods and Services Tax registration number.',
    documents: ['Business Registration Certificate', 'Bank Statement', 'Address Proof'],
    resources: [
      { label: 'GST Portal', href: '#' },
      { label: 'GST Registration Guide', href: '#' }
    ],
    completed: false
  },
  {
    id: 3,
    title: 'Import Export Code (IEC)',
    required: false,
    description: 'Required for international trade operations.',
    documents: ['PAN Card', 'Bank Certificate', 'Address Proof'],
    resources: [
      { label: 'DGFT Portal', href: '#' },
      { label: 'IEC Application', href: '#' }
    ],
    completed: false
  },
  {
    id: 4,
    title: 'Environmental Clearance',
    required: false,
    description: 'Environmental compliance for manufacturing/storage facilities.',
    documents: ['Project Report', 'Site Plan', 'Environmental Impact Assessment'],
    resources: [
      { label: 'SPCB Portal', href: '#' },
      { label: 'Environmental Clearance', href: '#' }
    ],
    completed: false
  },
  {
    id: 5,
    title: 'Labor Compliance',
    required: true,
    description: 'Compliance with labor laws and employee regulations',
    documents: ['Employee Contracts', 'Salary Records', 'PF Registration'],
    resources: [
      { label: 'Labour Ministry', href: '#' },
      { label: 'EPF Portal', href: '#' }
    ],
    completed: false
  },
  {
    id: 6,
    title: 'Fire Safety Certificate',
    required: true,
    description: 'Fire safety compliance for commercial establishments',
    documents: ['Building Plan', 'Fire Safety Equipment List', 'NOC from Local Authority'],
    resources: [
      { label: 'Fire Department Portal', href: '#' },
      { label: 'Safety Guidelines', href: '#' }
    ],
    completed: false
  }
];

const Badge = ({ kind, children }) => (
  <span className={`cmp-badge ${kind === 'required' ? 'required' : 'conditional'}`}>{children}</span>
);

const Compliance = () => {
  const [category, setCategory] = useState('export');
  const [city, setCity] = useState('');
  const [steps, setSteps] = useState(SAMPLE_STEPS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const loadComplianceSteps = async () => {
    setLoading(true); setError(''); setInfo('');
    try {
      const response = await axios.get('/api/compliance', { params: { category, city } });
      if (response?.data?.steps?.length) {
        const normalized = response.data.steps.map((s, i) => ({
          id: s.id ?? i + 1,
          title: s.title ?? 'Untitled',
          required: !!s.required,
          description: s.description ?? '',
          documents: s.documents ?? [],
          resources: s.resources ?? [],
          completed: !!s.completed
        }));
        setSteps(normalized);
      } else {
        setInfo('No compliance steps found for the filters. Showing defaults.');
        setSteps(SAMPLE_STEPS);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load compliance steps. Showing default template.');
      setSteps(SAMPLE_STEPS);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const summary = useMemo(() => {
    const totalReq = steps.filter(s => s.required).length;
    const totalCond = steps.filter(s => !s.required).length;
    const completed = steps.filter(s => s.completed).length;
    const rate = steps.length ? Math.round((completed / steps.length) * 100) : 0;
    return { totalReq, totalCond, rate };
  }, [steps]);

  useEffect(() => {
    // keep samples on first render; call loadComplianceSteps() if you want API-first
  }, []);

  return (
    <section className="section">
      <h2>Compliance Management</h2>
      <p className="muted">Navigate regulatory requirements with step-by-step guidance and official links.</p>

      {/* Summary */}
      <div className="cmp-summary">
        <div className="cmp-card kpi">
          <div className="kpi-title">Required Steps</div>
          <div className="kpi-value">{summary.totalReq}</div>
        </div>
        <div className="cmp-card kpi">
          <div className="kpi-title">Conditional Steps</div>
          <div className="kpi-value">{summary.totalCond}</div>
        </div>
        <div className="cmp-card kpi">
          <div className="kpi-title">Completion Rate</div>
          <div className="kpi-value">{summary.rate}%</div>
        </div>
      </div>

      {/* Filters */}
      <form className="filters" onSubmit={(e)=>{e.preventDefault(); loadComplianceSteps();}}>
        <select value={category} onChange={(e)=> setCategory(e.target.value)}>
          <option value="export">Export logistics</option>
          <option value="road">Road transport (RTO/trucking)</option>
          <option value="aviation">Aviation cargo</option>
          <option value="ports">Ports & customs</option>
          <option value="environment">Pollution NOCs</option>
        </select>
        <input
          placeholder="City or PIN (optional)"
          value={city}
          onChange={(e)=> setCity(e.target.value)}
        />
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Loading…' : 'Load steps'}</button>
      </form>

      {error && <div className="alert warn">{error}</div>}
      {info && <div className="alert success">{info}</div>}

      <h3 className="cmp-subtitle">Compliance Checklist</h3>

      <div className="cmp-list">
        {steps.map((s, i) => (
          <div className="cmp-card step" key={s.id}>
            <div className="cmp-card-head">
              <div className="step-index">{i + 1}</div>
              <div className="step-main">
                <div className="step-title">
                  {s.title}{' '}
                  <Badge kind={s.required ? 'required' : 'conditional'}>
                    {s.required ? 'Required' : 'Conditional'}
                  </Badge>
                </div>
                <div className="step-desc muted">{s.description}</div>
              </div>
              <div className="step-actions">
                <button
                  type="button"
                  className={`btn cmp-complete ${s.completed ? 'is-done' : ''}`}
                  onClick={() => toggleComplete(s.id)}
                >
                  {s.completed ? 'Completed' : 'Mark as Completed'}
                </button>
              </div>
            </div>

            <div className="cmp-card-body">
              <div className="row">
                <div className="col">
                  <div className="row-title">Required Documents</div>
                  <div className="chip-row">
                    {s.documents.map((d, idx) => (
                      <span className="chip" key={idx}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="row-title">Official Resources</div>
                  <div className="chip-row">
                    {s.resources.map((r, idx) => (
                      <a className="chip link" href={r.href} target="_blank" rel="noreferrer" key={idx}>
                        {r.label} <span className="ext">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Help panel */}
        <div className="cmp-card help">
          <div className="help-title">Need Help?</div>
          <p className="muted">Our compliance experts are here to assist with complex requirements.</p>
          <div className="help-actions">
            <button className="btn primary">Contact Compliance Expert</button>
            <button className="btn">Schedule Consultation</button>
            <button className="btn">Download Compliance Guide</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Compliance;
