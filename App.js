import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Routes from './src/navigation'; // Importa o nosso roteador principal

export default function App() {
  return (
    <>
      {/* Configura a barra de status do celular */}
      <StatusBar style="auto" />
      
      {/* Renderiza as rotas */}
      <Routes />
    </>
  );
}