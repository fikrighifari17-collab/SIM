import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: 'home-outline', iconActive: 'home' },
    { id: 'services', label: 'Layanan SIM', icon: 'card-outline', iconActive: 'card' },
    { id: 'faq', label: 'FAQ', icon: 'help-circle-outline', iconActive: 'help-circle' },
    { id: 'about', label: 'Digital ID', icon: 'id-card-outline', iconActive: 'id-card' },
  ];

  return (
    <View style={styles.navContainer}>
      <View style={styles.navContent}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={18}
                color={isActive ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[styles.tabText, isActive && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 99,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
      },
    }),
  },
  navContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
