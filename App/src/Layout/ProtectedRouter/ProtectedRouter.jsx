import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import API from '../Axios/AxiosInterceptor';

const ProtectedRouter = () => {
  const [isValidToken, setIsValidToken] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    setIsValidToken(false);
    window.location.href = 'login';
  };

  const storeNewToken = (accessToken) => {
    // Store in localStorage
    localStorage.setItem('accessToken', accessToken);
    
    // Store in cookie with 1 day expiration
    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    
    document.cookie = `accessToken=${accessToken}; ${expires}; path=/; ${
      import.meta.env.MODE === 'production' ? 'Secure; SameSite=Strict' : ''
    }`;
  };

  useEffect(() => {
    const verifyAndRefreshToken = async () => {
      // If no tokens exist, don't try to verify
      if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
        setIsLoading(false);
        return;
      }

      try {
        // Initial check with current access token
        await API.get('/auth/access-token', {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
          }
        });
        setIsLoading(false);
        
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              handleLogout();
              return;
            }

            // Generate new access token using refresh token
            const response = await API.post(
              '/auth/access-token-generate',
              { refreshToken }
            );

            if (response.data.accessToken) {
              storeNewToken(response.data.accessToken);
              setIsValidToken(true);
            } else {
              handleLogout();
            }
          } catch (refreshError) {
            if (refreshError.response?.status === 401) {
              handleLogout();
            } else {
              console.error('Token refresh failed:', refreshError);
              handleLogout();
            }
          }
        } else {
          handleLogout();
        }
        setIsLoading(false);
      }
    };

    verifyAndRefreshToken();
    const interval = setInterval(verifyAndRefreshToken, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
    return <Navigate to="login" />;
  }

  if (!isValidToken) {
    return <Navigate to="login" />;
  }

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRouter;