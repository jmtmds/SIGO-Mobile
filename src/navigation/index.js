import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Importe seus navegadores (certifique-se que os caminhos estão corretos)
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

// Importa o hook do UserContext que acabamos de criar
import { useUser } from '../contexts/UserContext'; 

export default function Routes() {
  // Pega a variável 'signed' do contexto
  const { signed } = useUser(); 

  return (
    <NavigationContainer>
      {/* Se signed for true, mostra o App (Dashboard). Se false, mostra Auth (Login) */}
      {signed ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}