import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (!response.ok) return setMessage(data.message || 'Unable to verify this code');
      login(data);
      navigate('/');
    } catch {
      setMessage('Could not contact the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email) return setMessage('Enter your email address first.');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      });
      const data = await response.json();
      setMessage(data.message || 'Unable to send a new code');
    } catch {
      setMessage('Could not contact the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={verify} className="auth-form">
        <h2>Verify your email</h2>
        <p className="verification-copy">Enter the six-digit code we sent you. It expires after 10 minutes.</p>
        <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <input className="otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength="6" placeholder="123456" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required />
        {message && <p className="auth-message" role="status">{message}</p>}
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Please wait…' : 'Verify email'}</button>
        <button type="button" className="text-button" onClick={resend} disabled={loading}>Send a new code</button>
        <p>Already verified? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
};

export default VerifyEmail;
