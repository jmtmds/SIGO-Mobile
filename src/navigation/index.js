import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

export default function Routes() {
  // TODO: Substituir isso pelo UserContext futuramente
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); 

  return (
    <NavigationContainer>
      {isUserLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}