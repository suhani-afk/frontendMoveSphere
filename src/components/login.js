// // import React, { useState } from 'react';
// // import '../styles/style.css';
// // import { Link } from 'react-router-dom';

// // const Login = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // Add login logic here (e.g., API call)
// //     console.log('Logging in with:', { email, password });
// //   };

// //   return (
// //     <section className="auth-form">
// //       <h2>Login</h2>
// //       <form onSubmit={handleSubmit} noValidate>
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           required
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           required
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />
// //         <button type="submit" className="btn btn-primary" id="loginBtn">
// //           Login
// //         </button>
// //       </form>
// //       <p>
// //         Don't have an account? <Link to="/signup">Sign Up</Link>
// //       </p>
// //     </section>
// //   );
// // };

// // export default Login;
// import React, { useState } from 'react';
// import '../styles/style.css';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState(''); // '', 'customer', 'owner', 'admin'

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password || !role) return;
//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, role }),
//       });
//       if (!res.ok) throw new Error('Login failed');
//       // TODO: redirect by role
//       console.log('Logged in:', { email, role });
//     } catch (err) {
//       console.error(err);
//       alert('Invalid credentials or server error');
//     }
//   };

//   return (
//     <section className="auth-form">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit} noValidate>
//         <input
//           type="email"
//           placeholder="Email"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           required
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {/* Role dropdown (styled like inputs) */}
//         <div className="select-field">
//           <label htmlFor="role">Role</label>
//           <select
//             id="role"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             required
//           >
//             <option value="" disabled>Select role</option>
//             <option value="customer">Customer</option>
//             <option value="owner">Business Owner</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <button type="submit" className="btn btn-primary" id="loginBtn" disabled={!email || !password || !role}>
//           Login
//         </button>
//       </form>

//       <p>
//         Don't have an account? <Link to="/signup">Sign Up</Link>
//       </p>
//     </section>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import '../styles/style.css';
import { Link, useNavigate } from 'react-router-dom';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // '', 'customer', 'owner', 'admin'
  const [alert, setAlert] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', msg: '' });

    if (!emailOk(email)) {
      setAlert({ type: 'warn', msg: 'Enter a valid email address (must include @ and a domain).' });
      return;
    }
    if (password.length < 8) {
      setAlert({ type: 'warn', msg: 'Password must be at least 8 characters.' });
      return;
    }
    if (!role) {
      setAlert({ type: 'warn', msg: 'Please select a role.' });
      return;
    }

    try {
      // Optional preflight: check if user exists
      try {
        const existsRes = await fetch(`/api/auth/exists?email=${encodeURIComponent(email)}`);
        if (existsRes.ok) {
          const ex = await existsRes.json();
          if (ex && ex.exists === false) {
            setAlert({ type: 'warn', msg: 'No account found. Please Sign Up first.' });
            return;
          }
        }
      } catch (_) {}

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        let message = 'Login failed.';
        try {
          const data = await res.json();
          if (data?.error?.toLowerCase().includes('not found')) {
            setAlert({ type: 'warn', msg: 'No account found. Please Sign Up first.' });
            return;
          }
          if (data?.error) message = data.error;
        } catch (_) {}
        setAlert({ type: 'warn', msg: message });
        return;
      }

      setAlert({ type: 'success', msg: 'Login successful. Redirecting…' });
      setTimeout(() => {
        if (role === 'customer') navigate('/bids', { replace: true });
        else if (role === 'owner') navigate('/bidding', { replace: true });
        else navigate('/admin', { replace: true });
      }, 600);
    } catch (err) {
      setAlert({ type: 'warn', msg: 'Network error. Please try again.' });
    }
  };

  return (
    <section className="auth-form">
      <h2>Login</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email with red inline hint */}
        <input
          type="email"
          placeholder="e.g., user@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {email && !emailOk(email) && (
          <div className="hint-error">Email must include “@” and a domain like example.com.</div>
        )}

        {/* Password with sample placeholder */}
        <input
          type="password"
          placeholder="e.g., at least 8 characters"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role dropdown */}
        <div className="select-field">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>Select role</option>
            <option value="customer">Customer</option>
            <option value="owner">Business Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit alert (yellow/green) */}
        {alert.msg && (
          <div className={`alert ${alert.type === 'success' ? 'success' : 'warn'}`}>
            {alert.msg}
            {alert.type !== 'success' && alert.msg.includes('Sign Up') && (
              <Link to="/signup" style={{ marginLeft: 6, textDecoration: 'underline' }}>Sign Up</Link>
            )}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          id="loginBtn"
          disabled={!email || !password || !role}
        >
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

