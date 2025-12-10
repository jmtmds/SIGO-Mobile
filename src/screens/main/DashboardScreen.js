import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  RefreshControl, StatusBar, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/AccessibilityContext';
import { API_URL } from '../../services/api';

import CarlosImg from '../../assets/Carlos.jpg'; 

export default function DashboardScreen({ navigation }) {
  const { user } = useUser();
  const { theme, isHighContrast } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    ocorrenciasHoje: 0,
    statusEquipe: 'Carregando...'
  });

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          ocorrenciasHoje: data.occurrences_today || 0,
          statusEquipe: data.team_status || 'Operacional'
        });
      }
    } catch (error) {
      console.log('[Dashboard] Erro visual, mantendo dados anteriores');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  // Cores Base
  const primaryColor = theme.primary; 
  const isDarkMode = theme.background !== '#FFFFFF' || isHighContrast;
  
  const screenBg = isDarkMode ? theme.background : '#F4F6F9';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const secondaryButtonBg = isDarkMode ? '#333333' : '#FFFFFF'; 
  const secondaryBorderColor = isDarkMode ? '#FFFFFF' : '#E5E7EB';
  const textColor = theme.text;
  const subTextColor = isDarkMode ? '#AAAAAA' : '#666666';
  
  // Cores do Header
  const headerTextColor = isDarkMode ? '#000000' : '#FFFFFF'; // Se fundo escuro/contraste, texto preto
  const borderColor = '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar style="light" backgroundColor={primaryColor} />
      
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.profileContainer}>
            <Image source={CarlosImg} style={[styles.profileImage, { borderColor }]} />
            <View style={[styles.profileOnlineIndicator, { borderColor }]} />
          </View>

          <View style={styles.userInfo}>
            <Text style={[
              styles.headerWelcome, 
              { color: isDarkMode ? '#000000' : 'rgba(255,255,255,0.9)' }
            ]}>
              Bem-vindo ao SIGO
            </Text>
            <Text style={[styles.headerName, { color: headerTextColor }]} numberOfLines={1}>
              {user?.name || 'Carlos Ferreira'}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.headerRole}>{user?.role || '2º Tenente'}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />}
        showsVerticalScrollIndicator={false}
      >
        {/* CARDS DE STATUS */}
        <View style={styles.statsRow}>
          <View style={[
            styles.statCard, 
            { backgroundColor: cardBg }
          ]}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(49, 70, 151, 0.1)' }]}>
              <Ionicons name="alert-circle" size={28} color={primaryColor} />
            </View>
            <Text style={[styles.statNumber, { color: primaryColor }]}>
              {stats.ocorrenciasHoje}
            </Text>
            {/* MUDANÇA DE TEXTO AQUI: De "Hoje" para "Ativas" */}
            <Text style={[styles.statLabel, { color: subTextColor }]}>Ocorrências Ativas</Text>
          </View>

          <View style={[
            styles.statCard, 
            { backgroundColor: cardBg }
          ]}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
              <Ionicons name="people" size={28} color="#2ECC71" />
            </View>
            <Text style={[styles.statNumber, { color: '#2ECC71', fontSize: 20 }]}>
              {stats.statusEquipe}
            </Text>
            <Text style={[styles.statLabel, { color: subTextColor }]}>Status Equipe</Text>
          </View>
        </View>

        {/* MENU DE AÇÕES */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>Painel de Controle</Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.shadowProp, { backgroundColor: secondaryButtonBg, borderWidth: 1, borderColor: secondaryBorderColor }]}
            onPress={() => navigation.navigate('MyIncidents')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#6C757D' }]}>
              <Ionicons name="list" size={24} color="#FFF" />
            </View>
            <View style={styles.actionTexts}>
              <Text style={[styles.actionTitle, { color: textColor }]}>Minhas Ocorrências</Text>
              <Text style={[styles.actionSubtitle, { color: subTextColor }]}>Visualize seu histórico</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={subTextColor} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.shadowProp, { backgroundColor: secondaryButtonBg, borderWidth: 1, borderColor: secondaryBorderColor }]}
            onPress={() => navigation.navigate('SettingsMenu')} 
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#6C757D' }]}>
              <Ionicons name="settings-sharp" size={24} color="#FFF" />
            </View>
            <View style={styles.actionTexts}>
              <Text style={[styles.actionTitle, { color: textColor }]}>Ajustes</Text>
              <Text style={[styles.actionSubtitle, { color: subTextColor }]}>Configurações do app</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={subTextColor} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.shadowProp, { backgroundColor: primaryColor }]}
            onPress={() => navigation.navigate('IncidentRegistration')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: isHighContrast ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="add" size={30} color={isHighContrast ? '#000' : '#FFF'} />
            </View>
            <View style={styles.actionTexts}>
              <Text style={[styles.actionTitle, { color: isHighContrast ? '#000' : '#FFF' }]}>Nova Ocorrência</Text>
              <Text style={[styles.actionSubtitle, { color: isHighContrast ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)' }]}>Registrar novo chamado</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isHighContrast ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 20, paddingBottom: 20, paddingHorizontal: 25, elevation: 8, zIndex: 10 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  profileContainer: { position: 'relative' },
  profileImage: { width: 100, height: 100, borderRadius: 20, borderWidth: 2 },
  profileOnlineIndicator: { position: 'absolute', bottom: 0, right: 0, width: 15, height: 15, borderRadius: 10, backgroundColor: '#2ECC71', borderWidth: 2 },
  userInfo: { marginLeft: 22, flex: 1 },
  headerWelcome: { fontSize: 14, fontWeight: '500', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  headerName: { fontSize: 26, fontWeight: 'bold', letterSpacing: 0.5 },
  roleBadge: { marginTop: 8, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6, alignSelf: 'flex-start' },
  headerRole: { color: '#FFD700', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
  
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 24, 
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  profileOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
  },
  userInfo: {
    marginLeft: 22,
    flex: 1,
  },
  headerWelcome: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerName: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  roleBadge: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRole: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
    marginTop: 25,
    marginBottom: 35,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 5,
  },
  actionsContainer: {
    gap: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    height: 85,
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTexts: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
  },
});