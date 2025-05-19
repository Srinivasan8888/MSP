import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';

const DashboardContext = createContext();
const ParameterContext = createContext();
import API from '../Layout/Axios/AxiosInterceptor';

export const DashboardProvider = ({ children }) => {
  const [selectedParameter, setSelectedParameter] = useState(() => {
    return localStorage.getItem('selectedParameter') || 'vibration';
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const previousDataRef = useRef(null);

  // Update localStorage when selectedParameter changes
  useEffect(() => {
    localStorage.setItem('selectedParameter', selectedParameter);
    const id = localStorage.getItem('id');
  }, [selectedParameter]);

  const fetchDashboardData = useCallback(async (parameter) => {
    try {
      const id = localStorage.getItem('id');
      const headers = {};
      if (id) {
        headers['x-user-id'] = id;
      }
      // const response = await API.get(`/api/v2/getDashboard?parameter=${parameter}`);
      const response = await fetch(`${import.meta.env.BACKEND_URL_GET}getDashboard?parameter=${parameter}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      
      if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
        previousDataRef.current = data;
        setDashboardData(data);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchDashboardData(selectedParameter);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      fetchDashboardData(selectedParameter);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedParameter, fetchDashboardData]);

  const parameterValue = useMemo(() => ({
    selectedParameter,
    setSelectedParameter
  }), [selectedParameter]);

  const dashboardValue = useMemo(() => ({
    dashboardData,
    loading,
    error,
    fetchDashboardData
  }), [dashboardData, loading, error, fetchDashboardData]);

  return (
    <ParameterContext.Provider value={parameterValue}>
      <DashboardContext.Provider value={dashboardValue}>
        {children}
      </DashboardContext.Provider>
    </ParameterContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const useParameter = () => {
  const context = useContext(ParameterContext);
  if (!context) {
    throw new Error('useParameter must be used within a DashboardProvider');
  }
  return context;
}; 