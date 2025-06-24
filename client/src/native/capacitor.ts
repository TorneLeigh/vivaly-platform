import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const isNative = () => Capacitor.isNativePlatform();

export const takePicture = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // Allows user to choose camera or gallery
    });
    return image.dataUrl;
  } catch (error) {
    console.error('Error taking picture:', error);
    throw error;
  }
};

export const getCurrentPosition = async () => {
  try {
    const coordinates = await Geolocation.getCurrentPosition();
    return {
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

export const requestPushPermissions = async () => {
  try {
    const result = await PushNotifications.requestPermissions();
    if (result.receive === 'granted') {
      await PushNotifications.register();
    }
    return result;
  } catch (error) {
    console.error('Error requesting push permissions:', error);
    throw error;
  }
};

export const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Light) => {
  try {
    await Haptics.impact({ style });
  } catch (error) {
    console.error('Error with haptic feedback:', error);
  }
};

// Initialize push notifications for native app
export const initializePushNotifications = () => {
  if (!isNative()) return;

  PushNotifications.addListener('registration', (token) => {
    console.log('Push registration success, token: ' + token.value);
    // Send token to your backend to store for sending notifications
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.error('Registration error: ', error);
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push notification received: ', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
};