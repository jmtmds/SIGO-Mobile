import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Alert, ActivityIndicator, Modal, FlatList, Image,
  KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import SignatureScreen from 'react-native-signature-canvas';

import { useTheme } from '../../contexts/AccessibilityContext';
import { useUser } from '../../contexts/UserContext';
import { registerIncident } from '../../services/OcorrenciasService';

// --- COMPONENTES AUXILIARES ---

const FormInput = ({ label, value, onChangeText, placeholder, multiline = false, theme, highContrast, dynamicText, editable = true }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>{label}</Text>
    <TextInput
      style={[
        styles.input, 
        { 
          backgroundColor: editable ? theme.inputBackground : (highContrast ? '#000' : '#E0E0E0'),
          color: theme.text,
          borderColor: highContrast ? theme.border : theme.border,
          borderWidth: 1,
          height: multiline ? 100 : 50,
          textAlignVertical: multiline ? 'top' : 'center',
          paddingTop: multiline ? 12 : 0,
          opacity: editable ? 1 : 0.7
        }
      ]}
      placeholder={placeholder}
      placeholderTextColor={theme.textSecondary}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      editable={editable}
    />
  </View>
);

const CustomDropdown = ({ label, options, selectedValue, onSelect, placeholder, theme, highContrast, dynamicText, fontSizeLevel }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLabel = options.find(o => o.value === selectedValue)?.label;

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>{label}</Text>
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
        <Text style={{ color: selectedLabel ? theme.text : theme.textSecondary, fontSize: 16 * fontSizeLevel }}>
          {selectedLabel || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground, borderColor: theme.border, borderWidth: 1 }]}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>Selecione uma opção</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem, { borderBottomColor: theme.border },
                    item.value === selectedValue && { backgroundColor: theme.inputBackground }
                  ]}
                  onPress={() => { onSelect(item.value); setModalVisible(false); }}
                >
                  <Text style={{ color: item.value === selectedValue ? theme.primary : theme.text, fontWeight: 'bold' }}>{item.label}</Text>
                  {item.value === selectedValue && <Ionicons name="checkmark" size={20} color={theme.primary} />}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.primary }]} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- TELA PRINCIPAL ---

