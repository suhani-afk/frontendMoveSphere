// import React, { useState } from 'react';
// import '../styles/style.css';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add login logic here (e.g., API call)
//     console.log('Logging in with:', { email, password });
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
//         <button type="submit" className="btn btn-primary" id="loginBtn">
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
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // customer | admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Example API call with role
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) throw new Error('Login failed');
      // handle success, route by role if needed
      console.log('Logged in:', { email, role });
    } catch (err) {
      console.error(err);
      alert('Invalid credentials or server error');
    }
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

        {/* Account type */}
        <select
          aria-label="Account type"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="customer">Customer</option>
          <option value="admin">Administrator</option>
        </select>

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
