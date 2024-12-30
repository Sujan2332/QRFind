import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import QRScanner from './QRScanner';
import UserDetails from './UserDeatils';
import Signup from "./Singup";
import Login from './Login';  // Assuming you have a Login component

// ProtectedRoute component that checks if the user is authenticated
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Check for user authentication status

  // If the user is authenticated, render the element (QRScanner)
  // If not, redirect to the login page
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function MainRouter() {
  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected route for QRScanner */}
        <Route
          path="/"
          element={
            <ProtectedRoute element={<QRScanner />} />  // Protect QRScanner route
          }
        />

        {/* Route for User Details */}
        <Route path="/user-details/:id" element={<UserDetails />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
