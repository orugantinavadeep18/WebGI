import { Link } from "react-router-dom";
import { Heart, MapPin, BedDouble, Bath } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPropertyImageUrl, handleImageError } from "@/lib/imageUtils";

// Import property images
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const defaultImages = [property1, property2, property3];

const PropertyCard = ({ property, isSaved, onToggleSave }) => {
  // Get image URL with automatic fallback
  const imageUrl = getPropertyImageUrl(property, 0);

  // Handle amenities - convert object to array if needed
  const amenitiesArray = Array.isArray(property.amenities)
    ? property.amenities
    : property.amenities
    ? Object.keys(property.amenities)
        .filter(k => property.amenities[k] === true)
        .map(k => k.replace(/_/g, ' '))
    : [];

  const propertyTypeLabels = {
    hostel: "Hostel",
    pg: "PG",
    others: "Rental",
    house: "House",
    apartment: "Apartment",
    condo: "Condo",
    villa: "Villa",
    studio: "Studio",
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
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => handleImageError(e, defaultImages[0])}
        />
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary/90 text-primary-foreground text-xs font-medium">
            {propertyTypeLabels[property.propertyType] || property.propertyType}
          </Badge>
          {property.status && (
            <Badge variant="secondary" className="text-xs capitalize">
              {property.status}
            </Badge>
          )}
        </div>

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
      <Link to={`/properties/${property._id}`} className="block p-4">
        <div className="space-y-3">
          {/* Title and Location */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-accent transition-colors line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{property.address}, {property.city}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            {amenitiesArray?.slice(0, 3).map((amenity) => (
              <span key={amenity} className="capitalize">{amenity}</span>
            ))}
          </div>

          {/* Price and Details */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-xl font-bold text-foreground">
                ₹{property.price?.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
