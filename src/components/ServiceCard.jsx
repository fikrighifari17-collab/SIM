import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

export default function ServiceCard({ title, subtitle, iconName, badge, isUpcoming, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && !isUpcoming && styles.cardPressed,
      ]}
      onPress={isUpcoming ? null : onPress}
      disabled={isUpcoming}
    >
      <View style={[styles.iconWrapper, isUpcoming && styles.iconWrapperDisabled]}>
        <Ionicons
          name={iconName}
          size={22}
          color={isUpcoming ? COLORS.textSecondary : COLORS.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isUpcoming && styles.titleDisabled]}>{title}</Text>
          {badge && (
            <View
              style={[
                styles.badge,
                isUpcoming ? styles.badgeUpcoming : styles.badgeActive,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isUpcoming ? styles.badgeTextUpcoming : styles.badgeTextActive,
                ]}
              >
                {badge}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {!isUpcoming ? (
        <Ionicons name="chevron-forward" size={18} color={COLORS.navyMuted} />
      ) : (
        <Ionicons name="lock-closed-outline" size={16} color={COLORS.textSecondary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flex: 1,
    height: '100%',
    minHeight: 115,
  },
  cardPressed: {
    backgroundColor: COLORS.cardHover,
    borderColor: COLORS.navyMuted,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 0,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconWrapperDisabled: {
    backgroundColor: '#E2E8F0',
  },
  textContainer: {
    flex: 1,
    paddingRight: 6,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  titleDisabled: {
    color: COLORS.textSecondary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 0,
  },
  badgeActive: {
    backgroundColor: 'rgba(46, 125, 91, 0.12)',
  },
  badgeUpcoming: {
    backgroundColor: '#E2E8F0',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: COLORS.success,
  },
  badgeTextUpcoming: {
    color: COLORS.textSecondary,
  },
});
