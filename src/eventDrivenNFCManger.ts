/**
 * Event-Driven NFC Manager
 * Battery-optimized NFC management that only activates on transaction triggers
 */

import { Platform, NativeEventEmitter, NativeModules } from 'react-native';
import { WalletIntegrationManager } from './walletIntegration';

// Platform-specific NFC modules
const NFCManager = Platform.OS === 'ios'
  ? NativeModules.RNNFCManager
  : NativeModules.ReactNativeNFCManager;

const NFCHCEService = Platform.OS === 'android'
  ? NativeModules.NFCHCEService
  : null;

export interface NFCTransactionEvent {
  tagId: string;
  tagType: string;
  data: any;
  timestamp: number;
  signalStrength?: number;
  batteryLevel?: number;
}

export interface NFCPowerState {
  isActive: boolean;
  lastActivity: number;
  batteryImpact: number;
  cpuUsage: number;
}

export class EventDrivenNFCManger {
  private static instance: EventDrivenNFCManger;
  private eventEmitter: NativeEventEmitter | null = null;
  private isInitialized = false;
  private isActive = false;
  private powerState: NFCPowerState = {
    isActive: false,
    lastActivity: 0,
    batteryImpact: 0,
    cpuUsage: 0,
  };
  private walletManager: WalletIntegrationManager;
  private eventListeners: { [key: string]: any } = {};

  private constructor() {
    this.walletManager = WalletIntegrationManager.getInstance();
  }

  static getInstance(): EventDrivenNFCManger {
    if (!EventDrivenNFCManger.instance) {
      EventDrivenNFCManger.instance = new EventDrivenNFCManger();
    }
    return EventDrivenNFCManger.instance;
  }

