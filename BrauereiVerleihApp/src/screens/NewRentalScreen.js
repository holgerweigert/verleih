import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { customerService, productService, rentalService } from '../services/api';
import { APP_CONFIG } from '../utils/config';

export default function NewRentalScreen({ route, navigation }) {
  const { customerId } = route.params || {};
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [notes, setNotes] = useState('');
  
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
    }
  }, [customerId]);

  const loadData = async () => {
    try {
      const [customersData, productsData] = await Promise.all([
        customerService.getAll(),
        productService.getAvailable()
      ]);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
      Alert.alert('Fehler', 'Daten konnten nicht geladen werden');
    }
  };

  const loadCustomer = async (id) => {
    try {
      const customer = await customerService.getById(id);
      setSelectedCustomer(customer);
    } catch (error) {
      console.error('Fehler beim Laden des Kunden:', error);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setDepositAmount(product.kaution?.toString() || '0');
    setRentalPrice(product.mietpreis?.toString() || '0');
    setShowProductModal(false);
  };

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      Alert.alert('Fehler', 'Bitte wähle einen Kunden aus');
      return;
    }

    if (!selectedProduct) {
      Alert.alert('Fehler', 'Bitte wähle ein Produkt aus');
      return;
    }

    const rentalData = {
      customer_id: selectedCustomer.id,
      product_id: selectedProduct.id,
      rental_date: new Date().toISOString(),
      rental_price: parseFloat(rentalPrice) || 0,
      deposit_amount: parseFloat(depositAmount) || 0,
      notes: notes.trim()
    };

    Alert.alert(
      'Verleihung erstellen',
      `${selectedProduct.name} an ${selectedCustomer.vorname} ${selectedCustomer.nachname} verleihen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Bestätigen',
          onPress: async () => {
            try {
              setLoading(true);
              await rentalService.create(rentalData);
              Alert.alert('Erfolg', 'Verleihung wurde erstellt', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack()
                }
              ]);
            } catch (error) {
              console.error('Fehler beim Erstellen der Verleihung:', error);
              Alert.alert('Fehler', 'Verleihung konnte nicht erstellt werden');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const totalAmount = (parseFloat(rentalPrice) || 0) + (parseFloat(depositAmount) || 0);

  return (
    <ScrollView style={styles.container}>
      {/* Kunde auswählen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kunde</Text>
        <TouchableOpacity
          style={styles.selectCard}
          onPress={() => setShowCustomerModal(true)}
        >
          {selectedCustomer ? (
            <View style={styles.selectedInfo}>
              <Ionicons name="person" size={24} color="#8B4513" />
              <View style={styles.selectedContent}>
                <Text style={styles.selectedLabel}>Ausgewählt</Text>
                <Text style={styles.selectedValue}>
                  {selectedCustomer.vorname} {selectedCustomer.nachname}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptySelect}>
              <Ionicons name="person-add" size={24} color="#999" />
              <Text style={styles.emptyText}>Kunde auswählen</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Produkt auswählen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produkt</Text>
        <TouchableOpacity
          style={styles.selectCard}
          onPress={() => setShowProductModal(true)}
        >
          {selectedProduct ? (
            <View style={styles.selectedInfo}>
              <Ionicons name="beer" size={24} color="#8B4513" />
              <View style={styles.selectedContent}>
                <Text style={styles.selectedLabel}>Ausgewählt</Text>
                <Text style={styles.selectedValue}>{selectedProduct.name}</Text>
                <Text style={styles.selectedDetail}>
                  Verfügbar: {selectedProduct.verfuegbar} / {selectedProduct.gesamt}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptySelect}>
              <Ionicons name="add-circle" size={24} color="#999" />
              <Text style={styles.emptyText}>Produkt auswählen</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Preise */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kosten</Text>
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Mietpreis</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={rentalPrice}
                onChangeText={setRentalPrice}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
              <Text style={styles.currency}>{APP_CONFIG.CURRENCY}</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Kaution</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={depositAmount}
                onChangeText={setDepositAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
              <Text style={styles.currency}>{APP_CONFIG.CURRENCY}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Gesamt</Text>
            <Text style={styles.totalValue}>
              {totalAmount.toFixed(2)} {APP_CONFIG.CURRENCY}
            </Text>
          </View>
        </View>
      </View>

      {/* Notizen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notizen (optional)</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Zusätzliche Informationen..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>
            {loading ? 'Wird erstellt...' : 'Verleihung erstellen'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Kunden-Auswahl Modal */}
      <Modal
        visible={showCustomerModal}
        animationType="slide"
        onRequestClose={() => setShowCustomerModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Kunde auswählen</Text>
            <TouchableOpacity onPress={() => setShowCustomerModal(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {customers.map(customer => (
              <TouchableOpacity
                key={customer.id}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCustomer(customer);
                  setShowCustomerModal(false);
                }}
              >
                <View style={styles.modalItemContent}>
                  <Ionicons name="person" size={24} color="#8B4513" />
                  <View style={styles.modalItemInfo}>
                    <Text style={styles.modalItemTitle}>
                      {customer.vorname} {customer.nachname}
                    </Text>
                    {customer.firma && (
                      <Text style={styles.modalItemSubtitle}>{customer.firma}</Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Produkt-Auswahl Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Produkt auswählen</Text>
            <TouchableOpacity onPress={() => setShowProductModal(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {products.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.modalItem}
                onPress={() => handleProductSelect(product)}
                disabled={product.verfuegbar === 0}
              >
                <View style={styles.modalItemContent}>
                  <Ionicons name="beer" size={24} color="#8B4513" />
                  <View style={styles.modalItemInfo}>
                    <Text style={[
                      styles.modalItemTitle,
                      product.verfuegbar === 0 && styles.modalItemDisabled
                    ]}>
                      {product.name}
                    </Text>
                    <Text style={styles.modalItemSubtitle}>
                      Verfügbar: {product.verfuegbar} / {product.gesamt}
                    </Text>
                    <Text style={styles.modalItemPrice}>
                      {product.mietpreis.toFixed(2)} {APP_CONFIG.CURRENCY}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  selectCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedContent: {
    marginLeft: 15,
    flex: 1,
  },
  selectedLabel: {
    fontSize: 12,
    color: '#666',
  },
  selectedValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  selectedDetail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginLeft: 10,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    minWidth: 120,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'right',
  },
  currency: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  submitButton: {
    backgroundColor: '#8B4513',
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
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#8B4513',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContent: {
    flex: 1,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalItemInfo: {
    marginLeft: 15,
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  modalItemPrice: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
    marginTop: 2,
  },
  modalItemDisabled: {
    color: '#999',
  },
});
