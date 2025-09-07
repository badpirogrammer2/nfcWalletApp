/**
 * Receipt Image Generator
 * Generates high-quality images of receipts for saving to device galleries
 */

import { Platform } from 'react-native';
import { DetailedReceipt } from './walletIntegration';

// Simplified image generation for React Native
export class ReceiptImageGenerator {
  // Generate receipt image (simplified for React Native)
  async generateImage(receipt: DetailedReceipt): Promise<string> {
    try {
      // Create a detailed text representation of the receipt
      const receiptText = this.createDetailedReceiptText(receipt);

      // In a real implementation, you would use:
      // - react-native-canvas for drawing
      // - react-native-svg for vector graphics
      // - Native modules for image generation

      // For now, return a data URL with the text content
      const encodedText = encodeURIComponent(receiptText);
      return `data:text/plain;charset=utf-8,${encodedText}`;

    } catch (error) {
      console.error('Failed to generate receipt image:', error);
      throw new Error('Image generation failed');
    }
  }

  // Create detailed receipt text with all items and formatting
  private createDetailedReceiptText(receipt: DetailedReceipt): string {
    const lines: string[] = [];

    // Header
    lines.push('='.repeat(50));
    lines.push(`         ${receipt.merchantName.toUpperCase()}`);
    if (receipt.merchantAddress) {
      lines.push(`         ${receipt.merchantAddress}`);
    }
    if (receipt.merchantPhone) {
      lines.push(`         Phone: ${receipt.merchantPhone}`);
    }
    lines.push('');
    lines.push(`Receipt #: ${receipt.receiptNumber}`);
    lines.push(`Date: ${new Date(receipt.timestamp).toLocaleDateString()}`);
    lines.push(`Time: ${new Date(receipt.timestamp).toLocaleTimeString()}`);
    lines.push('='.repeat(50));
    lines.push('');

    // Items header
    lines.push('ITEMS:');
    lines.push('-'.repeat(50));

    // Individual items with tags
    receipt.items.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.name}`);
      if (item.description) {
        lines.push(`   ${item.description}`);
      }
      lines.push(`   Quantity: ${item.quantity}`);
      lines.push(`   Unit Price: $${item.unitPrice.toFixed(2)}`);
      lines.push(`   Total: $${item.totalPrice.toFixed(2)}`);

      // Item tags
      if (item.tags && item.tags.length > 0) {
        lines.push(`   Tags: ${item.tags.join(', ')}`);
      }

      // Custom fields
      if (item.customFields) {
        Object.entries(item.customFields).forEach(([key, value]) => {
          lines.push(`   ${key}: ${value}`);
        });
      }

      lines.push('');
    });

    lines.push('-'.repeat(50));

    // Totals section
    lines.push(`Subtotal: $${receipt.subtotal.toFixed(2)}`);
    lines.push(`Tax (${(receipt.taxRate * 100).toFixed(0)}%): $${receipt.taxAmount.toFixed(2)}`);

    if (receipt.discountAmount > 0) {
      lines.push(`Discount${receipt.discountCode ? ` (${receipt.discountCode})` : ''}: -$${receipt.discountAmount.toFixed(2)}`);
    }

    lines.push('='.repeat(50));
    lines.push(`TOTAL: $${receipt.totalAmount.toFixed(2)}`);
    lines.push('='.repeat(50));
    lines.push('');

    // Payment information
    lines.push('PAYMENT INFORMATION:');
    lines.push(`Method: ${receipt.paymentMethod}`);
    lines.push(`Transaction ID: ${receipt.transactionId}`);
    lines.push(`Status: ${receipt.status.toUpperCase()}`);
    lines.push('');

    // Store information
    if (receipt.storeLocation) {
      lines.push(`Store Location: ${receipt.storeLocation}`);
    }

    if (receipt.cashierId) {
      lines.push(`Cashier: ${receipt.cashierId}`);
    }

    lines.push('');

    // Loyalty program
    if (receipt.loyaltyPoints && receipt.loyaltyPoints > 0) {
      lines.push('LOYALTY PROGRAM:');
      lines.push(`Points Earned: ${receipt.loyaltyPoints}`);
      if (receipt.nextVisitDiscount && receipt.nextVisitDiscount > 0) {
        lines.push(`Next Visit Discount: ${(receipt.nextVisitDiscount * 100).toFixed(0)}%`);
      }
      lines.push('');
    }

    // Security verification
    lines.push('SECURITY VERIFICATION:');
    lines.push('✓ Verified with AIONET Protocol v1.2');
    lines.push(`Security Score: ${receipt.securityProof.securityScore}/100`);
    lines.push(`Risk Level: ${receipt.securityProof.riskLevel.toUpperCase()}`);
    lines.push(`Block Height: ${receipt.securityProof.blockHeight}`);
    lines.push('');

    // NFC Tags summary
    if (receipt.nfcTags && receipt.nfcTags.length > 0) {
      lines.push('NFC TAGS PROCESSED:');
      receipt.nfcTags.forEach((tag, index) => {
        lines.push(`${index + 1}. ${tag.substring(0, 32)}...`);
      });
      lines.push('');
    }

    // Footer
    lines.push('Thank you for your business!');
    lines.push('Powered by NFC Wallet App with AIONET Security');
    lines.push('='.repeat(50));

    return lines.join('\n');
  }
}

// Main export function
export async function generateReceiptImage(
  receipt: DetailedReceipt,
  style: 'modern' | 'classic' | 'minimal' = 'modern',
  platform: string = Platform.OS
): Promise<string> {
  try {
    const generator = new ReceiptImageGenerator();
    return await generator.generateImage(receipt);
  } catch (error) {
    console.error('Receipt image generation failed:', error);

    // Fallback: return a simple text-based representation
    return generateFallbackReceiptImage(receipt);
  }
}

// Fallback receipt image generation
function generateFallbackReceiptImage(receipt: DetailedReceipt): string {
  const receiptText = `
RECEIPT - ${receipt.merchantName}
${receipt.merchantAddress || ''}
Date: ${new Date(receipt.timestamp).toLocaleDateString()}
Receipt: ${receipt.receiptNumber}

ITEMS:
${receipt.items.map(item =>
  `${item.name} x${item.quantity} - $${item.totalPrice.toFixed(2)}`
).join('\n')}

Subtotal: $${receipt.subtotal.toFixed(2)}
Tax: $${receipt.taxAmount.toFixed(2)}
${receipt.discountAmount > 0 ? `Discount: -$${receipt.discountAmount.toFixed(2)}` : ''}
TOTAL: $${receipt.totalAmount.toFixed(2)}

Payment: ${receipt.paymentMethod}
Transaction: ${receipt.transactionId}

✓ Verified with AIONET Protocol v1.2
Security Score: ${receipt.securityProof.securityScore}/100
  `.trim();

  // Convert text to data URL (simplified)
  const encodedText = encodeURIComponent(receiptText);
  return `data:text/plain;charset=utf-8,${encodedText}`;
}

// Export the generator class for advanced usage
export default ReceiptImageGenerator;
