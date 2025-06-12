import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-6">
            About VIVALY
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Created by a Mom, for families who understand that raising children truly takes a village
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  VIVALY was founded by a dedicated mom who understands the challenges of finding trusted care. 
                  She built this platform to connect parents with caregivers who provide compassionate, reliable support.
                </p>
                <p>
                  Our mission is to make childcare and caregiver booking seamless, safe, and convenient for busy families.
                  We believe every family deserves access to quality care that gives them peace of mind.
                </p>
                <p>
                  What started as a personal need became a community solution. Today, VIVALY serves families across Australia, 
                  creating meaningful connections between parents and trusted caregivers.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-coral rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-white" size={32} />
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "Every parent deserves the confidence that comes with knowing their loved ones are in caring, capable hands."
                </blockquote>
                <cite className="text-sm font-medium text-gray-900">- VIVALY Founder</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive background checks and verification ensure your family's safety is our top priority.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                Building meaningful connections between families and caregivers in your local community.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Compassion</h3>
              <p className="text-gray-600 text-sm">
                Every interaction is guided by empathy, understanding, and genuine care for your family's needs.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-xl p-6 shadow-sm">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-orange-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reliability</h3>
              <p className="text-gray-600 text-sm">
                Consistent, dependable service that you can count on, whenever you need support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Our Mission
          </h2>
          <div className="bg-gradient-to-r from-coral to-pink-500 rounded-2xl p-8 text-white">
            <p className="text-xl leading-relaxed mb-6">
              To empower families with access to trusted, verified caregivers while creating meaningful 
              employment opportunities for compassionate professionals in the care industry.
            </p>
            <p className="text-lg opacity-90">
              Because every family deserves the peace of mind that comes with exceptional care.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join the VIVALY Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're a family seeking care or a caregiver looking to make a difference, 
            we're here to help you connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Find Care
              </Button>
            </Link>
            <Link href="/become-caregiver">
              <Button variant="outline" className="border-black text-black hover:bg-gray-50 px-8 py-3">
                Become a Caregiver
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}