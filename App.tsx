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

const STORAGE_KEY = 'nfc_wallet_items';

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

  useEffect(() => {
    loadItems();
    NfcManager.start();
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent();
    };
  }, []);

  const loadItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const saveItems = async (newItems: NfcItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    const onTagDiscovered = (tag: any) => {
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

      const bytes = Ndef.encodeMessage([Ndef.textRecord(receipt)]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        Alert.alert('Success', 'Receipt written to NFC tag successfully!');
      } else {
        Alert.alert('Error', 'Failed to encode receipt message');
      }
    } catch (error) {
      console.error('Error writing to tag:', error);
      Alert.alert('Error', 'Failed to write receipt to NFC tag');
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

    // Generate receipt
    const receipt = generateReceipt(newItem);

    // Save item to wallet
    const updatedItems = [...items, newItem];
    await saveItems(updatedItems);

    // Write receipt to NFC tag
    if (amount && amount > 0) {
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
