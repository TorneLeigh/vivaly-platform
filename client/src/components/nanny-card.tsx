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
  const profileImage = nanny.user.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240";

  return (
    <Card className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <Link href={`/nanny/${nanny.id}`}>
        <img 
          src={profileImage}
          alt={`${nanny.user.firstName} - Professional Nanny`}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
      </Link>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Link href={`/nanny/${nanny.id}`}>
            <h3 className="font-semibold text-warm-gray hover:text-coral transition-colors">
              {nanny.user.firstName} {nanny.user.lastName.charAt(0)}.
            </h3>
          </Link>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-warm-gray ml-1">{nanny.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{nanny.suburb} • {nanny.experience}+ years exp</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {nanny.isVerified && (
            <Badge variant="secondary" className="bg-soft-green bg-opacity-10 text-soft-green text-xs">
              Verified
            </Badge>
          )}
          {nanny.certificates.slice(0, 2).map((cert, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-trust-blue bg-opacity-10 text-trust-blue text-xs"
            >
              {cert}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-warm-gray">
            {formatCurrency(nanny.hourlyRate!)}/hr
          </span>
          <Link href={`/nanny/${nanny.id}`}>
            <Button variant="ghost" size="sm" className="text-coral hover:text-coral">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
