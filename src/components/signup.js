import React, { useState } from 'react';
import '../styles/style.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);

  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isStrongPassword = Object.values(criteria).every(Boolean);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!isStrongPassword) {
      alert("Password is not strong enough!");
      return;
    }

    // API call to send OTP
    try {
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });
      setStep(2);
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP.');
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, otp }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Sign Up Successful!");
        setStep(1);
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="auth-form">
      {step === 1 ? (
        <>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="password"
              placeholder="Set Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="password-criteria">
              <p>Password must contain:</p>
              <ul>
                <li style={{ color: criteria.length ? 'green' : 'red' }}>
                  {criteria.length ? '✅' : '❌'} At least 8 characters
                </li>
                <li style={{ color: criteria.uppercase ? 'green' : 'red' }}>
                  {criteria.uppercase ? '✅' : '❌'} At least 1 uppercase letter
                </li>
                <li style={{ color: criteria.number ? 'green' : 'red' }}>
                  {criteria.number ? '✅' : '❌'} At least 1 number
                </li>
                <li style={{ color: criteria.special ? 'green' : 'red' }}>
                  {criteria.special ? '✅' : '❌'} At least 1 special character
                </li>
              </ul>
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </form>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </>
      ) : (
        <>
          <h2>Verify OTP</h2>
          <form onSubmit={handleOtpVerify}>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Verify OTP
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default SignUp;
