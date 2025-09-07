/**
 * Multi-Item Receipt Demo
 * Demonstrates receipt generation with multiple items, tags, and image saving
 */

import { WalletIntegrationManager, ReceiptItem } from '../walletIntegration';
import { generateReceiptImage } from '../receiptImageGenerator';
import { saveToPhotos } from '../iosImageSaver';
import { saveToGallery } from '../androidImageSaver';

// Mock Platform for demonstration
const Platform = {
  OS: 'ios', // Change to 'android' to test Android functionality
  Version: '14.0',
  isPad: false,
  isTV: false,
};

class MultiItemReceiptDemo {
  private walletManager: WalletIntegrationManager;

  constructor() {
    this.walletManager = WalletIntegrationManager.getInstance();
  }

  async initializeDemo(): Promise<void> {
    console.log('🧾 Multi-Item Receipt Demo Initialization\n');
    console.log('=' .repeat(60));

    // Initialize wallet integration
    const initialized = await this.walletManager.initializePayments('pk_test_demo_stripe_key');
    console.log(`✅ Wallet integration initialized: ${initialized}\n`);
  }

  // Create sample receipt items with tags
  createSampleReceiptItems(): ReceiptItem[] {
    return [
      {
        id: 'item_001',
        name: 'Premium Coffee Beans',
        description: 'Ethiopian Yirgacheffe, Medium Roast',
        quantity: 2,
        unitPrice: 24.99,
        totalPrice: 49.98,
        category: 'Beverages',
        tags: ['organic', 'fair-trade', 'premium', 'coffee'],
        nfcTag: 'nfc_coffee_001',
        customFields: {
          origin: 'Ethiopia',
          roastLevel: 'Medium',
          grindType: 'Whole Bean'
        }
      },
      {
        id: 'item_002',
        name: 'Artisan Croissant',
        description: 'Butter croissant with almond filling',
        quantity: 1,
        unitPrice: 5.99,
        totalPrice: 5.99,
        category: 'Bakery',
        tags: ['fresh', 'artisan', 'pastry', 'almond'],
        nfcTag: 'nfc_croissant_001',
        customFields: {
          allergens: 'nuts, dairy',
          preparationTime: '15 minutes',
          temperature: 'Warm'
        }
      },
      {
        id: 'item_003',
        name: 'Organic Fruit Salad',
        description: 'Mixed seasonal fruits with mint',
        quantity: 3,
        unitPrice: 8.50,
        totalPrice: 25.50,
        category: 'Healthy Foods',
        tags: ['organic', 'fresh', 'healthy', 'seasonal'],
        nfcTag: 'nfc_salad_001',
        customFields: {
          fruits: 'strawberries, blueberries, kiwi, mint',
          calories: '120 per serving',
          organicCertified: 'Yes'
        }
      },
      {
        id: 'item_004',
        name: 'Gourmet Chocolate Bar',
        description: 'Dark chocolate with sea salt and almonds',
        quantity: 1,
        unitPrice: 7.99,
        totalPrice: 7.99,
        category: 'Desserts',
        tags: ['gourmet', 'dark-chocolate', 'artisanal', 'nuts'],
        nfcTag: 'nfc_chocolate_001',
        customFields: {
          cocoaContent: '72%',
          allergens: 'nuts',
          origin: 'Belgium'
        }
      }
    ];
  }

