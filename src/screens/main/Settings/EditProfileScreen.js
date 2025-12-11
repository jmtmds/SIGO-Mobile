import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Image, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/AccessibilityContext';
import { useUser } from '../../../contexts/UserContext';
import { updateUserProfile } from '../../../services/authService';

import carlosImg from '../../../assets/Carlos.jpg'; 

export default function EditProfileScreen({ navigation }) {
  const { theme, fontScale, isHighContrast } = useTheme();
  const { user, signIn } = useUser(); 
  const [loading, setLoading] = useState(false);

  // --- FUNÇÃO DE MÁSCARA DE TELEFONE ---
  const formatPhone = (value) => {
    if (!value) return '';
    
    // 1. Remove tudo que não é número
    const cleaned = value.replace(/\D/g, '');
    
    // 2. Limita a 11 dígitos (DDD + 9 dígitos)
    const match = cleaned.substring(0, 11);

    // 3. Monta a máscara: (81) 9 5566-7788
    if (match.length <= 2) {
      return match;
    } else if (match.length <= 3) {
      return `(${match.slice(0, 2)}) ${match.slice(2)}`;
    } else if (match.length <= 7) {
      return `(${match.slice(0, 2)}) ${match.slice(2, 3)} ${match.slice(3)}`;
    } else {
      return `(${match.slice(0, 2)}) ${match.slice(2, 3)} ${match.slice(3, 7)}-${match.slice(7, 11)}`;
    }
  };

  // Estados do formulário
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // AQUI: Aplicamos a formatação já no valor inicial
  const [phone, setPhone] = useState(formatPhone(user?.phone || ''));
  
  const [matricula] = useState(user?.matricula || '');

  const dynamicText = (size, weight = 'normal', color = theme.text) => ({
    fontSize: size * fontScale,
    fontWeight: weight,
    color: color
  });

  // Função Wrapper para aplicar máscara ao digitar
  const handlePhoneChange = (text) => {
    const formatted = formatPhone(text);
    setPhone(formatted);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }

    setLoading(true);

    try {
      // Importante: Antes de enviar pro banco, é bom limpar a máscara
      // para salvar apenas os números: "81988887777".
      // Mas se preferir salvar formatado, pode mandar 'phone' direto.
      // Vou mandar formatado conforme visualização.
      
      const updatedData = await updateUserProfile(user.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      });

      signIn({ ...user, ...updatedData });

      Alert.alert('Sucesso', 'Perfil atualizado!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputBg = theme.mode === 'dark' ? '#333' : theme.inputBackground || '#F5F7FA';
  const borderColor = theme.border;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* FOTO E CABEÇALHO */}
          <View style={styles.headerProfile}>
            <View style={styles.imageContainer}>
              <Image 
                source={carlosImg} 
                style={[
                  styles.profileImage, 
                  { borderColor: theme.primary, borderWidth: isHighContrast ? 4 : 2 }
                ]} 
              />
              <TouchableOpacity style={[styles.cameraButton, { backgroundColor: theme.primary }]}>
                <Ionicons name="camera" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.userName, dynamicText(20, 'bold', theme.text)]}>
              {name}
            </Text>
            <Text style={dynamicText(14, '600', theme.primary)}>
              {user?.role || 'Oficial Combatente'}
            </Text>
          </View>

          {/* DADOS PESSOAIS */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicText(14, 'bold', '#888')]}>
              DADOS PESSOAIS
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>Nome Completo</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: theme.text, borderColor: borderColor }]}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome completo"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>Matrícula</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: '#999', borderColor: borderColor, opacity: 0.7 }]}
                value={matricula}
                editable={false}
              />
            </View>
          </View>

          {/* CONTATO */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicText(14, 'bold', '#888')]}>
              CONTATO
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>E-mail Institucional</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: theme.text, borderColor: borderColor }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="ex: nome@bombeiros.pe.gov.br"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>Telefone Móvel</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: theme.text, borderColor: borderColor }]}
                value={phone}
                onChangeText={handlePhoneChange} // <--- AQUI A MÁGICA
                keyboardType="numeric" // Apenas números no teclado
                placeholder="(81) 9 9999-9999"
                placeholderTextColor="#999"
                maxLength={16} // Limita o tamanho (11 números + caracteres da máscara)
              />
            </View>
          </View>

          {/* BOTÃO SALVAR */}
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: theme.primary }]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={dynamicText(16, 'bold', '#FFF')}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 50 },
  headerProfile: { alignItems: 'center', marginBottom: 32 },
  imageContainer: { position: 'relative', marginBottom: 16 },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  userName: { marginBottom: 4, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
  inputGroup: { marginBottom: 16 },
  label: { marginBottom: 8 },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
  saveButton: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
});