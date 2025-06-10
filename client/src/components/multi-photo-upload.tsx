import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Upload, X, AlertCircle, CheckCircle } from "lucide-react";

interface MultiPhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  guidanceAccepted: boolean;
  onGuidanceAccept: (accepted: boolean) => void;
  minPhotos?: number;
  maxPhotos?: number;
}

export default function MultiPhotoUpload({ 
  photos, 
  onPhotosChange, 
  guidanceAccepted,
  onGuidanceAccept,
  minPhotos = 3, 
  maxPhotos = 8 
}: MultiPhotoUploadProps) {
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newErrors: string[] = [];
    
    if (photos.length + files.length > maxPhotos) {
      newErrors.push(`Maximum ${maxPhotos} photos allowed`);
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        newErrors.push(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.push(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setUploadErrors(newErrors);

    if (validFiles.length > 0) {
      const newPhotoUrls = await Promise.all(
        validFiles.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        })
      );
      
      onPhotosChange([...photos, ...newPhotoUrls].slice(0, maxPhotos));
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const photoGuidelines = [
    "Photos must be professional, bright, and clear",
    "Include photos of you actively caring for children, elderly, or pets",
    "Ensure you have permission to post photos with other people's children",
    "No selfies or casual photos - this is your professional profile",
    "Show your caring environment and any relevant certifications",
    "Good lighting and high resolution preferred"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Professional Photos ({photos.length}/{maxPhotos})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo Guidelines */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-semibold">Professional Photo Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {photoGuidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                ))}
              </ul>
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox 
                  id="photo-guidance"
                  checked={guidanceAccepted}
                  onCheckedChange={onGuidanceAccept}
                />
                <label htmlFor="photo-guidance" className="text-sm font-medium">
                  I understand and agree to follow these professional photo guidelines
                </label>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Upload Status */}
        {photos.length < minPhotos && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need at least {minPhotos} professional photos to complete your profile
            </AlertDescription>
          </Alert>
        )}

        {photos.length >= minPhotos && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Great! You have enough photos. You can add up to {maxPhotos - photos.length} more.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Messages */}
        {uploadErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {uploadErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={!guidanceAccepted || photos.length >= maxPhotos}
            className="w-full max-w-md"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Professional Photos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Professional photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Main Photo
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Photo Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Tips for Great Photos:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use natural lighting whenever possible</li>
            <li>• Show yourself actively engaged with children/elderly/pets</li>
            <li>• Include any relevant certificates or qualifications</li>
            <li>• Smile naturally and look professional</li>
            <li>• Ensure background is clean and appropriate</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}