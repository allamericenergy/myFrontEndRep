import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
//import {logo} from './assets/Logo.jpg'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
          setLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      if (res.data.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/user';
      }
    } catch (error) {
      alert(
        error.response?.data?.message || 'Login Failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        {/*  <div className="overlay">
          <h1>CRM Portal</h1>
          <p>
            Manage customers, leads, invoices,
            tickets, and workflows in one place.
          </p>
        </div> */}
      </div>

      <div className="login-right">
        <div className="login-card">
          <img 
            src="./src/assets/Logo.jpg"
            alt="All American Energy Logo"
            width={200} height={75}
          />
          <br />
          <br />
          <h2>Welcome</h2>  

          <p className="subtitle">
            Login to your account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
            >
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <div className="footer-text">
            © 2026 CRM Management System
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;