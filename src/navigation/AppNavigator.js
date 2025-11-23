import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importe o useTheme
import { useTheme } from '../contexts/AccessibilityContext';

import DashboardScreen from '../screens/Main/DashboardScreen';
import SettingsMenuScreen from '../screens/Main/Settings/SettingsMenuScreen';
import AccessibilityScreen from '../screens/Main/Settings/AccessibilityScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  // Pegamos o tema atual
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        // Aqui definimos o estilo global da barra para todas as telas
        headerStyle: {
          backgroundColor: theme.headerBackground,
          elevation: 0, // Remove sombra no Android para ficar mais clean
          shadowOpacity: 0, // Remove sombra no iOS
        },
        headerTintColor: theme.text, // Cor da seta de voltar e título
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="SettingsMenu" 
        component={SettingsMenuScreen} 
        options={{ title: 'Configurações' }} 
      />
      <Stack.Screen 
        name="Accessibility" 
        component={AccessibilityScreen} 
        options={{ title: 'Acessibilidade' }} 
      />
      
      {/* Placeholders */}
      <Stack.Screen name="IncidentRegistration" component={DashboardScreen} options={{title: 'Em breve'}}/>
      <Stack.Screen name="MyIncidents" component={DashboardScreen} options={{title: 'Em breve'}}/>
      <Stack.Screen name="EditProfile" component={DashboardScreen} options={{title: 'Em breve'}}/>
      <Stack.Screen name="Notifications" component={DashboardScreen} options={{title: 'Em breve'}}/>
      <Stack.Screen name="ChangePassword" component={DashboardScreen} options={{title: 'Em breve'}}/>
    </Stack.Navigator>
  );
}