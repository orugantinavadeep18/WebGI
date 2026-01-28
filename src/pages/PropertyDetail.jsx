import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  BookOpen,
  Loader2,
  Star,
  Check,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import ReviewSystem from "@/components/property/ReviewSystem";

// Import demo images
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getPropertyById } = useProperties();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [seller, setSeller] = useState(null);

  // Fetch property data
  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await getPropertyById(id);
      
      // Check if data exists
      if (!data) {
        setError("Property not found");
        setProperty(null);
        return;
      }
      
      // Normalize rental data to property structure
      const normalizedProperty = {
        ...data,
        // Map rental fields to property fields
        title: data.name || data.title,
        description: data.about || data.description,
        propertyType: data.property_type || data.propertyType,
        address: data.location || data.address || "",
        city: data.location || data.city || "",
        seller: data._id || data.id,
        // Ensure amenities is an array
        amenities: Array.isArray(data.amenities) 
          ? data.amenities 
          : Object.entries(data.amenities || {})
              .filter(([, value]) => value === true)
              .map(([key]) => key.replace(/_/g, ' ')),
      };
      
      setProperty(normalizedProperty);
      
      // Set seller info
      setSeller({
        id: data?._id || data?.id,
        name: data?.owner_details || "Property Owner",
        email: "owner@example.com",
        phone: "+91 XXXXX XXXXX",
      });
    } catch (err) {
      setError(err.message);
      setProperty(null);
      console.error("Error loading property:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || "This property could not be found"}</p>
            <Button onClick={() => navigate("/properties")}>Back to Properties</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : [property1, property2, property3];

  const currentImage = images[currentImageIndex] || property1;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
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

  const handleContactSeller = () => {
    if (!user) {
      toast.error("Please sign in to contact seller");
      return;
    }
    // Navigate to messaging/chat page
    navigate(`/messages/${seller?.id}`);
  };

  const handleInquiry = () => {
    if (!user) {
      toast.error("Please sign in to send inquiry");
      return;
    }
    setShowContactModal(true);
  };

  const propertyTypeLabels = {
    house: "House",
    apartment: "Apartment",
    condo: "Condo",
    villa: "Villa",
    studio: "Studio",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-gray-100 rounded-lg transition inline-flex items-center gap-2 text-gray-700"
          title="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate("/")} className="hover:text-foreground">Home</button>
          <span>/</span>
          <button onClick={() => navigate("/properties")} className="hover:text-foreground">Properties</button>
          <span>/</span>
          <span className="text-foreground">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted">
              <img
                src={typeof currentImage === 'string' ? currentImage : currentImage.url || property1}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center transition"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center transition"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
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
                  {propertyTypeLabels[property.propertyType] || property.propertyType}
                </Badge>
                {property.status && (
                  <Badge variant="secondary" className="capitalize">
                    {property.status}
                  </Badge>
                )}
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/90 text-primary-foreground">
                      {propertyTypeLabels[property.propertyType] || property.propertyType}
                    </Badge>
                    {property.status && (
                      <Badge variant="outline" className="capitalize">
                        {property.status}
                      </Badge>
                    )}
                  </div>
                  <h1 className="font-heading text-3xl font-bold">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {property.address}, {property.city}
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

              {/* Price Info */}
              <div className="text-lg font-semibold text-foreground">
                ₹{property.price?.toLocaleString()}<span className="text-sm text-muted-foreground">/month</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="ai-score">AI Score</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">About this property</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description || property.about || "No description provided"}
                  </p>
                </div>
                
                {property.rules && (
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-3">📋 House Rules</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.rules}</p>
                  </div>
                )}
                
                {property.required_documents && (
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-3">📄 Required Documents</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.required_documents}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="amenities" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities && property.amenities.length > 0 ? (
                    property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 rounded-lg bg-secondary"
                      >
                        <Check className="h-5 w-5 text-accent" />
                        <span className="font-medium capitalize">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-full">No amenities listed</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {property.bedrooms && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="text-2xl font-semibold">{property.bedrooms}</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="text-2xl font-semibold">{property.bathrooms}</p>
                    </div>
                  )}
                  {property.squareFeet && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Square Feet</p>
                      <p className="text-2xl font-semibold">{property.squareFeet?.toLocaleString()}</p>
                    </div>
                  )}
                  {property.propertyType && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      <p className="text-2xl font-semibold capitalize">{property.property_type || property.propertyType}</p>
                    </div>
                  )}
                  {property.capacity && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="text-2xl font-semibold">{property.capacity} people</p>
                    </div>
                  )}
                  {property.vacancies !== undefined && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Vacancies</p>
                      <p className="text-2xl font-semibold">{property.vacancies}</p>
                    </div>
                  )}
                  {property.sharing_type && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Sharing Type</p>
                      <p className="text-2xl font-semibold capitalize">{property.sharing_type}</p>
                    </div>
                  )}
                  {property.gender_preference && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Gender Preference</p>
                      <p className="text-2xl font-semibold capitalize">{property.gender_preference}</p>
                    </div>
                  )}
                  <div className="p-4 rounded-lg bg-secondary col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-lg font-semibold">{property.address || property.location}</p>
                  </div>
                  {property.city && (
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="text-xl font-semibold">{property.city}</p>
                    </div>
                  )}
                  <div className="p-4 rounded-lg bg-secondary">
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="text-xl font-semibold">{property.state}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-score" className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border-2 border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-900 mb-6">🤖 AI Recommendation Analysis</h3>
                  
                  {/* Overall Score */}
                  <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600 text-sm mb-2">Overall Recommendation Score</p>
                    <div className="flex items-end gap-4">
                      <div className="text-5xl font-bold text-green-600">
                        {property.recommendation_score?.toFixed(1) || 'N/A'}<span className="text-2xl">/100</span>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full"
                            style={{width: `${Math.min((property.recommendation_score || 0) / 100 * 100, 100)}%`}}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">{property.recommendation_score > 75 ? '⭐⭐⭐ Excellent Match' : property.recommendation_score > 50 ? '⭐⭐ Good Match' : '⭐ Fair Match'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Scoring Breakdown */}
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {/* Price Factor */}
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-800">💰 Price Factor</p>
                        <span className="text-lg font-bold text-blue-600">25%</span>
                      </div>
                      <p className="text-sm text-gray-600">₹{property.price?.toLocaleString()} /month</p>
                      <div className="mt-2 bg-blue-100 h-2 rounded-full"></div>
                    </div>

                    {/* Rating Factor */}
                    <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-800">⭐ Rating Factor</p>
                        <span className="text-lg font-bold text-yellow-600">30%</span>
                      </div>
                      <p className="text-sm text-gray-600">Rating: {property.rating?.toFixed(1) || 'N/A'} stars</p>
                      <div className="mt-2 bg-yellow-100 h-2 rounded-full" style={{width: `${Math.min((property.rating || 0) / 5 * 100, 100)}%`}}></div>
                    </div>

                    {/* Amenities Factor */}
                    <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-800">✨ Amenities Factor</p>
                        <span className="text-lg font-bold text-green-600">25%</span>
                      </div>
                      <p className="text-sm text-gray-600">{property.amenities?.length || 0} amenities available</p>
                      <div className="mt-2 bg-green-100 h-2 rounded-full" style={{width: `${Math.min((property.amenities?.length || 0) / 8 * 100, 100)}%`}}></div>
                    </div>

                    {/* Availability Factor */}
                    <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-800">🔑 Availability Factor</p>
                        <span className="text-lg font-bold text-purple-600">15%</span>
                      </div>
                      <p className="text-sm text-gray-600">{property.vacancies || 0} rooms available</p>
                      <div className="mt-2 bg-purple-100 h-2 rounded-full" style={{width: `${Math.min((property.vacancies || 0) / 5 * 100, 100)}%`}}></div>
                    </div>

                    {/* Capacity Factor */}
                    <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-800">👥 Capacity Factor</p>
                        <span className="text-lg font-bold text-orange-600">5%</span>
                      </div>
                      <p className="text-sm text-gray-600">Capacity: {property.capacity || 'N/A'} people</p>
                      <div className="mt-2 bg-orange-100 h-2 rounded-full"></div>
                    </div>
                  </div>

                  {/* Why This Property Was Recommended */}
                  <div className="bg-white p-6 rounded-lg border-2 border-green-200">
                    <h4 className="font-semibold text-gray-800 mb-4">✅ Why This Property Matches Your Preferences</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {property.price ? <li>✓ Price point fits your budget</li> : null}
                      {property.capacity ? <li>✓ Capacity meets your requirements</li> : null}
                      {property.vacancies ? <li>✓ Currently has available rooms</li> : null}
                      {property.rating > 3 ? <li>✓ Well-rated by previous tenants</li> : null}
                      {property.amenities?.length > 0 ? <li>✓ Offers essential amenities</li> : null}
                      <li>✓ Located in your preferred area</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <ReviewSystem 
                  propertyId={property._id}
                  onReviewsUpdated={() => loadProperty()}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Seller Info & Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Seller Info Card */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Hosted by</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-lg">{seller?.name || "Property Owner"}</p>
                    <p className="text-sm text-muted-foreground">Property Seller</p>
                  </div>
                  
                  <div className="space-y-2 py-4 border-y">
                    {seller?.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{seller.email}</span>
                      </div>
                    )}
                    {seller?.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{seller.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full gap-2"
                      onClick={handleContactSeller}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message Seller
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleInquiry}
                    >
                      <BookOpen className="h-4 w-4" />
                      Send Inquiry
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Price & Availability Card */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold">
                        ₹{property.price?.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>

                  {/* Quick Details */}
                  <div className="grid grid-cols-2 gap-3 py-4 border-y text-sm">
                    <div>
                      <p className="text-muted-foreground">Bedrooms</p>
                      <p className="font-semibold text-lg">{property.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bathrooms</p>
                      <p className="font-semibold text-lg">{property.bathrooms}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {property.status === 'available' 
                      ? '✓ Available Now' 
                      : `Status: ${property.status}`}
                  </p>
                </div>
              </Card>

              {/* Safety & Trust */}
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800 text-sm">
                      Verified Property
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      This property has been verified for authenticity and safety.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
