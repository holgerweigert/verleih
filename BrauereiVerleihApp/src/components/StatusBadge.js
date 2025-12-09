import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../utils/theme';
import { getStatusColor, getStatusText } from '../utils/helpers';

const StatusBadge = ({ status, style, textStyle }) => {
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusText(status);

  return (
    <View style={[styles.badge, { backgroundColor: statusColor }, style]}>
      <Text style={[styles.text, textStyle]}>{statusLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  text: {
    color: Colors.surface,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});

export default StatusBadge;
