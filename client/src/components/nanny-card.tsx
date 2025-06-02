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
        <div className="relative mb-3">
          <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden">
            <div className="h-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-600">
                  {nanny.user.firstName[0]}{nanny.user.lastName[0]}
                </span>
              </div>
            </div>
          </div>
          {nanny.isVerified && (
            <div className="absolute top-2 right-2">
              <div className="bg-white rounded-full p-1 shadow-sm">
                <Star className="w-4 h-4 text-soft-green fill-current" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          {/* Location and Rating */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">{nanny.suburb}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{nanny.rating}</span>
            </div>
          </div>

          {/* Name */}
          <p className="text-sm text-gray-600 truncate">
            {nanny.user.firstName} {nanny.user.lastName}
          </p>

          {/* Service */}
          <p className="text-sm text-gray-500 truncate">
            {nanny.services?.[0] || 'Care provider'}
          </p>

          {/* Price */}
          <p className="text-sm">
            <span className="font-semibold text-gray-900">${nanny.hourlyRate}</span>
            <span className="text-gray-500"> /hour</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
