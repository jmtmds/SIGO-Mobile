import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 

import { getMyIncidents } from '../../services/OcorrenciasService';
import { useUser } from '../../contexts/UserContext';

// ... (Funções formatDate e getStatusColor continuam iguais) ...
const formatDate = (unixTimestamp) => {
  if (!unixTimestamp) return 'Data desconhecida';
  const date = new Date(unixTimestamp * 1000); 
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', 
    hour: '2-digit', minute: '2-digit'
  });
};

const getStatusColor = (status) => {
  if (!status) return '#6B7280';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('aberta') || statusLower.includes('pendente')) return '#EF4444';
  if (statusLower.includes('andamento')) return '#F59E0B';
  if (statusLower.includes('finalizada') || statusLower.includes('concluída')) return '#10B981';
  return '#6B7280';
};

export default function MyIncidentsScreen({ navigation }) {
  // ... (Toda a lógica de state e useEffect continua igual) ...
  const { user } = useUser();
  const [filter, setFilter] = useState('Todas');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncidents = async () => {
    try {
      const data = await getMyIncidents();
      setIncidents(data || []);
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIncidents();
  };

  const filteredData = filter === 'Todas' 
    ? incidents 
    : incidents.filter(item => {
        const s = item.status?.toLowerCase() || '';
        const f = filter.toLowerCase();
        if (f === 'aberta' && (s.includes('aberta') || s.includes('pendente'))) return true;
        if (f === 'em andamento' && s.includes('andamento')) return true;
        if (f === 'finalizada' && s.includes('finalizada')) return true;
        return false;
      });

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const titulo = item.chamado?.tipo || 'Ocorrência';
    const codigo = `#${item.id?.substring(0, 8).toUpperCase()}`;
    const dataFormatada = formatDate(item.timestamps?.abertura);
    const descricao = item.chamado?.detalhes || 'Sem descrição';
    const endereco = "Localização Registrada"; 

    return (
      <View style={[styles.card, { borderLeftColor: statusColor }]}>
        <View style={styles.cardHeader}>
          <View style={styles.typeContainer}>
            <View style={[styles.iconCircle, { backgroundColor: statusColor + '20' }]}>
              <Ionicons name="alert-circle" size={24} color={statusColor} />
            </View>
            <View>
              <Text style={styles.cardTitle}>{titulo}</Text>
              <Text style={styles.cardCode}>{codigo}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status || 'Desconhecido'}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.rowText}>{endereco}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.rowText}>{dataFormatada}</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {descricao}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* REMOVI O CABEÇALHO PERSONALIZADO DAQUI */}

      {/* Filtros (Abas) */}
      <View style={styles.filterContainer}>
        {['Todas', 'Aberta', 'Em Andamento', 'Finalizada'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[
              styles.filterTab, 
              filter === tab && styles.filterTabActive
            ]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[
              styles.filterText, 
              filter === tab && styles.filterTextActive
            ]}>
              {tab === 'Em Andamento' ? 'Andamento' : tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Carregando ocorrências...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma ocorrência encontrada.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  // REMOVI OS ESTILOS DO HEADER (header e headerTitle)
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFF',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: '#E0E7FF',
    borderColor: '#1E3A8A',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#1E3A8A',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardCode: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardBody: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowText: {
    fontSize: 14,
    color: '#4B5563',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#9CA3AF',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#1E3A8A',
    fontSize: 16,
  }
});