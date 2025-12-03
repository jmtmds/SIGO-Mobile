import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Alert, ActivityIndicator, Modal, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/AccessibilityContext';
import { useUser } from '../../contexts/UserContext';

import { registerIncident } from '../../services/OcorrenciasService';

export default function IncidentRegistrationScreen({ navigation }) {
  const { theme, fontSizeLevel, highContrast } = useTheme();
  
  const [loading, setLoading] = useState(false);
  
  // Estados do Formulário
  const [formData, setFormData] = useState({
    endereco: '',
    pontoReferencia: '',
    tipo: '',
    subtipo: '',    
    prioridade: '', // Começa vazio para obrigar escolha
    descricao: '',
    codigoViatura: '',
  });

  const dynamicText = (size, weight = 'normal', color = theme.text) => ({
    fontSize: size * fontSizeLevel,
    fontWeight: weight,
    color: color
  });

  // Opções (Labels para exibição, Values para o backend)
  const tiposOcorrencia = [
    { label: 'Incêndio', value: 'fire' },
    { label: 'Acidente de Trânsito', value: 'traffic_accident' },
    { label: 'Emergência Médica', value: 'medic_emergency' },
    { label: 'Salvamento / Resgate', value: 'rescue' },
    { label: 'Outros', value: 'other' },
  ];

  const prioridades = [
    { label: 'Baixa', value: 'low' },
    { label: 'Média', value: 'medium' },
    { label: 'Alta', value: 'high' },
  ];

  const handleRegister = async () => {
    // Validação
    if (!formData.endereco || !formData.tipo || !formData.prioridade || !formData.codigoViatura) {
      Alert.alert('Campos Obrigatórios', 'Preencha Endereço, Tipo, Prioridade e Viatura.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        gps: [0, 0], 
        idEquipes: [] 
      };

      await registerIncident(payload);
      
      Alert.alert('Sucesso', 'Ocorrência registrada!', [
        { text: 'OK', onPress: () => navigation.navigate('MyIncidents') }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar ocorrência. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- COMPONENTES AUXILIARES ---

  // 1. Input de Texto Comum
  const FormInput = ({ label, value, onChangeText, placeholder, multiline = false }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: theme.inputBackground, 
            color: theme.text,
            borderColor: highContrast ? theme.border : theme.border,
            borderWidth: 1,
            height: multiline ? 100 : 50,
            textAlignVertical: multiline ? 'top' : 'center'
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  );

  // 2. Dropdown Customizado (Modal)
  const CustomDropdown = ({ label, options, selectedValue, onSelect, placeholder }) => {
    const [modalVisible, setModalVisible] = useState(false);

    // Encontra o label correspondente ao valor selecionado
    const selectedLabel = options.find(o => o.value === selectedValue)?.label;

    return (
      <View style={styles.inputGroup}>
        <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>{label}</Text>
        
        {/* Botão que parece um Input */}
        <TouchableOpacity
          style={[
            styles.input, 
            { 
              backgroundColor: theme.inputBackground, 
              borderColor: highContrast ? theme.border : theme.border,
              borderWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ 
            color: selectedLabel ? theme.text : theme.textSecondary,
            fontSize: 16 * fontSizeLevel
          }}>
            {selectedLabel || placeholder}
          </Text>
          <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Modal de Seleção */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.cardBackground, borderColor: theme.border, borderWidth: 1 }]}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>Selecione uma opção</Text>
              
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem, 
                      { borderBottomColor: theme.border },
                      item.value === selectedValue && { backgroundColor: theme.inputBackground }
                    ]}
                    onPress={() => {
                      onSelect(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={{ 
                      color: item.value === selectedValue ? theme.primary : theme.text,
                      fontWeight: item.value === selectedValue ? 'bold' : 'normal',
                      fontSize: 16 * fontSizeLevel
                    }}>
                      {item.label}
                    </Text>
                    {item.value === selectedValue && (
                      <Ionicons name="checkmark" size={20} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
              
              <TouchableOpacity 
                style={[styles.modalCloseButton, { backgroundColor: theme.primary }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: highContrast ? '#000' : '#FFF', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={[styles.sectionTitle, dynamicText(18, 'bold', theme.primary)]}>
          Dados da Ocorrência
        </Text>

        <FormInput 
          label="Endereço *" 
          placeholder="Rua, Número, Bairro..."
          value={formData.endereco}
          onChangeText={(text) => setFormData({...formData, endereco: text})}
        />

        <FormInput 
          label="Ponto de Referência" 
          placeholder="Próximo a..."
          value={formData.pontoReferencia}
          onChangeText={(text) => setFormData({...formData, pontoReferencia: text})}
        />

        {/* Dropdown Tipo */}
        <CustomDropdown 
          label="Tipo *" 
          placeholder="Selecione o tipo..."
          options={tiposOcorrencia} 
          selectedValue={formData.tipo}
          onSelect={(val) => setFormData({...formData, tipo: val})}
        />

        {/* Dropdown Prioridade */}
        <CustomDropdown 
          label="Prioridade *" 
          placeholder="Selecione a prioridade..."
          options={prioridades} 
          selectedValue={formData.prioridade}
          onSelect={(val) => setFormData({...formData, prioridade: val})}
        />

        <FormInput 
          label="Código da Viatura *" 
          placeholder="Ex: ABT-12"
          value={formData.codigoViatura}
          onChangeText={(text) => setFormData({...formData, codigoViatura: text})}
        />

        <FormInput 
          label="Descrição Inicial" 
          placeholder="Descreva a situação..."
          value={formData.descricao}
          onChangeText={(text) => setFormData({...formData, descricao: text})}
          multiline
        />

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: theme.primary },
            loading && { opacity: 0.7 }
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="send" size={20} color={highContrast ? '#000' : '#FFF'} />
              <Text style={dynamicText(16, 'bold', highContrast ? '#000' : '#FFF')}>
                Registrar Ocorrência
              </Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 50 },
  sectionTitle: { marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 8 },
  
  // Estilo compartilhado entre Input e Botão do Dropdown
  input: {
    borderRadius: 12, // Mais arredondado conforme design
    paddingHorizontal: 16,
    fontSize: 16,
    height: 50,
    justifyContent: 'center',
  },
  
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginTop: 10,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
});