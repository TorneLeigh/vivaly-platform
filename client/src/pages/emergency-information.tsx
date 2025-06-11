import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Heart,
  Shield,
  Ambulance,
  Building2,
  Navigation,
  Info
} from "lucide-react";

export default function EmergencyInformation() {
  const emergencyNumbers = [
    {
      service: "Police, Fire, Ambulance",
      number: "000",
      description: "Life-threatening emergencies only",
      icon: AlertTriangle,
      priority: "urgent"
    },
    {
      service: "Police Assistance Line",
      number: "131 444",
      description: "Non-urgent police matters",
      icon: Shield,
      priority: "normal"
    },
    {
      service: "Poison Information Centre",
      number: "13 11 26",
      description: "24/7 poison emergency advice",
      icon: Heart,
      priority: "urgent"
    },
    {
      service: "Health Direct",
      number: "1800 022 222",
      description: "24/7 health advice and nurse triage",
      icon: Ambulance,
      priority: "normal"
    }
  ];

  const sydneyHospitals = [
    {
      name: "Sydney Children's Hospital, Randwick",
      address: "High St, Randwick NSW 2031",
      phone: "(02) 9382 1111",
      emergency: "24/7 Emergency Department",
      speciality: "Paediatric Emergency"
    },
    {
      name: "The Children's Hospital at Westmead",
      address: "Cnr Hawkesbury Rd & Hainsworth St, Westmead NSW 2145",
      phone: "(02) 9845 0000",
      emergency: "24/7 Emergency Department",
      speciality: "Paediatric Emergency"
    },
    {
      name: "Royal Prince Alfred Hospital",
      address: "50 Missenden Rd, Camperdown NSW 2050",
      phone: "(02) 9515 6111",
      emergency: "24/7 Emergency Department",
      speciality: "General Emergency"
    },
    {
      name: "Royal North Shore Hospital",
      address: "Reserve Rd, St Leonards NSW 2065",
      phone: "(02) 9926 7111",
      emergency: "24/7 Emergency Department",
      speciality: "General Emergency"
    },
    {
      name: "St Vincent's Hospital",
      address: "390 Victoria St, Darlinghurst NSW 2010",
      phone: "(02) 8382 1111",
      emergency: "24/7 Emergency Department",
      speciality: "General Emergency"
    }
  ];

  const policeStations = [
    {
      area: "Sydney City",
      station: "Sydney City Police Station",
      address: "192 Day St, Sydney NSW 2000",
      phone: "(02) 9265 6499"
    },
    {
      area: "Eastern Suburbs",
      station: "Waverley Police Station",
      address: "15 Henrietta St, Waverley NSW 2024",
      phone: "(02) 9369 9899"
    },
    {
      area: "Northern Beaches",
      station: "Dee Why Police Station",
      address: "1-5 Redman Rd, Dee Why NSW 2099",
      phone: "(02) 9971 3399"
    },
    {
      area: "Inner West",
      station: "Leichhardt Police Station",
      address: "86 Balmain Rd, Leichhardt NSW 2040",
      phone: "(02) 9550 8199"
    },
    {
      area: "Western Sydney",
      station: "Parramatta Police Station",
      address: "1 Marsden St, Parramatta NSW 2150",
      phone: "(02) 9633 0699"
    }
  ];

  const emergencyProtocols = [
    {
      situation: "Child Injury",
      steps: [
        "Assess the situation - ensure your safety first",
        "Call 000 if life-threatening, otherwise seek medical advice",
        "Provide first aid if trained and safe to do so",
        "Contact child's parents/guardians immediately",
        "Document the incident with date, time, and details"
      ]
    },
    {
      situation: "Child Missing",
      steps: [
        "Call 000 immediately - do not wait",
        "Search immediate area systematically",
        "Contact child's parents/guardians",
        "Gather information: what child was wearing, last seen location",
        "Cooperate fully with police response"
      ]
    },
    {
      situation: "Medical Emergency",
      steps: [
        "Call 000 for ambulance",
        "Follow dispatcher instructions for emergency care",
        "Contact child's parents/guardians",
        "Gather child's medical information if available",
        "Stay with child until emergency services arrive"
      ]
    },
    {
      situation: "Severe Weather",
      steps: [
        "Move children to safest location in building",
        "Contact parents about pickup if evacuation needed",
        "Monitor emergency broadcasts",
        "Have emergency supplies accessible",
        "Follow local evacuation orders if issued"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold">Emergency Information</h1>
            </div>
            <p className="text-xl text-red-100">
              Essential emergency contacts and procedures for childcare situations
            </p>
            <div className="mt-4 p-3 bg-red-700 rounded-lg">
              <p className="font-semibold">IN CASE OF EMERGENCY: CALL 000</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Emergency Numbers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Contact Numbers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyNumbers.map((emergency, index) => {
                const IconComponent = emergency.icon;
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      emergency.priority === 'urgent' 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`h-6 w-6 mt-1 ${
                        emergency.priority === 'urgent' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{emergency.service}</h3>
                        <p className={`text-2xl font-bold ${
                          emergency.priority === 'urgent' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {emergency.number}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{emergency.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Protocols */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Emergency Response Protocols
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {emergencyProtocols.map((protocol, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{protocol.situation}</h3>
                  <ol className="space-y-2">
                    {protocol.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {stepIndex + 1}
                        </span>
                        <span className="text-sm text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sydney Hospitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Sydney Emergency Hospitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sydneyHospitals.map((hospital, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">{hospital.address}</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">{hospital.phone}</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">{hospital.emergency}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={hospital.speciality === 'Paediatric Emergency' ? 'default' : 'secondary'}
                      className="ml-4"
                    >
                      {hospital.speciality}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Police Stations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Sydney Police Stations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policeStations.map((station, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2">{station.area}</Badge>
                    <h3 className="font-semibold text-gray-900">{station.station}</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">{station.address}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">{station.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Important Safety Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Before an Emergency</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Always have emergency contact information readily available</li>
                <li>• Know the child's medical conditions, allergies, and medications</li>
                <li>• Familiarize yourself with nearest hospital and police station</li>
                <li>• Keep a basic first aid kit accessible and know how to use it</li>
                <li>• Have the child's parents' contact details in multiple locations</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">When Calling Emergency Services</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Stay calm and speak clearly</li>
                <li>• Provide your exact location with street address</li>
                <li>• Describe the emergency and current condition of the child</li>
                <li>• Follow the dispatcher's instructions exactly</li>
                <li>• Do not hang up until told to do so</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">After an Emergency</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Document all details of the incident immediately</li>
                <li>• Notify VIVALY platform of any serious incidents</li>
                <li>• Follow up with parents and medical professionals as needed</li>
                <li>• Consider counseling support if traumatic event occurred</li>
                <li>• Review and update emergency procedures based on experience</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>This information is provided for emergency reference only.</p>
          <p>In a life-threatening emergency, always call 000 immediately.</p>
          <p className="mt-2">Last updated: June 2025</p>
        </div>
      </div>
    </div>
  );
}