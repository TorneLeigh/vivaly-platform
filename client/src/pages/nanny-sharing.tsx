import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, Calendar, DollarSign, Plus } from "lucide-react";

interface NannyShare {
  id: string;
  creatorId: string;
  title: string;
  location: string;
  suburb: string;
  rate: string;
  schedule: string;
  startDate: string;
  endDate?: string;
  maxFamilies: number;
  childrenDetails: string;
  requirements?: string;
  nannyId?: string;
  status: string;
  participants: string[];
  createdAt: string;
  creatorProfile?: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export default function NannySharingPage() {
  const [filter, setFilter] = useState<"all" | "open" | "full">("all");

  const { data: nannyShares = [], isLoading } = useQuery<NannyShare[]>({
    queryKey: ["/api/nanny-shares"],
  });

  const filteredShares = nannyShares.filter(share => {
    if (filter === "all") return true;
    return share.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-800";
      case "full": return "bg-yellow-100 text-yellow-800";
      case "active": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nanny Sharing</h1>
          <p className="text-gray-600 max-w-2xl">
            Connect with other families to share nanny costs. Split the expense while providing quality care for your children.
          </p>
        </div>
        <Link href="/create-nanny-share">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Share
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          size="sm"
        >
          All Shares
        </Button>
        <Button
          variant={filter === "open" ? "default" : "outline"}
          onClick={() => setFilter("open")}
          size="sm"
        >
          Open
        </Button>
        <Button
          variant={filter === "full" ? "default" : "outline"}
          onClick={() => setFilter("full")}
          size="sm"
        >
          Full
        </Button>
      </div>

      {/* Shares Grid */}
      {filteredShares.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No nanny shares found</h3>
            <p className="text-gray-600 mb-4">
              {filter === "all" 
                ? "Be the first to create a nanny share in your area."
                : `No ${filter} nanny shares at the moment.`
              }
            </p>
            <Link href="/create-nanny-share">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Create First Share
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShares.map((share) => (
            <Card key={share.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">{share.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={share.creatorProfile?.profileImageUrl} />
                        <AvatarFallback>
                          {share.creatorProfile?.firstName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {share.creatorProfile?.firstName} {share.creatorProfile?.lastName}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(share.status)}>
                    {share.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{share.suburb}, {share.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{share.schedule}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>${share.rate}/hr (split between families)</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{share.participants.length}/{share.maxFamilies} families</span>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {share.childrenDetails}
                  </p>
                </div>

                <div className="pt-4">
                  <Link href={`/nanny-share/${share.id}`}>
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}