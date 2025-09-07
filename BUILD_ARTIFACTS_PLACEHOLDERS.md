# Build Artifacts Placeholders

This document lists all placeholder files created for build artifacts that contain local computer information and are ignored by git.

## 📱 Android Build Artifacts

### APK Files
- **`android/app/build/outputs/apk/debug/app-debug.apk`**
  - Original: `/Users/homemac/IdeaProjects/aiprojs/Almonds1/nfcWalletApp/android/app/build/outputs/apk/debug/app-debug.apk`
  - Purpose: Debug APK for Android development and testing
  - Build Command: `./build-android.sh` or `cd android && ./gradlew assembleDebug`

- **`android/app/build/outputs/apk/release/app-release.apk`**
  - Original: `/Users/homemac/IdeaProjects/aiprojs/Almonds1/nfcWalletApp/android/app/build/outputs/apk/release/app-release.apk`
  - Purpose: Production/signed APK for Android deployment
  - Build Command: `./build-android.sh` or `cd android && ./gradlew assembleRelease`
  - Note: Requires signing configuration for production

### Build Intermediates
- **`android/app/build/intermediates/README.md`**
  - Original: `/Users/homemac/IdeaProjects/aiprojs/Almonds1/nfcWalletApp/android/app/build/intermediates/`
  - Purpose: Directory containing compiled classes, merged manifests, and transform outputs
  - Contains: System-specific paths and incremental build data
  - Build Command: `./build-android.sh` or `cd android && ./gradlew assembleDebug`

## 🍎 iOS Build Artifacts

### IPA File
- **`ios/build/IPA/nfcWalletApp.ipa`**
  - Original: `/Users/homemac/IdeaProjects/aiprojs/Almonds1/nfcWalletApp/ios/build/IPA/nfcWalletApp.ipa`
  - Purpose: Production/signed IPA for iOS deployment and distribution
  - Build Command: `./build-ios.sh` or `xcodebuild` with exportArchive
  - Note: Requires Apple Developer Program membership and code signing

### App Bundles
- **`ios/build/Build/Products/Debug-iphonesimulator/nfcWalletApp.app`**
  - Original: `/Users/homemac/IdeaProjects/aiprojs/Almonds1/nfcWalletApp/ios/build/Build/Products/Debug-iphonesimulator/nfcWalletApp.app`
  - Purpose: Debug app bundle for iOS Simulator testing
  - Build Command: `./build-ios.sh` or `xcodebuild` with iphonesimulator destination

- **`ios/build/Build/Products/Release-iphoneos/nfcWalletApp.app`**
  - Original: `/Users/homemac/IdeaProjects/aiprojs/Almonds1/nfcWalletApp/ios/build/Build/Products/Release-iphoneos/nfcWalletApp.app`
  - Purpose: Release app bundle for physical iOS devices
  - Build Command: `./build-ios.sh` or `xcodebuild` with iphoneos destination
  - Note: Requires code signing for device deployment

## 🔒 Security & Privacy

### Why These Files Are Ignored
- **Local Paths**: All files contain the full path `/Users/homemac/IdeaProjects/aiprojs/Almonds1/nfcWalletApp/`
- **System Information**: Build artifacts include system-specific configuration and cache data
- **Personal Data**: SDK paths and development environment details are exposed
- **Security Risk**: Sharing local computer information poses privacy and security concerns

### Git Ignore Patterns
The following patterns in `.gitignore` ensure these files are never committed:
```gitignore
android/app/build/
ios/build/
.gradle/
*.iml
local.properties
```

## 🚀 How to Generate Real Build Artifacts

### Android
```bash
# Quick build
./build-android.sh

# Manual build
cd android
./gradlew clean assembleDebug  # For debug APK
./gradlew clean assembleRelease  # For release APK
```

### iOS
```bash
# Quick build
./build-ios.sh

# Manual build
cd ios
pod install
xcodebuild -workspace nfcWalletApp.xcworkspace -scheme nfcWalletApp -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 14,OS=latest' build
```

## 📋 Development Workflow

1. **Clone Repository**: Get clean codebase without build artifacts
2. **Setup Environment**: Configure SDK paths using templates
3. **Build Artifacts**: Generate real build files using provided scripts
4. **Test & Deploy**: Use generated artifacts for testing and distribution
5. **Clean Repository**: Build artifacts are automatically ignored

## ⚠️ Important Notes

- **Placeholder Files**: These are documentation files, not actual build artifacts
- **Path Configuration Required**: When these files are actually built and generated, they will contain the correct paths for the current system/environment, not the original hardcoded paths shown in the comments
- **Dynamic Path Generation**: Build tools automatically use the current project's absolute paths when generating artifacts
- **Build Required**: Real APK/IPA files must be generated using build scripts
- **Signing Required**: Release builds require code signing certificates
- **Distribution Ready**: Generated artifacts are ready for app store submission or internal distribution

## 🔧 Path Configuration During Build

### Android Build Paths
When building Android APKs, the following paths are dynamically configured:
- **SDK Path**: Read from `android/local.properties` (configured per developer)
- **Project Path**: Automatically resolved by Gradle build system
- **Output Path**: Generated relative to project root (`android/app/build/outputs/apk/`)

### iOS Build Paths
When building iOS apps, the following paths are dynamically configured:
- **Project Path**: Automatically resolved by Xcode build system
- **Derived Data**: Generated in `ios/build/` directory
- **Archive Path**: Created in `ios/build/archives/` for IPA generation

### Environment-Specific Paths
- **Local Computer Name**: Replaced with current system's username during build
- **Project Directory**: Uses actual project location on current machine
- **SDK Locations**: Configured per developer's environment setup

## 📋 Build Process Path Resolution

1. **Pre-build**: Scripts validate environment and SDK paths
2. **Build Execution**: Build tools resolve absolute paths for current system
3. **Artifact Generation**: Files created with correct paths for current environment
4. **Post-build**: Artifacts contain system-appropriate paths, not original hardcoded paths

For more information about building and deploying the NFC Wallet App, see `DEPLOYMENT.md`.
