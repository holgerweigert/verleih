import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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

const RentalsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rentals, setRentals] = useState([]);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadRentals();
  }, [filter]);

  const loadRentals = async () => {
    try {
      const data = await apiService.getRentals(filter);
      setRentals(data);
    } catch (error) {
      console.error('Error loading rentals:', error);
      Alert.alert('Fehler', 'Verleihungen konnten nicht geladen werden');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRentals();
  };

  const handleRentalPress = (rental) => {
    navigation.navigate('RentalDetail', { id: rental.id });
  };

  const handleNewRental = () => {
    navigation.navigate('NewRental');
  };

  const renderRental = ({ item }) => (
    <Card
      onPress={() => handleRentalPress(item)}
      badge={<StatusBadge status={item.status} />}
    >
      <Text style={styles.rentalCustomer}>
        {item.kunde_vorname} {item.kunde_nachname}
      </Text>
      {item.kunde_firma && (
        <Text style={styles.rentalInfo}>{item.kunde_firma}</Text>
      )}
      <View style={styles.rentalDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Ausgeliehen:</Text>
          <Text style={styles.value}>{formatDate(item.ausleihdatum)}</Text>
        </View>
        {item.rueckgabedatum && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Rückgabe bis:</Text>
            <Text style={styles.value}>{formatDate(item.rueckgabedatum)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.rentalPrice}>{formatCurrency(item.gesamtbetrag)}</Text>
    </Card>
  );

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading message="Lade Verleihungen..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verleihungen</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.filterSection}>
          <View style={styles.filterButtons}>
            <FilterButton label="Aktiv" value="active" />
            <FilterButton label="Zurückgegeben" value="returned" />
            <FilterButton label="Alle" value="all" />
          </View>
          
          <Button
            title="+ Neue Verleihung"
            onPress={handleNewRental}
            fullWidth
            style={styles.newButton}
          />
        </View>

        <FlatList
          data={rentals}
          renderItem={renderRental}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>Keine Verleihungen vorhanden</Text>
            </Card>
          }
        />
      </View>
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
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  filterSection: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: Colors.surface,
  },
  newButton: {
    marginTop: Spacing.sm,
  },
  rentalCustomer: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  rentalInfo: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  rentalDetails: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '600',
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

export default RentalsScreen;
