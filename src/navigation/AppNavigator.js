import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; 

import { useTheme } from '../contexts/AccessibilityContext';
import { useUser } from '../contexts/UserContext'; 

import DashboardScreen from '../screens/Main/DashboardScreen';
import SettingsMenuScreen from '../screens/Main/Settings/SettingsMenuScreen';
import AccessibilityScreen from '../screens/Main/Settings/AccessibilityScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();
  const { signOut } = useUser();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        // Estilo da Barra Fixa
        headerStyle: {
          backgroundColor: theme.headerBackground,
          elevation: 0, // Sem sombra no Android
          shadowOpacity: 0, // Sem sombra no iOS
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTintColor: theme.primary, // Cor Azul para tudo
        headerTitleStyle: { 
          fontWeight: 'bold',
          color: theme.primary 
        },
        headerTitleAlign: 'center',
        
        // --- MUDANÇA AQUI: Ícone de Voltar (Chevron) ---
        headerLeft: ({ canGoBack }) => canGoBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
            {/* Trocamos 'arrow-back' por 'chevron-back' */}
            <Ionicons name="chevron-back" size={28} color={theme.primary} />
          </TouchableOpacity>
        ) : null,

        // Ícone da Casa na direita (Padrão)
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
          // Dashboard tem botão Sair na esquerda (parecido com voltar, mas sai)
          headerLeft: () => (
            <TouchableOpacity onPress={signOut} style={{ marginLeft: 16 }}>
              {/* Ícone de Sair espelhado para parecer que está saindo 'para trás' */}
              <Ionicons name="log-out-outline" size={28} color={theme.primary} style={{ transform: [{ scaleX: -1 }] }} /> 
            </TouchableOpacity>
          ),
        }} 
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
      
      {/* Rotas Placeholder */}
      <Stack.Screen name="IncidentRegistration" component={DashboardScreen} options={{title: 'Nova Ocorrência'}}/>
      <Stack.Screen name="MyIncidents" component={DashboardScreen} options={{title: 'Minhas Ocorrências'}}/>
      <Stack.Screen name="EditProfile" component={DashboardScreen} options={{title: 'Editar Perfil'}}/>
      <Stack.Screen name="Notifications" component={DashboardScreen} options={{title: 'Notificações'}}/>
      <Stack.Screen name="ChangePassword" component={DashboardScreen} options={{title: 'Segurança'}}/>
    </Stack.Navigator>
  );
}