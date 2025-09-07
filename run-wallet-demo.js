/**
 * NFC Wallet Integration Demo Runner
 * Demonstrates end-to-end NFC transactions with Apple Pay and Google Pay
 */

// Mock React Native Platform for Node.js environment
global.Platform = {
  OS: 'ios',
  Version: '14.0',
  isPad: false,
  isTV: false,
};

// Mock console for better formatting
const originalLog = console.log;
console.log = (...args) => {
  originalLog(new Date().toISOString(), ...args);
};

// Import and run the demo
async function runDemo() {
  try {
    console.log('🚀 Starting NFC Wallet Integration Demo...\n');

    // Dynamic import to handle the demo
    const { default: WalletIntegrationDemo } = await import('./src/__tests__/WalletIntegrationDemo.ts');

    const demo = new WalletIntegrationDemo();
    await demo.runFullDemo();

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the demo
runDemo();
