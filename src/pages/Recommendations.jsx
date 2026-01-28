import { useState, useEffect } from "react";
import { Heart, Wifi, UtensilsCrossed, Zap, Wind, Shirt, Users, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Card } from "../components/ui/card";
import Layout from "../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiCall } from "../lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Recommendations() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedRentals, setSavedRentals] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    max_budget: 5000,
    location: "hyderabad",
    gender_preference: "unisex",
    sharing_type: "all",
    property_type: "all",
    min_rating: 0,
    min_capacity: 1,
    min_vacancies: 0,
    required_amenities: [],
    limit: 12,
  });

  const amenityOptions = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "food", label: "Food", icon: UtensilsCrossed },
    { id: "ac", label: "AC", icon: Wind },
    { id: "parking", label: "Parking", icon: "🅿️" },
    { id: "laundry", label: "Laundry", icon: "🧺" },
    { id: "power_backup", label: "Power Backup", icon: Zap },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "cctv", label: "CCTV", icon: "📹" },
  ];

  const propertyTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "hostel", label: "Hostel" },
    { value: "pg", label: "PG/Shared" },
    { value: "others", label: "Others" },
  ];

  const sharingTypeOptions = [
    { value: "all", label: "All Sharing" },
    { value: "single", label: "Single Room" },
    { value: "double", label: "Double Occupancy" },
    { value: "triple", label: "Triple Occupancy" },
    { value: "shared", label: "Shared" },
  ];

  const genderOptions = [
    { value: "unisex", label: "Anyone" },
    { value: "male", label: "Male Only" },
    { value: "female", label: "Female Only" },
  ];

  // Load saved rentals from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedRentals") || "[]");
    setSavedRentals(saved);
  }, []);

  // Fetch recommendations
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await apiCall("/rentals/recommend", {
        method: "POST",
        body: JSON.stringify(filters),
      });

      setRentals(data.recommendations || []);
      console.log(`✓ Found ${data.count} recommendations!`);
      toast.success(`Found ${data.count} recommendations!`);
    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);
      toast.error(error.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change (debounced)
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const toggleAmenity = (amenityId) => {
    setFilters((prev) => ({
      ...prev,
      required_amenities: prev.required_amenities.includes(amenityId)
        ? prev.required_amenities.filter((a) => a !== amenityId)
        : [...prev.required_amenities, amenityId],
    }));
  };

  const toggleSaveRental = (rental) => {
    setSavedRentals((prev) => {
      const isAlreadySaved = prev.find((r) => r._id === rental._id);
      if (isAlreadySaved) {
        toast.success("Removed from saved rentals");
        return prev.filter((r) => r._id !== rental._id);
      } else {
        toast.success("Added to saved rentals");
        return [...prev, rental];
      }
    });
  };

  useEffect(() => {
    localStorage.setItem("savedRentals", JSON.stringify(savedRentals));
  }, [savedRentals]);

  const isSaved = (rentalId) => savedRentals.some((r) => r._id === rentalId);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 p-2 hover:bg-gray-300 rounded-lg transition inline-flex items-center gap-2 text-gray-700"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  🎯 AI Rental Recommendations
                </h1>
                <p className="text-gray-600">
                  Discover perfect rentals tailored to your preferences
                </p>
              </div>
              <Button
                onClick={() => {
                  setRentals([]);
                  setFilters({
                    max_budget: 5000,
                    location: "hyderabad",
                    gender_preference: "unisex",
                    sharing_type: "all",
                    property_type: "all",
                    min_rating: 0,
                    required_amenities: [],
                    limit: 12,
                  });
                  toast.success("Filters reset");
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw size={20} />
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Filters</h2>

                {/* Budget Slider */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Max Budget: ₹{filters.max_budget.toLocaleString()}
                  </label>
                  <Slider
                    value={[filters.max_budget]}
                    onValueChange={(value) =>
                      setFilters({ ...filters, max_budget: value[0] })
                    }
                    min={1000}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    placeholder="City or area"
                    className="w-full"
                  />
                </div>

                {/* Gender Preference */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    <Shirt className="inline mr-1" size={16} /> Gender
                  </label>
                  <select
                    value={filters.gender_preference}
                    onChange={(e) =>
                      setFilters({ ...filters, gender_preference: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Sharing Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    <Users className="inline mr-1" size={16} /> Sharing Type
                  </label>
                  <select
                    value={filters.sharing_type}
                    onChange={(e) =>
                      setFilters({ ...filters, sharing_type: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="single">Single Room</option>
                    <option value="double">Double Sharing</option>
                    <option value="triple">Triple Sharing</option>
                    <option value="shared">Multi Sharing</option>
                  </select>
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Property Type
                  </label>
                  <select
                    value={filters.property_type}
                    onChange={(e) =>
                      setFilters({ ...filters, property_type: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="hostel">Hostel</option>
                    <option value="pg">PG</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Minimum Capacity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Minimum Capacity: {filters.min_capacity}
                  </label>
                  <Slider
                    value={[filters.min_capacity]}
                    onValueChange={(value) =>
                      setFilters({ ...filters, min_capacity: value[0] })
                    }
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Minimum Vacancies */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Minimum Vacancies: {filters.min_vacancies}
                  </label>
                  <Slider
                    value={[filters.min_vacancies]}
                    onValueChange={(value) =>
                      setFilters({ ...filters, min_vacancies: value[0] })
                    }
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Minimum Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Minimum Rating: {filters.min_rating.toFixed(1)} ⭐
                  </label>
                  <Slider
                    value={[filters.min_rating]}
                    onValueChange={(value) =>
                      setFilters({ ...filters, min_rating: value[0] })
                    }
                    min={0}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3 text-gray-700">
                    🏠 Amenities
                  </label>
                  <div className="space-y-2">
                    {amenityOptions.map((amenity) => (
                      <label
                        key={amenity.id}
                        className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={filters.required_amenities.includes(amenity.id)}
                          onChange={() => toggleAmenity(amenity.id)}
                          className="w-4 h-4 rounded accent-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {amenity.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Search Button */}
                <Button
                  onClick={fetchRecommendations}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                >
                  {loading ? "Searching..." : "Search Rentals"}
                </Button>
              </Card>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Finding perfect rentals...</p>
                </div>
              ) : rentals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rentals.map((rental) => (
                    <Card
                      key={rental._id}
                      className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer hover:scale-105 transform"
                      onClick={() => navigate(`/properties/${rental._id}`)}
                    >
                      {/* Image Section */}
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {rental.images && rental.images.length > 0 ? (
                          <img
                            src={rental.images[0].url || rental.images[0]}
                            alt={rental.name || rental.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-4xl">🏠</span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveRental(rental);
                          }}
                          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg"
                        >
                          <Heart
                            size={20}
                            fill={isSaved(rental._id) ? "currentColor" : "none"}
                            className={
                              isSaved(rental._id)
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            }
                          />
                        </button>
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          Match: {rental.recommendation_score?.toFixed(0) || 0}%
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Title and Location */}
                        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                          {rental.name || rental.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 flex items-center">
                          <MapPin size={16} className="mr-1" />
                          {rental.location || rental.city}
                        </p>

                        {/* Price and Rating */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold text-blue-600">
                            ₹{rental.price?.toLocaleString() || 'N/A'}/mo
                          </span>
                          <span className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                            <span className="text-yellow-500 mr-1">⭐</span>
                            <span className="font-semibold text-gray-700">
                              {rental.rating > 0 ? rental.rating.toFixed(1) : "N/A"}
                            </span>
                          </span>
                        </div>

                        {/* Detailed Recommendation Breakdown */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg mb-4 text-xs border border-green-200">
                          <p className="font-bold text-green-800 mb-2">✨ Why Recommended ({rental.recommendation_score?.toFixed(1) || 0}/100):</p>
                          <div className="space-y-1 text-gray-700">
                            <p>💰 Price Match: {rental.price <= filters.max_budget ? '✓' : '✗'}</p>
                            <p>👥 Capacity: {rental.capacity >= filters.min_capacity ? `✓ (${rental.capacity} people)` : `✗ (${rental.capacity}/${filters.min_capacity})`}</p>
                            <p>🔑 Available: {rental.vacancies >= filters.min_vacancies ? `✓ (${rental.vacancies} rooms)` : `✗ (${rental.vacancies}/${filters.min_vacancies})`}</p>
                            {rental.rating >= filters.min_rating ? <p>⭐ Rating: ✓ ({rental.rating})</p> : null}
                          </div>
                        </div>
                            <span className="font-semibold text-gray-700">
                              {rental.rating > 0 ? rental.rating : "New"}
                            </span>
                          </span>
                        </div>

                        {/* Recommendation Score */}
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-lg mb-3">
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            Match Score
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (rental.recommendation_score / 100) * 100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-sm font-bold text-green-700 mt-1">
                            {rental.recommendation_score.toFixed(1)}/100
                          </div>
                        </div>

                        {/* Property Details */}
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Type</p>
                            <p className="font-semibold text-gray-700 capitalize">
                              {rental.property_type}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Capacity</p>
                            <p className="font-semibold text-gray-700">
                              {rental.capacity} people
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Vacancies</p>
                            <p className="font-semibold text-gray-700">
                              {rental.vacancies}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-500">Sharing</p>
                            <p className="font-semibold text-gray-700 capitalize">
                              {rental.sharing_type}
                            </p>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-600 mb-2">
                            Amenities:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {rental.amenities.wifi && (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                📡 WiFi
                              </span>
                            )}
                            {rental.amenities.food && (
                              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                                🍽️ Food
                              </span>
                            )}
                            {rental.amenities.ac && (
                              <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded">
                                ❄️ AC
                              </span>
                            )}
                            {rental.amenities.parking && (
                              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                🅿️ Parking
                              </span>
                            )}
                            {rental.amenities.laundry && (
                              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                                🧺 Laundry
                              </span>
                            )}
                            {rental.amenities.security && (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                                🔒 Security
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Contact Button */}
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-xl text-gray-600 mb-4">
                    🔍 No rentals found with these filters
                  </p>
                  <p className="text-gray-500">
                    Try adjusting your filters or budget
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
