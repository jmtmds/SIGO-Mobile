import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, ActivityIndicator, 
  RefreshControl, TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/AccessibilityContext';

// Importação ajustada para a pasta services
import { getMyIncidents } from '../../services/OcorrenciasService';

// Componente para renderizar cada item da lista
const IncidentItem = ({ item, theme, dynamicText, highContrast }) => {
  const getStatusColor = (status) => {
    // Tratamento simples para evitar erro se status for null
    const s = status ? String(status).toLowerCase() : '';
    switch(s) {
      case 'em andamento': return '#2196f3'; // Azul
      case 'pendente': return '#ff9800'; // Laranja
      case 'finalizada': return '#4caf50'; // Verde
      default: return theme.textSecondary;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.cardBackground,
          borderColor: highContrast ? theme.border : theme.border,
          borderWidth: 1
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={dynamicText(14, 'bold', theme.primary)}>
          {/* Garante que item.id existe antes de tentar cortar */}
          #{item.id ? String(item.id).substring(0, 8) : 'N/A'}...
        </Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={dynamicText(12, '600', theme.text)}>
            {item.status || 'Pendente'}
          </Text>
        </View>
      </View>

      <Text style={[styles.cardTitle, dynamicText(16, 'bold', theme.text)]}>
        {item.tipo || 'Ocorrência sem tipo'}
      </Text>
      
      <Text numberOfLines={2} style={dynamicText(14, 'normal', theme.textSecondary)}>
        {item.descricao || 'Sem descrição disponível.'}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
          <Text style={dynamicText(12, 'normal', theme.textSecondary)}>
            {/* Formata a data ou usa a data atual se não existir */}
            {new Date(item.data_criacao || Date.now()).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

export default function MyIncidentsScreen() {
  const { theme, fontSizeLevel, highContrast } = useTheme();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const dynamicText = (size, weight = 'normal', color = theme.text) => ({
    fontSize: size * fontSizeLevel,
    fontWeight: weight,
    color: color
  });

  const loadData = async () => {
    try {
      setError(null);
      // Chama o serviço
      const data = await getMyIncidents();
      
      // Garante que incidents seja sempre um array, mesmo se a API retornar algo estranho
      setIncidents(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar as ocorrências.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, dynamicText(14, 'normal', theme.textSecondary)]}>
          Buscando ocorrências...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.textSecondary} />
          <Text style={[styles.errorText, dynamicText(16, 'normal', theme.textSecondary)]}>
            {error}
          </Text>
          <TouchableOpacity onPress={() => { setLoading(true); loadData(); }} style={[styles.retryButton, { backgroundColor: theme.primary }]}>
            <Text style={dynamicText(14, 'bold', '#FFF')}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => String(item.id || Math.random())}
          renderItem={({ item }) => (
            <IncidentItem 
              item={item} 
              theme={theme} 
              dynamicText={dynamicText} 
              highContrast={highContrast} 
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="documents-outline" size={48} color={theme.textSecondary} style={{ opacity: 0.5 }} />
              <Text style={[dynamicText(16, 'normal', theme.textSecondary), { marginTop: 10 }]}>
                Nenhuma ocorrência encontrada.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  loadingText: { marginTop: 10 },
  errorText: { marginTop: 10, marginBottom: 20, textAlign: 'center' },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  
  // Card Styles
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});