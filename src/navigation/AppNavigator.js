import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/Main/DashboardScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'SIGO Mobile' }} 
      />
      {/* Aqui entrarão as telas de Ocorrências, Perfil, etc. */}
    </Stack.Navigator>
  );
}