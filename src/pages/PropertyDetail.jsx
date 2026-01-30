import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import BookingModal from "@/components/property/BookingModal";
import { getPropertyImageUrls, handleImageError } from "@/lib/imageUtils";

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
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [seller, setSeller] = useState(null);

  // Fetch property data
  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
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
      setError(err.message || "Failed to load property");
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

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property?._id]);

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
    ? getPropertyImageUrls(property)
    : [];

  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex] : null;

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  const handleSave = () => {
    if (!user) {
      toast.error("Please sign in to save properties");
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Added to saved properties");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        toast.error("Failed to share");
      }
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      toast.error("Please sign in to message seller");
      return;
    }
    if (seller?.id) {
      navigate(`/messages/${seller.id}`);
    } else {
      toast.error("Seller information not available");
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please sign in to book property");
      return;
    }
    setShowBookingModal(true);
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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-3 sm:mb-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition inline-flex items-center gap-2 text-gray-700 text-xs sm:text-sm"
          title="Go back"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 overflow-x-auto">
          <button onClick={() => navigate("/")} className="hover:text-foreground whitespace-nowrap">Home</button>
          <span>/</span>
          <button onClick={() => navigate("/properties")} className="hover:text-foreground whitespace-nowrap">Properties</button>
          <span>/</span>
          <span className="text-foreground whitespace-nowrap truncate">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-lg sm:rounded-2xl overflow-hidden aspect-video bg-muted">
              {hasImages ? (
                <>
                  <img
                    src={typeof currentImage === 'string' ? currentImage : currentImage.url}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e)}
                  />

                  {/* Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center transition"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center transition"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                    </>
                  )}

                  {/* Image indicators */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-background w-4 sm:w-6"
                            : "bg-background/60"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center px-4">
                    <p className="text-lg sm:text-2xl font-bold text-gray-600 mb-2">No Preview Available</p>
                    <p className="text-xs sm:text-sm text-gray-500">Images will be available once the owner uploads them</p>
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-2">
                <Badge className="bg-primary/90 text-primary-foreground text-xs sm:text-sm">
                  {propertyTypeLabels[property.propertyType] || property.propertyType}
                </Badge>
                {property.status && (
                  <Badge variant="secondary" className="capitalize text-xs sm:text-sm">
                    {property.status}
                  </Badge>
                )}
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs sm:text-sm">
                      {propertyTypeLabels[property.propertyType] || property.propertyType}
                    </Badge>
                    {property.status && (
                      <Badge variant="outline" className="capitalize text-xs sm:text-sm">
                        {property.status}
                      </Badge>
                    )}
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2 text-xs sm:text-base">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="break-words">
                      {property.address}, {property.city}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className={isSaved ? "text-destructive" : ""}
                  >
                    <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isSaved ? "fill-current" : ""}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleShare}
                    aria-label="Share property"
                  >
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>

              {/* Price Info */}
              <div className="text-base sm:text-lg font-semibold text-foreground">
                ₹{property.price?.toLocaleString()}<span className="text-xs sm:text-sm text-muted-foreground">/month</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                {/* <TabsTrigger value="ai-score">AI Score</TabsTrigger> */}
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">About this property</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description || property.about || "No description provided"}
                  </p>
                </div>

                {/* Amenities Section */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-3">✨ Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                          <span className="text-sm capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {property.rules && (
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-3">📋 House Rules</h3>
                    <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                      {property.rules
                        .split(",")
                        .map((rule, idx) => (
                          <li key={idx}>{rule.trim()}</li>
                        ))}
                    </ul>
                  </div>
                )}
                
                {property.required_documents && (
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-3">📄 Required Documents</h3>
                    <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                      {property.required_documents
                        .split(",")
                        .map((doc, idx) => (
                          <li key={idx}>{doc.trim()}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4">
                  {property.bedrooms && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">Bedrooms</p>
                      <p className="text-lg sm:text-2xl font-semibold">{property.bedrooms}</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">Bathrooms</p>
                      <p className="text-lg sm:text-2xl font-semibold">{property.bathrooms}</p>
                    </div>
                  )}
                  {property.squareFeet && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">Square Feet</p>
                      <p className="text-lg sm:text-2xl font-semibold">{property.squareFeet?.toLocaleString()}</p>
                    </div>
                  )}
                  {property.propertyType && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">Property Type</p>
                      <p className="text-lg sm:text-2xl font-semibold capitalize">{property.property_type || property.propertyType}</p>
                    </div>
                  )}
                  {property.capacity && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">Capacity</p>
                      <p className="text-lg sm:text-2xl font-semibold">{property.capacity} people</p>
                    </div>
                  )}
                  {property.vacancies !== undefined && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">Vacancies</p>
                      <p className="text-lg sm:text-2xl font-semibold">{property.vacancies}</p>
                    </div>
                  )}
                  {property.sharing_type && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">Sharing Type</p>
                      <p className="text-lg sm:text-2xl font-semibold capitalize">{property.sharing_type}</p>
                    </div>
                  )}
                  {property.gender_preference && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">Gender Preference</p>
                      <p className="text-lg sm:text-2xl font-semibold capitalize">{property.gender_preference}</p>
                    </div>
                  )}
                  <div className="p-3 sm:p-4 rounded-lg bg-secondary col-span-2 lg:col-span-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">Address</p>
                    <p className="text-base sm:text-lg font-semibold">{property.address || property.location}</p>
                  </div>
                  {property.city && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">City</p>
                      <p className="text-lg sm:text-xl font-semibold">{property.city}</p>
                    </div>
                  )}
                  {property.state && (
                    <div className="p-3 sm:p-4 rounded-lg bg-secondary">
                      <p className="text-xs sm:text-sm text-muted-foreground">State</p>
                      <p className="text-lg sm:text-xl font-semibold">{property.state}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <ReviewSystem 
                  propertyId={property._id}
                  onReviewsUpdated={() => {
                    // Optional: Add any cleanup logic here
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Seller Info & Contact Card - Hidden on mobile, visible on lg */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="sticky top-24 space-y-4 sm:space-y-6">
              {/* Seller Info Card */}
              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Hosted by</h3>
                <div className="space-y-3 sm:space-y-4">
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
                      onClick={handleBookNow}
                    >
                      <BookOpen className="h-4 w-4" />
                      Book This Property
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleContactSeller}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message Seller
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
                  {(property.bedrooms || property.bathrooms) && (
                    <div className="grid grid-cols-2 gap-3 py-4 border-y text-sm">
                      {property.bedrooms && (
                        <div>
                          <p className="text-muted-foreground">Bedrooms</p>
                          <p className="font-semibold text-lg">{property.bedrooms}</p>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div>
                          <p className="text-muted-foreground">Bathrooms</p>
                          <p className="font-semibold text-lg">{property.bathrooms}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {property.status === 'available' 
                      ? '✓ Available Now' 
                      : `Status: ${property.status || 'Unknown'}`}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <BookingModal 
            property={property}
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            onSuccess={() => {
              setShowBookingModal(false);
              toast.success("Booking request sent! The owner will review it shortly.");
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default PropertyDetail;