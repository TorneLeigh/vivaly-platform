import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Heart, Users2, MapPin, Clock, MessageCircle, HandHeart, 
  Baby, Coffee, ShoppingCart, Car, Home, Star 
} from "lucide-react";

const supportRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  location: z.string().min(1, "Please select your area"),
  timeNeeded: z.string().min(1, "Please select when you need help"),
  duration: z.string().min(1, "Please select duration"),
});

type SupportRequestForm = z.infer<typeof supportRequestSchema>;

const categories = [
  { value: "childcare", label: "Childcare Help", icon: Baby },
  { value: "errands", label: "Errands & Shopping", icon: ShoppingCart },
  { value: "transport", label: "Transport & Pickup", icon: Car },
  { value: "social", label: "Social Support", icon: Coffee },
  { value: "emergency", label: "Emergency Help", icon: Heart },
  { value: "household", label: "Household Tasks", icon: Home },
];

const sydneyAreas = [
  "Inner West", "Eastern Suburbs", "Northern Beaches", "North Shore",
  "Western Sydney", "South West", "South East", "CBD & City",
  "Hills District", "Sutherland Shire"
];

export default function CoSupport() {
  const [activeTab, setActiveTab] = useState<"browse" | "request" | "my-offers">("browse");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SupportRequestForm>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      timeNeeded: "",
      duration: "",
    },
  });

  // Mock data for demonstration
  const supportRequests = [
    {
      id: 1,
      title: "Need help with school pickup",
      description: "Looking for someone to pick up my 8-year-old from school on Thursdays. I can return the favor on weekends!",
      category: "transport",
      location: "Inner West",
      timeNeeded: "Thursdays 3pm",
      duration: "30 minutes",
      author: "Sarah M.",
      authorInitials: "SM",
      postedAt: "2 hours ago",
      responses: 3,
    },
    {
      id: 2,
      title: "Playdate swap - toddlers",
      description: "I have a 3-year-old and would love to arrange regular playdate swaps with another family in the area.",
      category: "childcare",
      location: "Northern Beaches",
      timeNeeded: "Weekends",
      duration: "2-3 hours",
      author: "Emma K.",
      authorInitials: "EK",
      postedAt: "5 hours ago",
      responses: 7,
    },
    {
      id: 3,
      title: "Emergency backup childcare",
      description: "Looking to connect with other moms for emergency childcare backup when our usual arrangements fall through.",
      category: "emergency",
      location: "Eastern Suburbs",
      timeNeeded: "As needed",
      duration: "Few hours",
      author: "Lisa H.",
      authorInitials: "LH",
      postedAt: "1 day ago",
      responses: 12,
    },
  ];

  const createRequestMutation = useMutation({
    mutationFn: async (data: SupportRequestForm) => {
      const response = await apiRequest("POST", "/api/support-requests", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Posted!",
        description: "Your support request has been shared with the community.",
      });
      form.reset();
      setActiveTab("browse");
      queryClient.invalidateQueries({ queryKey: ["/api/support-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post request.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SupportRequestForm) => {
    createRequestMutation.mutate(data);
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    const Icon = cat?.icon || Heart;
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.label || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-light to-white">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-3xl mx-auto">
            <Users2 className="h-16 w-16 text-coral mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-warm-gray mb-4">
              Community Co-Support
            </h1>
            <p className="text-xl text-warm-gray-light mb-6">
              Connect with local families for free mutual support. Help each other out in an intimate, trusted community.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-warm-gray-light">
              <div className="flex items-center space-x-2">
                <HandHeart className="h-5 w-5 text-coral" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-coral" />
                <span>Local Families</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-coral" />
                <span>Trusted Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={activeTab === "browse" ? "default" : "ghost"}
              onClick={() => setActiveTab("browse")}
              className="px-6"
            >
              Browse Requests
            </Button>
            <Button
              variant={activeTab === "request" ? "default" : "ghost"}
              onClick={() => setActiveTab("request")}
              className="px-6"
            >
              Post Request
            </Button>
            <Button
              variant={activeTab === "my-offers" ? "default" : "ghost"}
              onClick={() => setActiveTab("my-offers")}
              className="px-6"
            >
              My Offers
            </Button>
          </div>
        </div>

        {/* Browse Requests */}
        {activeTab === "browse" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-warm-gray">Community Requests</h2>
              <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by area" />
                  </SelectTrigger>
                  <SelectContent>
                    {sydneyAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getCategoryIcon(request.category)}
                        {getCategoryLabel(request.category)}
                      </Badge>
                      <div className="text-xs text-warm-gray-light">{request.postedAt}</div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{request.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-warm-gray-light text-sm">{request.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-coral" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-coral" />
                        <span>{request.timeNeeded} • {request.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{request.authorInitials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{request.author}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-xs text-warm-gray-light">
                          <MessageCircle className="h-4 w-4" />
                          <span>{request.responses}</span>
                        </div>
                        <Button size="sm">
                          Offer Help
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Post Request */}
        {activeTab === "request" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Request Community Support</CardTitle>
                <p className="text-warm-gray-light">
                  Describe what kind of help you need. Other families in your area can offer assistance.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What do you need help with?</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Need help with school pickup"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center gap-2">
                                    <category.icon className="h-4 w-4" />
                                    {category.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Area</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select area" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sydneyAreas.map((area) => (
                                  <SelectItem key={area} value={area}>
                                    {area}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeNeeded"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>When do you need help?</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="e.g., Weekdays 3pm"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How long?</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., 1-2 hours"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Provide more details about what you need help with and how you can return the favor..."
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={createRequestMutation.isPending}
                      className="w-full h-12"
                      size="lg"
                    >
                      {createRequestMutation.isPending ? "Posting..." : "Post Request"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Offers */}
        {activeTab === "my-offers" && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">My Support Offers</CardTitle>
                <p className="text-warm-gray-light">
                  Track the help you've offered to other families in your community.
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <HandHeart className="h-16 w-16 text-coral mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-warm-gray mb-2">No offers yet</h3>
                  <p className="text-warm-gray-light mb-6">
                    Start by offering help to families in your area. It's a great way to build community connections!
                  </p>
                  <Button onClick={() => setActiveTab("browse")}>
                    Browse Requests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-white border-t py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-3xl font-bold text-center text-warm-gray mb-12">How Co-Support Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Users2 className="h-8 w-8 text-coral" />
              </div>
              <h4 className="text-lg font-semibold text-warm-gray mb-2">Connect Locally</h4>
              <p className="text-warm-gray-light">Find families in your area who can help and who you can help in return.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
                <HandHeart className="h-8 w-8 text-coral" />
              </div>
              <h4 className="text-lg font-semibold text-warm-gray mb-2">Share Support</h4>
              <p className="text-warm-gray-light">Offer help when you can, ask for help when you need it. It's all about mutual support.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-coral" />
              </div>
              <h4 className="text-lg font-semibold text-warm-gray mb-2">Build Community</h4>
              <p className="text-warm-gray-light">Create lasting friendships and a supportive network for your family.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}