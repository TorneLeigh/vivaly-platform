import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Nanny, User } from "@shared/schema";

interface NannyCardProps {
  nanny: Nanny & { user: User };
}

export default function NannyCard({ nanny }: NannyCardProps) {
  const profileImage = nanny.user.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200";

  return (
    <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden">
      <Link href={`/nanny/${nanny.id}`}>
        <div className="relative">
          <img 
            src={profileImage}
            alt={`${nanny.user.firstName} - Professional Caregiver`}
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 right-2 flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-medium ml-1">{nanny.rating}</span>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/nanny/${nanny.id}`}>
          <h3 className="font-semibold text-warm-gray hover:text-coral transition-colors text-sm mb-1">
            {nanny.user.firstName} {nanny.user.lastName.charAt(0)}.
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-500 text-xs mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{nanny.suburb}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {nanny.isVerified && (
            <Badge variant="secondary" className="bg-soft-green bg-opacity-10 text-soft-green text-xs px-1.5 py-0.5">
              Verified
            </Badge>
          )}
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5">
            {nanny.experience}+ yrs
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-warm-gray text-sm">
            {formatCurrency(nanny.hourlyRate!)}/hr
          </span>
          <Link href={`/nanny/${nanny.id}`}>
            <Button variant="ghost" size="sm" className="text-coral hover:text-coral text-xs px-2 py-1 h-auto">
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
