import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { rentalService, receiptService } from '../services/api';
import { APP_CONFIG } from '../utils/config';

export default function RentalDetailScreen({ route, navigation }) {
  const { rentalId } = route.params;
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRentalData();
  }, [rentalId]);

  const loadRentalData = async () => {
    try {
      setLoading(true);
      // In echter Implementierung würde hier rentalService.getById(rentalId) aufgerufen
      const data = await rentalService.getAll();
      const foundRental = data.find(r => r.id === rentalId);
      setRental(foundRental);
    } catch (error) {
      console.error('Fehler beim Laden der Verleihung:', error);
      Alert.alert('Fehler', 'Verleihung konnte nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    Alert.alert(
      'Rückgabe bestätigen',
      'Möchten Sie diese Verleihung als zurückgegeben markieren?',
      [
        {
          text: 'Abbrechen',
          style: 'cancel'
        },
        {
          text: 'Bestätigen',
          onPress: async () => {
            try {
              await rentalService.return(rentalId, {
                return_date: new Date().toISOString(),
                deposit_returned: true
              });
              Alert.alert('Erfolg', 'Verleihung wurde zurückgegeben');
              loadRentalData();
            } catch (error) {
              console.error('Fehler bei Rückgabe:', error);
              Alert.alert('Fehler', 'Rückgabe konnte nicht durchgeführt werden');
            }
          }
        }
      ]
    );
  };

  const handleGenerateReceipt = async () => {
    try {
      const receipt = await receiptService.generate(rentalId);
      Alert.alert('Erfolg', 'Quittung wurde erstellt');
      // Hier könnte man zur Quittungsansicht navigieren oder PDF öffnen
    } catch (error) {
      console.error('Fehler beim Erstellen der Quittung:', error);
      Alert.alert('Fehler', 'Quittung konnte nicht erstellt werden');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  if (!rental) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Verleihung nicht gefunden</Text>
      </View>
    );
  }

  const isActive = !rental.return_date;
  const daysRented = Math.ceil(
    (new Date(rental.return_date || new Date()) - new Date(rental.rental_date)) 
    / (1000 * 60 * 60 * 24)
  );

  return (
    <ScrollView style={styles.container}>
      {/* Status-Header */}
      <View style={[styles.statusHeader, isActive ? styles.activeHeader : styles.returnedHeader]}>
        <Ionicons 
          name={isActive ? "time" : "checkmark-circle"} 
          size={48} 
          color="#fff" 
        />
        <Text style={styles.statusTitle}>
          {isActive ? 'Aktive Verleihung' : 'Zurückgegeben'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {daysRented} Tag{daysRented !== 1 ? 'e' : ''}
        </Text>
      </View>

      {/* Kunden-Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kunde</Text>
        <TouchableOpacity
          style={styles.infoCard}
          onPress={() => navigation.navigate('CustomerDetail', { customerId: rental.customer_id })}
        >
          <View style={styles.infoRow}>
            <Ionicons name="person" size={24} color="#8B4513" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{rental.customer_name}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Produkt-Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produkt</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="beer" size={24} color="#8B4513" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Artikel</Text>
              <Text style={styles.infoValue}>{rental.product_name}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Zeitraum */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zeitraum</Text>
        <View style={styles.infoCard}>
          <View style={styles.dateInfoRow}>
            <Ionicons name="calendar-outline" size={20} color="#8B4513" />
            <View style={styles.dateContent}>
              <Text style={styles.dateLabel}>Ausgeliehen am</Text>
              <Text style={styles.dateValue}>
                {new Date(rental.rental_date).toLocaleDateString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>

          {rental.return_date && (
            <View style={styles.dateInfoRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <View style={styles.dateContent}>
                <Text style={styles.dateLabel}>Zurückgegeben am</Text>
                <Text style={styles.dateValue}>
                  {new Date(rental.return_date).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Kosten */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kosten</Text>
        <View style={styles.infoCard}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Mietpreis</Text>
            <Text style={styles.costValue}>
              {rental.rental_price?.toFixed(2) || '0.00'} {APP_CONFIG.CURRENCY}
            </Text>
          </View>

          {rental.deposit_amount > 0 && (
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Kaution</Text>
              <Text style={[styles.costValue, styles.depositValue]}>
                {rental.deposit_amount.toFixed(2)} {APP_CONFIG.CURRENCY}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.costRow}>
            <Text style={styles.totalLabel}>Gesamt</Text>
            <Text style={styles.totalValue}>
              {((rental.rental_price || 0) + (rental.deposit_amount || 0)).toFixed(2)} {APP_CONFIG.CURRENCY}
            </Text>
          </View>
        </View>
      </View>

      {/* Aktionen */}
      <View style={styles.actionsContainer}>
        {isActive ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.returnButton]}
            onPress={handleReturn}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Rückgabe durchführen</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.receiptButton]}
            onPress={handleGenerateReceipt}
          >
            <Ionicons name="receipt" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Quittung erstellen</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  statusHeader: {
    padding: 30,
    alignItems: 'center',
  },
  activeHeader: {
    backgroundColor: '#FF9800',
  },
  returnedHeader: {
    backgroundColor: '#4CAF50',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  dateInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  dateContent: {
    marginLeft: 12,
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
  },
  dateValue: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  },
  costValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  depositValue: {
    color: '#FF9800',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  actionsContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  returnButton: {
    backgroundColor: '#4CAF50',
  },
  receiptButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
