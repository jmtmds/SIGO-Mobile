import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../contexts/AccessibilityContext';

export default function AccessibilityScreen() {
  const { 
    theme, 
    isDarkMode, setIsDarkMode,
    highContrast, setHighContrast,
    fontSizeLevel, setFontSizeLevel
  } = useTheme();

  // Definição das 3 fases do tamanho da fonte
  const fontOptions = [
    { label: 'Padrão', value: 1 },   // 100%
    { label: 'Grande', value: 1.3 }, // 130%
    { label: 'Extra', value: 1.6 },  // 160%
  ];

  // Componente de Linha de Configuração (Switch)
  const SettingRow = ({ label, value, onValueChange }) => (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Text style={{ color: theme.text, fontSize: 16 * fontSizeLevel }}>{label}</Text>
      <Switch
        trackColor={{ false: "#767577", true: theme.primary }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.description, { color: theme.textSecondary, fontSize: 14 * fontSizeLevel }]}>
          Ajuste a visualização do aplicativo para melhor atender às suas necessidades.
        </Text>

        {/* Opções de Switch */}
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
        
        {/* Nova Seção de Tamanho da Fonte (3 Fases) */}
        <View style={[styles.fontSection, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 16 * fontSizeLevel }]}>
            Tamanho da Fonte
          </Text>
          
          <View style={styles.selectorContainer}>
            {fontOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.optionBtn,
                  { borderColor: theme.primary },
                  // Se for a opção selecionada, pinta o fundo
                  fontSizeLevel === option.value && { backgroundColor: theme.primary }
                ]}
                onPress={() => setFontSizeLevel(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  // Muda a cor do texto dependendo se está selecionado ou não
                  { 
                    color: fontSizeLevel === option.value ? '#FFFFFF' : theme.text,
                    fontSize: 14 * (fontSizeLevel > 1.3 ? 1.3 : fontSizeLevel) // Limita tamanho no botão pra não quebrar
                  }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={{ color: theme.textSecondary, marginTop: 8, fontSize: 14 * fontSizeLevel }}>
            Atual: {Math.round(fontSizeLevel * 100)}%
          </Text>
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
  // Estilos novos para o seletor de fonte
  fontSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: '500',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontWeight: 'bold',
  }
});