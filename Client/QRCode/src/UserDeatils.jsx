import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';

const UserDetails = () => {
  const { id } = useParams(); // Get the user ID from the URL parameter
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const backend = import.meta.env.VITE_BACKENDURL || `https://qrfind-backend.onrender.com/`;

  useEffect(() => {
    // Fetch the user data by ID from the backend API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${backend}api/user-details/${id}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError("An error occurred while fetching the data.");
      }
    };

    fetchUserData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'User Details',
        text: 'Check out this user data!',
        url: window.location.href, // Share the current URL
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that do not support the share API
      alert('Sharing not supported in your browser');
    }}

  // If there is an error or loading state
  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='Main'>
      <button className='share' onClick={handleShare}><i class="fa-solid fa-share"></i></button>
    <div className="user-details-container">
        <style>
            {`
            .Main{
            display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-evenly;
min-height:850px;

            }
.share{
position:fixed;
right:20px;
top:5px}
            .user-details-container {
  padding: 20px;
  max-width: 800px;
  border:2px solid black;
  margin: 0 auto;
  min-width:350px;
  text-align:center
}

.user-info {
  margin-top: 20px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-evenly;
}

.user-info p {
  font-size: 20px;
  margin:10px
}

button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

            `}
        </style>
      <h1 style={{textDecoration:"underline"}}>User Details</h1>
      <div className="user-info">
        <p><strong>Name:</strong><br /> {user.name}</p>
        <p><strong>Age:</strong><br /> {user.age}</p>
        <p><strong>Contact:</strong><br /> {user.contact}</p>
        <p><strong>Guardian Contact:</strong><br /> {user.guardianContact}</p>
        <div>
          <img src={user.qrCode} alt="QR Code" style={{ width: '150px', height: '150px' }} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserDetails;
