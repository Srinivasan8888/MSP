import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

const LineGraphContext = createContext();

export const LineGraphProvider = ({ children }) => {
  const [lineGraphData, setLineGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState('vibration');

  const fetchLineGraphData = useCallback(async (parameter) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v2/getDashboard?parameter=${parameter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch line graph data');
      }
      const data = await response.json();
      setLineGraphData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    lineGraphData,
    loading,
    error,
    selectedParameter,
    setSelectedParameter,
    fetchLineGraphData
  }), [lineGraphData, loading, error, selectedParameter, fetchLineGraphData]);

  return (
    <LineGraphContext.Provider value={contextValue}>
      {children}
    </LineGraphContext.Provider>
  );
};

export const useLineGraph = () => {
  const context = useContext(LineGraphContext);
  if (!context) {
    throw new Error('useLineGraph must be used within a LineGraphProvider');
  }
  return context;
}; 