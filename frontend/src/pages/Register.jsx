import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';
import { ToastContext } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const { notify } = useContext(ToastContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Disable button

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Backend confirmed email exists and OTP was sent
        navigate('/verify-email', { state: { email: data.email } });
      } else {
        // Backend returned an error (e.g., "Email does not exist")
        notify(data.message || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error(error);
      // Notify user if the server is down or network fails
      notify('Something went wrong. Please try again.', 'error'); 
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Register</h2>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Register'}
        </button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;