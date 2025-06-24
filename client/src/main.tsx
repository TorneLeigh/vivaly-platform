import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerSW } from "./registerSW";

// Register service worker for PWA functionality
registerSW();

createRoot(document.getElementById("root")!).render(<App />);
