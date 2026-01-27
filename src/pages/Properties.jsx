import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, SlidersHorizontal } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/search/SearchBar";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters from "@/components/property/PropertyFilters";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
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

const Properties = () => {
  const [searchParams] = useSearchParams();
  const { fetchProperties } = useProperties();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("popularity");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    propertyTypes: searchParams.get("type") ? [searchParams.get("type")] : [],
    priceRange: [0, 500000],
    amenities: [],
  });

  const city = searchParams.get("city");
  const budget = searchParams.get("budget");

  // Fetch properties from database
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filterObj = {};
        if (city) filterObj.city = city;
        if (filters.propertyTypes.length > 0) filterObj.propertyType = filters.propertyTypes[0];
        if (budget) filterObj.maxPrice = parseInt(budget);
        if (filters.priceRange[0] > 0) filterObj.minPrice = filters.priceRange[0];
        if (filters.priceRange[1] < 500000) filterObj.maxPrice = filters.priceRange[1];

        const response = await fetchProperties(filterObj);
        setProperties(response.properties || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [city, budget, filters.propertyTypes, filters.priceRange, fetchProperties]);

  const clearFilters = () => {
    setFilters({
      propertyTypes: [],
      priceRange: [0, 500000],
      amenities: [],
    });
  };

  // Sort properties
  const sortedProperties = [...properties];
  if (sortBy === "price_low") {
    sortedProperties.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_high") {
    sortedProperties.sort((a, b) => b.price - a.price);
  }

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
                {sortedProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
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
