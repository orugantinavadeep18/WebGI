import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Upload, X, Loader } from "lucide-react";
import { propertyAPI } from "../../lib/api";

export default function PropertyImageUpload({
  property,
  onClose,
  onSuccess,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.filter((file) => file.type.startsWith("image/"));

    if (newFiles.length !== files.length) {
      setError("Only image files are allowed");
    }

    setSelectedFiles([...selectedFiles, ...newFiles]);

    // Create previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await propertyAPI.uploadImages(property._id, formData);

      if (response.success) {
        setSelectedFiles([]);
        setPreviews([]);
        onSuccess(response.property);
      } else {
        setError(response.message || "Upload failed");
      }
    } catch (err) {
      setError(err.message || "Failed to upload images");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Upload Photos - {property.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Images */}
          {property.images && property.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Images ({property.images.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.images.map((image, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={image.url}
                      alt={`Property ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                      <button className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        ✕ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Photos
            </h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Upload className="mx-auto text-gray-400 mb-2" size={40} />
              <p className="text-gray-900 font-semibold mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-600 text-sm">
                PNG, JPG, GIF up to 10MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Selected Files Preview */}
          {previews.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selected Images ({previews.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                    />
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
            💡 <strong>Tip:</strong> Upload high-quality images with good
            lighting. Properties with photos get 5x more views!
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 flex items-center gap-2"
            disabled={selectedFiles.length === 0 || uploading}
          >
            {uploading && <Loader size={18} className="animate-spin" />}
            {uploading
              ? "Uploading..."
              : `Upload ${selectedFiles.length} Photo${selectedFiles.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
