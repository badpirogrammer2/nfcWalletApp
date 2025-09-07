#!/bin/bash

# Master Build Script for NFC Wallet App
# Builds both Android and iOS versions

set -e

echo "🚀 Starting build process for both Android and iOS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Check if we're on macOS for iOS builds
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${YELLOW}⚠️  Warning: Not running on macOS. iOS builds will be skipped.${NC}"
    SKIP_IOS=true
fi

# Build Android
print_header "BUILDING ANDROID"
if [ -f "build-android.sh" ]; then
    echo "📱 Building Android app..."
    ./build-android.sh
    echo -e "${GREEN}✅ Android build completed!${NC}"
else
    echo -e "${RED}❌ Android build script not found${NC}"
    exit 1
fi

# Build iOS (only on macOS)
if [ "$SKIP_IOS" != true ]; then
    print_header "BUILDING iOS"
    if [ -f "build-ios.sh" ]; then
        echo "🍎 Building iOS app..."
        ./build-ios.sh
        echo -e "${GREEN}✅ iOS build completed!${NC}"
    else
        echo -e "${RED}❌ iOS build script not found${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⏭️  Skipping iOS build (not on macOS)${NC}"
fi

print_header "BUILD SUMMARY"
echo -e "${GREEN}🎉 All builds completed successfully!${NC}"
echo ""
echo "📦 Build artifacts:"
echo "  Android Debug APK:  android/app/build/outputs/apk/debug/app-debug.apk"
echo "  Android Release APK: android/app/build/outputs/apk/release/app-release.apk"
if [ "$SKIP_IOS" != true ]; then
    echo "  iOS Debug:          ios/build/Build/Products/Debug-iphonesimulator/"
    echo "  iOS Release:        ios/build/Build/Products/Release-iphoneos/"
    echo "  iOS IPA:            ios/build/IPA/nfcWalletApp.ipa"
fi

echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "  1. Test the apps on devices/emulators"
echo "  2. Configure code signing for release builds"
echo "  3. Update version numbers in build.gradle and Info.plist"
echo "  4. Deploy to app stores or distribute internally"
