import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Common locations for autocomplete
const COMMON_LOCATIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Indore",
  "Kochi",
  "Surat",
  "Bhopal",
  "Visakhapatnam",
  "Nagpur",
  "Vadodara",
];

const SearchBar = ({ variant = "hero", className }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const suggestionsRef = useRef(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (propertyType) params.set("type", propertyType);
    if (budget) params.set("budget", budget);
    navigate(`/properties?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleCityChange = (value) => {
    setCity(value);
    if (value.trim()) {
      const filtered = COMMON_LOCATIONS.filter((location) =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredLocations([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectLocation = (location) => {
    setCity(location);
    setShowSuggestions(false);
    setFilteredLocations([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 p-2 bg-card rounded-xl border shadow-sm relative z-40 ${className}`}>
        <div className="flex-1 flex items-center gap-2 px-3 relative" ref={suggestionsRef}>
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter city, area or locality"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && city.trim()) {
                handleSearch();
              }
            }}
            className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto text-base font-medium placeholder:text-muted-foreground/60"
          />
          {showSuggestions && filteredLocations.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {filteredLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleSelectLocation(location)}
                  className="w-full text-left px-4 py-2 hover:bg-secondary/80 transition-colors text-sm flex items-center gap-2"
                >
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={handleSearch}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className={`search-box relative z-40 p-2 md:p-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-3">
        {/* City */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-lg relative" ref={suggestionsRef}>
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Location</p>
            <Input
              type="text"
              placeholder="Enter city, area or locality"
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && city.trim()) {
                  handleSearch();
                }
              }}
              className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto text-base font-medium placeholder:text-muted-foreground/60"
            />
            {showSuggestions && filteredLocations.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto md:w-80">
                {filteredLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleSelectLocation(location)}
                    className="w-full text-left px-4 py-2 hover:bg-secondary/80 transition-colors text-sm flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Property Type */}
        <div className="md:w-48 flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-lg">
          <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Property Type</p>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="border-0 bg-transparent focus:ring-0 p-0 h-auto text-base font-medium">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hostel">Hostel</SelectItem>
                <SelectItem value="pg">PG</SelectItem>
                <SelectItem value="rental_room">Rental Room</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Budget */}
        <div className="md:w-48 flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-lg">
          <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Budget/Month</p>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="border-0 bg-transparent focus:ring-0 p-0 h-auto text-base font-medium">
                <SelectValue placeholder="Any Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5000">Under ₹5,000</SelectItem>
                <SelectItem value="10000">Under ₹10,000</SelectItem>
                <SelectItem value="15000">Under ₹15,000</SelectItem>
                <SelectItem value="20000">Under ₹20,000</SelectItem>
                <SelectItem value="25000">Under ₹25,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          size="lg"
          className="md:px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-auto py-4"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
    </motion.div>
  );
};

export default SearchBar;