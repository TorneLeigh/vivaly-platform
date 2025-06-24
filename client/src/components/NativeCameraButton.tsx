import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { takePicture, isNative, hapticFeedback } from '@/native/capacitor';
import { ImpactStyle } from '@capacitor/haptics';

interface NativeCameraButtonProps {
  onImageSelected: (imageDataUrl: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function NativeCameraButton({ 
  onImageSelected, 
  disabled = false,
  children 
}: NativeCameraButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleTakePicture = async () => {
    try {
      setIsLoading(true);
      
      // Haptic feedback for native apps
      if (isNative()) {
        await hapticFeedback(ImpactStyle.Light);
      }
      
      const imageDataUrl = await takePicture();
      if (imageDataUrl) {
        onImageSelected(imageDataUrl);
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // For web browsers, fall back to regular file input
  const handleWebUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onImageSelected(result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleClick = () => {
    if (isNative()) {
      handleTakePicture();
    } else {
      handleWebUpload();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Camera className="w-4 h-4" />
      {children || (isLoading ? 'Taking Photo...' : isNative() ? 'Take Photo' : 'Upload Photo')}
    </Button>
  );
}