import React, { createContext, useState, useContext } from 'react';

const AccessibilityContext = createContext({});

export const AccessibilityProvider = ({ children }) => {
  // Estados de acessibilidade
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 1 = Normal, 1.2 = Grande

  // Definição das Cores Dinâmicas
  const theme = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    textSecondary: isDarkMode ? '#BBBBBB' : '#666666',
    primary: isDarkMode ? '#5c7cfa' : '#314697', // Azul mais claro no escuro para contraste
    cardBackground: isDarkMode ? '#1E1E1E' : '#F1F4FF',
    inputBackground: isDarkMode ? '#2C2C2C' : '#F1F4FF',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBackground: isDarkMode ? '#000000' : '#FFFFFF',
    statusBarStyle: isDarkMode ? 'light' : 'dark',
  };

  // Se Alto Contraste estiver ativado, sobrescreve algumas cores
  if (highContrast) {
    theme.background = '#000000';
    theme.text = '#FFFF00'; // Amarelo no preto
    theme.primary = '#FFFFFF';
    theme.cardBackground = '#000000';
    theme.border = '#FFFFFF';
  }

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