// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/style.css';

// const Bidding = () => {
//   const [step, setStep] = useState('choice'); // choice -> participate -> conduct -> terms
//   const [participateOption, setParticipateOption] = useState(null);
//   const [bidDetails, setBidDetails] = useState({
//     title: '',
//     description: '',
//     startDate: '',
//     endDate: '',
//     minimumBid: '',
//   });
//   const [ongoingBids, setOngoingBids] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [submitMessage, setSubmitMessage] = useState('');

//   // Load ongoing bids from backend on 'participate' step
//   useEffect(() => {
//     if (step === 'participate') {
//       setLoading(true);
//       setError('');
//       axios.get('/api/bidding')
//         .then(res => setOngoingBids(res.data))
//         .catch(err => {
//           setError('Failed to load ongoing bids');
//           console.error(err);
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [step]);

//   const handleNext = () => setStep('terms');

//   const handleBidChange = (e) => {
//     setBidDetails({ ...bidDetails, [e.target.name]: e.target.value });
//   };

//   // Submit new bid to backend
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSubmitMessage('');
//     try {
//       const response = await axios.post('/api/bidding', bidDetails);
//       setSubmitMessage(response.data.message || 'Bid submitted successfully');
//       setBidDetails({
//         title: '',
//         description: '',
//         startDate: '',
//         endDate: '',
//         minimumBid: '',
//       });
//       setStep('choice');
//     } catch (err) {
//       setError('Failed to submit bid.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="section">
//       <h2>Bidding</h2>

//       {step === 'choice' && (
//         <div className="cards">
//           <div className="card" onClick={() => setStep('participate')}>
//             <h3>Participate in Bidding</h3>
//             <p>View ongoing and upcoming biddings and place your bids.</p>
//           </div>
//           <div className="card" onClick={() => setStep('conduct')}>
//             <h3>Conduct a Bid</h3>
//             <p>Create a new bidding for your warehouse, hangar, or port services.</p>
//           </div>
//         </div>
//       )}

//       {step === 'participate' && (
//         <div>
//           <h3>Ongoing & Upcoming Bids</h3>
//           {loading ? (
//             <p>Loading...</p>
//           ) : error ? (
//             <p style={{ color: 'red' }}>{error}</p>
//           ) : ongoingBids.length ? (
//             <ul className="cards">
//               {ongoingBids.map((bid, i) => (
//                 <li key={i} className="card">
//                   <h4>{bid.title}</h4>
//                   <p>Start: {bid.startDate}</p>
//                   <p>End: {bid.endDate}</p>
//                   <button className="btn btn-primary" onClick={handleNext}>
//                     Participate
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No bids available at the moment.</p>
//           )}
//           <button className="btn btn-secondary" onClick={() => setStep('choice')}>
//             Back to choices
//           </button>
//         </div>
//       )}

//       {step === 'conduct' && (
//         <form className="auth-form" onSubmit={handleSubmit}>
//           <h3>Conduct a Bid</h3>
//           <input
//             type="text"
//             name="title"
//             placeholder="Bid Title"
//             value={bidDetails.title}
//             onChange={handleBidChange}
//             required
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={bidDetails.description}
//             onChange={handleBidChange}
//             required
//           />
//           <input
//             type="date"
//             name="startDate"
//             value={bidDetails.startDate}
//             onChange={handleBidChange}
//             required
//           />
//           <input
//             type="date"
//             name="endDate"
//             value={bidDetails.endDate}
//             onChange={handleBidChange}
//             required
//           />
//           <input
//             type="number"
//             name="minimumBid"
//             placeholder="Minimum Bid Amount"
//             value={bidDetails.minimumBid}
//             onChange={handleBidChange}
//             required
//           />
//           <button className="btn btn-primary" type="submit" disabled={loading}>
//             {loading ? 'Submitting...' : 'Next: Terms & Conditions'}
//           </button>
//         </form>
//       )}

//       {step === 'terms' && (
//         <div className="auth-form">
//           <h3>Terms & Conditions</h3>
//           <div style={{ maxHeight: '250px', overflowY: 'scroll', padding: '0.5rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
//             <p>1. All bids must comply with local laws and regulations.</p>
//             <p>2. Participants must provide valid identification.</p>
//             <p>3. Bids cannot be withdrawn once submitted.</p>
//             <p>4. The organizer is responsible for accurate bid details.</p>
//             <p>5. Any dispute will be resolved according to company policies.</p>
//             <p>6. Participants agree to the privacy and security terms of the platform.</p>
//             <p>7. The company is not liable for any external issues affecting the bid.</p>
//             <p>8. Failure to comply with T&C may result in disqualification.</p>
//           </div>
//           <button className="btn btn-primary" onClick={() => setStep('choice')}>
//             I Agree & Submit
//           </button>
//           {submitMessage && <p style={{ color: 'green' }}>{submitMessage}</p>}
//           {error && <p style={{ color: 'red' }}>{error}</p>}
//         </div>
//       )}
//     </section>
//   );
// };

