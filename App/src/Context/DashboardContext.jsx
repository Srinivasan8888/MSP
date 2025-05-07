import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [selectedParameter, setSelectedParameter] = useState('vibration');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const previousDataRef = useRef(null);

  const fetchDashboardData = useCallback(async (parameter) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v2/getDashboard?parameter=${parameter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      
      // Only update state if data has changed
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
    // Initial fetch
    setLoading(true);
    fetchDashboardData(selectedParameter);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      fetchDashboardData(selectedParameter);
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedParameter, fetchDashboardData]);

  const contextValue = useMemo(() => ({
    selectedParameter,
    setSelectedParameter,
    dashboardData,
    loading,
    error,
    fetchDashboardData
  }), [selectedParameter, dashboardData, loading, error, fetchDashboardData]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 