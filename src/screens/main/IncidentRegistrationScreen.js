import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Alert, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/AccessibilityContext';
import { useUser } from '../../contexts/UserContext';

// Importe o serviço que criaremos no próximo passo
import { registerIncident } from '../../services/OcorrenciasService';

export default function IncidentRegistrationScreen({ navigation }) {
  const { theme, fontSizeLevel, highContrast } = useTheme();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  
  // Estados do Formulário
  const [formData, setFormData] = useState({
    endereco: '',
    pontoReferencia: '',
    tipo: '',       // categoria (fire, traffic_accident...)
    subtipo: '',    // subcategoria (residential, collision...)
    prioridade: 'low',
    descricao: '',
    codigoViatura: '',
  });

  const dynamicText = (size, weight = 'normal', color = theme.text) => ({
    fontSize: size * fontSizeLevel,
    fontWeight: weight,
    color: color
  });

  // Opções para os Selects (Simplificado para teste)
  const tiposOcorrencia = [
    { label: 'Incêndio', value: 'fire' },
    { label: 'Acidente de Trânsito', value: 'traffic_accident' },
    { label: 'Emergência Médica', value: 'medic_emergency' },
    { label: 'Outros', value: 'other' },
  ];

  const prioridades = [
    { label: 'Baixa', value: 'low' },
    { label: 'Média', value: 'medium' },
    { label: 'Alta', value: 'high' },
  ];

  const handleRegister = async () => {
    // Validação Básica
    if (!formData.endereco || !formData.tipo || !formData.codigoViatura) {
      Alert.alert('Campos Obrigatórios', 'Preencha Endereço, Tipo e Viatura.');
      return;
    }

    setLoading(true);

    try {
      // Monta o objeto para enviar
      const payload = {
        ...formData,
        // Garante campos que o backend exige
        gps: [0, 0], // Placeholder até implementarmos GPS real
        idEquipes: [] // O backend pode exigir, enviamos vazio por enquanto
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

  // Componente de Input Reutilizável localmente
  const FormInput = ({ label, value, onChangeText, placeholder, multiline = false }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: theme.inputBackground, 
            color: theme.text,
            borderColor: highContrast ? theme.border : 'transparent',
            borderWidth: highContrast ? 1 : 0,
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

  // Componente de Seleção Simples (Botões)
  const FormSelector = ({ label, options, selectedValue, onSelect }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.selectorOption,
              selectedValue === opt.value && { backgroundColor: theme.primary },
              { borderColor: theme.primary }
            ]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={{ 
              color: selectedValue === opt.value ? (highContrast ? '#000' : '#FFF') : theme.primary,
              fontWeight: '600'
            }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

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

        <FormSelector 
          label="Tipo *" 
          options={tiposOcorrencia} 
          selectedValue={formData.tipo}
          onSelect={(val) => setFormData({...formData, tipo: val})}
        />

        <FormSelector 
          label="Prioridade *" 
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

        {/* Botão de Salvar */}
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
  scrollContent: { padding: 24 },
  sectionTitle: { marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 8 },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  selectorScroll: { flexDirection: 'row' },
  selectorOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginTop: 20,
    marginBottom: 40,
  },
});