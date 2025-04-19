import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onAuth, onClose }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
      }
      const payload = mode === 'login'
        ? { username: form.username, password: form.password }
        : {
            username: form.username,
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName
          };
      const res = await fetch(`http://localhost:5000/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      // Force update parent state before closing modal
      onAuth(data.user);
      setTimeout(onClose, 100); // Ensure parent updates before modal closes
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-modal">
      <div className="auth-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          {mode === 'register' && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {mode === 'register' && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-switch">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button className="link-btn" onClick={() => setMode('register')}>Register</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button className="link-btn" onClick={() => setMode('login')}>Login</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
