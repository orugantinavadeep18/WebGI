import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, SlidersHorizontal, X, Brain, ArrowLeft } from "lucide-react";
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

const Properties = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchProperties } = useProperties();
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("popularity");
  const [showSidebar, setShowSidebar] = useState(true);
  const [saved, setSaved] = useState(new Set());

  const [filters, setFilters] = useState({
    propertyTypes: searchParams.get("type") ? [searchParams.get("type")] : [],
    priceRange: [0, 500000],
    amenities: [],
  });

  const city = searchParams.get("city");
  const budget = searchParams.get("budget");

  // Fetch all properties ONCE when component mounts
  useEffect(() => {
    const loadAllProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from rentals API instead of properties
        const response = await fetch("http://localhost:5000/api/rentals");
        if (response.ok) {
          const data = await response.json();
          const rentals = data.rentals || [];
          // Map rentals to match property format
          const mappedRentals = rentals.map(r => ({
            _id: r._id,
            title: r.name,
            address: r.location,
            city: r.location,
            price: r.price,
            rating: r.rating,
            images: r.images || [],
            propertyType: r.property_type,
            // Convert amenities object to array of keys where value is true
            amenities: Object.keys(r.amenities || {})
              .filter(k => r.amenities[k] === true)
              .map(k => k.replace(/_/g, ' ')),
            ...r
          }));
          setAllProperties(mappedRentals);
        } else {
          throw new Error("Failed to fetch rentals");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllProperties();
  }, []);

  // Fetch AI recommendations whenever filters or city changes
  useEffect(() => {
    const fetchAiRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        
        // Build recommendation params based on filters
        const params = {
          limit: 5,
        };
        
        // Add city/location filter
        if (city) {
          params.location = city;
        }
        
        // Add budget/price filter
        if (budget) {
          params.max_budget = parseInt(budget);
        } else if (filters.priceRange[1] < 500000) {
          params.max_budget = filters.priceRange[1];
        }
        
        // Add amenities filter
        if (filters.amenities.length > 0) {
          params.required_amenities = filters.amenities;
        }
        
        const response = await fetch("http://localhost:5000/api/rentals/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        if (response.ok) {
          const data = await response.json();
          // Map rentals to match property format
          const recommendations = (data.recommendations || []).map(r => ({
            _id: r._id,
            title: r.name,
            city: r.location,
            price: r.price,
            rating: r.rating,
            score: r.recommendation_score || r.score || 0,
            images: r.images || [],
            propertyType: r.property_type,
            amenities: Object.keys(r.amenities || {})
              .filter(k => r.amenities[k] === true)
              .map(k => k.replace(/_/g, ' ')),
            ...r
          }));
          setAiRecommendations(recommendations);
        }
      } catch (err) {
        console.error("Error fetching AI recommendations:", err);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchAiRecommendations();
  }, [city, budget, filters]);

  // Apply client-side filtering whenever filters or data changes
  useEffect(() => {
    let filtered = [...allProperties];

    // Filter by city (from URL)
    if (city) {
      filtered = filtered.filter((p) =>
        p.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filter by property type
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.propertyTypes.includes(p.propertyType)
      );
    }

    // Filter by price range
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) {
      filtered = filtered.filter(
        (p) =>
          p.price >= filters.priceRange[0] &&
          p.price <= filters.priceRange[1]
      );
    }

    // Filter by budget (from URL)
    if (budget) {
      filtered = filtered.filter(
        (p) => p.price <= parseInt(budget)
      );
    }

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((p) => {
        // Convert amenities object to array if needed
        const amenitiesArray = Array.isArray(p.amenities)
          ? p.amenities
          : p.amenities
          ? Object.keys(p.amenities)
              .filter(k => p.amenities[k] === true)
              .map(k => k.replace(/_/g, ' '))
          : [];
        
        return filters.amenities.some((a) =>
          amenitiesArray.some((pa) => pa.toLowerCase().includes(a.toLowerCase()))
        );
      });
    }

    // Sort
    if (sortBy === "price_low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProperties(filtered);
  }, [allProperties, city, budget, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      propertyTypes: [],
      priceRange: [0, 500000],
      amenities: [],
    });
  };

  const toggleSave = (propertyId) => {
    setSaved(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(propertyId)) {
        newSaved.delete(propertyId);
      } else {
        newSaved.add(propertyId);
      }
      return newSaved;
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-gray-100 rounded-lg transition inline-flex items-center gap-2 text-gray-700"
          title="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold">
              {city ? `Properties in ${city}` : "All Properties"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {filteredProperties.length} properties found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Sidebar Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="gap-2"
              title={showSidebar ? "Hide filters" : "Show filters"}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showSidebar ? "Hide" : "Show"} Filters
            </Button>

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



        {/* Main Layout: Sidebar | Content | Right Panel */}
        <div className="flex gap-6">
          {/* LEFT SIDEBAR - Filters */}
          {showSidebar && (
            <aside className="w-80 flex-shrink-0 h-[calc(100vh-200px)] sticky top-24 overflow-y-auto">
              <div className="bg-white rounded-xl border p-4">
                <PropertyFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                />
              </div>
            </aside>
          )}

          {/* MIDDLE - Properties Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border">
                <p className="text-lg text-muted-foreground mb-4">
                  No properties found matching your criteria
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    isSaved={saved.has(property._id)}
                    onToggleSave={() => toggleSave(property._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - AI Recommendations */}
          <aside className="w-80 flex-shrink-0 h-fit sticky top-24">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <h3 className="font-heading font-bold text-lg text-blue-900">Top AI Recommendations</h3>
              </div>
              <p className="text-xs text-blue-700">
                AI-powered suggestions using advanced matching algorithm
              </p>

              {loadingRecommendations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              ) : aiRecommendations.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {aiRecommendations.slice(0, 5).map((rec, index) => (
                    <div
                      key={rec._id || index}
                      className="bg-white p-3 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors cursor-pointer hover:shadow-md"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(`/property/${rec._id}`);
                        }
                      }}
                    >
                      {/* Clickable content area */}
                      <div 
                        className="flex gap-3"
                        onClick={() => {
                          console.log('Navigating to property:', rec._id);
                          navigate(`/properties/${rec._id}`);
                        }}
                      >
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          {rec.images && rec.images[0] && (
                            <img
                              src={typeof rec.images[0] === 'string' ? rec.images[0] : rec.images[0].url}
                              alt={rec.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  Score: {rec.score?.toFixed(1) || 0}/100
                                </span>
                              </div>
                              <h4 className="font-semibold text-sm line-clamp-1 text-gray-900">
                                {rec.name}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {rec.location}
                              </p>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSave(rec._id);
                                }}
                                className="p-1 h-auto"
                              >
                                {saved.has(rec._id) ? "❤️" : "🤍"}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm font-bold text-blue-600">
                              ₹{rec.price?.toLocaleString()}/mo
                            </p>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-yellow-500">⭐</span>
                              <span className="text-gray-600">{rec.rating || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-blue-600 text-center py-4">
                  No recommendations available yet
                </p>
              )}

              <p className="text-xs text-blue-600 italic text-center pt-2 border-t border-blue-200">
                🎯 AI learns from your preferences
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Properties;
