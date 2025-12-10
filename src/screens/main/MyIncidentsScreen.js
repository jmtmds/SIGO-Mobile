import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  RefreshControl, Alert, StatusBar, Modal, TextInput, ScrollView,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../contexts/AccessibilityContext';
import { useStats } from '../../contexts/StatsContext';
import { getMyIncidents, updateIncidentStatus, updateIncident, deleteIncident } from '../../services/OcorrenciasService';

export default function MyIncidentsScreen({ navigation }) {
  const { theme, isHighContrast, fontSizeLevel } = useTheme();
  const { decrementActiveIncidents, incrementActiveIncidents } = useStats();
  const styles = createStyles(fontSizeLevel);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

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

  useFocusEffect(
    useCallback(() => {
      loadIncidents();
    }, [])
  );

  // --- FUNÇÕES DE FORMATAÇÃO ---
  const formatPriority = (p) => {
    const map = { 'low': 'Baixa', 'medium': 'Média', 'high': 'Alta', 'critical': 'Crítica' };
    const key = p?.toLowerCase();
    if (map[key]) return map[key];
    return p?.charAt(0).toUpperCase() + p?.slice(1);
  };

  const getPriorityColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': case 'alta': return '#E74C3C';
      case 'medium': case 'media': case 'média': return '#F1C40F';
      case 'low': case 'baixa': return '#2ECC71';
      default: return '#95A5A6';
    }
  };

  const formatCategory = (categoryKey) => {
    const categories = {
      'fire': 'Incêndio', 'traffic_accident': 'Acidente de Trânsito', 'rescue': 'Resgate / Salvamento',
      'medic_emergency': 'Emergência Médica', 'hazardous_material': 'Produtos Perigosos',
      'natural_disaster': 'Desastre Natural', 'other': 'Outros'
    };
    return categories[categoryKey] || categoryKey?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatSubcategory = (subcategoryKey) => {
    if (!subcategoryKey) return null;

    const subcategories = {
      'vehicle': 'Veicular',
      'residential': 'Residencial',
      'intoxication': 'Intoxicação',
      'trauma': 'Trauma',
      'fire': 'Incêndio',
      'collision': 'Colisão',
      'accident': 'Acidente',
      'emergency': 'Emergência',
      'medical': 'Médico',
      'cardiac': 'Cardíaco',
      'respiratory': 'Respiratório',
      'poisoning': 'Envenenamento',
      'drowning': 'Afogamento',
      'rescue': 'Resgate',
      'explosion': 'Explosão',
      'flood': 'Inundação',
      'storm': 'Tempestade',
      'earthquake': 'Terremoto',
      'landslide': 'Deslizamento',
      'industrial': 'Industrial',
      'structural': 'Estrutural',
      'forest': 'Florestal',
      'chemical': 'Químico',
      'toxic': 'Tóxico',
      'burn': 'Queimadura',
      'fall': 'Queda',
      'overdose': 'Overdose',
      'stroke': 'AVC',
      'seizure': 'Convulsão',
      'allergic': 'Alérgico',
      'diabetic': 'Diabético',
      'building': 'Edifício',
      'house': 'Casa',
      'motorcycle': 'Motocicleta',
      'truck': 'Caminhão',
      'pedestrian': 'Pedestre',
      'rollover': 'Capotamento',
      'water': 'Aquático',
      'height': 'Altura',
      'animal': 'Animal',
      'gas': 'Gás',
      'fuel': 'Combustível',
      'utility': 'Utilidade',
      'power': 'Energia',
      'tornado': 'Tornado',
      'hurricane': 'Furacão',

      'structure_fire': 'Incêndio Estrutural',
      'vehicle_fire': 'Incêndio Veicular',
      'forest_fire': 'Incêndio Florestal',
      'car_collision': 'Colisão de Veículos',
      'pedestrian_accident': 'Atropelamento',
      'cardiac_arrest': 'Parada Cardíaca',
      'water_rescue': 'Resgate Aquático',
      'chemical_spill': 'Vazamento Químico'
    };

    const lowerKey = subcategoryKey.toLowerCase().trim();
    if (subcategories[lowerKey]) {
      return subcategories[lowerKey];
    }

    return subcategoryKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const openDetails = (item) => {
    setSelectedIncident(item);
    setEditForm({
      descricao: item.descricao,
      endereco: item.endereco,
      ponto_referencia: item.ponto_referencia,
      prioridade: formatPriority(item.prioridade) || 'Média'
    });
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateIncident(selectedIncident.id, editForm);
      Alert.alert("Sucesso", "Ocorrência atualizada com sucesso!");
      setModalVisible(false);
      loadIncidents();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar alterações.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Excluir Ocorrência",
      "Tem certeza que deseja apagar permanentemente esta ocorrência?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, Excluir", style: "destructive", onPress: handleDelete }
      ]
    );
  };

  const handleDelete = async () => {
    try {
      const wasActive = selectedIncident.status !== 'Finalizada';
      
      await deleteIncident(selectedIncident.id);
      setModalVisible(false);
      setIncidents(prev => prev.filter(i => i.id !== selectedIncident.id));
      
      if (wasActive) {
        decrementActiveIncidents();
      }
      
      Alert.alert("Deletado", "Ocorrência removida com sucesso.");
    } catch (error) {
      console.error('Erro detalhado ao deletar:', error);
      Alert.alert("Erro", `Não foi possível deletar: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const handleStatusChange = (item) => {
    Alert.alert(
      "Atualizar Status",
      `Ocorrência: ${formatCategory(item.categoria)}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Reabrir (Aberta)", onPress: () => changeStatus(item.id, "Aberta") },
        { text: "Em Andamento", onPress: () => changeStatus(item.id, "Em Andamento") },
        { text: "Finalizada", onPress: () => changeStatus(item.id, "Finalizada") }
      ]
    );
  };

  const changeStatus = async (id, newStatus) => {
    try {
      const currentIncident = incidents.find(inc => inc.id === id);
      const previousStatus = currentIncident?.status;
      
      setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
      
      await updateIncidentStatus(id, newStatus);
      
      if (previousStatus && previousStatus !== 'Finalizada' && newStatus === 'Finalizada') {
        decrementActiveIncidents();
      } else if (previousStatus === 'Finalizada' && newStatus !== 'Finalizada') {
        incrementActiveIncidents();
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status.");
      loadIncidents();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aberta': return '#E74C3C';
      case 'Em Andamento': return '#F1C40F';
      case 'Finalizada': return '#2ECC71';
      default: return '#95A5A6';
    }
  };

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    let iconName = 'alert-circle';
    if (item.categoria === 'fire') iconName = 'flame';
    else if (item.categoria === 'traffic_accident') iconName = 'car';
    else if (item.categoria === 'medical_emergency') iconName = 'medkit';

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => openDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.categoryContainer}>
            <Ionicons name={iconName} size={20} color={theme.primary} />
            <Text style={[styles.category, { color: theme.text }]}>{formatCategory(item.categoria)}</Text>
          </View>
          <TouchableOpacity style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]} onPress={() => handleStatusChange(item)}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.address, { color: theme.text }]} numberOfLines={1}>
          <Ionicons name="location-outline" size={14} /> {item.endereco}
        </Text>
        <Text style={[styles.date, { color: '#888' }]}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')} às {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View style={styles.footer}>
          <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 14 * fontSizeLevel }}>Ver Detalhes</Text>
          <Ionicons name="create-outline" size={18} color={theme.primary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    const isDarkTheme = theme.mode === 'dark' || theme.background === '#000000' || theme.background === '#121212';

    let modalBgColor = '#FFFFFF';
    if (isHighContrast) modalBgColor = '#000000';
    else if (isDarkTheme) modalBgColor = '#1E1E1E';

    const contentTextColor = (isHighContrast || isDarkTheme) ? '#FFFFFF' : '#333333';

    let inputBg = '#F5F7FA';
    let inputBorder = '#E0E0E0';
    if (isHighContrast) { inputBg = '#1A1A1A'; inputBorder = theme.primary; }
    else if (isDarkTheme) { inputBg = '#333333'; inputBorder = '#555555'; }

    const headerTextColor = isHighContrast ? '#000' : '#FFF';
    const closeBtnBg = isHighContrast ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';

    const inactiveBorder = (isHighContrast || isDarkTheme) ? '#FFF' : '#000';
    const inactiveText = (isHighContrast || isDarkTheme) ? '#FFF' : '#000';

    const priorityOptions = ['Baixa', 'Média', 'Alta'];

    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >

            <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>

              <View style={[styles.modalHeader, { backgroundColor: theme.primary }]}>
                <Text style={[styles.modalTitle, { color: headerTextColor }]}>
                  {isEditing ? "Editar Ocorrência" : "Detalhes"}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.closeButton, { backgroundColor: closeBtnBg }]}>
                  <Ionicons name="close" size={24} color={headerTextColor} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>

                <View style={styles.detailRow}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="pricetag" size={16} color={theme.primary} style={styles.labelIcon} />
                    <Text style={[styles.detailLabel, { color: theme.primary }]}>Categoria</Text>
                  </View>
                  <Text style={[styles.detailValue, { color: contentTextColor, fontWeight: 'bold', fontSize: 18 * fontSizeLevel }]}>
                    {selectedIncident && formatCategory(selectedIncident.categoria)}
                  </Text>
                </View>

                {selectedIncident?.subcategoria && (
                  <View style={styles.detailRow}>
                    <View style={styles.labelContainer}>
                      <Ionicons name="library" size={16} color={theme.primary} style={styles.labelIcon} />
                      <Text style={[styles.detailLabel, { color: theme.primary }]}>Subcategoria</Text>
                    </View>
                    <Text style={[styles.detailValue, { color: contentTextColor, fontSize: 16 * fontSizeLevel }]}>
                      {formatSubcategory(selectedIncident.subcategoria)}
                    </Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="alert-circle" size={16} color={theme.primary} style={styles.labelIcon} />
                    <Text style={[styles.detailLabel, { color: theme.primary }]}>Prioridade</Text>
                  </View>
                  {isEditing ? (
                    <View style={styles.prioritySelector}>
                      {priorityOptions.map((opt) => {
                        const isActive = editForm.prioridade === opt;
                        const activeColor = getPriorityColor(opt);
                        return (
                          <TouchableOpacity key={opt}
                            style={[
                              styles.priorityOption,
                              {
                                borderColor: isActive ? activeColor : inactiveBorder,
                                backgroundColor: isActive ? activeColor : 'transparent'
                              }
                            ]}
                            onPress={() => setEditForm({ ...editForm, prioridade: opt })}
                          >
                            <Text style={[
                              styles.priorityOptionText,
                              { color: isActive ? '#FFF' : inactiveText }
                            ]}>
                              {opt}
                            </Text>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  ) : (
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(selectedIncident?.prioridade) }]}>
                      <Text style={styles.priorityText}>{formatPriority(selectedIncident?.prioridade)}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="location" size={16} color={theme.primary} style={styles.labelIcon} />
                    <Text style={[styles.detailLabel, { color: theme.primary }]}>Endereço Completo</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      style={[styles.input, { color: contentTextColor, backgroundColor: inputBg, borderColor: inputBorder, minHeight: 60 }]}
                      value={editForm.endereco} onChangeText={(t) => setEditForm({ ...editForm, endereco: t })} multiline
                    />
                  ) : (
                    <Text style={[styles.detailValue, { color: contentTextColor }]}>{selectedIncident?.endereco}</Text>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="map" size={16} color={theme.primary} style={styles.labelIcon} />
                    <Text style={[styles.detailLabel, { color: theme.primary }]}>Ponto de Referência</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      style={[styles.input, { color: contentTextColor, backgroundColor: inputBg, borderColor: inputBorder }]}
                      value={editForm.ponto_referencia} onChangeText={(t) => setEditForm({ ...editForm, ponto_referencia: t })}
                    />
                  ) : (
                    <Text style={[styles.detailValue, { color: contentTextColor, fontStyle: selectedIncident?.ponto_referencia ? 'normal' : 'italic' }]}>
                      {selectedIncident?.ponto_referencia || 'Não informado'}
                    </Text>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.labelContainer}>
                    <Ionicons name="document-text" size={16} color={theme.primary} style={styles.labelIcon} />
                    <Text style={[styles.detailLabel, { color: theme.primary }]}>Descrição do Fato</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      style={[styles.input, { color: contentTextColor, backgroundColor: inputBg, borderColor: inputBorder, minHeight: 100 }]}
                      value={editForm.descricao} onChangeText={(t) => setEditForm({ ...editForm, descricao: t })} multiline textAlignVertical="top"
                    />
                  ) : (
                    <Text style={[styles.detailValue, { color: contentTextColor, fontStyle: selectedIncident?.descricao ? 'normal' : 'italic' }]}>
                      {selectedIncident?.descricao || 'Sem descrição detalhada.'}
                    </Text>
                  )}
                </View>

              </ScrollView>

              <View style={styles.modalFooter}>
                {isEditing ? (
                  <>
                    <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setIsEditing(false)}>
                      <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalBtn, styles.saveBtnPro, { backgroundColor: '#2ECC71' }]} onPress={handleSaveEdit}>
                      <Text style={styles.saveBtnTextPro}>Salvar Alterações</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.modalBtn, {
                        backgroundColor: '#E74C3C',
                        flex: fontSizeLevel >= 1.6 ? 0 : 1,
                        width: fontSizeLevel >= 1.6 ? '100%' : 'auto'
                      }]}
                      onPress={confirmDelete}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalBtn, {
                        backgroundColor: theme.primary,
                        flex: fontSizeLevel >= 1.6 ? 0 : 4,
                        width: fontSizeLevel >= 1.6 ? '100%' : 'auto'
                      }]}
                      onPress={() => setIsEditing(true)}
                    >
                      <Ionicons name="create" size={20} color={headerTextColor} style={{ marginRight: 8 }} />
                      <Text style={[styles.modalBtnText, { color: headerTextColor }]}>Editar Ocorrência</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      <FlatList
        data={incidents} renderItem={renderItem} keyExtractor={item => item.id} contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadIncidents} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#CCC" />
            <Text style={{ color: '#999', marginTop: 10 }}>Nenhuma ocorrência registrada.</Text>
          </View>
        }
      />
      {renderDetailModal()}
    </View>
  );
}

