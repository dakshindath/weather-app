import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful');
      setTimeout(() => navigate('/home'), 1000);
    } 
    catch (err: any) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
     <div className="auth-page-wrapper">
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input className="login-input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input className="login-input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" className="loginbutton">Login</button>
            </form>
            {message && <div className="login-message">{message}</div>}
            <p className="login-text">
                Don't have an account? <a href="/signup" className="login-link">Sign Up</a>
            </p>
        </div> 
     </div>
  );
};

export default Login;