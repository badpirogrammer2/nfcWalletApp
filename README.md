# NFC Wallet App

A React Native application that enables NFC tag scanning, transaction processing with receipt generation, and writing receipts back to NFC tags. The app supports both Android and iOS platforms with cross-platform NFC functionality including Host Card Emulation (HCE).

## Features

- **NFC Tag Scanning**: Detect and read NFC tags (NTAG213, NTAG215, etc.)
- **Transaction Processing**: Handle transactions with item names and amounts
- **Receipt Generation**: Automatically generate formatted receipts with unique IDs
- **NFC Write-Back**: Write generated receipts back to the same NFC tag
- **Data Persistence**: Store transactions locally using AsyncStorage
- **Cross-Platform Support**: Android and iOS with HCE capabilities
- **Error Handling**: Graceful handling of NFC read/write failures
- **Dark Mode Support**: Automatic theme adaptation
- **Smart Notifications**: Cross-platform failure notifications with persistent alerts
- **Real-time Feedback**: Immediate alerts and toast notifications for all NFC operations
- **Payment Error Logging**: Comprehensive logging of payment failures with retry mechanisms
- **Payment Method Switching**: Dynamic switching between NFC, card, and digital payments
- **Transaction Recovery**: Automatic retry and recovery options for failed payments

## Prerequisites

### System Requirements
- Node.js >= 18.0.0
- npm >= 9.0.0
- React Native CLI
- Ruby >= 3.2.0 (for iOS CocoaPods)
- Xcode >= 14.0 (for iOS development)
- Android Studio >= 2022.1.1 (for Android development)

### Android Specific
- JDK 11 or 17
- Android SDK API level 33+
- Android device with NFC capability (for physical testing)

### iOS Specific
- macOS Monterey or later
- iOS device with NFC capability (iPhone 7+ for testing)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/badpirogrammer2/nfcWalletApp.git
cd nfcWalletApp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. iOS Setup
```bash
cd ios
pod install
cd ..
```

### 4. Android Setup
- Open Android Studio
- Open the `android` folder as a project
- Let Gradle sync and download dependencies
- Ensure Android SDK is properly configured

### 5. Environment Configuration
- For Android: Ensure `ANDROID_HOME` and `JAVA_HOME` are set
- For iOS: Ensure Xcode command line tools are installed

## Running the App

### Development Server
Start the Metro bundler:
```bash
npm start
```

### Android
```bash
npm run android
```
- Requires Android device connected or emulator running
- Enable USB debugging in developer options
- Enable NFC in device settings

### iOS
```bash
npm run ios
```
- Requires Xcode and iOS Simulator or physical device
- For physical device: Connect iPhone and trust the development certificate

### Alternative Commands
- `react-native run-android` - Direct Android build/run
- `react-native run-ios` - Direct iOS build/run

## Debugging

### Metro Bundler
- The development server provides hot reloading
- Access debug menu: Shake device or press Cmd+D (iOS) / Cmd+M (Android)
- Enable remote debugging in Chrome DevTools

### Flipper Integration
- Flipper is integrated for advanced debugging
- Inspect network requests, logs, and React components
- Access via Metro bundler console

### Android Specific Debugging
- Use Android Studio for native debugging
- Logcat for system logs: `adb logcat`
- Device monitor for performance profiling

### iOS Specific Debugging
- Use Xcode for native debugging
- Console logs via Xcode or `react-native log-ios`
- Safari Web Inspector for web debugging

### Common Debug Commands
```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear Android build
cd android && ./gradlew clean && cd ..

# Clear iOS build
cd ios && rm -rf build && cd ..
```

## Testing

### Unit Testing
Run Jest tests:
```bash
npm test
```

### Linting
Check code quality:
```bash
npm run lint
```

### Test Coverage
Generate coverage report:
```bash
npm test -- --coverage
```

### Manual Testing Setup
1. **Physical Device Testing**:
   - Use Android/iOS device with NFC capability
   - Prepare writable NFC tags (NTAG series recommended)
   - Test in various environments

2. **Emulator Testing**:
   - Android: Use AVD with NFC support
   - iOS: Use Simulator (limited NFC support)

## Capabilities & Test Cases

### Core Capabilities

1. **NFC Scanning**
   - Detect NFC tags in proximity
   - Decode NDEF messages
   - Handle various tag types

2. **Transaction Management**
   - Input item names and amounts
   - Generate unique receipt IDs
   - Store transactions locally

3. **Receipt Generation**
   - Format receipts with all transaction details
   - Include timestamps and NFC data
   - Unique receipt ID format: RCP-timestamp

