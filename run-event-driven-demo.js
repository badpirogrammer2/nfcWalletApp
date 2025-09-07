#!/usr/bin/env node

/**
 * Event-Driven NFC Demo Runner
 * Runs the battery-optimized NFC demonstration
 */

const path = require('path');

// Import the demo (this will work when run from the project root)
try {
  const { EventDrivenNFCManger, NFCBatteryOptimizer } = require('./src/eventDrivenNFCManger');

  console.log('🔋 Event-Driven NFC Battery Optimization Demo');
  console.log('=' .repeat(60));
  console.log('');

  // Initialize the NFC manager
  const nfcManager = EventDrivenNFCManger.getInstance();

  console.log('🚀 Initializing Event-Driven NFC Manager...');
  const initialized = nfcManager.initialize();

  if (initialized) {
    console.log('✅ NFC Manager initialized successfully');
    console.log('');

    // Demonstrate battery optimization
    console.log('🔋 Running Battery Optimization Demo...');
    NFCBatteryOptimizer.optimizeForBattery();

    // Get optimization recommendations
    const recommendations = NFCBatteryOptimizer.getOptimizationRecommendations();
    console.log('💡 Battery Optimization Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    console.log('');

    // Show current power state
    const powerState = nfcManager.getPowerState();
    console.log('📊 Current Power State:');
    console.log(`   Active: ${powerState.isActive}`);
    console.log(`   Battery Impact: ${powerState.batteryImpact}%`);
    console.log(`   CPU Usage: ${powerState.cpuUsage}%`);
    console.log('');

    console.log('🎯 Event-Driven NFC Features:');
    console.log('   • NFC only activates when transaction triggers are detected');
    console.log('   • Automatic low-power mode when idle');
    console.log('   • Platform-optimized battery management');
    console.log('   • Minimal background processing');
    console.log('   • Transaction-only activation');
    console.log('');

    console.log('✅ Demo completed successfully!');
    console.log('🔋 Battery optimization is now active.');
    console.log('⚡ NFC will only trigger on actual transactions.');

  } else {
    console.log('❌ Failed to initialize NFC Manager');
    console.log('💡 Make sure you have NFC-capable hardware and proper permissions');
  }

} catch (error) {
  console.error('❌ Error running demo:', error.message);
  console.log('');
  console.log('💡 To run this demo:');
  console.log('   1. Make sure you\'re in the project root directory');
  console.log('   2. Run: node run-event-driven-demo.js');
  console.log('   3. Or use: npm run demo:event-driven');
}