// export default Bidding;

// src/components/bidding.js
// src/components/bidding.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../styles/style.css';

// optional: set a baseURL if no dev proxy
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || '' // e.g., http://localhost:5000
});

const Bidding = () => {
  const [step, setStep] = useState('choice'); // choice | participate | conduct | terms

  // Admin rules (seconds-based storage; UI can show minutes where needed)
  const [rules, setRules] = useState({
    minStart: 1000,
    minIncrement: 100,
    endAtIso: '',
    graceSeconds: 180,
    extendSeconds: 120,
    highestValidSeconds: 120,
    allowForceClose: true,
    reserve: 0
  });

  // Auction metadata (for headers on participate)
  const [auctionMeta, setAuctionMeta] = useState({
    title: '',
    warehouseId: '',
    location: '',
    startAtIso: '',
    endAtIso: ''
  });

  // Lists and UI state
  const [ongoingBids, setOngoingBids] = useState([]);
  const [bids, setBids] = useState([]);
  const [filters, setFilters] = useState({ user: '', min: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  // Timer
  const [countdown, setCountdown] = useState('--:--');
  const [auctionStatus, setAuctionStatus] = useState('open'); // open | paused | closed
  const endAtRef = useRef(null);
  const tickRef = useRef(null);

  // Participant bidding state
  const [bidAmount, setBidAmount] = useState(0);
  const [bidNote, setBidNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidInfo, setBidInfo] = useState('');

  // Load list tiles when entering participate (optional tiles view)
  useEffect(() => {
    if (step === 'participate') {
      setLoading(true);
      setError('');
      API.get('/api/bidding')
        .then(r => setOngoingBids(r.data))
        .catch(e => { setError('Failed to load ongoing bids'); console.error(e); })
        .finally(() => setLoading(false));
    }
  }, [step]);

  // Load current auction and its bids for admin conduct view
  useEffect(() => {
    if (step === 'conduct') {
      setLoading(true);
      setError('');
      Promise.all([
        API.get('/api/auctions/current'),
        API.get('/api/auctions/current/bids')
      ])
        .then(([aRes, bRes]) => {
          const a = aRes.data || {};
          setRules(prev => ({
            ...prev,
            minStart: a.minStart ?? prev.minStart,
            minIncrement: a.minIncrement ?? prev.minIncrement,
            graceSeconds: a.graceSeconds ?? prev.graceSeconds,
            extendSeconds: a.extendSeconds ?? prev.extendSeconds,
            highestValidSeconds: a.highestValidSeconds ?? prev.highestValidSeconds,
            allowForceClose: a.allowForceClose ?? prev.allowForceClose,
            reserve: a.reserve ?? prev.reserve,
            endAtIso: a.endAtIso ?? prev.endAtIso
          }));
          setAuctionMeta({
            title: a.title || '',
            warehouseId: a.warehouseId || a.assetId || '',
            location: a.location || a.city || '',
            startAtIso: a.startAtIso || a.startAt || '',
            endAtIso: a.endAtIso || a.endAt || ''
          });
          if (a.endAtIso || a.endAt) endAtRef.current = new Date(a.endAtIso || a.endAt);
          setBids(Array.isArray(bRes.data) ? bRes.data : []);
          setAuctionStatus(a.status || 'open');
        })
        .catch(e => { setError('Failed to load auction settings'); console.error(e); })
        .finally(() => setLoading(false));
    }
  }, [step]);

  // Also pull live auction/bids when entering participate
  useEffect(() => {
    if (step === 'participate') {
      API.get('/api/auctions/current')
        .then(r => {
          const a = r.data || {};
          setRules(prev => ({ ...prev, ...a }));
          setAuctionMeta({
            title: a.title || '',
            warehouseId: a.warehouseId || a.assetId || '',
            location: a.location || a.city || '',
            startAtIso: a.startAtIso || a.startAt || '',
            endAtIso: a.endAtIso || a.endAt || ''
          });
          if (a.endAtIso || a.endAt) endAtRef.current = new Date(a.endAtIso || a.endAt);
        })
        .catch(() => {});
      API.get('/api/auctions/current/bids')
        .then(r => setBids(Array.isArray(r.data) ? r.data : []))
        .catch(() => {});
    }
  }, [step]);

  // Countdown tick
  useEffect(() => {
    clearInterval(tickRef.current);
    if (auctionStatus !== 'open' || !endAtRef.current) { setCountdown('--:--'); return; }
    tickRef.current = setInterval(() => {
      if (auctionStatus !== 'open' || !endAtRef.current) { setCountdown('--:--'); return; }
      const ms = endAtRef.current.getTime() - Date.now();
      if (ms <= 0) { setCountdown('00:00'); setAuctionStatus('closed'); clearInterval(tickRef.current); return; }
      const s = Math.floor(ms / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2,'0');
      const ss = String(s % 60).padStart(2,'0');
      setCountdown(`${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [rules.endAtIso, auctionStatus]);

  // Derived prices
  const leadingBid = useMemo(() => bids.find(b => b.status === 'leading') || null, [bids]);
  const currentPrice = useMemo(() => leadingBid ? leadingBid.amount : 0, [leadingBid]);
  const requiredNextBid = useMemo(
    () => currentPrice ? currentPrice + Number(rules.minIncrement || 0) : Number(rules.minStart || 0),
    [currentPrice, rules.minStart, rules.minIncrement]
  );

  // Admin handlers
  const handleRuleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setRules(r => ({ ...r, [name]: type === 'checkbox' ? checked : value }));
  };

  const setEndFromInput = (value) => {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      endAtRef.current = d;
      setRules(r => ({ ...r, endAtIso: d.toISOString() }));
    }
  };

  const saveRules = async () => {
    try {
      setError('');
      const payload = {
        ...rules,
        minStart: Number(rules.minStart || 0),
        minIncrement: Number(rules.minIncrement || 0),
        graceSeconds: Number(rules.graceSeconds || 0),
        extendSeconds: Number(rules.extendSeconds || 0),
        highestValidSeconds: Number(rules.highestValidSeconds || 0),
        reserve: Number(rules.reserve || 0)
      };
      if (!payload.endAtIso) throw new Error('Set end time');
      if (payload.minIncrement < 1) throw new Error('Min increment must be ≥ 1');
      await API.patch('/api/auctions/current', payload);
      setSubmitMessage('Rules saved');
    } catch (e) {
      setError(e.message || 'Failed to save rules');
    }
  };

  const forceClose = async () => {
    if (!rules.allowForceClose) { setError('Force close disabled by policy.'); return; }
    setAuctionStatus('closed');
    try { await API.post('/api/auctions/current/force-close'); } catch(e){ console.error(e); }
  };

  const applyFilters = () => {};
  const clearFilters = () => setFilters({ user:'', min:'' });

  const exportCsv = () => {
    const rows = [['bidder','amount','time_utc','status']];
    bids.forEach(b => rows.push([b.user, String(b.amount), (b.tsIso||'').replace('T',' ').slice(0,19), b.status]));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bids.csv'; a.click(); URL.revokeObjectURL(url);
  };

  // Participant: submit bid with optimistic update and anti‑snipe
  const submitBid = async () => {
    setBidError(''); setBidInfo('');
    const required = requiredNextBid;
    if (Number(bidAmount) < required) { setBidError(`Bid must be at least ${required.toLocaleString()}.`); return; }
    if (auctionStatus !== 'open') { setBidError('Auction is not open.'); return; }

    setPlacing(true);
    const prevLeading = bids.find(b => b.status === 'leading') || null;

    const optimistic = {
      user: 'me', // TODO: replace with authenticated user identity
      amount: Number(bidAmount),
      tsIso: new Date().toISOString(),
      status: 'leading',
      optimistic: true
    };
    setBids(prev => [{...optimistic}, ...prev.map(b => ({...b, status: b.status==='leading'?'outbid':b.status}))]);

    // Anti‑snipe extension
    if (endAtRef.current && Number(rules.graceSeconds) > 0 && Number(rules.extendSeconds) > 0) {
      const msLeft = endAtRef.current.getTime() - Date.now();
      if (msLeft <= Number(rules.graceSeconds) * 1000) {
        endAtRef.current = new Date(endAtRef.current.getTime() + Number(rules.extendSeconds) * 1000);
        setRules(r => ({ ...r, endAtIso: endAtRef.current.toISOString() }));
      }
    }

    try {
      const res = await API.post('/api/auctions/current/bids', {
        amount: Number(bidAmount),
        note: bidNote
      });
      if (res?.data?.bid) {
        setBids(prev => {
          const copy = [...prev];
          const idx = copy.findIndex(b => b.optimistic);
          if (idx >= 0) copy[idx] = { ...res.data.bid };
          return copy;
        });
        setBidInfo('Bid placed successfully.');
      } else {
        setBidInfo('Bid submitted.');
      }
    } catch (e) {
      setBids(prev => {
        const copy = prev.filter(b => !b.optimistic);
        if (prevLeading) copy.unshift(prevLeading);
        return copy;
      });
      setBidError('Failed to place bid. Please try again.');
    } finally {
      setPlacing(false);
      setBidAmount(requiredNextBid);
    }
  };

  return (
    <section className="section admin-dark snap-like">
      {step !== 'choice' && (
        <div className="toolbar">
          <button className="btn btn-secondary" onClick={() => setStep('choice')}>← Back to choices</button>
        </div>
      )}

      {step === 'choice' && (
        <div className="cards">
          <div className="card" onClick={() => setStep('participate')}>
            <h3>Participate in Bidding</h3>
            <p>View ongoing and upcoming biddings.</p>
          </div>
          <div className="card" onClick={() => setStep('conduct')}>
            <h3>Conduct a Bid</h3>
            <p>Configure rules and monitor bids.</p>
          </div>
        </div>
      )}

      {step === 'conduct' && (
        <div className="adm-grid">
          <div className="adm-card">
            <h3>Auction settings</h3>

            <div className="adm-row">
              <div>
                <label>Start price (min bid)</label>
                <input type="number" name="minStart" min="0" value={rules.minStart} onChange={handleRuleChange}/>
              </div>
              <div>
                <label>Min increment</label>
                <input type="number" name="minIncrement" min="1" value={rules.minIncrement} onChange={handleRuleChange}/>
              </div>
            </div>

            <div className="adm-row">
              <div>
                <label>Ends at (UTC)</label>
                <input
                  type="datetime-local"
                  value={rules.endAtIso ? rules.endAtIso.slice(0,16) : ''}
                  onChange={(e)=> setEndFromInput(e.target.value)}
                />
              </div>
              <div>
                <label>Grace window (min)</label>
                <input
                  type="number" min="0"
                  value={Math.floor(Number(rules.graceSeconds||0)/60)}
                  onChange={(e)=> setRules(r=>({...r,graceSeconds: Number(e.target.value||0)*60}))}
                />
              </div>
            </div>

            <div className="adm-row">
              <div>
                <label>Extend by (min)</label>
                <input
                  type="number" min="0"
                  value={Math.floor(Number(rules.extendSeconds||0)/60)}
                  onChange={(e)=> setRules(r=>({...r,extendSeconds: Number(e.target.value||0)*60}))}
                />
              </div>
              <div>
                <label>Highest bid valid (sec)</label>
                <input type="number" name="highestValidSeconds" min="0" value={rules.highestValidSeconds} onChange={handleRuleChange}/>
              </div>
            </div>

            <div className="adm-row">
              <div>
                <label>Allow force close</label>
                <select
                  value={rules.allowForceClose ? 'Yes':'No'}
                  onChange={(e)=> setRules(r=>({...r,allowForceClose: e.target.value==='Yes'}))}
                >
                  <option>Yes</option><option>No</option>
                </select>
              </div>
              <div>
                <label>Reserve price (optional)</label>
                <input type="number" name="reserve" min="0" value={rules.reserve} onChange={handleRuleChange}/>
              </div>
            </div>

            <div className="actions mt8">
              <button className="btn primary" onClick={saveRules}>Save rules</button>
              <button className="btn warn" onClick={()=>setAuctionStatus('paused')}>Pause</button>
              <button className="btn success" onClick={()=>setAuctionStatus('open')}>Resume</button>
              <button className="btn danger" onClick={forceClose}>Force close</button>
            </div>

            <div className="status">
              <span className="stat">Status: <strong>{auctionStatus}</strong></span>
              <span className="stat">Ends: <span className="muted">{rules.endAtIso ? rules.endAtIso.replace('T',' ').slice(0,16) : '—'}</span></span>
              <span className="stat">Countdown: <span>{countdown}</span></span>
              <span className="stat">Next min bid: <span>{requiredNextBid.toLocaleString()}</span></span>
            </div>
          </div>

          <div className="adm-card">
            <h3>Bid monitor</h3>

            <div className="adm-row">
              <div>
                <label>Filter by bidder</label>
                <input type="text" value={filters.user} onChange={(e)=> setFilters(f=>({...f, user:e.target.value}))}/>
              </div>
              <div>
                <label>Min amount</label>
                <input type="number" value={filters.min} onChange={(e)=> setFilters(f=>({...f, min:e.target.value}))}/>
              </div>
            </div>

            <div className="actions">
              <button className="btn" onClick={applyFilters}>Apply</button>
              <button className="btn" onClick={clearFilters}>Clear</button>
              <button className="btn" onClick={exportCsv}>Export CSV</button>
            </div>

            <table className="adm-table">
              <thead>
                <tr><th>Bidder</th><th className="right">Amount</th><th>Time (UTC)</th><th>Status</th></tr>
              </thead>
              <tbody>
                {bids.map((b, i) => (
                  <tr key={i}>
                    <td>{b.user}</td>
                    <td className="right">{Number(b.amount).toLocaleString()}</td>
                    <td>{(b.tsIso||'').replace('T',' ').slice(0,19)}</td>
                    <td><span className={`tag ${b.status==='leading'?'leading':'outbid'}`}>{b.status}</span></td>
                  </tr>
                ))}
                {!bids.length && <tr><td colSpan="4" className="muted">No bids yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step === 'participate' && (
        <div className="adm-grid">
          <div className="adm-card">
            <div className="toolbar">
              <button className="btn btn-secondary" onClick={() => setStep('choice')}>← Back to choices</button>
            </div>
            <h3>Participate in Bidding</h3>

            {/* Lot header */}
            <div className="status" style={{ marginTop: 8 }}>
              <span className="stat">Title: <span className="muted">{auctionMeta.title || '—'}</span></span>
              <span className="stat">Warehouse ID: <span className="muted">{auctionMeta.warehouseId || '—'}</span></span>
              <span className="stat">Location: <span className="muted">{auctionMeta.location || '—'}</span></span>
            </div>

            <div className="status">
              <span className="stat">Starts: <span className="muted">{auctionMeta.startAtIso ? auctionMeta.startAtIso.replace('T',' ').slice(0,16) : '—'}</span></span>
              <span className="stat">Ends: <span className="muted">{auctionMeta.endAtIso ? auctionMeta.endAtIso.replace('T',' ').slice(0,16) : '—'}</span></span>
              <span className="stat">Time left: <span>{countdown}</span></span>
              <span className="stat">Highest bid: <span>{currentPrice ? currentPrice.toLocaleString() : '—'}</span></span>
              <span className="stat">Next min bid: <span>{requiredNextBid.toLocaleString()}</span></span>
            </div>

            <div className="adm-row">
              <div>
                <label>Bid amount</label>
                <input
                  type="number"
                  min={requiredNextBid}
                  value={bidAmount}
                  onChange={(e)=> setBidAmount(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label>Bidder note (optional)</label>
                <input type="text" value={bidNote} onChange={(e)=> setBidNote(e.target.value)} />
              </div>
            </div>

            <div className="actions">
              <button className="btn primary" onClick={submitBid} disabled={placing || auctionStatus !== 'open'}>
                {placing ? 'Placing…' : 'Place bid'}
              </button>
            </div>

            {bidError && <p style={{ color: '#b91c1c', marginTop: 8 }}>{bidError}</p>}
            {bidInfo && <p className="muted" style={{ marginTop: 8 }}>{bidInfo}</p>}
          </div>

          <div className="adm-card">
            <h3>Recent bids</h3>
            <table className="adm-table">
              <thead>
                <tr><th>Bidder</th><th className="right">Amount</th><th>Time (UTC)</th><th>Status</th></tr>
              </thead>
              <tbody>
                {bids.map((b,i)=>(
                  <tr key={i}>
                    <td>{b.user}</td>
                    <td className="right">{Number(b.amount).toLocaleString()}</td>
                    <td>{(b.tsIso||'').replace('T',' ').slice(0,19)}</td>
                    <td><span className={`tag ${b.status==='leading'?'leading':'outbid'}`}>{b.status}</span></td>
                  </tr>
                ))}
                {!bids.length && <tr><td colSpan="4" className="muted">No bids yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default Bidding;
