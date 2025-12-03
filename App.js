import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Routes from './src/navigation'; 
import { UserProvider } from './src/contexts/UserContext';
import { AccessibilityProvider } from './src/contexts/AccessibilityContext'; // <--- Importe

export default function App() {
  return (
    <UserProvider>
      <AccessibilityProvider> 
        <StatusBar style="auto" />
        <Routes />
      </AccessibilityProvider>
    </UserProvider>
  );
}