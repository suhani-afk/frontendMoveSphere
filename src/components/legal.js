// // import React, { useState } from 'react';
// // import '../styles/style.css';

// // const LegalSupport = () => {
// //   const [city, setCity] = useState('');
// //   const [caseType, setCaseType] = useState('contract');
// //   const [results, setResults] = useState([]);

// //   const handleSearch = () => {
// //     // Placeholder: replace with API call to fetch legal support data
// //     const dummyResults = [
// //       `Legal support for ${caseType} cases`,
// //       city ? `Filtered by city: ${city}` : 'No city filter applied',
// //       'Court: District Court Hall 4',
// //       'Lawyer: John Doe - contact: 123456789',
// //       'Applicable Acts: Trade Disputes Act, 1929',
// //     ];
// //     setResults(dummyResults);
// //   };

// //   return (
// //     <section className="section">
// //       <h2>Legal & court support</h2>
// //       <p className="muted">
// //         Find relevant courts, hall numbers, lawyers, and related acts for trade disputes.
// //       </p>

// //       <div className="filters">
// //         <input
// //           id="legalCity"
// //           placeholder="City"
// //           value={city}
// //           onChange={(e) => setCity(e.target.value)}
// //         />

// //         <select
// //           id="caseType"
// //           value={caseType}
// //           onChange={(e) => setCaseType(e.target.value)}
// //         >
// //           <option value="contract">Contract disputes</option>
// //           <option value="customs">Customs & trade</option>
// //           <option value="transport">Transport compliance</option>
// //           <option value="environment">Environment & NOC</option>
// //         </select>

// //         <button className="btn btn-primary" id="searchLegal" onClick={handleSearch}>
// //           Search
// //         </button>
// //       </div>

// //       <div id="legalResults" className="list">
// //         {results.length > 0 ? (
// //           <ul>
// //             {results.map((item, idx) => (
// //               <li key={idx}>{item}</li>
// //             ))}
// //           </ul>
// //         ) : (
// //           <p>No search results yet.</p>
// //         )}
// //       </div>
// //     </section>
// //   );
// // };

// // export default LegalSupport;

// import React, { useMemo, useState } from 'react';
// import '../styles/style.css';

// const SAMPLE_COURTS = [
//   {
//     id: 'court-1',
//     name: 'Mumbai High Court',
//     type: 'High Court',
//     jurisdiction: 'Maharashtra & Goa',
//     address: 'Fort, Mumbai, Maharashtra 400001',
//     phone: '+91-22-2266-1000',
//     email: 'registrar@bombay.gov.in',
//     distanceKm: 2.5
//   },
//   {
//     id: 'court-2',
//     name: 'Commercial Court, Mumbai',
//     type: 'Commercial Court',
//     jurisdiction: 'Mumbai Metropolitan Region',
//     address: 'Nariman Point, Mumbai, Maharashtra 400021',
//     phone: '+91-22-2288-5000',
//     email: 'commercial@mumbai.gov.in',
//     distanceKm: 3.2
//   },
//   {
//     id: 'court-3',
//     name: 'Sessions Court, Mumbai',
//     type: 'Sessions Court',
//     jurisdiction: 'Mumbai City',
//     address: 'Kala Ghoda, Mumbai, Maharashtra 400001',
//     phone: '+91-22-2266-8000',
//     email: 'sessions@mumbai.gov.in',
//     distanceKm: 1.8
//   }
// ];

// const SAMPLE_LAWYERS = [
//   { id: 'law-1', name: 'Anita Rao', specialty: 'Commercial disputes', phone: '+91-98-7654-3210', email: 'anita.rao@law.example' },
//   { id: 'law-2', name: 'Rahul Menon', specialty: 'Customs & trade', phone: '+91-99-1122-3344', email: 'rahul.menon@law.example' },
//   { id: 'law-3', name: 'Meera Shah', specialty: 'Transport compliance', phone: '+91-97-5566-7788', email: 'meera.shah@law.example' }
// ];

// const CourtCard = ({ c }) => {
//   return (
//     <div className="legal-card">
//       <div className="legal-head">
//         <div className="legal-title">
//           <span className="ico">🏛️</span>
//           <div>
//             <div className="name">{c.name}</div>
//             <div className="meta">
//               <span className="pill">{c.type}</span>
//               <span className="muted">Jurisdiction: {c.jurisdiction}</span>
//             </div>
//           </div>
//         </div>
//         <div className="dist">
//           <span className="gps">📍</span> {c.distanceKm} km
//         </div>
//       </div>

