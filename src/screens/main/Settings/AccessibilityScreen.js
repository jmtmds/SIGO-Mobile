import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../../../contexts/AccessibilityContext';

export default function AccessibilityScreen() {
  const { 
    theme, 
    isDarkMode, setIsDarkMode,
    highContrast, setHighContrast,
    fontSizeLevel, setFontSizeLevel
  } = useTheme();

  const toggleSwitch = (setter, value) => setter(!value);

  // Função para simular aumento de fonte (ciclo simples: 1 -> 1.1 -> 1.2 -> 1)
  const toggleFontSize = () => {
    if (fontSizeLevel >= 1.2) setFontSizeLevel(1);
    else setFontSizeLevel(fontSizeLevel + 0.1);
  };

  const SettingRow = ({ label, value, onValueChange, isSwitch = true }) => (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Text style={{ color: theme.text, fontSize: 16 * fontSizeLevel }}>{label}</Text>
      {isSwitch ? (
        <Switch
          trackColor={{ false: "#767577", true: theme.primary }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
          onValueChange={() => onValueChange(value)}
          value={value}
        />
      ) : (
        // Botão simples se não for switch
        <Switch 
            value={value} 
            onValueChange={() => onValueChange()} // Hack para usar o switch como trigger momentaneo
        /> 
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Ajuste a visualização do aplicativo para melhor atender às suas necessidades.
        </Text>

        <SettingRow 
          label="Modo Escuro" 
          value={isDarkMode} 
          onValueChange={setIsDarkMode} 
        />

        <SettingRow 
          label="Alto Contraste" 
          value={highContrast} 
          onValueChange={setHighContrast} 
        />
        
        {/* Exemplo simples para fonte: clicar no switch aumenta a fonte */}
        <View style={[styles.row, { borderBottomColor: theme.border }]}>
          <Text style={{ color: theme.text, fontSize: 16 * fontSizeLevel }}>
            Tamanho da Fonte ({Math.round(fontSizeLevel * 100)}%)
          </Text>
          <Switch 
            value={fontSizeLevel > 1}
            onValueChange={toggleFontSize}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  description: { marginBottom: 30, lineHeight: 22 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});