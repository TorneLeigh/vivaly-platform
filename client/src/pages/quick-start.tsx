import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Clock, MapPin, Star, Heart, Users, Baby, Clock3 } from "lucide-react";

const quickBookingOptions = [
  {
    id: 1,
    title: "Tonight Babysitter",
    description: "Available in 2 hours",
    rate: "$25/hour",
    availability: "Available now",
    rating: 4.9,
    reviews: 127,
    image: "/api/placeholder/150/150",
    badges: ["Instant Book", "Background Checked"],
    responseTime: "Responds in 15 mins"
  },
  {
    id: 2,
    title: "Weekend Nanny",
    description: "This Saturday & Sunday",
    rate: "$30/hour",
    availability: "Available this weekend",
    rating: 4.8,
    reviews: 89,
    image: "/api/placeholder/150/150",
    badges: ["Instant Book", "CPR Certified"],
    responseTime: "Responds in 10 mins"
  },
  {
    id: 3,
    title: "After School Care",
    description: "Monday to Friday 3-6pm",
    rate: "$28/hour",
    availability: "Starting next week",
    rating: 5.0,
    reviews: 203,
    image: "/api/placeholder/150/150",
    badges: ["Instant Book", "Education Background"],
    responseTime: "Responds in 5 mins"
  }
];

export default function QuickStart() {
  const [selectedService, setSelectedService] = useState("babysitter");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Quick Service Selection */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">What do you need help with?</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant={selectedService === "babysitter" ? "default" : "outline"}
            onClick={() => setSelectedService("babysitter")}
            className="flex items-center gap-2"
          >
            <Baby className="w-4 h-4" />
            Babysitter
          </Button>
          <Button
            variant={selectedService === "nanny" ? "default" : "outline"}
            onClick={() => setSelectedService("nanny")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Nanny
          </Button>
          <Button
            variant={selectedService === "eldercare" ? "default" : "outline"}
            onClick={() => setSelectedService("eldercare")}
            className="flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Elder Care
          </Button>
        </div>
      </div>

      {/* When do you need care */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">When do you need care?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-16 flex-col">
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-sm">Right now</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <Clock3 className="w-5 h-5 mb-1" />
            <span className="text-sm">Tonight</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-sm">This weekend</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <Clock3 className="w-5 h-5 mb-1" />
            <span className="text-sm">Next week</span>
          </Button>
        </div>
      </div>

      {/* Available Caregivers */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available caregivers near you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickBookingOptions.map((caregiver) => (
            <Card key={caregiver.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={caregiver.image}
                    alt={caregiver.title}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{caregiver.title}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{caregiver.rating}</span>
                      <span>({caregiver.reviews})</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{caregiver.description}</CardDescription>
                <div className="flex flex-wrap gap-2 mb-3">
                  {caregiver.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-lg">{caregiver.rate}</span>
                  <span className="text-sm text-green-600">{caregiver.availability}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">{caregiver.responseTime}</div>
                <Button className="w-full">
                  Instant Book
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Simplified Steps */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-coral text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold mb-2">Choose your caregiver</h3>
            <p className="text-sm text-gray-600">Browse verified profiles and instant book</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-coral text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold mb-2">Meet safely</h3>
            <p className="text-sm text-gray-600">All caregivers are background checked</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-coral text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold mb-2">Pay securely</h3>
            <p className="text-sm text-gray-600">Cashless payments through our platform</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Button size="lg" className="mr-4">
          <Link href="/search">Find More Caregivers</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/become-nanny">Become a Caregiver</Link>
        </Button>
      </div>
    </div>
  );
}