import { useState, useEffect, useRef } from "react";
import PropertyCard from "./PropertyCard";
import { propertyAPI } from "@/lib/api";

export default function SavedPropertyCard({ propertyId, onRemove, index = 0 }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (hasCalledRef.current) return; // Prevent duplicate calls
    
    // Stagger requests by index to avoid overwhelming browser resources
    const delay = index * 300; // 300ms between each request
    
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await propertyAPI.getPropertyById(propertyId);
        const data = response.rental || response.property;
        
        if (data) {
          setProperty(data);
          setError(null);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error loading property:", err);
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    }, delay);

    hasCalledRef.current = true;
    return () => clearTimeout(timer);
  }, [propertyId, index]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-4 animate-pulse">
        <div className="w-full h-40 bg-gray-200 rounded-lg mb-4" />
        <div className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
        <div className="w-1/2 h-4 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-white rounded-xl border p-6 text-center">
        <p className="text-gray-600 mb-4">{error || "Property not available"}</p>
        <button
          onClick={() => onRemove(propertyId)}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <PropertyCard
      key={property._id}
      property={property}
      isSaved={true}
      onToggleSave={() => onRemove(property._id)}
    />
  );
}
