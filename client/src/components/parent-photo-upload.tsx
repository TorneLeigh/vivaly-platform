import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Camera, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParentPhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function ParentPhotoUpload({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 3 
}: ParentPhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxPhotos - photos.length;
    
    if (fileArray.length > remainingSlots) {
      toast({
        title: "Too many photos",
        description: `You can only upload ${remainingSlots} more photo(s)`,
        variant: "destructive",
      });
      return;
    }

    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = e.target?.result as string;
          onPhotosChange([...photos, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Your Photos ({photos.length}/{maxPhotos})
        </CardTitle>
        <p className="text-sm text-gray-600">
          Add photos of yourself to help caregivers recognize you. Please don't include children's faces for privacy.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Parent photo ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Upload Area */}
        {photos.length < maxPhotos && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-coral bg-coral/5"
                : "border-gray-300 hover:border-coral"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Drag photos here or click to browse
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="parent-photo-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('parent-photo-upload')?.click()}
            >
              Choose Photos
            </Button>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Photo Guidelines:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Clear, well-lit photos work best</li>
            <li>• Include photos of yourself only</li>
            <li>• Avoid including children's faces for privacy</li>
            <li>• Show yourself in different settings (home, outdoors, etc.)</li>
            <li>• Professional or casual photos are both welcome</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}