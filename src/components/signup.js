import React, { useMemo, useState } from 'react';
import '../styles/style.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(''); // '', 'customer', 'admin'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [pwdTouched, setPwdTouched] = useState(false);

  const criteria = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const isStrongPassword = useMemo(
    () => Object.values(criteria).every(Boolean),
    [criteria]
  );

  const showCriteria = pwdTouched || password.length > 0;

  const canSubmit =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    !!role &&
    isStrongPassword &&
    password === confirmPassword;

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, role, fullName }),
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
        body: JSON.stringify({ email, phone, otp, role, fullName, password }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Sign Up Successful!');
        setStep(1);
        setFullName(''); setEmail(''); setPhone(''); setRole('');
        setPassword(''); setConfirmPassword(''); setOtp('');
      } else {
        alert('Invalid OTP');
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

            {/* Account type */}
            <div className="select-field">
              <label htmlFor="role">Account type</label>
              <select
                id="role"
                aria-label="Account type"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>Select role</option>
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <input
              type="password"
              placeholder="Set Password"
              required
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setPwdTouched(true)}
            />

            {showCriteria && (
              <div className="password-criteria">
                <p>Password must contain:</p>
                <ul>
                  <li style={{ color: criteria.length ? '#16a34a' : '#dc2626' }}>
                    {criteria.length ? '✅' : '❌'} At least 8 characters
                  </li>
                  <li style={{ color: criteria.uppercase ? '#16a34a' : '#dc2626' }}>
                    {criteria.uppercase ? '✅' : '❌'} At least 1 uppercase letter
                  </li>
                  <li style={{ color: criteria.number ? '#16a34a' : '#dc2626' }}>
                    {criteria.number ? '✅' : '❌'} At least 1 number
                  </li>
                  <li style={{ color: criteria.special ? '#16a34a' : '#dc2626' }}>
                    {criteria.special ? '✅' : '❌'} At least 1 special character
                  </li>
                </ul>
              </div>
            )}

            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
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
