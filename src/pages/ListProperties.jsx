import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "../hooks/useProperties";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Edit2, Trash2, Plus, Upload, Eye, MapPin } from "lucide-react";
import PropertyImageUpload from "../components/property/PropertyImageUpload";
import PropertyEditForm from "../components/property/PropertyEditForm";

export default function ListProperties() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { getSellerProperties, deleteProperty } = useProperties();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return; // Still loading auth state, don't redirect yet
    }

    if (!user) {
      navigate("/auth");
      return;
    }

    fetchProperties();
  }, [user, authLoading, navigate]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSellerProperties();
      setProperties(response.properties || []);
    } catch (err) {
      setError(err.message || "Failed to fetch properties");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      await deleteProperty(propertyId);
      setProperties(properties.filter((p) => p._id !== propertyId));
    } catch (err) {
      alert("Failed to delete property: " + err.message);
    }
  };

  const handleImageUploadSuccess = (updatedProperty) => {
    setProperties(
      properties.map((p) => (p._id === updatedProperty._id ? updatedProperty : p))
    );
    setShowUploadModal(false);
  };

  const handleEditSuccess = (updatedProperty) => {
    setProperties(
      properties.map((p) => (p._id === updatedProperty._id ? updatedProperty : p))
    );
    setShowEditModal(false);
    setSelectedProperty(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">Please log in to list properties</p>
          <Button onClick={() => navigate("/auth")} className="bg-blue-600">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Properties</h1>
            <p className="text-gray-600 mt-2">
              Manage and showcase your listings
            </p>
          </div>
          <Button
            onClick={() => navigate("/create-property")}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus size={20} />
            List New Property
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900">
                  {properties.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MapPin className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">
                  {properties.reduce((sum, p) => sum + (p.views || 0), 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Eye className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Images Uploaded</p>
                <p className="text-3xl font-bold text-gray-900">
                  {properties.reduce((sum, p) => sum + (p.images?.length || 0), 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Upload className="text-purple-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <Button
              onClick={fetchProperties}
              variant="outline"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <Card className="p-12 text-center">
            <div className="mb-4">
              <MapPin className="mx-auto text-gray-400" size={48} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Properties Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start by listing your first property
            </p>
            <Button
              onClick={() => navigate("/create-property")}
              className="bg-blue-600"
            >
              Create Your First Listing
            </Button>
          </Card>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onEdit={() => {
                  setSelectedProperty(property);
                  setShowEditModal(true);
                }}
                onUploadImages={() => {
                  setSelectedProperty(property);
                  setShowUploadModal(true);
                }}
                onDelete={() => handleDelete(property._id)}
                onView={() => navigate(`/properties/${property._id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedProperty && (
        <PropertyImageUpload
          property={selectedProperty}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleImageUploadSuccess}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedProperty && (
        <PropertyEditForm
          property={selectedProperty}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProperty(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

// Property Card Component
function PropertyCard({ property, onEdit, onUploadImages, onDelete, onView }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0].url}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <Upload className="text-gray-400" size={32} />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ₹{(property.price / 100000).toFixed(1)}L
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
          {property.images?.length || 0} photos
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
          {property.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <MapPin size={14} />
          {property.city}, {property.state}
        </p>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-600">Beds</p>
            <p className="font-semibold">{property.bedrooms}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-600">Bath</p>
            <p className="font-semibold">{property.bathrooms}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-600">Views</p>
            <p className="font-semibold">{property.views || 0}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Status */}
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              property.status === "available"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {property.status || "Available"}
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onView}
            variant="outline"
            className="text-xs"
            size="sm"
          >
            View
          </Button>
          <Button
            onClick={onUploadImages}
            variant="outline"
            className="text-xs"
            size="sm"
          >
            <Upload size={14} className="mr-1" />
            Photos
          </Button>
          <Button
            onClick={onEdit}
            variant="outline"
            className="text-xs"
            size="sm"
          >
            <Edit2 size={14} className="mr-1" />
            Edit
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            className="text-xs text-red-600 hover:bg-red-50"
            size="sm"
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
