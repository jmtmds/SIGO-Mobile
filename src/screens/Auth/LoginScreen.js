import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; // Para o ícone de voltar

// Importe o seu Logo aqui
import Logo from '../../assets/logo.svg'; 

export default function LoginScreen({ navigation }) {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {/* KeyboardAvoidingView ajuda o teclado não cobrir os campos */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* Botão Voltar */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          {/* Cabeçalho com Logo e Título */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
               {/* Ajuste o tamanho conforme necessário */}
               <Logo width={300} height={300} /> 
            </View>
            
            <Text style={styles.welcomeText}>Bem-vindo!</Text>
            <Text style={styles.instructionText}>
              Digite sua Matrícula para acessar o sistema
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Matrícula</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua matrícula"
                placeholderTextColor="#9CA3AF"
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#9CA3AF"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => alert('Lógica de Login')}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>

        
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  header: {
    alignItems: 'center', // Centraliza tudo no header
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 6,
    // Adicione sombra se quiser destacar o logo
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#314697', // Azul Escuro do SIGO
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280', // Cinza médio
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151', // Cinza escuro
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F3F4F6', // Fundo cinza bem claro
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12, // Bordas bem arredondadas
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  loginButton: {
    backgroundColor: '#314697',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#314697',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4, // Sombra no Android
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});