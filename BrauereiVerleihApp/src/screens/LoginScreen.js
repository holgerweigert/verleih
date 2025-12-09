import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Input from '../components/Input';
import Button from '../components/Button';
import { apiService } from '../services/api';
import { Colors, Spacing, FontSizes } from '../utils/theme';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Fehler', 'Bitte Benutzername und Passwort eingeben');
      return;
    }

    setLoading(true);
    try {
      await apiService.login(username, password);
      // Navigation erfolgt automatisch durch App.js wenn Token gesetzt ist
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Anmeldung fehlgeschlagen',
        'Benutzername oder Passwort falsch'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>🍺</Text>
          <Text style={styles.title}>Brauerei Kirschenholz</Text>
          <Text style={styles.subtitle}>Verleihsystem</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Benutzername"
            value={username}
            onChangeText={setUsername}
            placeholder="Benutzername eingeben"
            autoCapitalize="none"
            editable={!loading}
          />

          <Input
            label="Passwort"
            value={password}
            onChangeText={setPassword}
            placeholder="Passwort eingeben"
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          <Button
            title="Anmelden"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.loginButton}
          />
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.surface,
    opacity: 0.9,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  version: {
    textAlign: 'center',
    color: Colors.surface,
    fontSize: FontSizes.sm,
    marginTop: Spacing.xl,
    opacity: 0.7,
  },
});

export default LoginScreen;
