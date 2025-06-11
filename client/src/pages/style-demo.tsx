import RoleToggle from "@/components/role-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StyleDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Vivaly Styling */}
      <header className="vivaly-header">
        <div className="vivaly-logo">VIVALY</div>
        <RoleToggle variant="vivaly" />
      </header>

      {/* Content Area */}
      <div className="vivaly-content">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Style Demonstration
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Showcasing the integrated CSS styling with VIVALY platform components
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Original Tailwind Styling */}
            <Card>
              <CardHeader>
                <CardTitle>Default VIVALY Style</CardTitle>
                <CardDescription>Using Tailwind CSS with custom design system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RoleToggle variant="default" />
                <div className="space-y-2">
                  <Button className="w-full">Primary Button</Button>
                  <Button variant="outline" className="w-full">Secondary Button</Button>
                </div>
                <div className="p-4 bg-coral/10 border border-coral/20 rounded-lg">
                  <p className="text-coral font-medium">VIVALY Coral Accent</p>
                </div>
              </CardContent>
            </Card>

            {/* New CSS Styling */}
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Vivaly Style</CardTitle>
                <CardDescription>Using your custom CSS components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RoleToggle variant="vivaly" />
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Styled Button
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    Outlined Button
                  </button>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-600 font-medium">Custom Blue Accent</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Switch Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Role Toggle Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of different toggle styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Default Style</h3>
                  <div className="p-4 bg-gray-50 rounded-lg flex justify-center">
                    <RoleToggle variant="default" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Vivaly Style</h3>
                  <div className="p-4 bg-gray-50 rounded-lg flex justify-center">
                    <RoleToggle variant="vivaly" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CSS Classes Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Available CSS Classes</CardTitle>
              <CardDescription>Custom CSS classes that were integrated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-white border rounded-lg text-center">
                    <div className="w-4 h-4 bg-blue-600 rounded mx-auto mb-2"></div>
                    <code>.vivaly-logo</code>
                  </div>
                  <div className="p-3 bg-white border rounded-lg text-center">
                    <div className="w-4 h-4 bg-gray-300 rounded mx-auto mb-2"></div>
                    <code>.vivaly-header</code>
                  </div>
                  <div className="p-3 bg-white border rounded-lg text-center">
                    <div className="w-4 h-4 bg-gray-400 rounded mx-auto mb-2"></div>
                    <code>.vivaly-switch</code>
                  </div>
                  <div className="p-3 bg-white border rounded-lg text-center">
                    <div className="w-4 h-4 bg-gray-500 rounded mx-auto mb-2"></div>
                    <code>.vivaly-content</code>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Integration Notes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• CSS styles integrated as Tailwind components using @layer</li>
                    <li>• Role toggle component enhanced with variant support</li>
                    <li>• Maintains compatibility with existing VIVALY design system</li>
                    <li>• Smooth transitions and accessibility preserved</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}