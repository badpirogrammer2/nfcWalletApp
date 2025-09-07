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

### Performance Expectations
- NFC Scanning: < 2 seconds
- Receipt Generation: < 1 second
- NFC Write Operation: < 3 seconds
- App Startup: < 5 seconds

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
