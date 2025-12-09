import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productService } from '../services/api';
import { APP_CONFIG } from '../utils/config';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchText, filterAvailable, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Fehler beim Laden der Produkte:', error);
      Alert.alert('Fehler', 'Produkte konnten nicht geladen werden');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter nach Verfügbarkeit
    if (filterAvailable) {
      filtered = filtered.filter(p => p.verfuegbar > 0);
    }

    // Filter nach Suchtext
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        (p.beschreibung || '').toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const getAvailabilityColor = (available, total) => {
    if (available === 0) return '#f44336';
    if (available === total) return '#4CAF50';
    return '#FF9800';
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productIcon}>
          <Ionicons name="beer" size={32} color="#8B4513" />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          {item.beschreibung && (
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.beschreibung}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.productDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mietpreis:</Text>
          <Text style={styles.detailValue}>
            {item.mietpreis.toFixed(2)} {APP_CONFIG.CURRENCY}
          </Text>
        </View>

        {item.kaution > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kaution:</Text>
            <Text style={styles.detailValue}>
              {item.kaution.toFixed(2)} {APP_CONFIG.CURRENCY}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Verfügbar:</Text>
          <View style={styles.availabilityContainer}>
            <View 
              style={[
                styles.availabilityDot,
                { backgroundColor: getAvailabilityColor(item.verfuegbar, item.gesamt) }
              ]}
            />
            <Text style={styles.detailValue}>
              {item.verfuegbar} / {item.gesamt}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Suchleiste */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Produkt suchen..."
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterAvailable && styles.filterButtonActive]}
          onPress={() => setFilterAvailable(!filterAvailable)}
        >
          <Ionicons 
            name={filterAvailable ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={20} 
            color={filterAvailable ? "#fff" : "#8B4513"} 
          />
          <Text style={[
            styles.filterButtonText,
            filterAvailable && styles.filterButtonTextActive
          ]}>
            Nur verfügbare
          </Text>
        </TouchableOpacity>

        <Text style={styles.resultCount}>
          {filteredProducts.length} Produkt{filteredProducts.length !== 1 ? 'e' : ''}
        </Text>
      </View>

      {/* Produktliste */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="beer-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>
              {searchText || filterAvailable 
                ? 'Keine Produkte gefunden' 
                : 'Noch keine Produkte vorhanden'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  filterButtonActive: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  filterButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 15,
    paddingTop: 5,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  productIcon: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  productDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
});
