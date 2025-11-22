import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/AccessibilityContext';

export default function SettingsMenuScreen({ navigation }) {
  const { theme, fontSizeLevel } = useTheme();

  const MenuItem = ({ icon, title, route }) => (
    <TouchableOpacity 
      style={[styles.item, { borderBottomColor: theme.border }]}
      onPress={() => route && navigation.navigate(route)}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={24} color={theme.text} />
        <Text style={[styles.itemText, { color: theme.text, fontSize: 16 * fontSizeLevel }]}>
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>GERAL</Text>
        
        <MenuItem icon="person-outline" title="Perfil" route="EditProfile" />
        <MenuItem icon="notifications-outline" title="Notificações" route="Notifications" />
        <MenuItem icon="shield-checkmark-outline" title="Segurança" route="ChangePassword" />
        
        <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 30 }]}>PREFERÊNCIAS</Text>
        
        <MenuItem icon="eye-outline" title="Acessibilidade" route="Accessibility" />
        <MenuItem icon="information-circle-outline" title="Sobre o App" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginLeft: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  itemText: { fontWeight: '500' },
});