#!/bin/bash

# Android Build Script for NFC Wallet App
# This script builds the Android APK using Gradle

set -e

echo "🚀 Starting Android build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Android SDK is configured
if [ ! -d "$ANDROID_HOME" ]; then
    echo -e "${RED}Error: ANDROID_HOME is not set or Android SDK is not installed${NC}"
    echo "Please install Android SDK and set ANDROID_HOME environment variable"
    exit 1
fi

echo -e "${YELLOW}Android SDK found at: $ANDROID_HOME${NC}"

# Navigate to android directory
cd android

echo "📦 Cleaning previous build..."
./gradlew clean

echo "🔨 Building debug APK..."
./gradlew assembleDebug

echo "🔨 Building release APK..."
./gradlew assembleRelease

# Check if build was successful
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo -e "${GREEN}✅ Debug APK built successfully!${NC}"
    echo "📍 Location: android/app/build/outputs/apk/debug/app-debug.apk"
else
    echo -e "${RED}❌ Debug APK build failed${NC}"
    exit 1
fi

if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo -e "${GREEN}✅ Release APK built successfully!${NC}"
    echo "📍 Location: android/app/build/outputs/apk/release/app-release.apk"
else
    echo -e "${YELLOW}⚠️  Release APK not found (may require signing configuration)${NC}"
fi

echo -e "${GREEN}🎉 Android build completed!${NC}"
