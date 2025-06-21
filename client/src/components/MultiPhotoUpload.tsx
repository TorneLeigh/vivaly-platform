import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Star, Camera } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  isMain?: boolean;
  originalName?: string;
}

interface MultiPhotoUploadProps {
  photos: Photo[];
  onPhotosChange: () => void;
  maxPhotos?: number;
  className?: string;
}

export function MultiPhotoUpload({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 10,
  className = ""
}: MultiPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these photos would exceed the limit
    if (photos.length + files.length > maxPhotos) {
      toast({
        title: "Too many photos",
        description: `You can only have up to ${maxPhotos} photos. Current: ${photos.length}`,
        variant: "destructive"
      });
      return;
    }

    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validFiles = Array.from(files).filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name}: Please upload JPG, PNG, GIF, or WebP images only`,
          variant: "destructive"
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name}: Maximum size is 5MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append("photos", file);
      });

      const response = await fetch("/api/upload-profile-photos", {
        method: "POST",
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload photos");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: data.message || `${data.photos.length} photo(s) uploaded successfully!`,
      });

      if (data.skipped > 0) {
        toast({
          title: "Some files skipped",
          description: `${data.skipped} file(s) were skipped due to validation errors`,
          variant: "destructive"
        });
      }

      onPhotosChange();
      e.target.value = '';
    } catch (error: any) {
      console.error("Photo upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/profile-photos/${photoId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });

      onPhotosChange();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete photo",
        variant: "destructive"
      });
    }
  };

  const handleSetMainPhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/profile-photos/${photoId}/main`, {
        method: "PUT",
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to set main photo");
      }

      toast({
        title: "Success",
        description: "Main photo updated successfully",
      });

      onPhotosChange();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update main photo",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden relative group">
            <img 
              src={photo.url} 
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Photo overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                {!photo.isMain && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSetMainPhoto(photo.id)}
                    className="text-xs h-8"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Main
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="text-xs h-8"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Main photo badge */}
            {photo.isMain && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-coral text-white text-xs">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Main
                </Badge>
              </div>
            )}
          </div>
        ))}
        
        {/* Add photos button */}
        {photos.length < maxPhotos && (
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors">
            <label htmlFor="photo-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
              <div className="text-center">
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral mx-auto mb-2"></div>
                ) : (
                  <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                )}
                <p className="text-sm text-gray-500 px-2">
                  {uploading ? "Uploading..." : "Add Photos"}
                </p>
              </div>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handlePhotoUpload}
              disabled={uploading}
              multiple
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Upload guidelines */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Photo Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700">
          <div>
            <p>• Select multiple photos at once</p>
            <p>• Maximum {maxPhotos} photos total</p>
            <p>• Click star icon to set main photo</p>
          </div>
          <div>
            <p>• Maximum 5MB per photo</p>
            <p>• JPG, PNG, GIF, WebP formats</p>
            <p>• Clear, well-lit photos work best</p>
          </div>
        </div>
      </div>
    </div>
  );
}