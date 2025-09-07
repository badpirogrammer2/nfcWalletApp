import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Alert,
  TextInput,
  Platform,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NfcManager, {NfcEvents, Ndef} from 'react-native-nfc-manager';

interface NfcItem {
  id: string;
  name: string;
  nfcData: string;
  timestamp: number;
  type: string;
  amount?: number;
  receiptId?: string;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  itemName: string;
  paymentMethod: 'nfc' | 'card' | 'digital';
  cardType?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';
  timestamp: number;
  retryCount: number;
  errorMessage?: string;
  nfcTagId?: string;
}

interface PaymentErrorLog {
  id: string;
  transactionId: string;
  errorType: string;
  errorMessage: string;
  timestamp: number;
  paymentMethod: string;
  retryAttempted: boolean;
  userAction?: string;
}

const STORAGE_KEY = 'nfc_wallet_items';

// Custom Notification Manager for cross-platform notifications
class NotificationManager {
  static showAlert(title: string, message: string, buttons?: any[]) {
    Alert.alert(title, message, buttons);
  }

  static showToast(message: string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      // For iOS, we can use Alert as fallback or implement custom toast
      Alert.alert('Notification', message);
    }
  }

  static showNfcFailureNotification(errorType: string, details?: string) {
    const messages = {
      timeout: {
        title: 'NFC Connection Timeout',
        message: 'NFC communication timed out. Please ensure devices are close together and try again.',
      },
      writeFailure: {
        title: 'NFC Write Failed',
        message: 'Failed to write data to NFC tag. Tag may be read-only or out of range.',
      },
      readFailure: {
        title: 'NFC Read Failed',
        message: 'Failed to read NFC tag. Please try scanning again.',
      },
      permissionDenied: {
        title: 'NFC Permission Required',
        message: 'NFC permission is required. Please enable NFC in device settings.',
      },
      deviceIncompatible: {
        title: 'Device Not Compatible',
        message: 'This device does not support NFC functionality.',
      },
      crossDeviceFailure: {
        title: 'Cross-Device Transfer Failed',
        message: 'Failed to transfer data between devices. Please check device proximity and try again.',
      },
      emulationFailure: {
        title: 'Card Emulation Failed',
        message: 'Host Card Emulation failed. Please restart the app and try again.',
      },
    };

    const notification = messages[errorType as keyof typeof messages] || {
      title: 'NFC Error',
      message: details || 'An NFC operation failed. Please try again.',
    };

    // Show immediate alert
    this.showAlert(notification.title, notification.message);

    // Show persistent notification (toast on Android, alert on iOS)
    setTimeout(() => {
      this.showToast(`${notification.title}: ${notification.message}`);
    }, 1000);
  }

  static showNfcSuccessNotification(operation: string) {
    const messages = {
      scan: 'NFC tag scanned successfully',
      write: 'Data written to NFC tag successfully',
      transfer: 'Data transferred between devices successfully',
      emulation: 'Card emulation started successfully',
    };

    const message = messages[operation as keyof typeof messages] || 'NFC operation completed successfully';
    this.showToast(message);
  }

  static showPaymentErrorNotification(errorType: string, errorMessage: string, paymentMethod: string) {
    const messages = {
      payment_failed: {
        title: 'Payment Failed',
        message: `Payment failed via ${paymentMethod}. ${errorMessage}`,
      },
      card_declined: {
        title: 'Card Declined',
        message: 'Your card was declined. Please try a different card or payment method.',
      },
      insufficient_funds: {
        title: 'Insufficient Funds',
        message: 'Insufficient funds available. Please check your balance or try a different payment method.',
      },
      network_error: {
        title: 'Network Error',
        message: 'Network connection failed. Please check your internet connection and try again.',
      },
      authentication_failed: {
        title: 'Authentication Failed',
        message: 'Payment authentication failed. Please verify your credentials and try again.',
      },
      retry_failed: {
        title: 'Retry Failed',
        message: 'Payment retry attempt failed. Please try a different payment method.',
      },
      method_switched: {
        title: 'Payment Method Changed',
        message: `Switched to ${paymentMethod} payment method.`,
      },
      switch_method_failed: {
        title: 'Method Switch Failed',
        message: `Failed to switch to ${paymentMethod}. Please try again or choose a different method.`,
      },
    };

    const notification = messages[errorType as keyof typeof messages] || {
      title: 'Payment Error',
      message: errorMessage,
    };

    // Show immediate alert with retry options for payment failures
    if (errorType.includes('failed') || errorType.includes('error')) {
      this.showAlert(notification.title, notification.message, [
        { text: 'Retry', onPress: () => this.handlePaymentRetry() },
        { text: 'Change Method', onPress: () => this.handlePaymentMethodChange() },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      this.showAlert(notification.title, notification.message);
    }

    // Show persistent notification
    setTimeout(() => {
      this.showToast(`${notification.title}: ${notification.message}`);
    }, 1000);
  }

  static showPaymentSuccessNotification(message: string) {
    this.showToast(`✅ ${message}`);
  }

  static handlePaymentRetry() {
    // Get the latest failed transaction and retry
    const failedTransactions = PaymentManager.transactions.filter(t => t.status === 'failed');
    if (failedTransactions.length > 0) {
      const latestFailed = failedTransactions[failedTransactions.length - 1];
      PaymentManager.retryPayment(latestFailed.id);
    }
  }

  static handlePaymentMethodChange() {
    // Show payment method selection dialog
    this.showAlert(
      'Change Payment Method',
      'Choose a new payment method:',
      [
        { text: 'NFC Card', onPress: () => this.switchToMethod('nfc') },
        { text: 'Credit/Debit Card', onPress: () => this.switchToMethod('card') },
        { text: 'Digital Wallet', onPress: () => this.switchToMethod('digital') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  static switchToMethod(method: 'nfc' | 'card' | 'digital') {
    const failedTransactions = PaymentManager.transactions.filter(t => t.status === 'failed');
    if (failedTransactions.length > 0) {
      const latestFailed = failedTransactions[failedTransactions.length - 1];
      PaymentManager.switchPaymentMethod(latestFailed.id, method);
    }
  }
}

// Payment and Error Logging Manager
class PaymentManager {
  static transactions: PaymentTransaction[] = [];
  static errorLogs: PaymentErrorLog[] = [];

  static createTransaction(amount: number, itemName: string, paymentMethod: 'nfc' | 'card' | 'digital', cardType?: string): PaymentTransaction {
    const transaction: PaymentTransaction = {
      id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount,
      itemName,
      paymentMethod,
      cardType,
      status: 'pending',
      timestamp: Date.now(),
      retryCount: 0,
    };
    this.transactions.push(transaction);
    return transaction;
  }

  static logError(transactionId: string, errorType: string, errorMessage: string, paymentMethod: string, retryAttempted: boolean = false, userAction?: string) {
    const errorLog: PaymentErrorLog = {
      id: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId,
      errorType,
      errorMessage,
      timestamp: Date.now(),
      paymentMethod,
      retryAttempted,
      userAction,
    };
    this.errorLogs.push(errorLog);

    // Show notification for critical errors
    NotificationManager.showPaymentErrorNotification(errorType, errorMessage, paymentMethod);
  }

  static async retryPayment(transactionId: string): Promise<boolean> {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) return false;

    transaction.retryCount += 1;
    transaction.status = 'retrying';

    try {
      // Simulate payment retry logic
      const success = await this.processPayment(transaction);
      if (success) {
        transaction.status = 'completed';
        NotificationManager.showPaymentSuccessNotification('Payment retried successfully');
        return true;
      } else {
        transaction.status = 'failed';
        this.logError(transactionId, 'retry_failed', 'Payment retry failed', transaction.paymentMethod, true);
        return false;
      }
    } catch (error: any) {
      transaction.status = 'failed';
      this.logError(transactionId, 'retry_error', error.message, transaction.paymentMethod, true);
      return false;
    }
  }

  static async switchPaymentMethod(transactionId: string, newMethod: 'nfc' | 'card' | 'digital', cardType?: string): Promise<boolean> {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) return false;

    const oldMethod = transaction.paymentMethod;
    transaction.paymentMethod = newMethod;
    transaction.cardType = cardType;
    transaction.status = 'pending';
    transaction.retryCount = 0;

    this.logError(transactionId, 'method_switched', `Payment method changed from ${oldMethod} to ${newMethod}`, newMethod, false, 'user_switched_method');

    try {
      const success = await this.processPayment(transaction);
      if (success) {
        transaction.status = 'completed';
        NotificationManager.showPaymentSuccessNotification(`Payment completed with ${newMethod}`);
        return true;
      } else {
        transaction.status = 'failed';
        this.logError(transactionId, 'switch_method_failed', `Payment failed with new method ${newMethod}`, newMethod, false);
        return false;
      }
    } catch (error: any) {
      transaction.status = 'failed';
      this.logError(transactionId, 'switch_method_error', error.message, newMethod, false);
      return false;
    }
  }

  static async processPayment(transaction: PaymentTransaction): Promise<boolean> {
    // Simulate payment processing with potential failures
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate random failures for demonstration
        const randomFailure = Math.random() < 0.3; // 30% failure rate
        if (randomFailure) {
          resolve(false);
        } else {
          resolve(true);
        }
      }, 2000); // 2 second processing time
    });
  }

  static getTransactionHistory(): PaymentTransaction[] {
    return this.transactions;
  }

  static getErrorLogs(): PaymentErrorLog[] {
    return this.errorLogs;
  }

  static clearLogs() {
    this.errorLogs = [];
    this.transactions = [];
  }
}



