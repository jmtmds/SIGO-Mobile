import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/AccessibilityContext';

export default function DashboardScreen({ navigation }) {
  const { user, signOut } = useUser();
  const { theme, fontSizeLevel } = useTheme();

  const dynamicText = (size, weight = 'normal', color = theme.text) => ({
    fontSize: size * fontSizeLevel,
    fontWeight: weight,
    color: color
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBarStyle} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
        <View>
          <Text style={dynamicText(22, 'bold', theme.primary)}>Olá, {user?.name || 'Bombeiro'}</Text>
          <Text style={dynamicText(14, 'normal', theme.textSecondary)}>Bem-vindo ao SIGO Mobile</Text>
        </View>
        <TouchableOpacity onPress={signOut}>
           <Ionicons name="log-out-outline" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card Grande: Adicionei borderWidth dinâmico para aparecer no preto */}
        <TouchableOpacity 
          style={[
            styles.bigCard, 
            { 
              backgroundColor: theme.cardBackground, 
              borderColor: theme.primary, // Borda colorida no card principal
              borderWidth: 2 
            }
          ]}
          onPress={() => navigation.navigate('IncidentRegistration')}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
             {/* Ícone precisa ser preto se o fundo for amarelo (alto contraste) ou branco se for azul */}
             <Ionicons name="add" size={40} color={theme.background === '#000000' ? '#000' : '#FFF'} />
          </View>
          <Text style={[styles.cardTitle, dynamicText(18, 'bold', theme.text)]}>
            Registrar Ocorrência
          </Text>
          <Text style={[styles.cardDesc, dynamicText(14, 'normal', theme.textSecondary)]}>
            Inicie um novo registro de atendimento
          </Text>
        </TouchableOpacity>

        <View style={styles.row}>
          {/* Card Pequeno 1 */}
          <TouchableOpacity 
            style={[
              styles.smallCard, 
              { 
                backgroundColor: theme.cardBackground, 
                borderColor: theme.border, // Usa a borda do tema (Amarela no contraste)
                borderWidth: 1 
              }
            ]}
            onPress={() => navigation.navigate('MyIncidents')}
          >
            <Ionicons name="list" size={32} color={theme.primary} />
            <Text style={[styles.smallCardTitle, dynamicText(16, 'bold', theme.text)]}>Minhas Ocorrências</Text>
          </TouchableOpacity>

          {/* Card Pequeno 2 */}
          <TouchableOpacity 
            style={[
              styles.smallCard, 
              { 
                backgroundColor: theme.cardBackground, 
                borderColor: theme.border,
                borderWidth: 1 
              }
            ]}
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
    // Removemos sombras fixas e deixamos o estilo inline cuidar da borda
  },
  content: { padding: 24 },
  bigCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
  },
  smallCardTitle: {
    marginTop: 12,
    textAlign: 'center',
  }
});