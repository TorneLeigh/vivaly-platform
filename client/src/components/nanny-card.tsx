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
  return (
    <Link href={`/nanny/${nanny.id}`}>
      <div className="group cursor-pointer">
        {/* Profile Image */}
        <div className="relative mb-2">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden sm:rounded-xl">
            {nanny.user.profileImage ? (
              <img 
                src={`/attached_assets/${nanny.user.profileImage}`}
                alt={`${nanny.user.firstName} ${nanny.user.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-lg font-semibold text-gray-700">
                    {nanny.user.firstName[0]}{nanny.user.lastName[0]}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-1 right-1 flex flex-col gap-1">
            {nanny.isVerified && (
              <div className="bg-white rounded-full p-0.5 shadow-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 fill-current" />
              </div>
            )}
          </div>
          
          {/* Short Notice Badge */}
          {nanny.id % 3 === 0 && (
            <div className="absolute top-1 left-1">
              <div className="bg-black text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
                Available today
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-0.5 sm:space-y-1">
          {/* Location and Rating */}
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{nanny.suburb}</p>
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm font-medium">{nanny.rating}</span>
            </div>
          </div>

          {/* Name */}
          <p className="text-xs sm:text-sm text-gray-600 truncate">
            {nanny.user.firstName} {nanny.user.lastName}
          </p>

          {/* Service */}
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            {nanny.services?.[0] || 'Care provider'}
          </p>

          {/* Price */}
          <p className="text-xs sm:text-sm">
            <span className="font-semibold text-gray-900">${nanny.hourlyRate}</span>
            <span className="text-gray-500"> /hour</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
