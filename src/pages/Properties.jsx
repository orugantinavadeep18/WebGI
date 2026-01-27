import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, SlidersHorizontal } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/search/SearchBar";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters from "@/components/property/PropertyFilters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Import demo images
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

// Demo properties for initial load
const demoProperties = [
  {
    id: "demo-1",
    name: "Sunrise Student Hostel",
    property_type: "hostel",
    city: "Bangalore",
    address: "Koramangala 5th Block",
    price_per_month: 8000,
    gender_preference: "male",
    amenities: ["WiFi", "AC", "Food"],
    images: [property1],
    available_beds: 5,
    total_beds: 20,
  },
  {
    id: "demo-2",
    name: "Green Valley PG",
    property_type: "pg",
    city: "Bangalore",
    address: "HSR Layout Sector 2",
    price_per_month: 12000,
    gender_preference: "female",
    amenities: ["WiFi", "AC", "Laundry"],
    images: [property2],
    available_beds: 3,
    total_beds: 8,
  },
  {
    id: "demo-3",
    name: "Urban Nest Rental",
    property_type: "rental_room",
    city: "Mumbai",
    address: "Andheri West",
    price_per_month: 15000,
    gender_preference: "any",
    amenities: ["WiFi", "Parking", "Security"],
    images: [property3],
    available_beds: 1,
    total_beds: 1,
  },
  {
    id: "demo-4",
    name: "Scholar's Haven Hostel",
    property_type: "hostel",
    city: "Pune",
    address: "Kothrud",
    price_per_month: 7500,
    gender_preference: "any",
    amenities: ["WiFi", "Food", "Gym"],
    images: [property1],
    available_beds: 8,
    total_beds: 30,
  },
  {
    id: "demo-5",
    name: "Comfort Zone PG",
    property_type: "pg",
    city: "Delhi",
    address: "South Delhi, Hauz Khas",
    price_per_month: 14000,
    gender_preference: "female",
    amenities: ["WiFi", "AC", "Food", "Laundry"],
    images: [property2],
    available_beds: 2,
    total_beds: 6,
  },
  {
    id: "demo-6",
    name: "Metro View Flat",
    property_type: "flat",
    city: "Hyderabad",
    address: "Gachibowli",
    price_per_month: 22000,
    gender_preference: "any",
    amenities: ["WiFi", "AC", "Parking", "Power Backup"],
    images: [property3],
    available_beds: 1,
    total_beds: 1,
  },
];

const demoVerifications = {
  "demo-1": { document_verified: true, owner_verified: true, property_inspected: true, safety_certified: false, trust_score: 80 },
  "demo-2": { document_verified: true, owner_verified: true, property_inspected: false, safety_certified: true, trust_score: 70 },
  "demo-3": { document_verified: true, owner_verified: false, property_inspected: false, safety_certified: false, trust_score: 25 },
  "demo-4": { document_verified: true, owner_verified: true, property_inspected: true, safety_certified: true, trust_score: 100 },
  "demo-5": { document_verified: true, owner_verified: true, property_inspected: true, safety_certified: true, trust_score: 100 },
  "demo-6": { document_verified: false, owner_verified: false, property_inspected: false, safety_certified: false, trust_score: 0 },
};

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState(demoProperties);
  const [verifications] = useState(demoVerifications);
  const [loading] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    propertyTypes: searchParams.get("type") ? [searchParams.get("type")] : [],
    genderPreference: [],
    priceRange: [0, 50000],
    amenities: [],
    trustVerified: searchParams.get("verified") === "true",
  });

  const city = searchParams.get("city");
  const budget = searchParams.get("budget");

  useEffect(() => {
    // For demo, we filter the demo data
    let filtered = [...demoProperties];

    if (city) {
      filtered = filtered.filter((p) =>
        p.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.propertyTypes.includes(p.property_type)
      );
    }

    if (filters.genderPreference.length > 0) {
      filtered = filtered.filter((p) =>
        filters.genderPreference.includes(p.gender_preference)
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) {
      filtered = filtered.filter(
        (p) =>
          p.price_per_month >= filters.priceRange[0] &&
          p.price_per_month <= filters.priceRange[1]
      );
    }

    if (budget) {
      filtered = filtered.filter(
        (p) => p.price_per_month <= parseInt(budget)
      );
    }

    if (filters.trustVerified) {
      filtered = filtered.filter((p) => {
        const v = demoVerifications[p.id];
        return v && v.trust_score >= 60;
      });
    }

    // Sort
    if (sortBy === "price_low") {
      filtered.sort((a, b) => a.price_per_month - b.price_per_month);
    } else if (sortBy === "price_high") {
      filtered.sort((a, b) => b.price_per_month - a.price_per_month);
    } else if (sortBy === "trust") {
      filtered.sort((a, b) => {
        const va = demoVerifications[a.id]?.trust_score || 0;
        const vb = demoVerifications[b.id]?.trust_score || 0;
        return vb - va;
      });
    }

    setProperties(filtered);
  }, [city, budget, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      propertyTypes: [],
      genderPreference: [],
      priceRange: [0, 50000],
      amenities: [],
      trustVerified: false,
    });
  };

  return (
    <Layout>
      {/* Search Header */}
      <div className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <SearchBar variant="compact" className="max-w-2xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">
              {city ? `Properties in ${city}` : "All Properties"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {properties.length} properties found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filters Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                  <PropertyFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="trust">Trust Score</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <PropertyFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground mb-4">
                  No properties found matching your criteria
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    verification={verifications[property.id] || null}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Properties;