const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [nfcMessage, setNfcMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<NfcItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState<any>(null);
  const [currentTransaction, setCurrentTransaction] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadItems();
        await NfcManager.start();
      } catch (error) {
        console.error('App initialization error:', error);
        Alert.alert('Error', 'App initialization failed. Please restart the app.');
      }
    };

    initializeApp();

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent();
    };
  }, []);

  const loadItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored);
        // Validate data integrity
        if (Array.isArray(parsedItems)) {
          setItems(parsedItems);
        } else {
          console.error('Data corruption detected: stored data is not an array');
          Alert.alert('Error', 'Data corruption detected. Please clear app data and restart.');
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Error loading items:', error);
      Alert.alert('Error', 'Failed to load saved items. Please restart the app.');
    }
  };

  const saveItems = async (newItems: NfcItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error('Error saving items:', error);
      Alert.alert('Error', 'Failed to save transaction. Please check storage permissions.');
    }
  };

  const startScanning = async () => {
    try {
      // Check NFC availability and permissions
      const nfcSupported = await NfcManager.isSupported();
      if (!nfcSupported) {
        Alert.alert('Error', 'NFC is not supported on this device');
        return;
      }

      const nfcEnabled = await NfcManager.isEnabled();
      if (!nfcEnabled) {
        NotificationManager.showNfcFailureNotification('permissionDenied');
        return;
      }

      setIsScanning(true);

      // Set timeout for NFC scanning
      const timeoutId = setTimeout(() => {
        if (isScanning) {
          setIsScanning(false);
          NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
          NfcManager.unregisterTagEvent();
          NotificationManager.showNfcFailureNotification('timeout');
        }
      }, 10000); // 10 second timeout

      const onTagDiscovered = (tag: any) => {
        clearTimeout(timeoutId);
        let message = '';
        if (tag.ndefMessage && tag.ndefMessage.length > 0) {
          try {
            message = Ndef.text.decodePayload(tag.ndefMessage[0].payload);
          } catch (e) {
            message = 'NFC tag detected, but could not decode message.';
          }
        } else {
          message = 'NFC tag detected, but no NDEF message found.';
        }
        setNfcMessage(message);
        setCurrentTag(tag);
        setSaveModalVisible(true);
        setIsScanning(false);
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        NfcManager.unregisterTagEvent();
      };

      NfcManager.setEventListener(NfcEvents.DiscoverTag, onTagDiscovered);
      NfcManager.registerTagEvent();
    } catch (error) {
      console.error('Error starting NFC scan:', error);
      setIsScanning(false);
      Alert.alert('Error', 'Failed to start NFC scanning');
    }
  };

  const generateReceipt = (item: NfcItem): string => {
    const receiptId = `RCP-${Date.now()}`;
    const receipt = `RECEIPT\n-------\nID: ${receiptId}\nItem: ${
      item.name
    }\nAmount: $${item.amount || 0}\nDate: ${new Date(
      item.timestamp,
    ).toLocaleString()}\nNFC Data: ${
      item.nfcData
    }\n-------\nThank you for your transaction!`;
    return receipt;
  };

  const writeReceiptToTag = async (receipt: string) => {
    try {
      if (!currentTag) {
        Alert.alert('Error', 'No tag available for writing');
        return;
      }

      // Note: HCE support check would be implemented here for full HCE functionality
      // For now, we proceed with standard NFC operations

      const bytes = Ndef.encodeMessage([Ndef.textRecord(receipt)]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        Alert.alert('Success', 'Receipt written to NFC tag successfully!');
        NotificationManager.showNfcSuccessNotification('write');
      } else {
        Alert.alert('Error', 'Failed to encode receipt message');
      }
    } catch (error: any) {
      console.error('Error writing to tag:', error);

      // Handle specific HCE-related errors
      if (error.message && error.message.includes('emulation')) {
        NotificationManager.showNfcFailureNotification('emulationFailure');
      } else {
        NotificationManager.showNfcFailureNotification('writeFailure');
      }
    }
  };

  const processPaymentWithErrorHandling = async (amount: number, itemName: string, paymentMethod: 'nfc' | 'card' | 'digital') => {
    // Create transaction record
    const transaction = PaymentManager.createTransaction(amount, itemName, paymentMethod);
    setCurrentTransaction(transaction);

    try {
      transaction.status = 'processing';

      // Simulate different types of payment failures
      const failureType = Math.random();

      if (failureType < 0.2) {
        // Card declined
        throw new Error('Card declined by issuer');
      } else if (failureType < 0.4) {
        // Insufficient funds
        throw new Error('Insufficient funds');
      } else if (failureType < 0.6) {
        // Network error
        throw new Error('Network connection failed');
      } else if (failureType < 0.8) {
        // Authentication failed
        throw new Error('Authentication failed');
      }

      // Process payment
      const success = await PaymentManager.processPayment(transaction);

      if (success) {
        transaction.status = 'completed';
        NotificationManager.showPaymentSuccessNotification(`Payment of $${amount} completed successfully via ${paymentMethod}`);
        return true;
      } else {
        throw new Error('Payment processing failed');
      }

    } catch (error: any) {
      transaction.status = 'failed';
      transaction.errorMessage = error.message;

      // Log specific error types
      if (error.message.includes('declined')) {
        PaymentManager.logError(transaction.id, 'card_declined', error.message, paymentMethod);
      } else if (error.message.includes('funds')) {
        PaymentManager.logError(transaction.id, 'insufficient_funds', error.message, paymentMethod);
      } else if (error.message.includes('network')) {
        PaymentManager.logError(transaction.id, 'network_error', error.message, paymentMethod);
      } else if (error.message.includes('authentication')) {
        PaymentManager.logError(transaction.id, 'authentication_failed', error.message, paymentMethod);
      } else {
        PaymentManager.logError(transaction.id, 'payment_failed', error.message, paymentMethod);
      }

      return false;
    }
  };

  const saveScannedItem = async () => {
    if (!newItemName.trim() || !nfcMessage) {
      return;
    }

    const amount = newItemAmount ? parseFloat(newItemAmount) : undefined;
    const receiptId = `RCP-${Date.now()}`;

    const newItem: NfcItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      nfcData: nfcMessage,
      timestamp: Date.now(),
      type: 'NFC Tag',
      amount: amount,
      receiptId: receiptId,
    };

    // Process payment if amount is specified
    if (amount && amount > 0) {
      const paymentSuccess = await processPaymentWithErrorHandling(amount, newItemName.trim(), 'nfc');

      if (!paymentSuccess) {
        // Payment failed, but still save the item for retry
        console.log('Payment failed, item saved for retry');
      }
    }

    // Generate receipt
    const receipt = generateReceipt(newItem);

    // Save item to wallet
    const updatedItems = [...items, newItem];
    await saveItems(updatedItems);

    // Write receipt to NFC tag (only if payment was successful or no payment required)
    if (!amount || amount <= 0 || (currentTransaction && currentTransaction.status === 'completed')) {
      await writeReceiptToTag(receipt);
    }

    // Reset form
    setNewItemName('');
    setNewItemAmount('');
    setCurrentTag(null);
    setSaveModalVisible(false);
    setModalVisible(false);
  };

  const deleteItem = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedItems = items.filter(item => item.id !== id);
          saveItems(updatedItems);
        },
      },
    ]);
  };

  const renderItem = ({item}: {item: NfcItem}) => (
    <TouchableOpacity
      style={[styles.itemCard, {backgroundColor: isDarkMode ? '#333' : '#fff'}]}
      onPress={() => {
        setNfcMessage(item.nfcData);
        setModalVisible(true);
      }}
      onLongPress={() => deleteItem(item.id)}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemName, {color: isDarkMode ? '#fff' : '#000'}]}>
          {item.name}
        </Text>
        {item.amount && (
          <Text style={[styles.itemAmount, {color: '#28a745'}]}>
            ${item.amount}
          </Text>
        )}
      </View>
      <Text style={[styles.itemData, {color: isDarkMode ? '#ccc' : '#666'}]}>
        {item.nfcData.length > 50
          ? item.nfcData.substring(0, 50) + '...'
          : item.nfcData}
      </Text>
      <View style={styles.itemFooter}>
        <Text style={[styles.itemDate, {color: isDarkMode ? '#999' : '#999'}]}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        {item.receiptId && (
          <Text
            style={[styles.receiptId, {color: isDarkMode ? '#aaa' : '#888'}]}>
            {item.receiptId}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <Text style={[styles.title, {color: isDarkMode ? '#fff' : '#000'}]}>
          NFC Wallet
        </Text>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text
              style={[styles.emptyText, {color: isDarkMode ? '#ccc' : '#666'}]}>
              No NFC items yet. Scan your first tag!
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanningButton]}
          onPress={startScanning}
          disabled={isScanning}>
          <Text style={styles.buttonText}>
            {isScanning ? 'Scanning...' : 'Scan NFC Tag'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Save Item Modal */}
      <Modal
        visible={saveModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSaveModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save NFC Item</Text>
            <Text style={styles.scannedData}>{nfcMessage}</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: isDarkMode ? '#555' : '#ddd',
                  color: isDarkMode ? '#fff' : '#000',
                },
              ]}
              placeholder="Enter item name"
              placeholderTextColor={isDarkMode ? '#999' : '#999'}
              value={newItemName}
              onChangeText={setNewItemName}
            />
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: isDarkMode ? '#555' : '#ddd',
                  color: isDarkMode ? '#fff' : '#000',
                },
              ]}
              placeholder="Enter amount (optional)"
              placeholderTextColor={isDarkMode ? '#999' : '#999'}
              value={newItemAmount}
              onChangeText={setNewItemAmount}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setSaveModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveScannedItem}
                style={[styles.modalButton, styles.saveButton]}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Item Modal */}
      <Modal
        visible={modalVisible && !saveModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>NFC Data</Text>
            <Text style={styles.modalMessage}>{nfcMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  itemCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemData: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  receiptId: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  scanningButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    minWidth: 300,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scannedData: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
