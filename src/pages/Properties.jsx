import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, SlidersHorizontal, X, Brain, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/search/SearchBar";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters from "@/components/property/PropertyFilters";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { apiCall } from "@/lib/api";
import { ML_RECOMMEND_ENDPOINT } from "@/config/apiConfig";
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
  const { toggleSave, isSaved } = useSavedProperties();
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("price_low");
  const [showSidebar, setShowSidebar] = useState(true);

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
        const data = await apiCall("/rentals");
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
      } catch (err) {
        setError(err.message);
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllProperties();
  }, []);

  // Fetch AI recommendations on mount and when filters change
  useEffect(() => {
    const fetchAiRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        
        // Use filters from state for recommendations
        const recommendationCity = city || "all";
        const maxBudget = budget ? parseInt(budget) : (filters.priceRange[1] || 500000);
        const topK = 100;  // Fetch top 100 recommendations to show all
        
        const cityDisplay = recommendationCity === "all" ? "All Cities" : recommendationCity;
        console.log(`📌 Fetching recommendations for ${cityDisplay} with budget ₹${maxBudget}`);
        console.log(`🔧 Current filters:`, filters);
        
        // Call ML recommendation server to score ALL properties
        const mlUrl = ML_RECOMMEND_ENDPOINT(recommendationCity, maxBudget, topK);
        console.log(`🌐 ML Server URL: ${mlUrl}`);
        
        const mlResponse = await fetch(mlUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        console.log(`📡 ML Response Status: ${mlResponse.status}`);
        
        if (!mlResponse.ok) {
          throw new Error(`ML server error: ${mlResponse.statusText}`);
        }
        
        const mlData = await mlResponse.json();
        console.log(`✅ ML Server response:`, mlData);
        console.log(`📊 Response structure:`, {
          hasRecommendations: !!mlData.recommendations,
          recommendationsCount: mlData.recommendations?.length || 0,
          hasAllScored: !!mlData.all_scored_properties,
          allScoredCount: mlData.all_scored_properties?.length || 0,
          totalScored: mlData.total_properties_scored,
          mode: mlData.mode,
          saved: mlData.saved
        });
        console.log(`📈 First 3 all_scored_properties:`, mlData.all_scored_properties?.slice(0, 3) || []);

        // Fetch all properties from backend
        let recommendations = [];
        
        try {
          const allPropertiesResponse = await apiCall("/rentals");
          const allRentals = allPropertiesResponse.rentals || [];
          console.log(`🏠 Got ${allRentals.length} properties from backend`);

          if (allRentals.length > 0) {
            // Map rentals to property format
            const mappedRentals = allRentals.map(r => ({
              _id: r._id.toString ? r._id.toString() : r._id,
              title: r.name,
              address: r.location,
              city: r.location,
              price: r.price,
              rating: r.rating,
              images: r.images || [],
              propertyType: r.property_type,
              amenities: Object.keys(r.amenities || {})
                .filter(k => r.amenities[k] === true)
                .map(k => k.replace(/_/g, ' ')),
              ...r
            }));

            console.log(`📊 Got ${mappedRentals.length} properties from database`);

            // Match all scored properties with database properties
            const allScoredIds = (mlData.all_scored_properties || []).map(p => p._id.toString?.() || p._id);
            console.log(`🔍 Matching ${allScoredIds.length} scored property IDs with ${mappedRentals.length} database properties`);
            
            recommendations = mappedRentals
              .filter(p => allScoredIds.includes(p._id.toString ? p._id.toString() : p._id))
              .map(p => {
                // Find the corresponding scored property to get the ML score
                const scoredProp = (mlData.all_scored_properties || []).find(sp => 
                  (sp._id.toString?.() || sp._id) === (p._id.toString ? p._id.toString() : p._id)
                );
                
                return {
                  ...p,
                  mlScore: scoredProp?.score || 0  // Add ML score to property
                };
              })
              // Sort by ML score descending
              .sort((a, b) => (b.mlScore || 0) - (a.mlScore || 0));

            console.log(`✅ Matched ${recommendations.length} recommendations with database properties`);
            console.log(`📋 Top recommendations:`, recommendations.slice(0, 5).map(r => ({ name: r.title, score: r.mlScore })));
          }
        } catch (fetchErr) {
          console.error("Error matching recommendations with database:", fetchErr);
        }

        // If no matching recommendations found, use scored properties directly (demo mode)
        if (recommendations.length === 0) {
          console.log("⚠️ No database matches found, using demo data from ML server");
          recommendations = (mlData.all_scored_properties || []).map((r, index) => ({
            _id: r._id || `demo-${index}`,
            title: r.name || `Property ${index + 1}`,
            city: r.city || cityDisplay,
            price: r.price || 0,
            rating: r.rating || 0,
            mlScore: r.score || 0,
            images: r.images || [],
            propertyType: r.propertyType || 'Shared',
            amenities: typeof r.amenities === 'string' 
              ? r.amenities.split(',').map(a => a.trim())
              : r.amenities || [],
            location: r.location || r.city || cityDisplay,
            ...r
          }));
          console.log(`✅ Using ${recommendations.length} demo properties from ML server`);
        }

        // Apply client-side filters to recommendations
        let filteredRecommendations = recommendations;
        
        // Filter by city if URL param exists
        if (city) {
          filteredRecommendations = filteredRecommendations.filter((p) =>
            p.city.toLowerCase().includes(city.toLowerCase())
          );
        }

        // Filter by price range from sidebar
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) {
          filteredRecommendations = filteredRecommendations.filter(
            (r) =>
              r.price >= filters.priceRange[0] &&
              r.price <= filters.priceRange[1]
          );
        }

        // Filter by property type
        if (filters.propertyTypes.length > 0) {
          filteredRecommendations = filteredRecommendations.filter((r) =>
            filters.propertyTypes.includes(r.propertyType)
          );
        }

        // Filter by amenities
        if (filters.amenities.length > 0) {
          filteredRecommendations = filteredRecommendations.filter((r) => {
            const amenitiesArray = Array.isArray(r.amenities)
              ? r.amenities
              : r.amenities
              ? Object.keys(r.amenities)
                  .filter(k => r.amenities[k] === true)
                  .map(k => k.replace(/_/g, ' '))
              : [];
            
            return filters.amenities.some((a) =>
              amenitiesArray.some((pa) => pa.toLowerCase().includes(a.toLowerCase()))
            );
          });
        }
        
        console.log(`📌 Final recommendations after filtering: ${filteredRecommendations.length}`);
        setAiRecommendations(filteredRecommendations);
      } catch (err) {
        console.error("❌ Error fetching AI recommendations:", err);
        console.error("Error details:", err.message);
        setAiRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    // Fetch recommendations when filters change
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

  const handleToggleSave = (propertyId) => {
    toggleSave(propertyId);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
          <div className="flex-1">
            <h1 className="font-heading text-xl sm:text-2xl font-bold">
              {city ? `Properties in ${city}` : "All Properties"}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {filteredProperties.length} properties found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            {/* Toggle Sidebar Button - Mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="gap-2 w-full sm:w-auto text-xs sm:text-sm"
              title={showSidebar ? "Hide filters" : "Show filters"}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showSidebar ? "Hide" : "Show"} Filters
            </Button>

            {/* Sort - Responsive */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-44 text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>



        {/* Main Layout: Sidebar | Content | Right Panel - Responsive */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
          {/* LEFT SIDEBAR - Filters - Hidden on mobile, visible on large screens */}
          {showSidebar && (
            <aside className="w-full sm:w-80 lg:w-80 flex-shrink-0 h-fit lg:h-[calc(100vh-200px)] lg:sticky lg:top-24 lg:overflow-y-auto">
              <div className="bg-white rounded-xl border p-3 sm:p-4">
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
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  No properties found matching your criteria
                </p>
                <Button variant="outline" onClick={clearFilters} size="sm">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    isSaved={isSaved(property._id)}
                    onToggleSave={() => handleToggleSave(property._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - AI Recommendations - Hidden on mobile, visible on large screens */}
          <aside className="hidden lg:block w-full lg:w-80 flex-shrink-0 h-fit lg:sticky lg:top-24">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h3 className="font-heading font-bold text-sm sm:text-lg text-blue-900">Top AI Recommendations</h3>
              </div>
              <p className="text-xs text-blue-700">
                AI-powered suggestions.
              </p>

              {loadingRecommendations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-blue-600" />
                </div>
              ) : aiRecommendations.length > 0 ? (
                <div className="space-y-2 sm:space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {aiRecommendations.map((rec, index) => (
                    <div
                      key={rec._id || index}
                      className="bg-white p-2 sm:p-3 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors cursor-pointer hover:shadow-md"
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
                        className="flex gap-2 sm:gap-3"
                        onClick={() => {
                          console.log('Navigating to property:', rec._id);
                          navigate(`/properties/${rec._id}`);
                        }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
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
                              <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
                                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                  ML: {rec.mlScore?.toFixed(2) || 0}
                                </span>
                              </div>
                              <h4 className="font-semibold text-xs sm:text-sm line-clamp-1 text-gray-900">
                                {rec.title || rec.name}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {rec.location || rec.city}
                              </p>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleSave(rec._id);
                                }}
                                className="p-0.5 h-auto text-sm sm:text-base"
                              >
                                {isSaved(rec._id) ? "❤️" : "🤍"}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <p className="text-xs sm:text-sm font-bold text-blue-600">
                              ₹{rec.price?.toLocaleString()}/mo
                            </p>
                            <div className="flex items-center gap-0.5 sm:gap-1 text-xs">
                              <span className="text-yellow-500">⭐</span>
                              <span className="text-gray-600 text-xs">{rec.rating || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-blue-600 text-center py-4">
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
