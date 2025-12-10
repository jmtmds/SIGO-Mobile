import React, { createContext, useState, useContext } from 'react';

const StatsContext = createContext({});

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState({
    ocorrenciasHoje: 0,
    statusEquipe: 0
  });

  const updateStats = (newStats) => {
    setStats(prev => ({
      ...prev,
      ...newStats
    }));
  };

  const decrementActiveIncidents = () => {
    setStats(prev => ({
      ...prev,
      ocorrenciasHoje: Math.max(0, prev.ocorrenciasHoje - 1)
    }));
  };

  const incrementActiveIncidents = () => {
    setStats(prev => ({
      ...prev,
      ocorrenciasHoje: prev.ocorrenciasHoje + 1
    }));
  };

  return (
    <StatsContext.Provider value={{ 
      stats, 
      updateStats, 
      decrementActiveIncidents, 
      incrementActiveIncidents 
    }}>
      {children}
    </StatsContext.Provider>
  );
};

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) throw new Error('useStats deve ser usado dentro de um StatsProvider');
  return context;
}