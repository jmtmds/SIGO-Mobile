import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Importando o SVG como um componente
// Ajuste o caminho "../../assets/logo.svg" se seu arquivo estiver em outro lugar
import Logo from '../../assets/logo.svg'; 

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Área do Logo e Título */}
      <View style={styles.content}>
        {/* Agora usamos o Logo como uma tag, podendo mudar tamanho direto aqui */}
        <View style={styles.logoContainer}>
           <Logo width={382} height={382} />
        </View>
      </View>

      {/* Botão Começar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff', // Azul escuro do SIGO
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
    // Se precisar de sombra ou fundo no logo, adicione aqui
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000ff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000ff',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#314697ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});