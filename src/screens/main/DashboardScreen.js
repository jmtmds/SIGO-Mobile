import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/AccessibilityContext';

export default function DashboardScreen({ navigation }) {
  const { user, signOut } = useUser();
  const { theme, fontSizeLevel } = useTheme();

  // Função auxiliar para gerar estilo de texto dinâmico
  const dynamicText = (size, weight = 'normal', color = theme.text) => ({
    fontSize: size * fontSizeLevel,
    fontWeight: weight,
    color: color
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBarStyle} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <View>
          <Text style={dynamicText(22, 'bold', theme.primary)}>Olá, {user?.name || 'Bombeiro'}</Text>
          <Text style={dynamicText(14, 'normal', theme.textSecondary)}>Bem-vindo ao SIGO Mobile</Text>
        </View>
        <TouchableOpacity onPress={signOut}>
           <Ionicons name="log-out-outline" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card: Registrar Ocorrência */}
        <TouchableOpacity 
          style={[styles.bigCard, { backgroundColor: theme.cardBackground, borderColor: theme.primary }]}
          onPress={() => navigation.navigate('IncidentRegistration')}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
             <Ionicons name="add" size={40} color="#FFF" />
          </View>
          <Text style={[styles.cardTitle, dynamicText(18, 'bold', theme.text)]}>
            Registrar Ocorrência
          </Text>
          <Text style={[styles.cardDesc, dynamicText(14, 'normal', theme.textSecondary)]}>
            Inicie um novo registro de atendimento
          </Text>
        </TouchableOpacity>

        {/* Linha com 2 Cards menores */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.smallCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={() => navigation.navigate('MyIncidents')}
          >
            <Ionicons name="list" size={32} color={theme.primary} />
            <Text style={[styles.smallCardTitle, dynamicText(16, 'bold', theme.text)]}>Minhas Ocorrências</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.smallCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={() => navigation.navigate('SettingsMenu')}
          >
            <Ionicons name="settings-outline" size={32} color={theme.primary} />
            <Text style={[styles.smallCardTitle, dynamicText(16, 'bold', theme.text)]}>Configurações</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  content: { padding: 24 },
  bigCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: { marginBottom: 8 },
  cardDesc: { textAlign: 'center' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  smallCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    elevation: 1,
  },
  smallCardTitle: {
    marginTop: 12,
    textAlign: 'center',
  }
});