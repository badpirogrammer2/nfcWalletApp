#!/bin/bash

# iOS Build Script for NFC Wallet App
# This script builds the iOS app using Xcode

set -e

echo "🚀 Starting iOS build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}Error: Xcode is not installed or not in PATH${NC}"
    echo "Please install Xcode from the Mac App Store"
    exit 1
fi

echo -e "${YELLOW}Xcode found: $(xcodebuild -version)${NC}"

# Check if CocoaPods is installed
if ! command -v pod &> /dev/null; then
    echo -e "${RED}Error: CocoaPods is not installed${NC}"
    echo "Please install CocoaPods: sudo gem install cocoapods"
    exit 1
fi

echo -e "${YELLOW}CocoaPods found: $(pod --version)${NC}"

# Navigate to ios directory
cd ios

echo "📦 Installing CocoaPods dependencies..."
pod install

# Get the workspace name
WORKSPACE="nfcWalletApp.xcworkspace"
if [ ! -d "$WORKSPACE" ]; then
    echo -e "${RED}Error: $WORKSPACE not found${NC}"
    exit 1
fi

echo "🔨 Building iOS app for Debug configuration..."

# Build for iOS Simulator (Debug)
xcodebuild \
    -workspace "$WORKSPACE" \
    -scheme nfcWalletApp \
    -configuration Debug \
    -sdk iphonesimulator \
    -destination 'platform=iOS Simulator,name=iPhone 14,OS=latest' \
    build

echo "🔨 Building iOS app for Release configuration..."

# Build for iOS Device (Release)
xcodebuild \
    -workspace "$WORKSPACE" \
    -scheme nfcWalletApp \
    -configuration Release \
    -sdk iphoneos \
    -destination 'generic/platform=iOS' \
    build

# Check if build was successful
if [ -d "build/Build/Products/Debug-iphonesimulator" ]; then
    echo -e "${GREEN}✅ iOS Debug build completed successfully!${NC}"
    echo "📍 Location: ios/build/Build/Products/Debug-iphonesimulator/"
else
    echo -e "${RED}❌ iOS Debug build failed${NC}"
    exit 1
fi

if [ -d "build/Build/Products/Release-iphoneos" ]; then
    echo -e "${GREEN}✅ iOS Release build completed successfully!${NC}"
    echo "📍 Location: ios/build/Build/Products/Release-iphoneos/"
else
    echo -e "${YELLOW}⚠️  iOS Release build not found${NC}"
fi

echo -e "${GREEN}🎉 iOS build completed!${NC}"

# Optional: Create IPA for distribution
echo "📦 Creating IPA file for distribution..."
if [ -d "build/Build/Products/Release-iphoneos" ]; then
    mkdir -p build/IPA
    xcodebuild \
        -workspace "$WORKSPACE" \
        -scheme nfcWalletApp \
        -configuration Release \
        -sdk iphoneos \
        -destination 'generic/platform=iOS' \
        -archivePath "build/archives/nfcWalletApp.xcarchive" \
        archive

    xcodebuild \
        -exportArchive \
        -archivePath "build/archives/nfcWalletApp.xcarchive" \
        -exportPath "build/IPA" \
        -exportOptionsPlist "../ios-export-options.plist"

    if [ -f "build/IPA/nfcWalletApp.ipa" ]; then
        echo -e "${GREEN}✅ IPA file created successfully!${NC}"
        echo "📍 Location: ios/build/IPA/nfcWalletApp.ipa"
    fi
fi