//       <div className="legal-body">
//         <div className="row">
//           <div className="col">
//             <div className="line"><span className="muted">📍</span> {c.address}</div>
//           </div>
//           <div className="col">
//             <div className="line"><span className="muted">📞</span> {c.phone}</div>
//           </div>
//           <div className="col">
//             <div className="line"><span className="muted">✉️</span> {c.email}</div>
//           </div>
//         </div>
//         <div className="actions">
//           <button className="btn">Get Directions</button>
//           <button className="btn">View Details</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const LawyerCard = ({ l }) => (
//   <div className="legal-card">
//     <div className="legal-head">
//       <div className="legal-title">
//         <span className="ico">👩‍⚖️</span>
//         <div>
//           <div className="name">{l.name}</div>
//           <div className="meta">
//             <span className="pill">{l.specialty}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="legal-body">
//       <div className="row">
//         <div className="col">
//           <div className="line"><span className="muted">📞</span> {l.phone}</div>
//         </div>
//         <div className="col">
//           <div className="line"><span className="muted">✉️</span> {l.email}</div>
//         </div>
//       </div>
//       <div className="actions">
//         <button className="btn">Call</button>
//         <button className="btn">Email</button>
//       </div>
//     </div>
//   </div>
// );

// const LegalResources = () => {
//   const [tab, setTab] = useState('courts'); // courts | lawyers
//   const [query, setQuery] = useState('');

//   const filteredCourts = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return SAMPLE_COURTS;
//     return SAMPLE_COURTS.filter(c =>
//       c.name.toLowerCase().includes(q) ||
//       c.type.toLowerCase().includes(q) ||
//       c.jurisdiction.toLowerCase().includes(q) ||
//       c.address.toLowerCase().includes(q)
//     );
//   }, [query]);

//   const filteredLawyers = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return SAMPLE_LAWYERS;
//     return SAMPLE_LAWYERS.filter(l =>
//       l.name.toLowerCase().includes(q) ||
//       l.specialty.toLowerCase().includes(q)
//     );
//   }, [query]);

//   return (
//     <section className="section">
//       <h2>Legal Resources</h2>
//       <p className="muted">Find courts, legal professionals, and resources to support your business needs.</p>

//       <div className="legal-tabs">
//         <button className={`tab ${tab==='courts'?'active':''}`} onClick={()=> setTab('courts')}>
//           Nearest Courts
//         </button>
//         <button className={`tab ${tab==='lawyers'?'active':''}`} onClick={()=> setTab('lawyers')}>
//           Lawyer Directory
//         </button>
//       </div>

//       <input
//         className="legal-search"
//         placeholder={tab==='courts' ? 'Search courts...' : 'Search lawyers...'}
//         value={query}
//         onChange={(e)=> setQuery(e.target.value)}
//       />

//       <h3 className="cmp-subtitle">{tab==='courts' ? 'Nearest Courts' : 'Lawyer Directory'}</h3>

//       {tab==='courts' ? (
//         <div className="legal-list">
//           {filteredCourts.map(c => <CourtCard key={c.id} c={c} />)}
//         </div>
//       ) : (
//         <div className="legal-list">
//           {filteredLawyers.map(l => <LawyerCard key={l.id} l={l} />)}
//         </div>
//       )}

//       {/* Support strip like screenshot */}
//       {tab==='courts' && (
//         <div className="legal-card support">
//           <div className="support-title">Legal Support Services</div>
//           <p className="muted">Additional resources to help with your legal requirements.</p>
//           <div className="support-grid">
//             <div>
//               <div className="sup-head">Document Services</div>
//               <div className="muted">Legal document preparation, review, and notarization services.</div>
//               <button className="btn" style={{ marginTop: 8 }}>Learn More</button>
//             </div>
//             <div>
//               <div className="sup-head">Legal Consultation</div>
//               <div className="muted">Free initial consultation for new business legal requirements.</div>
//               <button className="btn" style={{ marginTop: 8 }}>Book Now</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default LegalResources;
import React, { useMemo, useState } from 'react';
import '../styles/style.css';

const SAMPLE_COURTS = [
  {
    id: 'court-1',
    name: 'Mumbai High Court',
    type: 'High Court',
    jurisdiction: 'Maharashtra & Goa',
    address: 'Fort, Mumbai, Maharashtra 400001',
    phone: '+91-22-2266-1000',
    email: 'registrar@bombay.gov.in',
    distanceKm: 2.5
  },
  {
    id: 'court-2',
    name: 'Commercial Court, Mumbai',
    type: 'Commercial Court',
    jurisdiction: 'Mumbai Metropolitan Region',
    address: 'Nariman Point, Mumbai, Maharashtra 400021',
    phone: '+91-22-2288-5000',
    email: 'commercial@mumbai.gov.in',
    distanceKm: 3.2
  },
  {
    id: 'court-3',
    name: 'Sessions Court, Mumbai',
    type: 'Sessions Court',
    jurisdiction: 'Mumbai City',
    address: 'Kala Ghoda, Mumbai, Maharashtra 400001',
    phone: '+91-22-2266-8000',
    email: 'sessions@mumbai.gov.in',
    distanceKm: 1.8
  }
];

