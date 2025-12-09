import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../utils/theme';

const Card = ({ 
  children, 
  onPress, 
  style,
  title,
  subtitle,
  footer,
  badge,
}) => {
  const CardContent = (
    <View style={[styles.card, style]}>
      {(title || badge) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {badge && <View style={styles.badge}>{badge}</View>}
        </View>
      )}
      
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      
      {children && <View style={styles.content}>{children}</View>}
      
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  content: {
    marginTop: Spacing.sm,
  },
  footer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  badge: {
    marginLeft: Spacing.sm,
  },
});

export default Card;
