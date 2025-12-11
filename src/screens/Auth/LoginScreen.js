import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { loginUser } from '../../services/authService';
import { useUser } from '../../contexts/UserContext';

import Logo from '../../assets/logo.svg';

export default function LoginScreen({ navigation }) {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const scrollViewRef = useRef(null);
  const { signIn } = useUser();

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 200,
        animated: true,
      });
    }, 100);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }, 100);
  };

  const handleLogin = async () => {
    if (!matricula || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha matrícula e senha.');
      return;
    }

    setIsLoading(true);

    try {
      const userData = await loginUser(matricula, senha);

      console.log('Dados recebidos no LoginScreen:', userData); 

      signIn(userData);

    } catch (error) {
      console.error(error);
      Alert.alert('Erro de Acesso', 'Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.header}>
            {!isInputFocused && (
              <View style={styles.logoContainer}>
                <Logo width={200} height={200} />
              </View>
            )}
            <Text style={styles.welcomeText}>Bem-vindo!</Text>
            <Text style={styles.instructionText}>
              Digite sua Matrícula para acessar o sistema
            </Text>
          </View>

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
                autoCapitalize="none"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
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
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { 
    flexGrow: 1, 
    padding: 24, 
    justifyContent: 'center',
    paddingBottom: 50
  },
  backButton: { marginBottom: 24, width: 40, height: 40, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { marginBottom: 20 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#314697', marginBottom: 8, textAlign: 'center' },
  instructionText: { fontSize: 16, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20 },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 16, color: '#1F2937' },
  loginButton: { backgroundColor: '#314697', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 12, elevation: 4 },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});