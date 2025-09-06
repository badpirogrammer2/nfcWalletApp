# Project Dependency List for NFC Wallet App

## JavaScript/TypeScript (npm)
- react
- react-native
- react-native-nfc-manager
- @react-native-async-storage/async-storage
- react-native-permissions
- typescript
- vite

## iOS (CocoaPods)
- All dependencies in ios/Podfile (auto-managed by React Native)
- CocoaPods (install with `sudo gem install cocoapods`)

## Ruby (for CocoaPods)
- Ruby >= 3.2.0 (required for latest activesupport and cocoapods)
- activesupport (auto-installed by CocoaPods)

## Android
- Android Studio (for Gradle and SDK management)

## Dev Tools
- Node.js >= 18
- npm >= 9
- Xcode (for iOS)
- Android Studio (for Android)

---

**Setup Steps:**
1. Install Node.js and npm
2. Install React Native CLI: `npm install -g react-native-cli`
3. Install CocoaPods: `sudo gem install cocoapods` (after upgrading Ruby if needed)
4. Install project dependencies: `npm install`
5. For iOS: `cd ios && pod install`

See README.md for more details.