4. **NFC Write-Back**
   - Write receipts to the same tag
   - Handle write permissions
   - Verify successful write operations

5. **Cross-Platform HCE**
   - Android Host Card Emulation
   - iOS client card reading
   - Multi-device communication

### Test Cases

#### Basic Functionality Tests
- **Test Case 1**: Basic NFC Scanning
  - Verify tag detection and data display
  - Expected: Modal shows scanned data

- **Test Case 2**: Transaction with Amount
  - Scan tag, enter item and amount
  - Expected: Transaction saved with receipt generated

- **Test Case 3**: Receipt Generation Verification
  - Check receipt format and content
  - Expected: Proper RECEIPT format with all fields

- **Test Case 4**: NFC Write-Back Verification
  - Write receipt to tag and verify with external reader
  - Expected: Receipt data stored on tag

- **Test Case 5**: Multiple Transactions
  - Process multiple transactions
  - Expected: Unique receipt IDs, all data preserved

#### Edge Cases
- **Zero Amount**: Transaction without amount
- **Invalid Amount**: Non-numeric input handling
- **Read-Only Tags**: Error handling for locked tags
- **Unsupported Tags**: Graceful degradation

#### Cross-Platform Tests
- **HCE-1**: Basic Card Emulation Detection
- **HCE-2**: Transaction Data Exchange
- **HCE-3**: Multiple Card Types Emulation
- **HCE-4**: Concurrent Multi-Device Testing
- **HCE-5**: Range and Positioning Tests
- **HCE-6**: Error Handling and Recovery
- **HCE-7**: Performance and Load Testing

### Error Messages & Handling

The app provides clear, user-friendly error messages for various failure scenarios:

#### NFC-Related Errors
- **"No tag available for writing"**
  - Occurs when attempting to write to a tag that is no longer in range
  - Solution: Ensure NFC tag remains close to device during write operation

- **"Failed to write receipt to NFC tag"**
  - General write failure, often due to tag being read-only or locked
  - Solution: Use writable NFC tags (NTAG series recommended) and ensure tag is not password-protected

- **"Failed to encode receipt message"**
  - Internal error during receipt encoding process
  - Solution: Check app logs for detailed error information

- **"NFC tag detected, but could not decode message"**
  - Tag contains data in unsupported format or is corrupted
  - Solution: Verify tag contains valid NDEF data or use a different tag

- **"NFC tag detected, but no NDEF message found"**
  - Tag is empty or contains non-NDEF data
  - Solution: Write valid data to tag first or use a pre-programmed tag

#### Permission Errors
- **"NFC permission not granted"**
  - App lacks necessary NFC permissions
  - Solution: Grant NFC permissions in device settings and app permissions

#### Transaction Errors
- **"Failed to save transaction"**
  - Internal storage error when saving transaction data
  - Solution: Check available storage space and app permissions

#### Network/Connection Errors
- **"Connection timeout"**
  - NFC communication took too long
  - Solution: Ensure stable device connection and tag proximity

#### Cross-Platform HCE Errors
- **"Card emulation not supported"**
  - Device doesn't support Host Card Emulation
  - Solution: Use Android device with HCE capability

- **"Emulation interrupted"**
  - HCE session was interrupted
  - Solution: Maintain device proximity and avoid interference

#### General App Errors
- **"App initialization failed"**
  - Failed to start NFC manager or load stored data
  - Solution: Restart app and check device NFC settings

- **"Data corruption detected"**
  - Stored wallet data is corrupted
  - Solution: Clear app data and re-import transactions

## Notification System

The app includes a comprehensive cross-platform notification system that provides real-time feedback for all NFC operations:

### Notification Types

#### Immediate Alerts
- **Modal Dialogs**: Critical errors and confirmations
- **Platform-Specific**: Native iOS alerts and Android dialogs
- **User Interaction**: Require user acknowledgment

#### Persistent Notifications
- **Toast Messages (Android)**: Non-intrusive background notifications
- **Alert Fallback (iOS)**: Persistent alerts for important messages
- **Auto-Dismiss**: Notifications automatically clear after timeout

### Notification Categories

#### Success Notifications
- **NFC Tag Scanned**: Confirms successful tag detection
- **Data Written**: Confirms successful receipt writing to tag
- **Transaction Saved**: Confirms successful transaction storage
- **Card Emulation Started**: Confirms HCE initialization

#### Failure Notifications
- **Connection Timeout**: NFC communication exceeded time limits
- **Write Failures**: Tag write operations failed
- **Permission Issues**: NFC permissions not granted
- **Device Compatibility**: Device doesn't support required features
- **Cross-Device Errors**: Inter-device communication failures
- **Emulation Errors**: HCE operation failures

