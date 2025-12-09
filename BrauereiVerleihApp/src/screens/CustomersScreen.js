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
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { apiService } from '../services/api';
import { Colors, Spacing, FontSizes } from '../utils/theme';
import { formatCustomerName, formatAddress } from '../utils/helpers';

const CustomersScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      const data = await apiService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      Alert.alert('Fehler', 'Kunden konnten nicht geladen werden');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = customers.filter((customer) => {
      const name = formatCustomerName(customer).toLowerCase();
      const address = formatAddress(customer).toLowerCase();
      const email = (customer.email || '').toLowerCase();
      const phone = (customer.telefon || '').toLowerCase();
      
      return (
        name.includes(term) ||
        address.includes(term) ||
        email.includes(term) ||
        phone.includes(term)
      );
    });
    
    setFilteredCustomers(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCustomers();
  };

  const handleCustomerPress = (customer) => {
    navigation.navigate('CustomerDetail', { id: customer.id });
  };

  const handleAddCustomer = () => {
    navigation.navigate('CustomerForm');
  };

  const renderCustomer = ({ item }) => (
    <Card onPress={() => handleCustomerPress(item)}>
      <Text style={styles.customerName}>{formatCustomerName(item)}</Text>
      {item.firma && (
        <Text style={styles.customerInfo}>Firma: {item.firma}</Text>
      )}
      <Text style={styles.customerInfo}>{formatAddress(item)}</Text>
      {item.telefon && (
        <Text style={styles.customerInfo}>Tel: {item.telefon}</Text>
      )}
      {item.email && (
        <Text style={styles.customerInfo}>E-Mail: {item.email}</Text>
      )}
    </Card>
  );

  if (loading) {
    return <Loading message="Lade Kunden..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kunden</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchSection}>
          <Input
            placeholder="Kunden suchen..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
          
          <Button
            title="+ Neuer Kunde"
            onPress={handleAddCustomer}
            fullWidth
          />
        </View>

        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomer}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>
                {searchTerm ? 'Keine Kunden gefunden' : 'Noch keine Kunden vorhanden'}
              </Text>
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
  searchSection: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  searchInput: {
    marginBottom: Spacing.md,
  },
  customerName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  customerInfo: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
});

export default CustomersScreen;
