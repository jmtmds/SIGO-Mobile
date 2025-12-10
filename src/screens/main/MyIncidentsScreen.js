import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  RefreshControl, Alert, StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../contexts/AccessibilityContext';
import { getMyIncidents, updateIncidentStatus } from '../../services/OcorrenciasService';

export default function MyIncidentsScreen({ navigation }) {
  const { theme, isHighContrast } = useTheme();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await getMyIncidents();
      setIncidents(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      loadIncidents();
    }, [])
  );

  // Função para abrir o menu de mudança de status
  const handleStatusChange = (item) => {
    Alert.alert(
      "Atualizar Status",
      `Ocorrência: ${item.categoria}`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Em Andamento", 
          onPress: () => changeStatus(item.id, "Em Andamento") 
        },
        { 
          text: "Finalizada", 
          onPress: () => changeStatus(item.id, "Finalizada") 
        }
      ]
    );
  };

  const changeStatus = async (id, newStatus) => {
    try {
      // Atualiza visualmente na hora (Otimista)
      setIncidents(prev => prev.map(inc => 
        inc.id === id ? { ...inc, status: newStatus } : inc
      ));
      
      // Envia para o backend
      await updateIncidentStatus(id, newStatus);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status.");
      loadIncidents(); // Reverte se der erro
    }
  };

  // Função para definir cor baseada no status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aberta': return '#E74C3C'; // Vermelho
      case 'Em Andamento': return '#F1C40F'; // Amarelo/Dourado
      case 'Finalizada': return '#2ECC71'; // Verde
      default: return '#95A5A6';
    }
  };

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    
    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => handleStatusChange(item)} // Clicar no card abre opções
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.categoryContainer}>
            <Ionicons name="flame" size={20} color={theme.primary} />
            <Text style={[styles.category, { color: theme.text }]}>{item.categoria}</Text>
          </View>
          
          {/* BADGE DE STATUS */}
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}> 
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={[styles.address, { color: theme.text }]}>
          <Ionicons name="location-outline" size={14} /> {item.endereco}
        </Text>
        
        <Text style={[styles.date, { color: '#888' }]}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')} às {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>

        <View style={styles.footer}>
          <Text style={{ color: '#888', fontSize: 12 }}>Toque para alterar status</Text>
          <Ionicons name="chevron-forward" size={16} color="#888" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      <FlatList
        data={incidents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadIncidents} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#CCC" />
            <Text style={{ color: '#999', marginTop: 10 }}>Nenhuma ocorrência registrada.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20 },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  }
});