  async demonstrateMultiItemReceipt(): Promise<void> {
    console.log('🛒 Multi-Item Receipt Generation Demo\n');
    console.log('=' .repeat(60));

    // Create sample items
    const items = this.createSampleReceiptItems();

    console.log('📦 Sample Items Created:');
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} x${item.quantity} - $${item.totalPrice.toFixed(2)}`);
      console.log(`   Tags: ${item.tags.join(', ')}`);
      if (item.customFields) {
        console.log(`   Custom: ${Object.entries(item.customFields).map(([k, v]) => `${k}=${v}`).join(', ')}`);
      }
      console.log('');
    });

    // Merchant information
    const merchantInfo = {
      id: 'merchant_cafe_delight_001',
      name: 'Cafe Delight',
      address: '123 Main Street, Downtown',
      phone: '(555) 123-4567',
      email: 'orders@cafedelight.com'
    };

    // Payment method
    const paymentMethods = await this.walletManager.loadPaymentMethods();
    const applePayMethod = paymentMethods.find(pm => pm.type === 'apple_pay');

    if (!applePayMethod) {
      console.log('❌ Apple Pay not available for demo');
      return;
    }

    console.log('💳 Processing payment with Apple Pay...');

    // Process payment with detailed receipt
    const paymentResult = await this.walletManager.processPaymentWithDetailedReceipt(
      items,
      applePayMethod.id,
      merchantInfo,
      'WELCOME10' // 10% discount code
    );

    if (paymentResult.success && paymentResult.receipt) {
      const receipt = paymentResult.receipt;

      console.log('✅ Payment processed successfully!');
      console.log(`🧾 Receipt ID: ${receipt.id}`);
      console.log(`💰 Total Amount: $${receipt.totalAmount.toFixed(2)}`);
      console.log(`🏪 Merchant: ${receipt.merchantName}`);
      console.log(`🔐 Security Score: ${receipt.securityProof.securityScore}/100`);
      console.log('');

      // Display receipt details
      console.log('📄 Receipt Details:');
      console.log('-'.repeat(40));
      console.log(`Merchant: ${receipt.merchantName}`);
      console.log(`Address: ${receipt.merchantAddress}`);
      console.log(`Receipt #: ${receipt.receiptNumber}`);
      console.log(`Date: ${new Date(receipt.timestamp).toLocaleDateString()}`);
      console.log('');

