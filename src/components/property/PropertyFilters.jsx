import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
  const [minPrice, setMinPrice] = useState(
    filters.priceRange ? filters.priceRange[0] : ""
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.priceRange ? filters.priceRange[1] : ""
  );

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
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };

  const handleMinPriceInput = (e) => {
    const value = e.target.value;
    // Allow empty input while typing
    if (value === "") {
      setMinPrice("");
      return;
    }
    const numValue = Number(value);
    if (!Number.isNaN(numValue)) {
      const validValue = Math.max(numValue, 0);
      // Only update if valid and doesn't exceed max (if max is set)
      if (typeof maxPrice === "number" ? validValue <= maxPrice : true) {
        setMinPrice(validValue);
      }
    }
  };

  const handleMaxPriceInput = (e) => {
    const value = e.target.value;
    // Allow empty input while typing
    if (value === "") {
      setMaxPrice("");
      return;
    }
    const numValue = Number(value);
    if (!Number.isNaN(numValue)) {
      const validValue = Math.max(numValue, 0);
      // Only update if valid and doesn't exceed min (if min is set)
      if (typeof minPrice === "number" ? validValue >= minPrice : true) {
        setMaxPrice(validValue);
      }
    }
  };

  // Handle Enter key in price inputs
  const handlePriceKeyPress = (e) => {
    if (e.key === "Enter") {
      applyPriceFilter();
    }
  };

  const applyPriceFilter = () => {
    // Validate that both min and max are set
    if (minPrice === "" || minPrice === null || minPrice === undefined) {
      toast.error("Please enter minimum price");
      return;
    }
    if (maxPrice === "" || maxPrice === null || maxPrice === undefined) {
      toast.error("Please enter maximum price");
      return;
    }
    if (minPrice > maxPrice) {
      toast.error("Minimum price cannot be greater than maximum price");
      return;
    }
    onFiltersChange({ ...filters, priceRange: [minPrice, maxPrice] });
    toast.success(`Filter applied: ₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`);
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
          <div className="text-sm text-muted-foreground font-semibold">
            {minPrice !== "" && maxPrice !== "" 
              ? `₹${Number(minPrice).toLocaleString()} - ₹${Number(maxPrice).toLocaleString()}`
              : "Set price range"}
          </div>
          
          {/* Min and Max Price Input Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                Minimum Price
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="₹ Min"
                value={minPrice}
                onChange={handleMinPriceInput}
                onKeyPress={handlePriceKeyPress}
                className="h-9 text-sm"
                min="0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                Maximum Price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="₹ Max"
                value={maxPrice}
                onChange={handleMaxPriceInput}
                onKeyPress={handlePriceKeyPress}
                className="h-9 text-sm"
                min="0"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button 
            onClick={applyPriceFilter}
            className="w-full h-9 gap-2"
            size="sm"
          >
            <Search className="h-4 w-4" />
            Apply Filter
          </Button>
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