### Platform-Specific Behavior

#### Android Notifications
- **Toast Messages**: Appear at bottom of screen, auto-dismiss after 3-5 seconds
- **Alert Dialogs**: Modal overlays requiring user interaction
- **Notification Shade**: System-level notifications for background operations
- **Vibration**: Optional haptic feedback for important notifications

#### iOS Notifications
- **Alert Controllers**: Native iOS alert dialogs
- **Banner Notifications**: Non-intrusive top-of-screen banners
- **Sound Alerts**: Optional audio feedback
- **Badge Updates**: App icon badge for unread notifications

### Notification Triggers

#### Automatic Triggers
- NFC operation failures
- Permission request failures
- Connection timeouts
- Device compatibility issues
- Data corruption detection

#### User-Initiated Triggers
- Successful NFC operations
- Transaction completions
- Settings changes
- Manual error checks

### Notification Management

#### User Preferences
- Enable/disable specific notification types
- Configure notification sounds
- Set vibration preferences
- Choose notification display duration

#### Error Recovery
- Retry options in failure notifications
- Troubleshooting guidance
- Alternative action suggestions
- Help documentation links

## Payment Error Logging & Recovery System

The app includes a sophisticated payment error logging and recovery system that handles various payment failure scenarios with intelligent retry mechanisms and payment method switching:

### Payment Error Types

#### Transaction-Level Errors
- **Payment Failed**: Generic payment processing failure
- **Card Declined**: Card issuer declined the transaction
- **Insufficient Funds**: Account balance too low
- **Network Error**: Communication failure with payment processor
- **Authentication Failed**: Invalid credentials or token expired

#### NFC-Specific Payment Errors
- **Tag Read Failure**: Unable to read payment data from NFC tag
- **Tag Write Failure**: Unable to write transaction data to tag
- **Tag Not Found**: Payment tag moved out of range during transaction
- **Tag Locked**: Payment tag is read-only or locked

#### Cross-Device Payment Errors
- **Device Connection Lost**: Communication interrupted between devices
- **Protocol Mismatch**: Incompatible payment protocols between devices
- **Emulation Failure**: Host Card Emulation malfunction

### Error Logging System

#### Error Log Structure
Each error log entry contains:
- **Transaction ID**: Unique identifier for the failed transaction
- **Error Type**: Categorized error classification
- **Error Message**: Detailed description of the failure
- **Timestamp**: When the error occurred
- **Payment Method**: NFC, card, or digital payment type
- **Retry Count**: Number of retry attempts made
- **User Action**: What action the user took (if any)

#### Log Storage & Retrieval
- **Persistent Storage**: Error logs stored locally using AsyncStorage
- **Log Rotation**: Automatic cleanup of old error logs
- **Export Capability**: Option to export logs for debugging
- **Search & Filter**: Filter logs by error type, payment method, or date range

### Retry Mechanisms

#### Automatic Retry Logic
- **Exponential Backoff**: Increasing delay between retry attempts
- **Maximum Retry Limit**: Configurable maximum retry attempts (default: 3)
- **Smart Retry Conditions**: Only retry recoverable errors
- **User Notification**: Inform user of retry attempts in progress

#### Manual Retry Options
- **One-Tap Retry**: Immediate retry button in error notifications
- **Scheduled Retry**: Retry after user-specified delay
- **Conditional Retry**: Retry only when conditions are met (e.g., better signal)

### Payment Method Switching

#### Dynamic Method Selection
- **NFC Fallback**: Switch from NFC to card/digital when NFC fails
- **Card Type Switching**: Switch between credit/debit cards
- **Digital Wallet Options**: Switch to Apple Pay, Google Pay, etc.

#### Intelligent Switching Logic
- **Error-Based Switching**: Switch method based on specific error types
- **User Preference Learning**: Learn and prioritize user's preferred methods
- **Availability Checking**: Only suggest available payment methods

#### Switching Scenarios
- **NFC Tag Issues**: Automatically suggest card payment
- **Card Declined**: Offer alternative card or digital payment
- **Network Issues**: Suggest offline-capable payment methods

### Recovery Workflows

#### Failed Payment Recovery
1. **Error Detection**: Immediate detection and logging of payment failure
2. **User Notification**: Clear error message with recovery options
3. **Automatic Retry**: Attempt retry with same payment method
4. **Method Switching**: If retry fails, suggest alternative methods
5. **Manual Intervention**: Allow user to manually select recovery option

