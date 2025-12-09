import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import { apiService } from '../services/api';
import { Colors, Spacing, FontSizes } from '../utils/theme';
import { formatDate, formatCurrency } from '../utils/helpers';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentRentals, setRecentRentals] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, rentalsData] = await Promise.all([
        apiService.getStats(),
        apiService.getRentals('active'),
      ]);
      
      setStats(statsData);
      setRecentRentals(rentalsData.slice(0, 5)); // Nur die ersten 5
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Fehler', 'Daten konnten nicht geladen werden');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          style: 'destructive',
          onPress: async () => {
            await apiService.logout();
            // Navigation wird durch App.js gehandhabt
          },
        },
      ]
    );
  };

  if (loading) {
    return <Loading message="Lade Dashboard..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Brauerei Kirschenholz</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Abmelden</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Statistiken */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.activeRentals || 0}</Text>
            <Text style={styles.statLabel}>Aktive Verleihungen</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.totalCustomers || 0}</Text>
            <Text style={styles.statLabel}>Kunden</Text>
          </Card>
        </View>

        {/* Schnellzugriff */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schnellzugriff</Text>
          
          <Button
            title="Neue Verleihung"
            onPress={() => navigation.navigate('NewRental')}
            fullWidth
            style={styles.actionButton}
          />
          
          <Button
            title="Kunde hinzufügen"
            onPress={() => navigation.navigate('CustomerForm')}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
        </View>

        {/* Aktuelle Verleihungen */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktuelle Verleihungen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Rentals')}>
              <Text style={styles.seeAllText}>Alle anzeigen</Text>
            </TouchableOpacity>
          </View>

          {recentRentals.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>Keine aktiven Verleihungen</Text>
            </Card>
          ) : (
            recentRentals.map((rental) => (
              <Card
                key={rental.id}
                onPress={() => navigation.navigate('RentalDetail', { id: rental.id })}
                badge={<StatusBadge status={rental.status} />}
              >
                <Text style={styles.rentalCustomer}>
                  {rental.kunde_vorname} {rental.kunde_nachname}
                </Text>
                <Text style={styles.rentalDate}>
                  Ausgeliehen am: {formatDate(rental.ausleihdatum)}
                </Text>
                {rental.rueckgabedatum && (
                  <Text style={styles.rentalDate}>
                    Rückgabe bis: {formatDate(rental.rueckgabedatum)}
                  </Text>
                )}
                <Text style={styles.rentalPrice}>
                  {formatCurrency(rental.gesamtbetrag)}
                </Text>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.xxl + 20,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  headerSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: Spacing.xs,
  },
  logoutText: {
    color: Colors.surface,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
  rentalCustomer: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  rentalDate: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  rentalPrice: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
});

export default HomeScreen;
