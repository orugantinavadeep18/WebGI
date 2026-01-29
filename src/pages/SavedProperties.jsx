import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SavedPropertyCard from "@/components/property/SavedPropertyCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { toast } from "sonner";

export default function SavedProperties() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { getSavedIds, removeSaved, clearAll } = useSavedProperties();
  
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved property IDs from localStorage
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    const savedIds = getSavedIds();
    setSavedProperties(savedIds);
    setLoading(false);
  }, [user, authLoading, navigate, getSavedIds]);

  const handleRemoveSaved = (propertyId) => {
    removeSaved(propertyId);
    setSavedProperties(prev => prev.filter(id => id !== propertyId));
    toast.success("Removed from saved properties");
  };

  const handleClearAllSaved = () => {
    if (confirm("Are you sure you want to clear all saved properties?")) {
      clearAll();
      setSavedProperties([]);
      toast.success("All saved properties cleared");
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">Please log in to view saved properties</p>
            <Button onClick={() => navigate("/auth")} className="bg-primary">
              Go to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition inline-flex items-center gap-2 text-gray-700 mb-4"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 fill-current" />
              <h1 className="text-3xl md:text-4xl font-bold">Saved Properties</h1>
            </div>
            <p className="text-white/80">
              {savedProperties.length} {savedProperties.length === 1 ? "property" : "properties"} saved
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {savedProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Saved Properties Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start exploring and save your favorite properties!
              </p>
              <Button
                onClick={() => navigate("/properties")}
                className="gap-2 bg-primary"
              >
                Browse Properties
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">My Saved Properties</h2>
                <Button
                  variant="outline"
                  onClick={handleClearAllSaved}
                  className="text-red-600 hover:text-red-700 border-red-200"
                >
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((propertyId, index) => (
                  <SavedPropertyCard
                    key={propertyId}
                    propertyId={propertyId}
                    index={index}
                    onRemove={handleRemoveSaved}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
