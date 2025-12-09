import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../utils/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Variant
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'danger':
        baseStyle.push(styles.danger);
        break;
      case 'success':
        baseStyle.push(styles.success);
        break;
    }
    
    // Size
    switch (size) {
      case 'sm':
        baseStyle.push(styles.small);
        break;
      case 'lg':
        baseStyle.push(styles.large);
        break;
    }
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text];
    
    switch (variant) {
      case 'outline':
        baseTextStyle.push(styles.outlineText);
        break;
      case 'danger':
        baseTextStyle.push(styles.whiteText);
        break;
      case 'success':
        baseTextStyle.push(styles.whiteText);
        break;
    }
    
    switch (size) {
      case 'sm':
        baseTextStyle.push(styles.smallText);
        break;
      case 'lg':
        baseTextStyle.push(styles.largeText);
        break;
    }
    
    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }
    
    if (textStyle) {
      baseTextStyle.push(textStyle);
    }
    
    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? Colors.primary : Colors.surface} 
          size="small"
        />
      ) : (
        <>
          {icon && icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.error,
  },
  success: {
    backgroundColor: Colors.success,
  },
  disabled: {
    backgroundColor: Colors.disabled,
    ...Shadows.sm,
  },
  small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  large: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    color: Colors.surface,
    fontSize: FontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  outlineText: {
    color: Colors.primary,
  },
  whiteText: {
    color: Colors.surface,
  },
  smallText: {
    fontSize: FontSizes.sm,
  },
  largeText: {
    fontSize: FontSizes.lg,
  },
  disabledText: {
    color: Colors.textSecondary,
  },
});

export default Button;
