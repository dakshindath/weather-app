import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth.css';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const Navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:5000/auth/signup', { username, email, password });
      setMessage('Signup successful');
      setTimeout(()=> Navigate("/"), 1000);
    } 
    catch (err: any) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
     <div className="auth-page-wrapper">
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <input className="signup-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input className="signup-input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input className="signup-input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
            {message && <div className="signup-message">{message}</div>}
            <p className="signup-text">
                Already have an account? <a href="/" className="signup-link">Login</a>
            </p>
        </div>
     </div>
  );
};

export default Signup;