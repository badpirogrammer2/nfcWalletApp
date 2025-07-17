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
} from 'react-native';
import NfcManager, {NfcEvents, Ndef} from 'react-native-nfc-manager';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [nfcMessage, setNfcMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    NfcManager.start();
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
      setModalVisible(true);
    };
    NfcManager.setEventListener(NfcEvents.DiscoverTag, onTagDiscovered);
    NfcManager.registerTagEvent();
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent();
    };
  }, []);

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
        <TouchableOpacity style={styles.nfcButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.buttonText}>Ready to Scan NFC</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>NFC Message Received</Text>
            <Text style={styles.modalMessage}>{nfcMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
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
    minWidth: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