const createStyles = (fontSizeLevel) => StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20 + (fontSizeLevel > 1 ? fontSizeLevel * 3 : 0) },
  card: {
    padding: 16 + (fontSizeLevel > 1 ? fontSizeLevel * 4 : 0),
    borderRadius: 12,
    marginBottom: 16 + (fontSizeLevel > 1 ? fontSizeLevel * 2 : 0),
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: fontSizeLevel >= 1.6 ? 180 + (fontSizeLevel * 15) : 140,
  },
  cardHeader: {
    flexDirection: fontSizeLevel >= 1.6 ? 'column' : 'row',
    justifyContent: fontSizeLevel >= 1.6 ? 'flex-start' : 'space-between',
    alignItems: fontSizeLevel >= 1.6 ? 'flex-start' : 'center',
    marginBottom: 10 + (fontSizeLevel > 1 ? fontSizeLevel * 2 : 0),
    gap: fontSizeLevel >= 1.6 ? 8 : 0,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: fontSizeLevel > 1 ? fontSizeLevel * 1 : 0,
    flex: fontSizeLevel >= 1.6 ? 1 : 0,
  },
  category: {
    fontSize: 16 * fontSizeLevel,
    fontWeight: 'bold',
    lineHeight: 16 * fontSizeLevel * 1.2,
    flexShrink: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4 + (fontSizeLevel > 1 ? fontSizeLevel * 2 : 0),
    paddingHorizontal: 10 + (fontSizeLevel > 1 ? fontSizeLevel * 2 : 0),
    borderRadius: 20,
    gap: 6,
    alignSelf: fontSizeLevel >= 1.6 ? 'flex-start' : 'center',
    marginTop: fontSizeLevel >= 1.6 ? 4 : 0,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: {
    fontSize: 12 * fontSizeLevel,
    fontWeight: 'bold',
    lineHeight: 12 * fontSizeLevel * 1.1
  },
  address: {
    fontSize: 14 * fontSizeLevel,
    marginBottom: 8 + (fontSizeLevel > 1 ? fontSizeLevel * 2 : 0),
    lineHeight: 14 * fontSizeLevel * 1.3,
    flexShrink: 1,
  },
  date: {
    fontSize: 12 * fontSizeLevel,
    marginBottom: 10 + (fontSizeLevel > 1 ? fontSizeLevel * 2 : 0),
    lineHeight: 12 * fontSizeLevel * 1.2
  },
  footer: {
    flexDirection: fontSizeLevel >= 1.6 ? 'column' : 'row',
    justifyContent: fontSizeLevel >= 1.6 ? 'flex-start' : 'space-between',
    alignItems: fontSizeLevel >= 1.6 ? 'stretch' : 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10 + (fontSizeLevel > 1 ? fontSizeLevel * 2 : 0),
    marginTop: fontSizeLevel > 1 ? fontSizeLevel * 3 : 0,
    gap: fontSizeLevel >= 1.6 ? 8 : 0,
  },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  keyboardAvoidingView: { width: '100%', alignItems: 'center', justifyContent: 'center' },

  modalContent: {
    width: '100%',
    borderRadius: 20,
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20 + (fontSizeLevel > 1 ? fontSizeLevel * 3 : 0),
    minHeight: 70 + (fontSizeLevel > 1 ? fontSizeLevel * 8 : 0)
  },
  modalTitle: {
    fontSize: 22 * fontSizeLevel,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 22 * fontSizeLevel * 1.2,
    flex: 1,
    flexShrink: 1,
  },
  closeButton: {
    padding: 5 + (fontSizeLevel > 1 ? fontSizeLevel * 2 : 0),
    borderRadius: 20
  },
  modalBody: {
    padding: 20 + (fontSizeLevel > 1 ? fontSizeLevel * 3 : 0)
  },
  detailRow: {
    marginBottom: 20 + (fontSizeLevel > 1 ? fontSizeLevel * 3 : 0)
  },
  labelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  labelIcon: { marginRight: 8, opacity: 0.8 },
  detailLabel: { fontSize: 14 * fontSizeLevel, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  detailValue: { fontSize: 16 * fontSizeLevel, lineHeight: 24, paddingLeft: 24 },

  priorityBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start', marginLeft: 24 },
  priorityText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12 * fontSizeLevel },

  prioritySelector: { flexDirection: 'row', gap: 10, marginLeft: 24, marginTop: 5 },
  priorityOption: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  priorityOptionText: { fontWeight: 'bold', fontSize: 14 * fontSizeLevel },

  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 * fontSizeLevel, marginLeft: 24, textAlignVertical: 'top' },
  modalFooter: {
    flexDirection: fontSizeLevel >= 1.6 ? 'column' : 'row',
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)'
  },
  modalBtn: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', elevation: 2 },
  cancelBtn: { flex: 1, backgroundColor: '#E0E0E0', borderWidth: 1, borderColor: '#CCC', elevation: 0 },
  cancelBtnText: { color: '#333', fontWeight: 'bold', fontSize: 14 * fontSizeLevel },
  saveBtnPro: { flex: 2, shadowColor: "#2ECC71", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
  saveBtnTextPro: { color: '#FFF', fontWeight: 'bold', fontSize: 16 * fontSizeLevel },
  modalBtnText: { fontWeight: 'bold', fontSize: 16 * fontSizeLevel },
});