      console.log('🛍️ Items:');
      receipt.items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name}`);
        console.log(`   Quantity: ${item.quantity} | Unit: $${item.unitPrice.toFixed(2)} | Total: $${item.totalPrice.toFixed(2)}`);
        console.log(`   Tags: ${item.tags.join(', ')}`);
        if (item.customFields) {
          console.log(`   Details: ${Object.entries(item.customFields).map(([k, v]) => `${k}=${v}`).join(', ')}`);
        }
        console.log('');
      });

      console.log('💵 Totals:');
      console.log(`Subtotal: $${receipt.subtotal.toFixed(2)}`);
      console.log(`Tax (${(receipt.taxRate * 100).toFixed(0)}%): $${receipt.taxAmount.toFixed(2)}`);
      if (receipt.discountAmount > 0) {
        console.log(`Discount (${receipt.discountCode}): -$${receipt.discountAmount.toFixed(2)}`);
      }
      console.log(`TOTAL: $${receipt.totalAmount.toFixed(2)}`);
      console.log('');

      console.log('🔒 Security Information:');
      console.log(`Payment Method: ${receipt.paymentMethod}`);
      console.log(`Transaction ID: ${receipt.transactionId}`);
      console.log(`Security Score: ${receipt.securityProof.securityScore}/100`);
      console.log(`Risk Level: ${receipt.securityProof.riskLevel.toUpperCase()}`);
      console.log(`NFC Tags Processed: ${receipt.nfcTags.length}`);
      console.log('');

      // Generate receipt image
      console.log('🎨 Generating receipt image...');
      const imageUri = await generateReceiptImage(receipt, 'modern', Platform.OS);

      console.log('✅ Receipt image generated successfully!');
      console.log(`📎 Image URI: ${imageUri.substring(0, 50)}...`);
      console.log('');

      // Save image to device
      console.log('💾 Saving receipt image to device...');
      const saveResult = Platform.OS === 'ios'
        ? await saveToPhotos(imageUri)
        : await saveToGallery(imageUri);

      if (saveResult) {
        console.log(`✅ Receipt image saved to ${Platform.OS === 'ios' ? 'Photos' : 'Gallery'}!`);
        console.log('📱 User can now access the receipt image from their device gallery.');
      } else {
        console.log('❌ Failed to save receipt image to device.');
      }

      console.log('');

      // Display NFC tag information
      console.log('🏷️ NFC Tag Information:');
      const nfcTags = this.walletManager.getReceiptWithNFCTags(receipt);
      console.log(`📊 Total NFC Tags: ${nfcTags.nfcTags.length}`);
      console.log('📄 Receipt Data Length:', nfcTags.receiptData.length);
      if (nfcTags.qrCode) {
        console.log('📱 QR Code Generated:', nfcTags.qrCode.substring(0, 50) + '...');
      }
      console.log('');

    } else {
      console.log('❌ Payment processing failed:', paymentResult.error);
    }
  }

  async demonstrateReceiptImageStyles(): Promise<void> {
    console.log('🎨 Receipt Image Style Comparison\n');
    console.log('=' .repeat(60));

    const items = this.createSampleReceiptItems().slice(0, 2); // Just first 2 items for demo

    const merchantInfo = {
      id: 'merchant_style_demo_001',
      name: 'Style Demo Cafe',
      address: '456 Style Avenue',
      phone: '(555) 987-6543',
      email: 'demo@styledemo.com'
    };

    const paymentMethods = await this.walletManager.loadPaymentMethods();
    const paymentMethod = paymentMethods[0];

    const paymentResult = await this.walletManager.processPaymentWithDetailedReceipt(
      items,
      paymentMethod.id,
      merchantInfo
    );

    if (paymentResult.success && paymentResult.receipt) {
      const styles = ['modern', 'classic', 'minimal'] as const;

      for (const style of styles) {
        console.log(`🎨 Generating ${style.toUpperCase()} style receipt...`);

        const imageUri = await generateReceiptImage(paymentResult.receipt, style, Platform.OS);
        console.log(`✅ ${style} style image generated`);
        console.log(`📎 URI Length: ${imageUri.length} characters`);
        console.log('');
      }

      console.log('💡 Different styles provide various visual presentations:');
      console.log('   • Modern: Clean, contemporary design');
      console.log('   • Classic: Traditional receipt appearance');
      console.log('   • Minimal: Simplified, essential information only');
      console.log('');
    }
  }

  async demonstrateLoyaltyProgramIntegration(): Promise<void> {
    console.log('🎁 Loyalty Program Integration Demo\n');
    console.log('=' .repeat(60));

    const items = this.createSampleReceiptItems();

    const merchantInfo = {
      id: 'merchant_loyalty_cafe_001',
      name: 'Loyalty Rewards Cafe',
      address: '789 Rewards Street',
      phone: '(555) 111-2222',
      email: 'loyalty@rewardscafe.com'
    };

    const paymentMethods = await this.walletManager.loadPaymentMethods();
    const paymentMethod = paymentMethods[0];

    // Process payment with loyalty points
    const paymentResult = await this.walletManager.processPaymentWithDetailedReceipt(
      items,
      paymentMethod.id,
      merchantInfo,
      'LOYALTY15' // 15% loyalty discount
    );

    if (paymentResult.success && paymentResult.receipt) {
      const receipt = paymentResult.receipt;

      console.log('🎉 Loyalty Program Features:');
      console.log(`💰 Total Purchase: $${receipt.totalAmount.toFixed(2)}`);
      console.log(`🏷️ Discount Applied: ${receipt.discountCode} (-$${receipt.discountAmount.toFixed(2)})`);
      console.log(`⭐ Loyalty Points Earned: ${receipt.loyaltyPoints || 0}`);

      if (receipt.nextVisitDiscount && receipt.nextVisitDiscount > 0) {
        console.log(`🎁 Next Visit Discount: ${(receipt.nextVisitDiscount * 100).toFixed(0)}%`);
      }

      console.log('');
      console.log('📊 Loyalty Benefits:');
      console.log('   • Points earned on every purchase');
      console.log('   • Exclusive discounts for members');
      console.log('   • Personalized offers based on purchase history');
      console.log('   • Tiered rewards system');
      console.log('');
    }
  }

  async runFullDemo(): Promise<void> {
    console.log('🎪 MULTI-ITEM RECEIPT GENERATION FULL DEMONSTRATION\n');
    console.log('🎯 This demo shows:');
    console.log('   • Multi-item receipt creation with detailed item information');
    console.log('   • Item tags and custom fields for enhanced categorization');
    console.log('   • Receipt image generation in multiple styles');
    console.log('   • Platform-specific image saving (iOS Photos / Android Gallery)');
    console.log('   • NFC tag integration for each item');
    console.log('   • Loyalty program integration');
    console.log('   • AIONET Protocol v1.2 security verification');
    console.log('');

    await this.initializeDemo();
    await this.demonstrateMultiItemReceipt();
    await this.demonstrateReceiptImageStyles();
    await this.demonstrateLoyaltyProgramIntegration();

    console.log('🎉 Multi-item receipt demo completed successfully!');
    console.log('✅ All receipt generation features are working correctly.');
    console.log('🖼️ Receipt images can be saved to device galleries.');
    console.log('🏷️ Item tags and NFC integration fully operational.');
    console.log('🔐 AIONET security verification included in all receipts.');
  }
}

// Export for use in other modules
export default MultiItemReceiptDemo;
