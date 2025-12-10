import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../contexts/AccessibilityContext';
import { useUser } from '../contexts/UserContext';

import DashboardScreen from '../screens/main/DashboardScreen';
import SettingsMenuScreen from '../screens/main/Settings/SettingsMenuScreen';
import AccessibilityScreen from '../screens/main/Settings/AccessibilityScreen';
import AboutScreen from '../screens/main/Settings/AboutScreen';
import MyIncidentsScreen from '../screens/main/MyIncidentsScreen';
import IncidentRegistrationScreen from '../screens/main/IncidentRegistrationScreen';
import IncidentSuccessScreen from '../screens/main/IncidentSuccessScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();
  const { signOut } = useUser();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        // Estilo Global da Barra Superior
        headerStyle: {
          backgroundColor: theme.headerBackground,
          elevation: 0, // Remove sombra no Android
          shadowOpacity: 0, // Remove sombra no iOS
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTintColor: theme.primary, // Cor Azul (ou Amarelo no Alto Contraste)
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.primary
        },
        headerTitleAlign: 'center',

        // Botão Voltar Padrão (Esquerda) - Chevron
        headerLeft: ({ canGoBack }) => canGoBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
            <Ionicons name="chevron-back" size={28} color={theme.primary} />
          </TouchableOpacity>
        ) : null,

        // Botão Home Padrão (Direita) - Casa
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
          // Dashboard não tem botão Home na direita
          headerRight: () => null,
          // Dashboard tem botão Sair na esquerda (espelhado)
          headerLeft: () => (
            <TouchableOpacity onPress={signOut} style={{ marginLeft: 16 }}>
              <Ionicons
                name="log-out-outline"
                size={28}
                color={theme.primary}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Tela de Minhas Ocorrências */}
      <Stack.Screen
        name="MyIncidents"
        component={MyIncidentsScreen}
        options={{ title: 'Minhas Ocorrências' }}
      />

      {/* Tela de Registro de Ocorrência */}
      <Stack.Screen
        name="IncidentRegistration"
        component={IncidentRegistrationScreen}
        options={{ title: 'Nova Ocorrência' }}
      />

      {/* Telas de Configuração */}
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

      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'Sobre o App' }}
      />

      {/* Tela de Sucesso na Ocorrência */}
      <Stack.Screen 
       name="IncidentSuccess" 
      component={IncidentSuccessScreen} 
     options={{ headerShown: false }} // Sem cabeçalho, igual ao Figma
      />


      {/* Rotas Placeholder (Futuras implementações) */}
      <Stack.Screen name="EditProfile" component={DashboardScreen} options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="Notifications" component={DashboardScreen} options={{ title: 'Notificações' }} />
      <Stack.Screen name="ChangePassword" component={DashboardScreen} options={{ title: 'Segurança' }} />
    </Stack.Navigator>
  );
}