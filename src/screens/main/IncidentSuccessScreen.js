import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 

export default function IncidentSuccessScreen({ route, navigation }) {
  // Recebe os dados passados pela tela anterior (opcional)
  const { protocol, date } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        
        {/* Ícone de Sucesso */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={60} color="#10B981" />
        </View>

        <Text style={styles.title}>Ocorrência Registrada!</Text>
        <Text style={styles.subtitle}>
          Sua ocorrência foi registrada no sistema com sucesso
        </Text>

        {/* Card de Informações */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Protocolo:</Text>
            <Text style={styles.infoValue}>{protocol || '2025-PENDENTE'}</Text>
          </View>
          <View style={[styles.infoRow, styles.borderTop]}>
            <Text style={styles.infoLabel}>Registrado em:</Text>
            <Text style={styles.infoValue}>{date || new Date().toLocaleString()}</Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.newButton} 
            onPress={() => navigation.navigate('IncidentRegistration')}
          >
            <Text style={styles.newButtonText}>+ Nova Ocorrência</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Ionicons name="home-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.homeButtonText}>Tela Inicial</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D1FAE5', 
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 40,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  newButton: {
    backgroundColor: '#F97316', // Laranja do Figma
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#1E3A8A', 
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});