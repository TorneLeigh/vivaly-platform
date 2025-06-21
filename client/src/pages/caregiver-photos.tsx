import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MultiPhotoUpload } from "@/components/MultiPhotoUpload";
import { Camera } from "lucide-react";

export default function CaregiverPhotos() {
  const { user } = useAuth();

  // Fetch user's profile photos
  const { data: photos = [], refetch: refetchPhotos } = useQuery({
    queryKey: ['/api/profile-photos'],
    queryFn: () => apiRequest('GET', '/api/profile-photos'),
    enabled: !!user
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Photos</h1>
          <p className="text-gray-600">
            Add multiple photos to showcase yourself to families. Professional photos help build trust and attract more opportunities.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Your Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MultiPhotoUpload 
              photos={photos}
              onPhotosChange={refetchPhotos}
              maxPhotos={10}
            />
          </CardContent>
        </Card>

        {/* Photo Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Photo Tips for Caregivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 text-coral">What to Include</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Professional headshot as main photo</li>
                  <li>• Photos showing you with children (if permitted)</li>
                  <li>• Activity photos (cooking, reading, playing)</li>
                  <li>• Outdoor photos showing active lifestyle</li>
                  <li>• Clear, well-lit, recent photos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-coral">What to Avoid</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Blurry or dark photos</li>
                  <li>• Group photos where you're hard to identify</li>
                  <li>• Inappropriate or party photos</li>
                  <li>• Photos with personal information visible</li>
                  <li>• Heavily filtered or edited photos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}