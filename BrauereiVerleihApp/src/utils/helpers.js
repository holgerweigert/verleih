// Datum formatieren
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

// Datum und Zeit formatieren
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Betrag formatieren (Euro)
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0,00 €';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

// Kundenname formatieren
export const formatCustomerName = (customer) => {
  if (!customer) return '';
  if (customer.firma) {
    return customer.firma;
  }
  return `${customer.vorname || ''} ${customer.nachname || ''}`.trim();
};

// Adresse formatieren
export const formatAddress = (customer) => {
  if (!customer) return '';
  const parts = [
    customer.strasse,
    customer.plz && customer.ort ? `${customer.plz} ${customer.ort}` : customer.plz || customer.ort,
  ].filter(Boolean);
  return parts.join(', ');
};

// Status Badge Farbe
export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
    case 'ausgeliehen':
      return '#FF9800'; // Orange
    case 'returned':
    case 'zurückgegeben':
      return '#4CAF50'; // Grün
    case 'overdue':
    case 'überfällig':
      return '#F44336'; // Rot
    default:
      return '#9E9E9E'; // Grau
  }
};

// Status Text
export const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Ausgeliehen';
    case 'returned':
      return 'Zurückgegeben';
    case 'overdue':
      return 'Überfällig';
    default:
      return status;
  }
};

// Prüfen ob Verleihung überfällig ist
export const isOverdue = (returnDate) => {
  if (!returnDate) return false;
  return new Date(returnDate) < new Date();
};

// Telefonnummer formatieren
export const formatPhone = (phone) => {
  if (!phone) return '';
  // Entferne alle Nicht-Ziffern außer +
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned;
};

// Email validieren
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Tage bis Rückgabe berechnen
export const daysUntilReturn = (returnDate) => {
  if (!returnDate) return null;
  const today = new Date();
  const returnDay = new Date(returnDate);
  const diffTime = returnDay - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Verleih-Dauer berechnen
export const calculateRentalDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Gesamtpreis berechnen
export const calculateTotalPrice = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((total, item) => {
    const itemTotal = (item.menge || 0) * (item.preis_pro_einheit || 0);
    return total + itemTotal;
  }, 0);
};
