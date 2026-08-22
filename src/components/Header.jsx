import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

export default function Header({ currentUser, onLogout }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.content}>
        <View style={styles.logoRow}>
          <View style={styles.badgeIcon}>
            <Ionicons name="shield-checkmark" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.brandTitle}>JEJAK SIM</Text>
            <Text style={styles.brandSubtitle}>Layanan Resmi Presisi Lalu Lintas</Text>
          </View>

          {currentUser && (
            <Pressable
              style={({ pressed }) => [
                styles.logoutBadgeBtn,
                pressed && styles.logoutBadgeBtnPressed,
              ]}
              onPress={onLogout}
            >
              <Ionicons name="log-out-outline" size={15} color="#FFFFFF" />
              <Text style={styles.logoutBadgeText}>Keluar</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.tagline}>
          "Stop Pelanggaran, Stop Kecelakaan! Keselamatan Untuk Kemanusiaan"
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'web' ? 10 : 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.navyMuted,
    zIndex: 100,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
      },
    }),
  },
  content: {
    width: '100%',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 0,
    backgroundColor: COLORS.navySoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
    marginRight: 14,
  },
  textColumn: {
    flex: 1,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  logoutBadgeBtn: {
    backgroundColor: COLORS.navySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.navyMuted,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutBadgeBtnPressed: {
    backgroundColor: '#334155',
  },
  logoutBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  tagline: {
    color: '#CBD5E1',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});
