import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Routes from './src/navigation'; 
import { UserProvider } from './src/contexts/UserContext';
import { AccessibilityProvider } from './src/contexts/AccessibilityContext';
import { StatsProvider } from './src/contexts/StatsContext';

export default function App() {
  return (
    <UserProvider>
      <AccessibilityProvider>
        <StatsProvider>
          <StatusBar style="auto" />
          <Routes />
        </StatsProvider>
      </AccessibilityProvider>
    </UserProvider>
  );
}