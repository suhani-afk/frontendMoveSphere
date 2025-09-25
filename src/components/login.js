import React, { useState } from 'react';
import '../styles/style.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here (e.g., API call)
    console.log('Logging in with:', { email, password });
  };

  return (
    <section className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" id="loginBtn">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </section>
  );
};

export default Login;