#### Cross-Device Recovery
1. **Connection Monitoring**: Continuous monitoring of device connections
2. **Automatic Reconnection**: Attempt to re-establish lost connections
3. **Data Synchronization**: Ensure transaction data consistency
4. **Fallback Handling**: Graceful degradation when cross-device features fail

### User Experience Enhancements

#### Error Notification Design
- **Contextual Messages**: Error messages specific to the failed operation
- **Actionable Solutions**: Clear steps to resolve the issue
- **Progress Indicators**: Show retry progress and estimated completion time
- **Help Integration**: Links to troubleshooting guides

#### Recovery Interface
- **One-Click Recovery**: Single button to initiate recovery process
- **Alternative Options**: Multiple recovery paths when available
- **Progress Tracking**: Real-time updates on recovery status
- **Success Confirmation**: Clear confirmation when recovery succeeds

### Analytics & Insights

#### Error Pattern Analysis
- **Common Failure Points**: Identify frequently failing operations
- **Payment Method Performance**: Track success rates by payment method
- **Time-Based Patterns**: Analyze errors by time of day or day of week
- **Device-Specific Issues**: Track errors by device type or OS version

#### Performance Metrics
- **Recovery Success Rate**: Percentage of successful recoveries
- **Average Recovery Time**: Time taken to resolve payment issues
- **User Satisfaction**: Track user feedback on recovery experience
- **System Reliability**: Overall payment success rate

### Security Considerations

#### Error Data Handling
- **Sensitive Data Protection**: Never log sensitive payment information
- **Encryption**: Encrypt error logs containing any sensitive data
- **Access Control**: Restrict access to error logs based on user permissions
- **Data Retention**: Configurable retention period for error logs

#### Fraud Prevention
- **Anomaly Detection**: Flag unusual error patterns that may indicate fraud
- **Rate Limiting**: Prevent excessive retry attempts that could be abusive
- **Authentication Verification**: Ensure user identity before allowing sensitive operations

### Integration with External Systems

#### Payment Processor Integration
- **Error Code Mapping**: Map payment processor error codes to user-friendly messages
- **Status Synchronization**: Keep local error logs synchronized with payment processor
- **Dispute Handling**: Support for payment dispute workflows

#### Customer Support Integration
- **Automated Ticketing**: Create support tickets for recurring errors
- **Error Report Generation**: Generate detailed reports for support teams
- **User Communication**: Automated communication about error resolution

### Performance Expectations
- NFC Scanning: < 2 seconds
- Receipt Generation: < 1 second
- NFC Write Operation: < 3 seconds
- App Startup: < 5 seconds
- Notification Display: < 500ms
- Notification Persistence: 3-10 seconds
- Error Logging: < 100ms
- Retry Processing: < 2 seconds
- Method Switching: < 1 second

## Project Structure

```
nfcWalletApp/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── __tests__/               # Unit tests
├── src/                     # Source code (if applicable)
├── App.tsx                  # Main app component
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── metro.config.js          # Metro bundler config
└── README.md                # This file
```

## Dependencies

### Core Dependencies
- `react-native`: Framework for building native apps
- `react-native-nfc-manager`: NFC functionality
- `@react-native-async-storage/async-storage`: Local data storage
- `react`: UI library
- `typescript`: Type safety

### Development Dependencies
- `jest`: Testing framework
- `eslint`: Code linting
- `@babel/*`: JavaScript transpilation
- `@types/*`: TypeScript definitions

## Troubleshooting

### Common Issues

1. **Metro Bundler Issues**
   - Clear cache: `npm start -- --reset-cache`
   - Kill process and restart

2. **Android Build Failures**
   - Clean build: `cd android && ./gradlew clean`
   - Invalidate caches in Android Studio

3. **iOS Build Failures**
   - Clean build: `cd ios && rm -rf build`
   - Update CocoaPods: `pod update`

4. **NFC Not Working**
   - Ensure NFC is enabled in device settings
   - Check device NFC capability
   - Test with known working NFC tags

5. **Permission Issues**
   - Grant NFC permissions in app settings
   - Check AndroidManifest.xml for proper permissions

### Getting Help
- Check device logs for detailed error messages
- Verify all prerequisites are installed
- Test on physical device rather than emulator for NFC features

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Run tests: `npm test`
5. Lint code: `npm run lint`
6. Commit changes: `git commit -am 'Add feature'`
7. Push to branch: `git push origin feature-name`
8. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Native community
- NFC technology providers
- Open source contributors

---

**Note**: This app requires physical NFC-capable devices for full functionality testing. Emulator testing has limitations for NFC features.
