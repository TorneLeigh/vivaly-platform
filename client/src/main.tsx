import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerSW } from "./registerSW";
import { initializePushNotifications, isNative } from "./native/capacitor";

// Register service worker for PWA functionality (web only)
if (!isNative()) {
  registerSW();
}

// Initialize native features for mobile app
if (isNative()) {
  initializePushNotifications();
}

createRoot(document.getElementById("root")!).render(<App />);
