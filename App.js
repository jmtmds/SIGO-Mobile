import React from 'react';
import { StatusBar } from 'expo-status-bar';

// Importa o arquivo de rotas e o provedor
import Routes from './src/navigation'; 
import { UserProvider } from './src/contexts/UserContext';

export default function App() {
  return (
    // O Provider envolve as Rotas para que todas as telas tenham acesso ao login
    <UserProvider>
      <StatusBar style="auto" />
      <Routes />
    </UserProvider>
  );
}