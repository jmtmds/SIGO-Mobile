import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; 

import { useTheme } from '../contexts/AccessibilityContext';
import { useUser } from '../contexts/UserContext'; 

import DashboardScreen from '../screens/Main/DashboardScreen';
import SettingsMenuScreen from '../screens/Main/Settings/SettingsMenuScreen';
import AccessibilityScreen from '../screens/Main/Settings/AccessibilityScreen';

// 1. IMPORTE A NOVA TELA AQUI
import MyIncidentsScreen from '../screens/Main/MyIncidentsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();
  const { signOut } = useUser();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: theme.headerBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTintColor: theme.primary, 
        headerTitleStyle: { 
          fontWeight: 'bold',
          color: theme.primary 
        },
        headerTitleAlign: 'center',
        
        headerLeft: ({ canGoBack }) => canGoBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
            <Ionicons name="chevron-back" size={28} color={theme.primary} />
          </TouchableOpacity>
        ) : null,

        headerRight: () => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Dashboard')} 
            style={{ marginRight: 16 }}
          >
            <Ionicons name="home-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ 
          title: 'SIGO Mobile',
          headerRight: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={signOut} style={{ marginLeft: 16 }}>
              <Ionicons name="log-out-outline" size={28} color={theme.primary} style={{ transform: [{ scaleX: -1 }] }} /> 
            </TouchableOpacity>
          ),
        }} 
      />
      
      {/* 2. ATUALIZE A ROTA AQUI (Troque DashboardScreen por MyIncidentsScreen) */}
      <Stack.Screen 
        name="MyIncidents" 
        component={MyIncidentsScreen} 
        options={{ title: 'Minhas Ocorrências' }} 
      />

      {/* Configurações */}
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
      
      {/* Rotas Placeholder (Ainda apontando para Dashboard até criarmos) */}
      <Stack.Screen name="IncidentRegistration" component={DashboardScreen} options={{title: 'Nova Ocorrência'}}/>
      <Stack.Screen name="EditProfile" component={DashboardScreen} options={{title: 'Editar Perfil'}}/>
      <Stack.Screen name="Notifications" component={DashboardScreen} options={{title: 'Notificações'}}/>
      <Stack.Screen name="ChangePassword" component={DashboardScreen} options={{title: 'Segurança'}}/>
    </Stack.Navigator>
  );
}