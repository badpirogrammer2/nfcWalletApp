# NFC Wallet App - Build and Deployment Guide

This document provides instructions for building and deploying the NFC Wallet App for both Android and iOS platforms.

## 📋 Prerequisites

### For Android Builds
- Android SDK (API 31+)
- Android NDK (21.4.7075529 or 24.0.8215888)
- Java JDK 11 or higher
- Set `ANDROID_HOME` environment variable

#### Android SDK Setup
1. Copy the template file:
   ```bash
   cp android/local.properties.template android/local.properties
   ```

2. Edit `android/local.properties` and update the SDK path:
   ```properties
   sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
   ```

3. The `local.properties` file is automatically ignored by git to keep your personal paths private.

### For iOS Builds (macOS only)
- Xcode 12.4+
- CocoaPods
- iOS Simulator or physical device
- Apple Developer Account (for distribution)

## 🚀 Quick Start

### Build Both Platforms
```bash
./build-all.sh
```

### Build Android Only
```bash
./build-android.sh
```

### Build iOS Only
```bash
./build-ios.sh
```

## 📱 Android Build Process

The Android build script (`build-android.sh`) performs the following steps:

1. **Environment Check**: Verifies Android SDK installation
2. **Clean Build**: Removes previous build artifacts
3. **Debug Build**: Creates debug APK for development/testing
4. **Release Build**: Creates release APK for production
5. **Verification**: Confirms build artifacts are created

### Build Outputs
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

### Release Configuration
For production releases, configure the following in `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/keystore.jks')
            storePassword 'store_password'
            keyAlias 'key_alias'
            keyPassword 'key_password'
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 🍎 iOS Build Process

The iOS build script (`build-ios.sh`) performs the following steps:

1. **Environment Check**: Verifies Xcode and CocoaPods installation
2. **Dependencies**: Installs CocoaPods dependencies
3. **Debug Build**: Creates debug build for simulator
4. **Release Build**: Creates release build for device
5. **IPA Creation**: Generates IPA file for distribution

### Build Outputs
- **Debug Build**: `ios/build/Build/Products/Debug-iphonesimulator/`
- **Release Build**: `ios/build/Build/Products/Release-iphoneos/`
- **IPA File**: `ios/build/IPA/nfcWalletApp.ipa`

### Code Signing Configuration

1. Open the project in Xcode:
   ```bash
   open ios/nfcWalletApp.xcworkspace
   ```

2. Select the target and configure signing:
   - Go to "Signing & Capabilities"
   - Select your development team
   - Configure provisioning profiles

3. For distribution, update `ios-export-options.plist`:
   ```xml
   <key>method</key>
   <string>app-store</string>  <!-- or enterprise/ad-hoc -->
   <key>teamID</key>
   <string>YOUR_TEAM_ID</string>
   ```

## 🔧 Configuration Files

### Android Configuration
- `android/build.gradle` - Project-level build configuration
- `android/app/build.gradle` - App-level build configuration
- `android/gradle.properties` - Gradle properties
- `android/local.properties` - Local SDK path

### iOS Configuration
- `ios/Podfile` - CocoaPods dependencies
- `ios/nfcWalletApp.xcodeproj` - Xcode project
- `ios/nfcWalletApp/Info.plist` - App configuration
- `ios-export-options.plist` - Export options for IPA creation

## 📦 Distribution

### Android Distribution
1. **Google Play Store**:
   - Generate signed release APK/AAB
   - Upload to Google Play Console
   - Configure store listing and pricing

2. **Internal Distribution**:
   - Use APK for direct installation
   - Host on internal server or distribute via email

### iOS Distribution
1. **App Store**:
   - Create App Store Connect record
   - Upload IPA using Xcode or Transporter
   - Submit for review

2. **TestFlight**:
   - Upload to TestFlight for beta testing
   - Invite testers via email

3. **Enterprise/In-House**:
   - Use enterprise distribution certificate
   - Host IPA on internal server

## 🐛 Troubleshooting

### Android Issues
- **SDK not found**: Ensure `ANDROID_HOME` is set correctly
- **NDK download fails**: Check internet connection and disk space
- **Build fails**: Clean and rebuild: `./gradlew clean assembleDebug`

### iOS Issues
- **CocoaPods fails**: Update CocoaPods and try `pod install --repo-update`
- **Code signing errors**: Check provisioning profiles and certificates
- **Xcode build fails**: Clean derived data and rebuild

### Common Issues
- **Permission denied**: Make scripts executable: `chmod +x build-*.sh`
- **Out of memory**: Increase Gradle memory in `gradle.properties`
- **Network issues**: Check proxy settings and firewall

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Release
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build Android
        run: ./build-android.sh
      - name: Build iOS
        run: ./build-ios.sh
      - name: Upload artifacts
        uses: actions/upload-artifact@v2
        with:
          name: build-artifacts
          path: |
            android/app/build/outputs/apk/
            ios/build/IPA/
```

## 📞 Support

For build issues:
1. Check the build logs for specific error messages
2. Verify all prerequisites are installed
3. Ensure configuration files are correct
4. Try cleaning and rebuilding

## 📝 Version Management

Update version numbers in:
- **Android**: `android/app/build.gradle` (versionCode/versionName)
- **iOS**: `ios/nfcWalletApp/Info.plist` (CFBundleVersion/CFBundleShortVersionString)
- **Package**: `package.json` (version)

Ensure version numbers are consistent across all platforms.
