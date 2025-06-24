#!/bin/bash

echo "Building VIVALY mobile apps for app stores..."

# Build web assets
echo "Building web application..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync

# Copy app icons
echo "Copying app icons..."
mkdir -p ios/App/App/Assets.xcassets/AppIcon.appiconset/
mkdir -p android/app/src/main/res/mipmap-hdpi/
mkdir -p android/app/src/main/res/mipmap-mdpi/
mkdir -p android/app/src/main/res/mipmap-xhdpi/
mkdir -p android/app/src/main/res/mipmap-xxhdpi/
mkdir -p android/app/src/main/res/mipmap-xxxhdpi/

# Copy iOS icons (if they exist)
if [ -d "client/resources/ios" ]; then
    cp client/resources/ios/* ios/App/App/Assets.xcassets/AppIcon.appiconset/ 2>/dev/null || true
fi

# Copy Android icons (if they exist)
if [ -d "client/resources/android" ]; then
    cp client/resources/android/icon-48.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png 2>/dev/null || true
    cp client/resources/android/icon-72.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png 2>/dev/null || true
    cp client/resources/android/icon-96.png android/app/src/main/res/mipmap-xhdpi/ic_launcher.png 2>/dev/null || true
    cp client/resources/android/icon-144.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png 2>/dev/null || true
    cp client/resources/android/icon-192.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png 2>/dev/null || true
fi

echo "Mobile app build complete!"
echo "Next steps:"
echo "1. For iOS: npx cap open ios (requires macOS and Xcode)"
echo "2. For Android: npx cap open android (requires Android Studio)"
echo "3. Build and test on physical devices"
echo "4. Submit to app stores"