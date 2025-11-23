import React, { createContext, useState, useContext } from 'react';

const AccessibilityContext = createContext({});

export const AccessibilityProvider = ({ children }) => {
  // Estados de acessibilidade
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); 

  // Lógica de Cores Blindada
  // Se Alto Contraste estiver ligado, ele ignora o Dark Mode e força o tema acessível
  const theme = {
    background: highContrast ? '#000000' : (isDarkMode ? '#121212' : '#FFFFFF'),
    
    text: highContrast ? '#FFFF00' : (isDarkMode ? '#FFFFFF' : '#333333'),
    
    textSecondary: highContrast ? '#FFFF00' : (isDarkMode ? '#BBBBBB' : '#666666'),
    
    primary: highContrast ? '#FFD700' : (isDarkMode ? '#5c7cfa' : '#314697'), 
    
    cardBackground: highContrast ? '#000000' : (isDarkMode ? '#1E1E1E' : '#F1F4FF'),
    
    inputBackground: highContrast ? '#000000' : (isDarkMode ? '#2C2C2C' : '#F1F4FF'),
    
    border: highContrast ? '#FFFF00' : (isDarkMode ? '#333333' : '#E0E0E0'), // Borda amarela no contraste para destacar
    
    headerBackground: highContrast ? '#000000' : (isDarkMode ? '#1E1E1E' : '#FFFFFF'),
    
    statusBarStyle: (highContrast || isDarkMode) ? 'light' : 'dark',
    
    // Cor extra para elementos selecionados ou focados
    highlight: highContrast ? '#FFFF00' : (isDarkMode ? '#5c7cfa' : '#314697')
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        isDarkMode, setIsDarkMode,
        highContrast, setHighContrast,
        fontSizeLevel, setFontSizeLevel,
        theme 
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de AccessibilityProvider');
  return context;
}