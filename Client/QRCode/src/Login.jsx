import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./admin.css"
const Login = () => {
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
      const response = await axios.post(`${backend}api/admin/login`, {
        email,
        password,
      });

      console.log('Response:', response);  // Log the response

      setSuccess(response.data.message); // On success, display the success message
      setError(''); // Clear any previous errors
      setEmail(''); // Clear the email field
      setPassword(''); // Clear the password field

      // Store JWT token, authentication status, and userId in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAuthenticated', 'true'); // Mark user as authenticated
      localStorage.setItem('userId', response.data.userId); // Store userId from the response
      console.log(response.data.userId);  // Log the userId

      alert("Logged in successfully!");
      
      // Navigate to the protected route
      navigate('/'); // or wherever you want to redirect after successful login

    } catch (error) {
      console.error('Login error:', error); // Log the error for debugging
      setError(error.response?.data?.error || 'Invalid email or password');
      setSuccess(''); // Clear success message if there was an error
    }
};

  return (
    <div className='signup'>
            <h1 className="signuptitle" style={{marginBottom:"50px",textDecoration:"underline"}}>QR Code Generator for Emergency Contact</h1>
    <div className="signup-container">
      <h2>Admin Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form className="singupform" onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter email"
          />
        </div>
        
        <div>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />
        </div>
        
        <button type="submit">Login</button>
      </form>

      <div>
        <p>
          Don't have an account? <a href="/#/signup">Sign Up</a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login;