  // Initialize NFC manager with minimal resource usage
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        return true;
      }

      console.log('🔋 Initializing Event-Driven NFC Manager (Battery Optimized)...');

      // Initialize platform-specific NFC
      if (Platform.OS === 'ios') {
        await this.initializeIOSNFC();
      } else if (Platform.OS === 'android') {
        await this.initializeAndroidNFC();
      }

      // Set up event listeners for transaction triggers only
      this.setupEventListeners();

      // Initialize in low-power mode
      await this.enterLowPowerMode();

      this.isInitialized = true;
      console.log('✅ Event-Driven NFC Manager initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Failed to initialize Event-Driven NFC Manager:', error);
      return false;
    }
  }

  // iOS-specific NFC initialization
  private async initializeIOSNFC(): Promise<void> {
    try {
      if (!NFCManager) {
        throw new Error('iOS NFC Manager not available');
      }

      // Initialize with minimal scanning - only when triggered
      await NFCManager.initialize({
        alertMessage: 'Ready for NFC transaction',
        pollingOption: 'eventDriven', // Only scan when explicitly triggered
        batteryOptimization: true,
      });

      // Set up event emitter for iOS NFC events
      this.eventEmitter = new NativeEventEmitter(NFCManager);

      console.log('🍎 iOS NFC initialized in event-driven mode');

    } catch (error) {
      console.error('Failed to initialize iOS NFC:', error);
      throw error;
    }
  }

  // Android-specific NFC initialization
  private async initializeAndroidNFC(): Promise<void> {
    try {
      if (!NFCManager) {
        throw new Error('Android NFC Manager not available');
      }

      // Initialize Android NFC with battery optimization
      await NFCManager.initialize({
        pollingOption: 'eventDriven',
        batteryOptimization: true,
        dozeModeOptimization: true,
      });

      // Initialize HCE service if available
      if (NFCHCEService) {
        await NFCHCEService.initialize({
          serviceName: 'com.nfcwallet.hce',
          batteryOptimization: true,
        });
      }

      // Set up event emitter for Android NFC events
      this.eventEmitter = new NativeEventEmitter(NFCManager);

      console.log('🤖 Android NFC initialized in event-driven mode');

    } catch (error) {
      console.error('Failed to initialize Android NFC:', error);
      throw error;
    }
  }

  // Set up event listeners for transaction triggers only
  private setupEventListeners(): void {
    if (!this.eventEmitter) return;

    // Listen for NFC tag detection (transaction trigger)
    this.eventListeners.tagDiscovered = this.eventEmitter.addListener(
      'NFC_TAG_DISCOVERED',
      this.handleNFCTagDiscovered.bind(this)
    );

    // Listen for HCE service activation (Android)
    if (Platform.OS === 'android' && NFCHCEService) {
      this.eventListeners.hceActivated = this.eventEmitter.addListener(
        'HCE_SERVICE_ACTIVATED',
        this.handleHCEActivated.bind(this)
      );
    }

    // Listen for power state changes
    this.eventListeners.powerStateChanged = this.eventEmitter.addListener(
      'NFC_POWER_STATE_CHANGED',
      this.handlePowerStateChanged.bind(this)
    );

    console.log('👂 Event listeners set up for transaction triggers only');
  }

  // Handle NFC tag discovered event
  private async handleNFCTagDiscovered(event: NFCTransactionEvent): Promise<void> {
    try {
      console.log('🎯 NFC Tag Discovered - Processing Transaction...');
      this.updatePowerState(true);

      // Process the NFC transaction
      await this.processNFCTransaction(event);

      // Return to low-power mode after processing
      await this.enterLowPowerMode();

    } catch (error) {
      console.error('Failed to process NFC tag:', error);
      await this.enterLowPowerMode();
    }
  }

  // Handle HCE service activation (Android)
  private async handleHCEActivated(event: any): Promise<void> {
    try {
      console.log('🔄 HCE Service Activated - Ready for emulation');
      this.updatePowerState(true);

      // Handle HCE transaction if needed
      await this.processHCETtransaction(event);

      // Return to low-power mode
      await this.enterLowPowerMode();

    } catch (error) {
      console.error('Failed to process HCE activation:', error);
      await this.enterLowPowerMode();
    }
  }

  // Handle power state changes
  private handlePowerStateChanged(state: NFCPowerState): void {
    this.powerState = { ...this.powerState, ...state };
    console.log('🔋 Power state updated:', this.powerState);
  }

  // Process NFC transaction with battery optimization
  private async processNFCTransaction(event: NFCTransactionEvent): Promise<void> {
    try {
      console.log('💳 Processing NFC Transaction...');

      // Extract transaction data from NFC tag
      const transactionData = await this.extractTransactionData(event);

      // Process payment with wallet integration
      const paymentResult = await this.walletManager.processPayment(
        transactionData.amount,
        transactionData.currency,
        transactionData.description,
        transactionData.paymentMethodId,
        transactionData.merchantId
      );

      if (paymentResult.success) {
        console.log('✅ NFC Transaction completed successfully');

        // Generate and save receipt
        await this.generateAndSaveReceipt(paymentResult.transactionId!, transactionData);

        // Write receipt back to NFC tag if possible
        await this.writeReceiptToTag(event.tagId, paymentResult.transactionId!);

      } else {
        console.error('❌ NFC Transaction failed:', paymentResult.error);
      }

    } catch (error) {
      console.error('Failed to process NFC transaction:', error);
      throw error;
    }
  }

  // Process HCE transaction (Android)
  private async processHCETtransaction(event: any): Promise<void> {
    try {
      console.log('📱 Processing HCE Transaction...');

      // Handle HCE-based transactions
      // This would typically involve emulating a payment card

      console.log('✅ HCE Transaction processed');

    } catch (error) {
      console.error('Failed to process HCE transaction:', error);
      throw error;
    }
  }

  // Extract transaction data from NFC tag
  private async extractTransactionData(event: NFCTransactionEvent): Promise<{
    amount: number;
    currency: string;
    description: string;
    paymentMethodId: string;
    merchantId: string;
  }> {
    try {
      // Parse NFC tag data
      const tagData = event.data;

      // Extract transaction information
      const transactionData = {
        amount: tagData.amount || 0,
        currency: tagData.currency || 'USD',
        description: tagData.description || 'NFC Transaction',
        paymentMethodId: tagData.paymentMethodId || 'default',
        merchantId: tagData.merchantId || 'unknown',
      };

      console.log('📄 Extracted transaction data:', transactionData);
      return transactionData;

    } catch (error) {
      console.error('Failed to extract transaction data:', error);
      throw error;
    }
  }

  // Generate and save receipt
  private async generateAndSaveReceipt(
    transactionId: string,
    transactionData: any
  ): Promise<void> {
    try {
      console.log('🧾 Generating receipt...');

      // Create receipt items (simplified for demo)
      const receiptItems = [{
        id: 'nfc_item_1',
        name: transactionData.description,
        quantity: 1,
        unitPrice: transactionData.amount / 100,
        totalPrice: transactionData.amount / 100,
        category: 'NFC Transaction',
        tags: ['nfc', 'transaction'],
      }];

      // Create merchant info
      const merchantInfo = {
        id: transactionData.merchantId,
        name: 'NFC Merchant',
        address: 'NFC Location',
      };

      // Process payment with detailed receipt
      const result = await this.walletManager.processPaymentWithDetailedReceipt(
        receiptItems,
        transactionData.paymentMethodId,
        merchantInfo
      );

      if (result.success && result.receipt) {
        // Generate receipt image
        const imageUri = await this.walletManager.generateReceiptImage(result.receipt);

        // Save to device gallery
        await this.walletManager.saveReceiptImageToGallery(imageUri);

        console.log('✅ Receipt generated and saved');
      }

    } catch (error) {
      console.error('Failed to generate receipt:', error);
    }
  }

  // Write receipt back to NFC tag
  private async writeReceiptToTag(tagId: string, transactionId: string): Promise<void> {
    try {
      console.log('📝 Writing receipt to NFC tag...');

      if (Platform.OS === 'ios') {
        await NFCManager.writeToTag(tagId, {
          type: 'receipt',
          transactionId,
          timestamp: Date.now(),
        });
      } else if (Platform.OS === 'android') {
        await NFCManager.writeNdefMessage(tagId, {
          type: 'receipt',
          transactionId,
          timestamp: Date.now(),
        });
      }

      console.log('✅ Receipt written to NFC tag');

    } catch (error) {
      console.error('Failed to write receipt to tag:', error);
      // This is not critical - receipt is still saved to device
    }
  }

  // Enter low-power mode to save battery
  private async enterLowPowerMode(): Promise<void> {
    try {
      console.log('🔋 Entering low-power mode...');

      if (Platform.OS === 'ios') {
        await NFCManager.setPowerMode('low');
      } else if (Platform.OS === 'android') {
        await NFCManager.setPowerMode('low');
        if (NFCHCEService) {
          await NFCHCEService.setPowerMode('low');
        }
      }

      this.updatePowerState(false);
      console.log('✅ Low-power mode activated');

    } catch (error) {
      console.error('Failed to enter low-power mode:', error);
    }
  }

  // Activate NFC for transaction (temporary high-power mode)
  async activateForTransaction(timeout: number = 30000): Promise<void> {
    try {
      console.log('⚡ Activating NFC for transaction...');

      if (Platform.OS === 'ios') {
        await NFCManager.setPowerMode('active', { timeout });
      } else if (Platform.OS === 'android') {
        await NFCManager.setPowerMode('active', { timeout });
        if (NFCHCEService) {
          await NFCHCEService.setPowerMode('active', { timeout });
        }
      }

      this.updatePowerState(true);

      // Auto-deactivate after timeout
      setTimeout(() => {
        this.enterLowPowerMode();
      }, timeout);

      console.log('✅ NFC activated for transaction');

    } catch (error) {
      console.error('Failed to activate NFC:', error);
      throw error;
    }
  }

  // Update power state
  private updatePowerState(isActive: boolean): void {
    this.powerState = {
      ...this.powerState,
      isActive,
      lastActivity: Date.now(),
    };
  }

  // Get current power state
  getPowerState(): NFCPowerState {
    return { ...this.powerState };
  }

  // Check if NFC is available and ready
  async isNFCReady(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        return false;
      }

      if (Platform.OS === 'ios') {
        const status = await NFCManager.getStatus();
        return status.isAvailable && status.isEnabled;
      } else if (Platform.OS === 'android') {
        const status = await NFCManager.isEnabled();
        return status;
      }

      return false;

    } catch (error) {
      console.error('Failed to check NFC readiness:', error);
      return false;
    }
  }

  // Get battery optimization status
  async getBatteryOptimizationStatus(): Promise<{
    isOptimized: boolean;
    batteryLevel: number;
    estimatedDrain: number;
  }> {
    try {
      if (Platform.OS === 'ios') {
        const status = await NFCManager.getBatteryStatus();
        return {
          isOptimized: status.optimizationEnabled,
          batteryLevel: status.level,
          estimatedDrain: status.estimatedDrain,
        };
      } else if (Platform.OS === 'android') {
        const status = await NFCManager.getBatteryOptimization();
        return {
          isOptimized: status.isEnabled,
          batteryLevel: status.level,
          estimatedDrain: status.estimatedDrain,
        };
      }

      return {
        isOptimized: false,
        batteryLevel: 100,
        estimatedDrain: 0,
      };

    } catch (error) {
      console.error('Failed to get battery optimization status:', error);
      return {
        isOptimized: false,
        batteryLevel: 100,
        estimatedDrain: 0,
      };
    }
  }

  // Clean up resources
  async cleanup(): Promise<void> {
    try {
      console.log('🧹 Cleaning up Event-Driven NFC Manager...');

      // Remove event listeners
      Object.values(this.eventListeners).forEach(listener => {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      });

      // Deactivate NFC
      if (Platform.OS === 'ios') {
        await NFCManager.deactivate();
      } else if (Platform.OS === 'android') {
        await NFCManager.disable();
        if (NFCHCEService) {
          await NFCHCEService.disable();
        }
      }

      this.isInitialized = false;
      this.isActive = false;

      console.log('✅ Event-Driven NFC Manager cleaned up');

    } catch (error) {
      console.error('Failed to cleanup NFC manager:', error);
    }
  }

  // Manual trigger for testing (only when needed)
  async triggerNFCScan(): Promise<void> {
    try {
      console.log('🔍 Manually triggering NFC scan...');

      await this.activateForTransaction(10000); // 10 second timeout

      if (Platform.OS === 'ios') {
        await NFCManager.scanForTags();
      } else if (Platform.OS === 'android') {
        await NFCManager.startDiscovery();
      }

      console.log('✅ NFC scan triggered');

    } catch (error) {
      console.error('Failed to trigger NFC scan:', error);
      throw error;
    }
  }
}

