import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';

const LineGraphContext = createContext();

export const LineGraphProvider = ({ children }) => {
  const [selectedParameter, setSelectedParameter] = useState(() => {
    // Initialize from localStorage if available, otherwise default to 'vibration'
    return localStorage.getItem('selectedParameter') || 'vibration';
  });

  // Update localStorage when selectedParameter changes
  useEffect(() => {
    localStorage.setItem('selectedParameter', selectedParameter);
  }, [selectedParameter]);

  const contextValue = useMemo(() => ({
    selectedParameter,
    setSelectedParameter
  }), [selectedParameter]);

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