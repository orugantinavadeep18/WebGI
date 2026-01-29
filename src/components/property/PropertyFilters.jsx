import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PropertyFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [openSections, setOpenSections] = useState({
    propertyType: true,
    price: true,
    amenities: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const propertyTypes = [
    { value: "hostel", label: "Hostel" },
    { value: "pg", label: "PG" },
    { value: "others", label: "Rental" },
  ];

  const amenityOptions = [
    "WiFi",
    "Food Available",
    "Air Conditioning",
    "Parking",
    "Laundry",
    "Power Backup",
    "Security",
    "CCTV",
    "Gym",
    "Pool",
    "Garden",
    "Balcony",
    "Microwave",
    "Washing Machine",
    "Dishwasher",
    "TV",
    "Elevator",
    "Pet Friendly",
  ];


  const handlePropertyTypeChange = (type, checked) => {
    const updated = checked
      ? [...(filters.propertyTypes || []), type]
      : (filters.propertyTypes || []).filter((t) => t !== type);
    onFiltersChange({ ...filters, propertyTypes: updated });
  };

  const handleAmenityChange = (amenity, checked) => {
    const updated = checked
      ? [...(filters.amenities || []), amenity]
      : (filters.amenities || []).filter((a) => a !== amenity);
    onFiltersChange({ ...filters, amenities: updated });
  };

  const handlePriceChange = (value) => {
    onFiltersChange({ ...filters, priceRange: value });
  };

  const hasActiveFilters =
    (filters.propertyTypes && filters.propertyTypes.length > 0) ||
    (filters.amenities && filters.amenities.length > 0) ||
    (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000));

  return (
    <div className="bg-card rounded-xl border p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-foreground" />
          <h3 className="font-heading font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Property Type */}
      <Collapsible open={openSections.propertyType} onOpenChange={() => toggleSection("propertyType")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t">
          <span className="font-medium text-sm">Property Type</span>
          {openSections.propertyType ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          {propertyTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={type.value}
                checked={(filters.propertyTypes || []).includes(type.value)}
                onCheckedChange={(checked) =>
                  handlePropertyTypeChange(type.value, checked)
                }
              />
              <Label htmlFor={type.value} className="text-sm cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t">
          <span className="font-medium text-sm">Price Range</span>
          {openSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          <div className="text-sm text-muted-foreground">
            ₹{(filters.priceRange && filters.priceRange[0] ? filters.priceRange[0] : 0).toLocaleString()} - ₹{(filters.priceRange && filters.priceRange[1] ? filters.priceRange[1] : 20000).toLocaleString()}
          </div>
          <Slider
            value={filters.priceRange || [0, 20000]}
            onValueChange={handlePriceChange}
            min={0}
            max={20000}
            step={1000}
            className="w-full"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Amenities */}
      <Collapsible open={openSections.amenities} onOpenChange={() => toggleSection("amenities")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t">
          <span className="font-medium text-sm">Amenities</span>
          {openSections.amenities ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          {amenityOptions.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={(filters.amenities || []).includes(amenity)}
                onCheckedChange={(checked) =>
                  handleAmenityChange(amenity, checked)
                }
              />
              <Label htmlFor={amenity} className="text-sm cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PropertyFilters;
