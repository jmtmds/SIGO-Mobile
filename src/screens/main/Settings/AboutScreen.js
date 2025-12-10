import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/AccessibilityContext';

export default function AboutScreen() {
  const { theme, fontSizeLevel } = useTheme();

  const InfoItem = ({ icon, title, value, onPress }) => (
    <TouchableOpacity 
      style={[styles.infoItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={24} color={theme.primary} />
        <View style={styles.infoText}>
          <Text style={[styles.infoTitle, { color: theme.text, fontSize: 16 * fontSizeLevel }]}>
            {title}
          </Text>
          <Text style={[styles.infoValue, { color: theme.textSecondary, fontSize: 14 * fontSizeLevel }]}>
            {value}
          </Text>
        </View>
      </View>
      {onPress && (
        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const handleContactSupport = () => {
    Alert.alert(
      'Suporte',
      'Entre em contato conosco através do email: suporte@sigo.com.br',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Abrir Email',
          onPress: () => Linking.openURL('mailto:suporte@sigo.com.br'),
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Política de Privacidade',
      'Nossa política de privacidade está disponível em nosso site oficial.',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  };

  const handleTermsOfUse = () => {
    Alert.alert(
      'Termos de Uso',
      'Os termos de uso estão disponíveis em nosso site oficial.',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
            <Ionicons name="shield-checkmark" size={40} color="white" />
          </View>
          <Text style={[styles.appName, { color: theme.text, fontSize: 24 * fontSizeLevel }]}>
            SIGO Mobile
          </Text>
          <Text style={[styles.appDescription, { color: theme.textSecondary, fontSize: 14 * fontSizeLevel }]}>
            Sistema Integrado de Gestão de Ocorrências
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontSize: 14 * fontSizeLevel }]}>
            INFORMAÇÕES DO APP
          </Text>
          
          <InfoItem 
            icon="phone-portrait-outline" 
            title="Versão" 
            value="1.0.0" 
          />
          <InfoItem 
            icon="build-outline" 
            title="Build" 
            value="2025.2" 
          />
          <InfoItem 
            icon="logo-react" 
            title="Tecnologia" 
            value="React Native + Expo" 
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontSize: 14 * fontSizeLevel }]}>
            DESENVOLVIMENTO
          </Text>
          
          <InfoItem 
            icon="people-outline" 
            title="Equipe de Desenvolvimento" 
            value="Bianca Guimarães, Gislany Araujo, João Marcos, Jose Lucas, Pedro Ayres, Thaise Renaux" 
          />
          <InfoItem 
            icon="school-outline" 
            title="Instituição" 
            value="SENAC Pernambuco" 
          />
          <InfoItem 
            icon="calendar-outline" 
            title="Ano de Desenvolvimento" 
            value="2025" 
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontSize: 14 * fontSizeLevel }]}>
            SUPORTE
          </Text>
          
          <InfoItem 
            icon="mail-outline" 
            title="Suporte Técnico" 
            value="suporte@sigo.com.br" 
            onPress={handleContactSupport}
          />
          <InfoItem 
            icon="document-text-outline" 
            title="Política de Privacidade" 
            value="Visualizar documento" 
            onPress={handlePrivacyPolicy}
          />
          <InfoItem 
            icon="shield-outline" 
            title="Termos de Uso" 
            value="Visualizar documento" 
            onPress={handleTermsOfUse}
          />
        </View>

        <View style={[styles.footer, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.footerText, { color: theme.textSecondary, fontSize: 12 * fontSizeLevel }]}>
            Desenvolvido para auxiliar o CBMPE nos registros de ocorrencias
          </Text>
          <Text style={[styles.copyright, { color: theme.textSecondary, fontSize: 11 * fontSizeLevel }]}>
            © 2025 SIGO Mobile - Todos os direitos reservados
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 12,
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  appName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appDescription: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    marginLeft: 15,
    flex: 1,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: 3,
  },
  infoValue: {
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 10,
  },
  copyright: {
    textAlign: 'center',
    fontWeight: '500',
  },
});