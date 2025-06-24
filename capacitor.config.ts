import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vivaly.app',
  appName: 'VIVALY',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FF5F7E",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Camera: {
      permissions: {
        camera: "This app needs camera access to take profile photos",
        photos: "This app needs photo library access to select profile images"
      }
    },
    Geolocation: {
      permissions: {
        location: "This app needs location access to find nearby caregivers"
      }
    }
  }
};

export default config;
