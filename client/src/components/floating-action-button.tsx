import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Calendar, Search, X } from "lucide-react";
import { Link } from "wouter";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Search,
      label: "Find Caregiver",
      href: "/search",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      icon: Calendar,
      label: "Quick Book",
      href: "/quick-start",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: MessageCircle,
      label: "Get Help",
      href: "/support",
      color: "bg-blue-500 hover:bg-blue-600"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Items */}
      <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link key={index} href={action.href}>
              <Button
                className={`${action.color} text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center`}
                onClick={() => setIsOpen(false)}
              >
                <IconComponent className="w-6 h-6" />
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Main FAB */}
      <Button
        className={`bg-orange-500 hover:bg-orange-600 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'rotate-45' : 'hover:-translate-y-1'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
      </Button>
    </div>
  );
}