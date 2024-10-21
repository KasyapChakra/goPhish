import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Decode token to get username
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.sub);
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <div className="navbar">
        <span>{username}</span>
        <img src="/profile-icon.png" alt="Profile" />
      </div>
      <div className="content">
        {/* Additional dashboard content can be added here */}
      </div>
    </div>
  );
}

export default Dashboard;