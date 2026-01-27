import { Link } from "react-router-dom";
import { Heart, MapPin, Users, Wifi, Wind, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustScore, TrustBadgesRow } from "@/components/trust/TrustBadge";
import { cn } from "@/lib/utils";

// Import property images
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const defaultImages = [property1, property2, property3];

const amenityIcons = {
  wifi: Wifi,
  ac: Wind,
  food: Utensils,
};

const PropertyCard = ({ property, verification, isSaved, onToggleSave }) => {
  // Handle both image formats: string URL or object with url property
  let imageUrl;
  if (property.images && property.images.length > 0) {
    const firstImage = property.images[0];
    imageUrl = typeof firstImage === 'string' ? firstImage : firstImage.url;
  }
  imageUrl = imageUrl || defaultImages[Math.floor(Math.random() * 3)];
  const trustScore = verification?.trust_score || 0;

  const propertyTypeLabels = {
    hostel: "Hostel",
    pg: "PG",
    rental_room: "Rental Room",
    flat: "Flat",
  };

  const genderLabels = {
    male: "Boys",
    female: "Girls",
    any: "Co-ed",
  };

  return (
    <motion.div
      className="property-card group h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary/90 text-primary-foreground text-xs font-medium">
            {propertyTypeLabels[property.property_type] || property.property_type}
          </Badge>
          {property.gender_preference !== "any" && (
            <Badge variant="secondary" className="text-xs">
              {genderLabels[property.gender_preference]}
            </Badge>
          )}
        </div>

        {/* Trust Score */}
        {trustScore > 0 && (
          <div className="absolute top-3 right-3">
            <TrustScore score={trustScore} size="sm" />
          </div>
        )}

        {/* Save button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white",
            isSaved && "text-red-500"
          )}
          onClick={(e) => {
            e.preventDefault();
            onToggleSave?.();
          }}
        >
          <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
        </Button>
      </div>

      {/* Content */}
      <Link to={`/property/${property.id}`} className="block p-4">
        <div className="space-y-3">
          {/* Title and Location */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-accent transition-colors line-clamp-1">
              {property.name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{property.address}, {property.city}</span>
            </div>
          </div>

          {/* Trust Badges */}
          <TrustBadgesRow verification={verification} size="sm" />

          {/* Amenities */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {property.amenities?.slice(0, 3).map((amenity) => {
              const Icon = amenityIcons[amenity.toLowerCase()] || Wifi;
              return (
                <div key={amenity} className="flex items-center gap-1">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="capitalize">{amenity}</span>
                </div>
              );
            })}
          </div>

          {/* Price and Availability */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-xl font-bold text-foreground">
                ₹{property.price_per_month.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{property.available_beds}/{property.total_beds} beds</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
