import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/AccessibilityContext';
import { useUser } from '../../../contexts/UserContext';

// Importe sua imagem de avatar padrão aqui
import carlosImg from '../../../assets/Carlos.jpg'; 

export default function EditProfileScreen({ navigation }) {
  const { theme, fontSizeLevel, highContrast } = useTheme();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [name, setName] = useState(user?.name || 'Carlos Ferreira');
  const [email, setEmail] = useState(user?.email || 'carlos.ferreira@bombeiros.pe.gov.br');
  const [phone, setPhone] = useState(user?.phone || '(81) 98888-7777');
  const [matricula, setMatricula] = useState(user?.matricula || '2023.1.0045');

  // Helper de texto dinâmico (igual às outras telas)
  const dynamicText = (size, weight = 'normal', color = theme.text) => ({
    fontSize: size * fontSizeLevel,
    fontWeight: weight,
    color: color
  });

  const handleSave = () => {
    setLoading(true);
    // Simulação de delay de rede
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sucesso', 'Seus dados foram atualizados!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* --- SESSÃO 1: FOTO E CABEÇALHO --- */}
          <View style={styles.headerProfile}>
            <View style={styles.imageContainer}>
              <Image 
                source={carlosImg} 
                style={[
                  styles.profileImage, 
                  { borderColor: theme.primary, borderWidth: highContrast ? 4 : 2 }
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

          {/* --- SESSÃO 2: DADOS PESSOAIS --- */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicText(14, 'bold', theme.textSecondary)]}>
              DADOS PESSOAIS
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>Nome Completo</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground, 
                    color: theme.text, 
                    borderColor: theme.border,
                    borderWidth: 1
                  }
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome completo"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>Matrícula (Somente Leitura)</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground, 
                    color: theme.textSecondary, 
                    borderColor: theme.border,
                    borderWidth: 1,
                    opacity: 0.7
                  }
                ]}
                value={matricula}
                editable={false}
              />
            </View>
          </View>

          {/* --- SESSÃO 3: CONTATO --- */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicText(14, 'bold', theme.textSecondary)]}>
              CONTATO
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>E-mail Institucional</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground, 
                    color: theme.text, 
                    borderColor: theme.border,
                    borderWidth: 1
                  }
                ]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, dynamicText(14, '600', theme.text)]}>Telefone Móvel</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground, 
                    color: theme.text, 
                    borderColor: theme.border,
                    borderWidth: 1
                  }
                ]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
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
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 50,
  },
  
  // Header do Perfil
  headerProfile: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF', // Borda branca para destacar do fundo
  },
  userName: {
    marginBottom: 4,
    textAlign: 'center',
  },

  // Sessões
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    justifyContent: 'center',
  },

  // Botão
  saveButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});