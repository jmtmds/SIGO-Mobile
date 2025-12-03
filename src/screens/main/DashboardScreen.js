import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/AccessibilityContext';

import carlosImg from '../../assets/Carlos.jpg'; 

// ActionCard atualizado com Rolagem Lateral no Texto
const ActionCard = ({ title, subtitle, icon, onPress, isPrimary = false, theme, highContrast, dynamicText }) => (
  <TouchableOpacity 
    style={[
      styles.actionCard, 
      { 
        backgroundColor: isPrimary ? theme.primary : theme.cardBackground,
        borderColor: highContrast ? theme.border : (isPrimary ? 'transparent' : theme.border),
        borderWidth: highContrast ? 2 : (isPrimary ? 0 : 1)
      }
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    {/* 1. Ícone Fixo na Esquerda */}
    <View style={[
      styles.iconCircle, 
      { backgroundColor: isPrimary ? 'rgba(255,255,255,0.2)' : theme.inputBackground }
    ]}>
       <Ionicons 
         name={icon} 
         size={24} 
         color={isPrimary ? (highContrast ? '#000' : '#FFF') : theme.primary} 
       />
    </View>

    {/* 2. Texto com Rolagem Lateral (Ocupa o meio) */}
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={true} // Mostra a barra lateral
      persistentScrollbar={true}            // Tenta manter a barra visível (Android)
      style={styles.textScroll}
      contentContainerStyle={{ paddingRight: 10 }} // Espaço extra no fim do scroll
    >
      <View>
        <Text style={dynamicText(16, 'bold', isPrimary ? (highContrast ? '#000' : '#FFF') : theme.text)}>
          {title}
        </Text>
        {subtitle && (
          <Text style={dynamicText(12, 'normal', isPrimary ? (highContrast ? '#000' : '#E0E7FF') : theme.textSecondary)}>
            {subtitle}
          </Text>
        )}
      </View>
    </ScrollView>

    {/* 3. Seta Fixa na Direita */}
    <Ionicons 
      name="chevron-forward" 
      size={24} 
      color={isPrimary ? (highContrast ? '#000' : '#FFF') : theme.textSecondary}
      style={{ marginLeft: 8 }} 
    />
  </TouchableOpacity>
);

export default function DashboardScreen({ navigation }) {
  const { user } = useUser(); 
  const { theme, fontSizeLevel, highContrast } = useTheme();

  const dynamicText = (size, weight = 'normal', color = theme.text) => ({
    fontSize: size * fontSizeLevel,
    fontWeight: weight,
    color: color
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBarStyle} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- Perfil do Usuário --- */}
        <View style={styles.profileContainer}>
          <Image 
            source={carlosImg} 
            style={[styles.profileImage, { borderColor: theme.primary }]} 
          />
          
          {/* Texto do Perfil com Scroll também, caso aumente muito */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            style={styles.profileTextScroll}
          >
            <View style={styles.profileTextContainer}>
              <Text style={dynamicText(14, 'normal', theme.textSecondary)}>
                Bem-vindo de volta,
              </Text>
              
              <Text style={dynamicText(24, 'bold', theme.text)}>
                {user?.name || 'Carlos Ferreira'}
              </Text>
              
              <Text style={[styles.roleBadge, dynamicText(15, '600', theme.primary)]}>
                {user?.role || '2º Tenente'}
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* Linha Divisória */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* --- Widget de Status --- */}
        <View style={[styles.statusContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border, borderWidth: 1 }]}>
            <View style={styles.statusItem}>
                <Text style={dynamicText(24, 'bold', theme.primary)}>03</Text>
                <Text style={dynamicText(12, '600', theme.textSecondary)}>Ocorrências Hoje</Text>
            </View>
            <View style={[styles.verticalDivider, { backgroundColor: theme.border }]}/>
            <View style={styles.statusItem}>
                <Text style={dynamicText(24, 'bold', '#10B981')}>ON</Text>
                <Text style={dynamicText(12, '600', theme.textSecondary)}>Status Equipe</Text>
            </View>
        </View>

        {/* --- Lista de Ações --- */}
        <View style={styles.actionsList}>
          <Text style={[styles.sectionTitle, dynamicText(14, 'bold', theme.textSecondary)]}>
            AÇÕES RÁPIDAS
          </Text>

          <ActionCard 
            title="Minhas Ocorrências" 
            subtitle="Histórico e atendimentos"
            icon="list"
            onPress={() => navigation.navigate('MyIncidents')}
            theme={theme} highContrast={highContrast} dynamicText={dynamicText}
          />

          <ActionCard 
            title="Ajustes" 
            subtitle="Configurações do aplicativo"
            icon="settings-outline"
            onPress={() => navigation.navigate('SettingsMenu')}
            theme={theme} highContrast={highContrast} dynamicText={dynamicText}
          />

          <ActionCard 
            title="Nova Ocorrência" 
            subtitle="Iniciar registro de emergência"
            icon="add-circle"
            isPrimary={true}
            onPress={() => navigation.navigate('IncidentRegistration')}
            theme={theme} highContrast={highContrast} dynamicText={dynamicText}
          />

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 24,
  },
  
  // Perfil
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 20, 
  },
  profileImage: {
    width: 85, 
    height: 85,
    borderRadius: 22, 
    borderWidth: 2,
    flexShrink: 0, // Impede que a imagem encolha
  },
  profileTextScroll: {
    flex: 1, // Ocupa o resto do espaço lateral
  },
  profileTextContainer: {
    justifyContent: 'center',
  },
  roleBadge: {
    marginTop: 2,
    opacity: 0.9,
  },

  divider: {
    height: 1,
    width: '100%',
    marginBottom: 24,
  },
  
  // Widget Status
  statusContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statusItem: {
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '80%',
  },
  
  // Ações
  actionsList: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    // Altura mínima garante que não fique espremido se tiver barra de rolagem
    minHeight: 90, 
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // Impede o ícone de esmagar
    marginRight: 16,
  },
  textScroll: {
    flex: 1, // Ocupa todo o espaço disponível entre ícone e seta
  },
});