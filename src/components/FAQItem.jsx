import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../colors';

export default function FAQItem({ question, answer, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.faqContainer}>
      <Pressable
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.questionText}>{question}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={COLORS.navyMuted}
        />
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  faqContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    paddingRight: 12,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  answerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
