import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/style.css';

const Bidding = () => {
  const [step, setStep] = useState('choice'); // choice -> participate -> conduct -> terms
  const [participateOption, setParticipateOption] = useState(null);
  const [bidDetails, setBidDetails] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    minimumBid: '',
  });
  const [ongoingBids, setOngoingBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  // Load ongoing bids from backend on 'participate' step
  useEffect(() => {
    if (step === 'participate') {
      setLoading(true);
      setError('');
      axios.get('/api/bidding')
        .then(res => setOngoingBids(res.data))
        .catch(err => {
          setError('Failed to load ongoing bids');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [step]);

  const handleNext = () => setStep('terms');

  const handleBidChange = (e) => {
    setBidDetails({ ...bidDetails, [e.target.name]: e.target.value });
  };

  // Submit new bid to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitMessage('');
    try {
      const response = await axios.post('/api/bidding', bidDetails);
      setSubmitMessage(response.data.message || 'Bid submitted successfully');
      setBidDetails({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        minimumBid: '',
      });
      setStep('choice');
    } catch (err) {
      setError('Failed to submit bid.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <h2>Bidding</h2>

      {step === 'choice' && (
        <div className="cards">
          <div className="card" onClick={() => setStep('participate')}>
            <h3>Participate in Bidding</h3>
            <p>View ongoing and upcoming biddings and place your bids.</p>
          </div>
          <div className="card" onClick={() => setStep('conduct')}>
            <h3>Conduct a Bid</h3>
            <p>Create a new bidding for your warehouse, hangar, or port services.</p>
          </div>
        </div>
      )}

      {step === 'participate' && (
        <div>
          <h3>Ongoing & Upcoming Bids</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : ongoingBids.length ? (
            <ul className="cards">
              {ongoingBids.map((bid, i) => (
                <li key={i} className="card">
                  <h4>{bid.title}</h4>
                  <p>Start: {bid.startDate}</p>
                  <p>End: {bid.endDate}</p>
                  <button className="btn btn-primary" onClick={handleNext}>
                    Participate
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bids available at the moment.</p>
          )}
          <button className="btn btn-secondary" onClick={() => setStep('choice')}>
            Back to choices
          </button>
        </div>
      )}

      {step === 'conduct' && (
        <form className="auth-form" onSubmit={handleSubmit}>
          <h3>Conduct a Bid</h3>
          <input
            type="text"
            name="title"
            placeholder="Bid Title"
            value={bidDetails.title}
            onChange={handleBidChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={bidDetails.description}
            onChange={handleBidChange}
            required
          />
          <input
            type="date"
            name="startDate"
            value={bidDetails.startDate}
            onChange={handleBidChange}
            required
          />
          <input
            type="date"
            name="endDate"
            value={bidDetails.endDate}
            onChange={handleBidChange}
            required
          />
          <input
            type="number"
            name="minimumBid"
            placeholder="Minimum Bid Amount"
            value={bidDetails.minimumBid}
            onChange={handleBidChange}
            required
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Next: Terms & Conditions'}
          </button>
        </form>
      )}

      {step === 'terms' && (
        <div className="auth-form">
          <h3>Terms & Conditions</h3>
          <div style={{ maxHeight: '250px', overflowY: 'scroll', padding: '0.5rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
            <p>1. All bids must comply with local laws and regulations.</p>
            <p>2. Participants must provide valid identification.</p>
            <p>3. Bids cannot be withdrawn once submitted.</p>
            <p>4. The organizer is responsible for accurate bid details.</p>
            <p>5. Any dispute will be resolved according to company policies.</p>
            <p>6. Participants agree to the privacy and security terms of the platform.</p>
            <p>7. The company is not liable for any external issues affecting the bid.</p>
            <p>8. Failure to comply with T&C may result in disqualification.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setStep('choice')}>
            I Agree & Submit
          </button>
          {submitMessage && <p style={{ color: 'green' }}>{submitMessage}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </section>
  );
};

export default Bidding;
