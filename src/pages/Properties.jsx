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
  const [sortBy, setSortBy] = useState("popularity");
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

<<<<<<< HEAD
<<<<<<< HEAD
  // Fetch AI recommendations on mount and when filters change
=======
  // Fetch AI recommendations on mount and when URL params change
>>>>>>> 52ec31373959a2928f522c7ce2d018147615478b
=======
  // Fetch AI recommendations on mount and when filters change
>>>>>>> kittu
  useEffect(() => {
    const fetchAiRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        
<<<<<<< HEAD
<<<<<<< HEAD
        // Use filters from state for recommendations
=======
        // If no city is selected, use "all" to get recommendations for all cities
>>>>>>> 52ec31373959a2928f522c7ce2d018147615478b
=======
        // Use filters from state for recommendations
>>>>>>> kittu
        const recommendationCity = city || "all";
        const maxBudget = budget ? parseInt(budget) : (filters.priceRange[1] || 500000);
        const topK = 100;  // Fetch top 100 recommendations to show all
        
        const cityDisplay = recommendationCity === "all" ? "All Cities" : recommendationCity;
<<<<<<< HEAD
<<<<<<< HEAD
        console.log(`📌 Fetching recommendations for ${cityDisplay} with budget ₹${maxBudget}`);
        console.log(`🔧 Current filters:`, filters);
=======
        console.log(`📌 Fetching ALL recommendations for ${cityDisplay} with max budget ₹${maxBudget}`);
>>>>>>> 52ec31373959a2928f522c7ce2d018147615478b
=======
        console.log(`📌 Fetching recommendations for ${cityDisplay} with budget ₹${maxBudget}`);
        console.log(`🔧 Current filters:`, filters);
>>>>>>> kittu
        
        // Call ML recommendation server to score ALL properties
        const mlUrl = `http://localhost:8001/recommend?city=${encodeURIComponent(recommendationCity)}&max_budget=${maxBudget}&top_k=${topK}`;
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> kittu
        // Apply client-side filters to recommendations
        let filteredRecommendations = recommendations;
        
        // Filter by city if URL param exists
        if (city) {
          filteredRecommendations = filteredRecommendations.filter((p) =>
            p.city.toLowerCase().includes(city.toLowerCase())
          );
        }

        // Filter by price range from sidebar
<<<<<<< HEAD
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) {
          filteredRecommendations = filteredRecommendations.filter(
=======
        // Apply page filters to recommendations
        // Filter by price range
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) {
          recommendations = recommendations.filter(
>>>>>>> 52ec31373959a2928f522c7ce2d018147615478b
=======
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) {
          filteredRecommendations = filteredRecommendations.filter(
>>>>>>> kittu
            (r) =>
              r.price >= filters.priceRange[0] &&
              r.price <= filters.priceRange[1]
          );
        }

        // Filter by property type
        if (filters.propertyTypes.length > 0) {
<<<<<<< HEAD
<<<<<<< HEAD
          filteredRecommendations = filteredRecommendations.filter((r) =>
=======
          recommendations = recommendations.filter((r) =>
>>>>>>> 52ec31373959a2928f522c7ce2d018147615478b
=======
          filteredRecommendations = filteredRecommendations.filter((r) =>
>>>>>>> kittu
            filters.propertyTypes.includes(r.propertyType)
          );
        }

        // Filter by amenities
        if (filters.amenities.length > 0) {
<<<<<<< HEAD
<<<<<<< HEAD
          filteredRecommendations = filteredRecommendations.filter((r) => {
=======
          recommendations = recommendations.filter((r) => {
>>>>>>> 52ec31373959a2928f522c7ce2d018147615478b
=======
          filteredRecommendations = filteredRecommendations.filter((r) => {
>>>>>>> kittu
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
        
<<<<<<< HEAD
<<<<<<< HEAD
        console.log(`📌 Final recommendations after filtering: ${filteredRecommendations.length}`);
        setAiRecommendations(filteredRecommendations);
=======
        console.log(`📌 Final recommendations after filtering: ${recommendations.length}`);
        setAiRecommendations(recommendations);
>>>>>>> 52ec31373959a2928f522c7ce2d018147615478b
=======
        console.log(`📌 Final recommendations after filtering: ${filteredRecommendations.length}`);
        setAiRecommendations(filteredRecommendations);
>>>>>>> kittu
      } catch (err) {
        console.error("❌ Error fetching AI recommendations:", err);
        console.error("Error details:", err.message);
        setAiRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

<<<<<<< HEAD
<<<<<<< HEAD
    // Fetch recommendations when filters change
=======
    // Always fetch recommendations on mount and when city/budget change
>>>>>>> 52ec31373959a2928f522c7ce2d018147615478b
=======
    // Fetch recommendations when filters change
>>>>>>> kittu
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
                    isSaved={isSaved(property._id)}
                    onToggleSave={() => handleToggleSave(property._id)}
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
                AI-powered suggestions.
              </p>

              {loadingRecommendations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              ) : aiRecommendations.length > 0 ? (
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {aiRecommendations.map((rec, index) => (
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
                                  ML Score: {rec.mlScore?.toFixed(2) || 0}
                                </span>
                              </div>
                              <h4 className="font-semibold text-sm line-clamp-1 text-gray-900">
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
                                className="p-1 h-auto"
                              >
                                {isSaved(rec._id) ? "❤️" : "🤍"}
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
