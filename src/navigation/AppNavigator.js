import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Telas Principais
import DashboardScreen from '../screens/Main/DashboardScreen';

// Telas de Configuração
import SettingsMenuScreen from '../screens/Main/Settings/SettingsMenuScreen';
import AccessibilityScreen from '../screens/Main/Settings/AccessibilityScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ headerShown: false }} 
      />
      
      {/* Rotas de Configuração */}
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
      
      {/* Placeholders para não dar erro se clicar */}
      <Stack.Screen name="IncidentRegistration" component={DashboardScreen} options={{title: 'Em breve'}}/>
      <Stack.Screen name="MyIncidents" component={DashboardScreen} options={{title: 'Em breve'}}/>
      <Stack.Screen name="EditProfile" component={DashboardScreen} options={{title: 'Em breve'}}/>
      <Stack.Screen name="Notifications" component={DashboardScreen} options={{title: 'Em breve'}}/>
      <Stack.Screen name="ChangePassword" component={DashboardScreen} options={{title: 'Em breve'}}/>
    </Stack.Navigator>
  );
}