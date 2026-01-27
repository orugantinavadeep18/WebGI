import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Wind,
  Utensils,
  Car,
  Shield,
  Dumbbell,
  Zap,
  Users,
  CheckCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrustScore } from "@/components/trust/TrustBadge";
import TrustBadge from "@/components/trust/TrustBadge";
import BookingModal from "@/components/property/BookingModal";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

// Import demo images
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const amenityIcons = {
  wifi: Wifi,
  ac: Wind,
  food: Utensils,
  parking: Car,
  security: Shield,
  gym: Dumbbell,
  "power backup": Zap,
};

// Demo property data
const demoProperty = {
  id: "demo-1",
  name: "Sunrise Student Hostel",
  property_type: "hostel",
  description: `Welcome to Sunrise Student Hostel - your home away from home! Located in the heart of Koramangala, one of Bangalore's most vibrant neighborhoods, we offer the perfect blend of comfort, convenience, and community for students and young professionals.

Our hostel features modern amenities, spacious rooms, and a welcoming atmosphere that makes it easy to focus on your studies while building lasting friendships. With 24/7 security, housekeeping services, and nutritious meals, you can concentrate on what matters most.

Nearby landmarks include Forum Mall, Christ University, and several IT parks. Public transport options are abundant with metro stations and bus stops within walking distance.`,
  city: "Bangalore",
  state: "Karnataka",
  address: "Koramangala 5th Block, Near Forum Mall",
  pincode: "560095",
  price_per_month: 8000,
  security_deposit: 16000,
  gender_preference: "male",
  amenities: ["WiFi", "AC", "Food", "Laundry", "Parking", "Security", "Power Backup"],
  rules: [
    "No smoking inside the premises",
    "Visitors allowed only in common areas",
    "Gate closes at 11 PM",
    "Maintain cleanliness in shared spaces",
    "Prior notice required for late entry",
  ],
  images: [property1, property2, property3],
  total_beds: 20,
  available_beds: 5,
};

const demoVerification = {
  document_verified: true,
  document_verified_at: "2025-12-15",
  owner_verified: true,
  owner_verified_at: "2025-12-10",
  property_inspected: true,
  property_inspected_at: "2025-12-20",
  safety_certified: false,
  safety_certified_at: null,
  trust_score: 80,
  verification_notes: "All documents verified. Property inspection completed with satisfactory results.",
};

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const property = demoProperty;
  const verification = demoVerification;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleSave = () => {
    if (!user) {
      toast.error("Please sign in to save properties");
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Added to saved properties");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please sign in to book");
      return;
    }
    setIsBookingModalOpen(true);
  };

  const propertyTypeLabels = {
    hostel: "Hostel",
    pg: "PG",
    rental_room: "Rental Room",
    flat: "Flat",
  };

  const genderLabels = {
    male: "Boys Only",
    female: "Girls Only",
    any: "Co-ed",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-foreground">Properties</Link>
          <span>/</span>
          <span className="text-foreground">{property.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <img
                src={typeof property.images[currentImageIndex] === 'string' 
                  ? property.images[currentImageIndex] 
                  : property.images[currentImageIndex].url}
                alt={property.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-background w-6"
                        : "bg-background/60"
                    }`}
                  />
                ))}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-primary/90 text-primary-foreground">
                  {propertyTypeLabels[property.property_type]}
                </Badge>
                <Badge variant="secondary">
                  {genderLabels[property.gender_preference]}
                </Badge>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-heading text-3xl font-bold">
                    {property.name}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {property.address}, {property.city}, {property.state} - {property.pincode}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className={isSaved ? "text-destructive" : ""}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4">
                <TrustScore score={verification.trust_score} size="lg" />
                <div className="flex flex-wrap gap-2">
                  <TrustBadge type="document" verified={verification.document_verified} size="md" />
                  <TrustBadge type="owner" verified={verification.owner_verified} size="md" />
                  <TrustBadge type="inspected" verified={verification.property_inspected} size="md" />
                  <TrustBadge type="safety" verified={verification.safety_certified} size="md" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">About this property</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity.toLowerCase()] || CheckCircle;
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 p-4 rounded-lg bg-secondary"
                      >
                        <Icon className="h-5 w-5 text-accent" />
                        <span className="font-medium">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="rules" className="space-y-6">
                <ul className="space-y-3">
                  {property.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="verification" className="space-y-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    This property has been verified through our comprehensive trust verification process.
                  </p>

                  <div className="space-y-3">
                    {[
                      { type: "document", verified: verification.document_verified, date: verification.document_verified_at },
                      { type: "owner", verified: verification.owner_verified, date: verification.owner_verified_at },
                      { type: "inspected", verified: verification.property_inspected, date: verification.property_inspected_at },
                      { type: "safety", verified: verification.safety_certified, date: verification.safety_certified_at },
                    ].map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <TrustBadge type={item.type} verified={item.verified} size="md" />
                        <span className="text-sm text-muted-foreground">
                          {item.verified && item.date
                            ? `Verified on ${new Date(item.date).toLocaleDateString()}`
                            : "Pending verification"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {verification.verification_notes && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">
                        <strong>Verification Notes:</strong> {verification.verification_notes}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl border p-6 space-y-6">
              {/* Price */}
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    ₹{property.price_per_month.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  + ₹{property.security_deposit.toLocaleString()} security deposit
                </p>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between py-4 border-y">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Available Beds</span>
                </div>
                <span className="font-semibold">
                  {property.available_beds}/{property.total_beds}
                </span>
              </div>

              {/* Book Now */}
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base"
                onClick={handleBookNow}
              >
                Book Now
              </Button>

              {/* Contact */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium">Contact Property</h4>
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  Call Owner
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Send Inquiry
                </Button>
              </div>

              {/* Trust Guarantee */}
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 text-sm">
                      WebGI Guarantee
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      This property is verified. If reality doesn't match the listing, we'll help you find an alternative.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        property={property}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={() => setIsBookingModalOpen(false)}
      />
    </Layout>
  );
};

export default PropertyDetail;