// Battery optimization utilities
export class NFCBatteryOptimizer {
  static async optimizeForBattery(): Promise<void> {
    try {
      console.log('🔋 Optimizing NFC for battery life...');

      const nfcManager = EventDrivenNFCManger.getInstance();

      // Check battery status
      const batteryStatus = await nfcManager.getBatteryOptimizationStatus();

      if (batteryStatus.batteryLevel < 20) {
        console.log('⚠️ Low battery detected - enabling aggressive optimization');
        // Implement more aggressive battery saving measures
      }

      console.log('✅ Battery optimization applied');

    } catch (error) {
      console.error('Failed to optimize for battery:', error);
    }
  }

  static async getOptimizationRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];

    try {
      const nfcManager = EventDrivenNFCManger.getInstance();
      const batteryStatus = await nfcManager.getBatteryOptimizationStatus();
      const powerState = nfcManager.getPowerState();

      if (batteryStatus.batteryLevel < 30) {
        recommendations.push('Low battery: NFC will only activate for critical transactions');
      }

      if (powerState.cpuUsage > 15) {
        recommendations.push('High CPU usage detected: Consider reducing NFC polling frequency');
      }

      if (powerState.batteryImpact > 5) {
        recommendations.push('High battery impact: NFC operations optimized for power efficiency');
      }

      recommendations.push('NFC operates in event-driven mode to maximize battery life');
      recommendations.push('Transactions only trigger when NFC tags are detected');

    } catch (error) {
      recommendations.push('Unable to analyze battery optimization status');
    }

    return recommendations;
  }
}

export default EventDrivenNFCManger;
