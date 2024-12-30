// src/components/Signup.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./admin.css"
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const backend = import.meta.env.VITE_BACKENDURL || `https://qrfind-backend.onrender.com/`;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Sending POST request to backend
      const response = await axios.post(`${backend}api/admin/signup`, {
        email,
        password,
      });

      setSuccess(response.data.message); // On success, display the success message
      setError(''); // Clear any previous errors
      setEmail('');
      setPassword('');
      navigate('/login'); // Navigate to the login page after successful sign-up
    } catch (error) {
      console.error('Error details:', error); // Log the error to see full details

      // Handle error message
      setError(error.response?.data?.error || 'Error during sign-up');
      setSuccess(''); // Clear success message if there was an error
    }
  };


  return (
    <div className='signup'>
            <h1 className="signuptitle" style={{marginBottom:"50px",textDecoration:"underline"}}>QR Code Generator for Emergency Contact</h1>
    <div className="signup-container">
      <h2>Admin Sign-up</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form className='singupform' onSubmit={handleSubmit}>
        <div>
          <label>Email</label> <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter email"
          />
        </div>
        
        <div>
          <label>Password</label> <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />
        </div>
        
        <button type="submit">Sign Up</button>
      </form>

      <div>
        <p>
          Already have an account? <a href="/#/login">Login</a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Signup;