export default function IncidentRegistrationScreen({ navigation }) {
  const { theme, fontSizeLevel, highContrast, isDarkMode } = useTheme();
  const { user } = useUser();
  
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  
  const [photos, setPhotos] = useState([]);
  const [signature, setSignature] = useState(null); 
  const [isSignatureModalVisible, setIsSignatureModalVisible] = useState(false);
  const signatureRef = useRef();

  const [formData, setFormData] = useState({
    endereco: '',
    pontoReferencia: '',
    tipo: '',
    subtipo: '',    
    prioridade: '',
    descricao: '',
    codigoViatura: '',
    gps: null,
  });

  const dynamicText = (size, weight = 'normal', color = theme.text) => ({
    fontSize: size * fontSizeLevel,
    fontWeight: weight,
    color: color
  });

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

  const handleGetLocation = async () => {
    setGpsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso ao GPS.');
        setGpsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setFormData(prev => ({
        ...prev,
        gps: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      }));
      
      try {
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        if (address && address.length > 0) {
          const addr = address[0];
          const formattedAddress = `${addr.street || ''}, ${addr.name || ''} - ${addr.subregion || ''}`;
          if (!formData.endereco) {
            setFormData(prev => ({ ...prev, endereco: formattedAddress }));
          }
        }
      } catch (e) {
        console.log('Erro no geocoding', e);
      }

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    } finally {
      setGpsLoading(false);
    }
  };

  const handlePickImage = async (useCamera = false) => {
    try {
      let result;
      // Opções da câmera/galeria
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        base64: true, // IMPORTANTE: Isso garante que a imagem venha convertida para salvar no PDF
      };

      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permissão', 'Precisamos de acesso à câmera.');
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled) {
        setPhotos([...photos, result.assets[0]]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível capturar a imagem.');
    }
  };

  // --- NOVA FUNÇÃO PARA DELETAR FOTO ---
  const handleRemovePhoto = (indexToRemove) => {
    setPhotos(currentPhotos => currentPhotos.filter((_, index) => index !== indexToRemove));
  };

  const handleSignatureOK = (signature) => {
    setSignature(signature);
    setIsSignatureModalVisible(false);
  };

  const handleSaveOffline = async () => {
    try {
      setLoading(true);

      // --- CRIAÇÃO DO HTML DAS FOTOS ---
      // Percorre todas as fotos e cria tags <img> com o base64
      const photosHtml = photos.map(photo => 
        `<div style="margin: 10px; display: inline-block;">
           <img src="data:image/jpeg;base64,${photo.base64}" style="width: 150px; height: 150px; border: 2px solid #ccc; border-radius: 8px;" />
         </div>`
      ).join('');

      const htmlContent = `
        <html>
          <body style="font-family: Helvetica; padding: 20px;">
            <h1 style="color: #314697;">Relatório de Ocorrência</h1>
            <p><strong>Responsável:</strong> ${user?.name} (Mat: ${user?.matricula})</p>
            <p><strong>Tipo:</strong> ${formData.tipo}</p>
            <p><strong>Prioridade:</strong> ${formData.prioridade}</p>
            <p><strong>Viatura:</strong> ${formData.codigoViatura}</p>
            <p><strong>Endereço:</strong> ${formData.endereco}</p>
            <p><strong>Coordenadas:</strong> ${formData.gps ? `${formData.gps.latitude}, ${formData.gps.longitude}` : 'N/A'}</p>
            
            <h3>Descrição</h3>
            <p>${formData.descricao || 'Sem descrição.'}</p>
            
            ${photos.length > 0 ? `
              <h3>Evidências Fotográficas</h3>
              <div style="display: flex; flex-wrap: wrap;">
                ${photosHtml}
              </div>
            ` : ''}

            ${signature ? `
              <h3>Assinatura</h3>
              <img src="${signature}" style="width: 200px; border-bottom: 1px solid #000;" />
            ` : ''}
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao gerar PDF.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.endereco || !formData.tipo || !formData.prioridade || !formData.codigoViatura) {
      Alert.alert('Campos Obrigatórios', 'Preencha Endereço, Tipo, Prioridade e Viatura.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        gps: formData.gps ? [formData.gps.latitude, formData.gps.longitude] : [0, 0], 
        idEquipes: [] 
      };

      await registerIncident(payload);
      
      Alert.alert('Sucesso', 'Ocorrência registrada!', [
        { text: 'OK', onPress: () => navigation.navigate('MyIncidents') }
      ]);
    } catch (error) {
      Alert.alert('Erro no Envio', 'Não foi possível enviar. Deseja salvar offline?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salvar PDF', onPress: handleSaveOffline }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}          
          indicatorStyle={isDarkMode ? 'white' : 'black'}
        >
          
          <Text style={[styles.sectionTitle, dynamicText(18, 'bold', theme.primary)]}>
            Dados da Ocorrência
          </Text>

          <FormInput 
            label="Responsável pelo Registro" 
            value={user?.name || 'Não identificado'}
            editable={false} 
            theme={theme} highContrast={highContrast} dynamicText={dynamicText}
          />
          
          <FormInput 
            label="Matrícula" 
            value={user?.matricula || '---'}
            editable={false} 
            theme={theme} highContrast={highContrast} dynamicText={dynamicText}
          />

          {/* GPS */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>Localização GPS *</Text>
            <View style={styles.rowInput}>
              <TextInput
                style={[
                  styles.input, 
                  { flex: 1, backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border, borderWidth: 1 }
                ]}
                placeholder="Aguardando captura..."
                placeholderTextColor={theme.textSecondary}
                value={formData.gps ? `${formData.gps.latitude}, ${formData.gps.longitude}` : ''}
                editable={false}
              />
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: theme.primary }]} 
                onPress={handleGetLocation}
                disabled={gpsLoading}
              >
                {gpsLoading ? <ActivityIndicator color="#FFF" /> : <Ionicons name="location" size={24} color="#FFF" />}
              </TouchableOpacity>
            </View>
          </View>

          <FormInput 
            label="Endereço (Preenchido pelo GPS)" 
            placeholder="Rua, Número, Bairro..."
            value={formData.endereco}
            onChangeText={(text) => setFormData({...formData, endereco: text})}
            theme={theme} highContrast={highContrast} dynamicText={dynamicText}
          />

          <CustomDropdown 
            label="Tipo *" 
            placeholder="Selecione o tipo..." 
            options={tiposOcorrencia} 
            selectedValue={formData.tipo} 
            onSelect={(val) => setFormData({...formData, tipo: val})} 
            theme={theme} highContrast={highContrast} dynamicText={dynamicText} fontSizeLevel={fontSizeLevel}
          />
          <CustomDropdown 
            label="Prioridade *" 
            placeholder="Selecione a prioridade..." 
            options={prioridades} 
            selectedValue={formData.prioridade} 
            onSelect={(val) => setFormData({...formData, prioridade: val})} 
            theme={theme} highContrast={highContrast} dynamicText={dynamicText} fontSizeLevel={fontSizeLevel}
          />

          <FormInput 
            label="Código da Viatura *" 
            placeholder="Ex: ABT-12"
            value={formData.codigoViatura}
            onChangeText={(text) => setFormData({...formData, codigoViatura: text})}
            theme={theme} highContrast={highContrast} dynamicText={dynamicText}
          />
          <FormInput 
            label="Descrição Inicial" 
            placeholder="Descreva a situação..."
            value={formData.descricao}
            onChangeText={(text) => setFormData({...formData, descricao: text})}
            multiline
            theme={theme} highContrast={highContrast} dynamicText={dynamicText}
          />

          {/* Mídia */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>Fotos e Evidências</Text>
            <View style={styles.rowButtons}>
              <TouchableOpacity style={[styles.mediaButton, { borderColor: theme.primary }]} onPress={() => handlePickImage(true)}>
                <Ionicons name="camera" size={24} color={theme.primary} />
                <Text style={{ color: theme.primary, fontWeight: '600' }}>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mediaButton, { borderColor: theme.primary }]} onPress={() => handlePickImage(false)}>
                <Ionicons name="images" size={24} color={theme.primary} />
                <Text style={{ color: theme.primary, fontWeight: '600' }}>Galeria</Text>
              </TouchableOpacity>
            </View>
            
            {/* Lista Horizontal de Fotos COM BOTÃO DE DELETAR */}
            {photos.length > 0 && (
              <ScrollView horizontal style={{ marginTop: 10 }}>
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
                    <TouchableOpacity 
                      style={styles.deletePhotoButton} 
                      onPress={() => handleRemovePhoto(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF0000" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Assinatura */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>Assinatura do Responsável</Text>
            {signature ? (
              <View style={styles.signaturePreviewContainer}>
                <Image source={{ uri: signature }} style={styles.signaturePreview} resizeMode="contain" />
                <TouchableOpacity onPress={() => setSignature(null)} style={styles.clearSignature}>
                  <Text style={{ color: '#d8000c', fontWeight: 'bold' }}>Apagar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.signatureButton, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
                onPress={() => setIsSignatureModalVisible(true)}
              >
                <Ionicons name="pencil" size={24} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary }}>Toque para assinar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: theme.primary, flex: 1 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={dynamicText(16, 'bold', '#FFF')}>Enviar Ocorrência</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: theme.textSecondary, flex: 1 }]}
              onPress={handleSaveOffline}
              disabled={loading}
            >
              <Ionicons name="download-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={dynamicText(16, 'bold', '#FFF')}>Salvar PDF</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Assinatura */}
      <Modal visible={isSignatureModalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View style={styles.signatureHeader}>
            <Text style={styles.signatureTitle}>Assine abaixo</Text>
            <TouchableOpacity onPress={() => setIsSignatureModalVisible(false)}>
              <Ionicons name="close" size={30} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <SignatureScreen
              ref={signatureRef}
              onOK={handleSignatureOK}
              webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`} 
            />
          </View>
          <View style={styles.signatureFooter}>
            <TouchableOpacity style={styles.sigBtnClear} onPress={() => signatureRef.current.clearSignature()}>
              <Text style={{ color: '#333' }}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sigBtnConfirm} onPress={() => signatureRef.current.readSignature()}>
              <Text style={{ color: '#FFF' }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24 },
  sectionTitle: { marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 8 },
  input: { borderRadius: 12, paddingHorizontal: 16, fontSize: 16, height: 50, justifyContent: 'center' },
  
  rowInput: { flexDirection: 'row', gap: 10 },
  iconButton: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  
  rowButtons: { flexDirection: 'row', gap: 15 },
  mediaButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  
  // Estilos para a miniatura e o botão de deletar
  photoContainer: { position: 'relative', marginRight: 15 },
  thumbnail: { width: 80, height: 80, borderRadius: 8 },
  deletePhotoButton: { 
    position: 'absolute', 
    top: -10, 
    right: -10, 
    backgroundColor: '#FFF', 
    borderRadius: 15 
  },

  signatureButton: { height: 100, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  signaturePreviewContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#DDD' },
  signaturePreview: { width: '100%', height: 100 },
  clearSignature: { alignSelf: 'flex-end', marginTop: 5 },
  
  signatureHeader: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EEE' },
  signatureTitle: { fontSize: 18, fontWeight: 'bold' },
  signatureFooter: { flexDirection: 'row', padding: 20, justifyContent: 'space-between', gap: 20 },
  sigBtnClear: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#CCC', alignItems: 'center' },
  sigBtnConfirm: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#314697', alignItems: 'center' },

  actionButtonsContainer: { flexDirection: 'row', gap: 10, marginBottom: 40 },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxHeight: '70%', borderRadius: 16, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalCloseButton: { marginTop: 20, padding: 14, borderRadius: 10, alignItems: 'center' },
});