const SAMPLE_LAWYERS = [
  { id: 'law-1', name: 'Anita Rao', specialty: 'Commercial disputes', phone: '+91-98-7654-3210', email: 'anita.rao@law.example' },
  { id: 'law-2', name: 'Rahul Menon', specialty: 'Customs & trade', phone: '+91-99-1122-3344', email: 'rahul.menon@law.example' },
  { id: 'law-3', name: 'Meera Shah', specialty: 'Transport compliance', phone: '+91-97-5566-7788', email: 'meera.shah@law.example' }
];

const CourtCard = ({ c }) => {
  return (
    <div className="legal-card">
      <div className="legal-head">
        <div className="legal-title">
          <span className="ico">🏛️</span>
          <div>
            <div className="name">{c.name}</div>
            <div className="meta">
              <span className="pill">{c.type}</span>
              <span className="muted">Jurisdiction: {c.jurisdiction}</span>
            </div>
          </div>
        </div>
        <div className="dist">
          <span className="gps">📍</span> {c.distanceKm} km
        </div>
      </div>

      <div className="legal-body">
        <div className="row">
          <div className="col">
            <div className="line"><span className="muted">📍</span> {c.address}</div>
          </div>
          <div className="col">
            <div className="line"><span className="muted">📞</span> {c.phone}</div>
          </div>
          <div className="col">
            <div className="line"><span className="muted">✉️</span> {c.email}</div>
          </div>
        </div>
        <div className="actions">
          <button className="btn">Get Directions</button>
          <button className="btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

const LawyerCard = ({ l }) => (
  <div className="legal-card">
    <div className="legal-head">
      <div className="legal-title">
        <span className="ico">👩‍⚖️</span>
        <div>
          <div className="name">{l.name}</div>
          <div className="meta">
            <span className="pill">{l.specialty}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="legal-body">
      <div className="row">
        <div className="col">
          <div className="line"><span className="muted">📞</span> {l.phone}</div>
        </div>
        <div className="col">
          <div className="line"><span className="muted">✉️</span> {l.email}</div>
        </div>
      </div>
      <div className="actions">
        <button className="btn">Call</button>
        <button className="btn">Email</button>
      </div>
    </div>
  </div>
);

const LegalResources = () => {
  const [tab, setTab] = useState('courts'); // courts | lawyers
  const [query, setQuery] = useState('');

  const filteredCourts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_COURTS;
    return SAMPLE_COURTS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      c.jurisdiction.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredLawyers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_LAWYERS;
    return SAMPLE_LAWYERS.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.specialty.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="section">
      <h2>Legal Resources</h2>
      <p className="muted">Find courts, legal professionals, and resources to support your business needs.</p>

      <div className="legal-tabs">
        <button className={`tab ${tab==='courts'?'active':''}`} onClick={()=> setTab('courts')}>
          Nearest Courts
        </button>
        <button className={`tab ${tab==='lawyers'?'active':''}`} onClick={()=> setTab('lawyers')}>
          Lawyer Directory
        </button>
      </div>

      <input
        className="legal-search"
        placeholder={tab==='courts' ? 'Search courts...' : 'Search lawyers...'}
        value={query}
        onChange={(e)=> setQuery(e.target.value)}
      />

      <h3 className="cmp-subtitle">{tab==='courts' ? 'Nearest Courts' : 'Lawyer Directory'}</h3>

      {tab==='courts' ? (
        <div className="legal-list">
          {filteredCourts.map(c => <CourtCard key={c.id} c={c} />)}
        </div>
      ) : (
        <div className="legal-list">
          {filteredLawyers.map(l => <LawyerCard key={l.id} l={l} />)}
        </div>
      )}

      {/* Support strip like screenshot */}
      {tab==='courts' && (
        <div className="legal-card support">
          <div className="support-title">Legal Support Services</div>
          <p className="muted">Additional resources to help with your legal requirements.</p>
          <div className="support-grid">
            <div>
              <div className="sup-head">Document Services</div>
              <div className="muted">Legal document preparation, review, and notarization services.</div>
              <button className="btn" style={{ marginTop: 8 }}>Learn More</button>
            </div>
            <div>
              <div className="sup-head">Legal Consultation</div>
              <div className="muted">Free initial consultation for new business legal requirements.</div>
              <button className="btn" style={{ marginTop: 8 }}>Book Now</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LegalResources;
