import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Heart, Baby, Clock, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const giftCardSchema = z.object({
  amount: z.string().min(1, "Please select an amount"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Please enter a valid email"),
  senderName: z.string().min(1, "Your name is required"),
  message: z.string().max(500, "Message must be under 500 characters"),
  deliveryDate: z.string().optional(),
});

type GiftCardFormData = z.infer<typeof giftCardSchema>;

const giftCardAmounts = [
  { value: "50", label: "$50" },
  { value: "100", label: "$100" },
  { value: "150", label: "$150" },
  { value: "200", label: "$200" },
  { value: "300", label: "$300" },
  { value: "500", label: "$500" },
];

const giftCardColors = [
  {
    id: "blue",
    name: "Blue",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "grey",
    name: "Grey", 
    gradient: "from-gray-500 to-gray-600",
  },
  {
    id: "pink",
    name: "Pink",
    gradient: "from-pink-500 to-pink-600",
  }
];

export default function GiftCards() {
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedAmount, setSelectedAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");

  const form = useForm<GiftCardFormData>({
    resolver: zodResolver(giftCardSchema),
    defaultValues: {
      amount: "100",
      recipientName: "",
      recipientEmail: "",
      senderName: "",
      message: "",
      deliveryDate: "",
    },
  });

  const onSubmit = async (data: GiftCardFormData) => {
    // Redirect to checkout with gift card data
    const params = new URLSearchParams({
      amount: data.amount.toString(),
      serviceType: 'Gift Card',
      recipientEmail: data.recipientEmail,
      message: data.message || '',
      isGiftCard: 'true'
    });
    
    window.location.href = `/gift-card-checkout?${params.toString()}`;
  };

  const selectedColorData = giftCardColors.find(c => c.id === selectedColor);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-coral to-pink-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Gift className="w-12 h-12 text-white mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-3 drop-shadow-lg">
            Give the Gift of Care
          </h1>
          <p className="text-lg text-black opacity-90 max-w-2xl mx-auto drop-shadow-md">
            Help families find trusted childcare with VIVALY gift cards. Perfect for baby showers, new parents, or anyone who needs quality care.
          </p>
        </div>
      </section>

      {/* Gift Card Builder */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Gift Card Preview */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Preview Your Gift Card</h2>
                
                {/* Gift Card Visual */}
                <div className="relative">
                  <div className={`w-full h-64 bg-gradient-to-br ${selectedColorData?.gradient} rounded-2xl p-8 text-white relative overflow-hidden shadow-xl`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
                      <div className="absolute top-8 right-8 w-6 h-6 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-8 left-8 w-4 h-4 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-white rounded-full"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Gift className="w-6 h-6" />
                          <span className="font-semibold">VIVALY</span>
                        </div>
                        <Gift className="w-6 h-6" />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">
                          ${customAmount || selectedAmount}
                        </div>
                        <div className="text-sm opacity-90">Gift Card</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm opacity-90">The gift of care</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Color</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {giftCardColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedColor === color.id
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${color.gradient} rounded-lg flex items-center justify-center`}>
                            <Gift className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{color.name}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Card Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gift Card Details</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base font-medium">Select Amount</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {giftCardAmounts.map((amount) => (
                        <button
                          key={amount.value}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amount.value);
                            setCustomAmount("");
                            form.setValue("amount", amount.value);
                          }}
                          className={`p-3 rounded-lg border-2 font-medium transition-all ${
                            selectedAmount === amount.value && !customAmount
                              ? "border-black bg-black text-white"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {amount.label}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      <Label htmlFor="custom-amount" className="text-sm text-gray-600">Or enter custom amount</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount("");
                          form.setValue("amount", e.target.value);
                        }}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter recipient's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="recipientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter recipient's email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Sender Details */}
                  <FormField
                    control={form.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Personal Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add a personal message..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Delivery Date */}
                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Date (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Purchase Button */}
                  <Button
                    type="submit"
                    className="w-full bg-coral hover:bg-coral/90 text-white py-4 text-lg font-semibold rounded-lg"
                    size="lg"
                  >
                    Purchase Gift Card - ${customAmount || selectedAmount}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>



      {/* Perfect For Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect Gift For</h2>
            <p className="text-lg text-gray-600">Show you care with the gift of trusted childcare</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "New Parents", description: "Help new families with quality childcare support", icon: "👶" },
              { title: "Baby Showers", description: "A thoughtful gift that keeps on giving", icon: "🎁" },
              { title: "Working Parents", description: "Give them peace of mind and flexibility", icon: "💼" },
              { title: "Special Occasions", description: "Birthdays, holidays, or just because", icon: "🎉" }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}