// export default Login;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import backendURL from '../utilities/urls'

function Login() {
  const [username, setUsername] = useState('');
  const [apikey, setApikey] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in and has a valid access token
    const storedAccessToken = localStorage.getItem('access_token');
    const tokenExpirationTime = localStorage.getItem('token_expiration_time');
    const currentTime = new Date().getTime() / 1000;

    if (storedAccessToken && tokenExpirationTime && currentTime < tokenExpirationTime) {
      navigate('/investors');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${backendURL}/connect/token`,
        `username=${encodeURIComponent(username)}&apikey=${encodeURIComponent(apikey)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.access_token) {
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        const expiresIn = response.data.expires_in;
        const tokenExpirationTime = new Date().getTime() / 1000 + expiresIn;

        // Store tokens and token expiration time in local storage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('token_expiration_time', tokenExpirationTime);

       // TODO: Calculate and implement token auto-refresh logic by periodically refreshing the token using refreshToken

        // Redirect to the InvestorsTable page
        navigate('/investors');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="API Key"
        value={apikey}
        onChange={(e) => setApikey(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
