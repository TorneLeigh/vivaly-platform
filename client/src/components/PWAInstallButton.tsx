import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // Show different UI for iOS vs Android
  if (isIOS) {
    return (
      <div className="bg-gradient-to-r from-[#FF5F7E]/10 to-[#FFA24D]/10 border border-[#FF5F7E]/20 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] rounded-full flex items-center justify-center shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Get the VIVALY App</h3>
            <p className="text-sm text-gray-600 mb-3">
              Install our app for the best experience with faster booking and notifications
            </p>
            <div className="flex items-center text-xs text-[#FF5F7E] font-medium">
              <span className="mr-2">📱 Tap Share</span>
              <span className="mr-2">→</span>
              <span>"Add to Home Screen"</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show install button for Android/other browsers
  if (deferredPrompt) {
    return (
      <div className="bg-gradient-to-r from-[#FF5F7E]/10 to-[#FFA24D]/10 border border-[#FF5F7E]/20 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] rounded-full flex items-center justify-center shadow-lg">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Get the VIVALY App</h3>
            <p className="text-sm text-gray-600 mb-4">
              Install our app for faster booking, push notifications, and offline access
            </p>
            <Button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] hover:from-[#e54c6b] hover:to-[#e8941f] text-white px-6 py-2 rounded-lg font-medium shadow-md"
            >
              Install Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show generic install message for browsers that support PWA but don't have the prompt
  return (
    <div className="bg-gradient-to-r from-[#FF5F7E]/10 to-[#FFA24D]/10 border border-[#FF5F7E]/20 rounded-xl p-6 mb-6 shadow-sm max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-[#FF5F7E] to-[#FFA24D] rounded-full flex items-center justify-center shadow-lg">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Get the VIVALY App</h3>
          <p className="text-sm text-gray-600">
            For the best experience, install our app
          </p>
        </div>
      </div>
    </div>
  );
}