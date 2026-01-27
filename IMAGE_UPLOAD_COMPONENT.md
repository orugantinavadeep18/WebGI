# Image Upload Component - Ready to Use

## 📝 Complete Image Upload Component

Copy and use this component in your property pages:

```jsx
import { useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";

export default function PropertyImageUpload({ propertyId, onSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const { uploadImages, loading, error } = useProperties();
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (files.length + preview.length > 10) {
      alert("Maximum 10 images allowed per property");
      return;
    }

    // Validate file sizes (10MB max per file)
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Max 10MB per file.`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);

    // Generate previews
    const previews = validFiles.map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      url: URL.createObjectURL(file),
    }));
    setPreview(previews);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one image");
      return;
    }

    try {
      setUploadSuccess(false);
      const response = await uploadImages(propertyId, selectedFiles);

      console.log("Upload successful:", response);
      setSelectedFiles([]);
      setPreview([]);
      setUploadSuccess(true);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.property?.images || []);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = preview.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreview(newPreviews);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setPreview([]);
    setUploadSuccess(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border border-border rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-6">Upload Property Images</h2>

      {/* File Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Images (Max 10, 10MB each)
        </label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Supported formats: JPG, PNG, GIF, WebP
        </p>
      </div>

      {/* Preview and File List */}
      {preview.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>

          {/* Grid of previews */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {preview.map((file, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={file.url}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleRemoveFile(idx)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {file.size} MB
                </div>
              </div>
            ))}
          </div>

          {/* File list summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-900">
              <strong>{preview.length}</strong> file(s) selected{" "}
              {preview.length > 0 &&
                `(${preview
                  .reduce((sum, f) => sum + parseFloat(f.size), 0)
                  .toFixed(2)} MB)`}
            </p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">
              Images uploaded successfully!
            </p>
            <p className="text-sm text-green-700">
              Your images are now visible on the property listing.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">Upload Failed</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {preview.length > 0 && (
        <div className="flex gap-3">
          <Button
            onClick={handleUpload}
            disabled={loading || preview.length === 0}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${preview.length} Image(s)`
            )}
          </Button>

          <Button
            onClick={handleClear}
            variant="outline"
            disabled={loading}
            className="px-6"
          >
            Clear
          </Button>
        </div>
      )}

      {preview.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600">
            Select images above to see them here
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 How to Use This Component

### In Your Property Page:

```jsx
import PropertyImageUpload from "@/components/PropertyImageUpload";

export default function PropertyDetail() {
  const [property, setProperty] = useState(null);

  const handleImagesUploaded = (images) => {
    console.log("Images uploaded:", images);
    // Update property with new images
    setProperty({
      ...property,
      images,
    });
  };

  return (
    <div>
      <h1>{property?.title}</h1>
      
      {/* Image upload component */}
      <PropertyImageUpload
        propertyId={property?._id}
        onSuccess={handleImagesUploaded}
      />

      {/* Display uploaded images */}
      {property?.images && property.images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Property Images</h3>
          <div className="grid grid-cols-3 gap-4">
            {property.images.map((image, idx) => (
              <img
                key={idx}
                src={image.url}
                alt={`Property ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🎨 Component Features

### ✅ What It Does:

1. **File Selection**
   - Allow multiple image selection
   - Validate file count (max 10)
   - Validate file size (max 10MB each)

2. **Image Preview**
   - Show thumbnail previews
   - Display file names and sizes
   - Allow remove individual files

3. **Upload Progress**
   - Show loading state
   - Display success message
   - Show error messages with details

4. **User Experience**
   - Responsive design
   - Hover effects on previews
   - Clear action buttons
   - Helpful instructions

---

## 📦 Alternative: Minimal Component

If you want a simpler version:

```jsx
import { useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";

export default function SimpleImageUpload({ propertyId }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { uploadImages, loading, error } = useProperties();

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      await uploadImages(propertyId, selectedFiles);
      setSelectedFiles([]);
      alert("Images uploaded successfully!");
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
        disabled={loading}
      />

      <Button onClick={handleUpload} disabled={loading || selectedFiles.length === 0}>
        {loading ? "Uploading..." : "Upload Images"}
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

---

## 🔧 Customization Options

### Change Max Files:
```javascript
if (files.length + preview.length > 20) { // Change 10 to 20
  alert("Maximum 20 images allowed per property");
  return;
}
```

### Change Max File Size:
```javascript
if (file.size > 50 * 1024 * 1024) { // Change to 50MB
  alert(`${file.name} is too large. Max 50MB per file.`);
  return false;
}
```

### Change Grid Columns:
```javascript
{/* Change grid-cols-3 to different number */}
<div className="grid grid-cols-4 gap-4 mb-4">
```

### Add Drag and Drop:

```jsx
const [dragActive, setDragActive] = useState(false);

const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(true);
  } else if (e.type === "dragleave") {
    setDragActive(false);
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  const files = Array.from(e.dataTransfer.files);
  handleFileChange({ target: { files } });
};

// Add to JSX:
<div
  onDragEnter={handleDrag}
  onDragLeave={handleDrag}
  onDragOver={handleDrag}
  onDrop={handleDrop}
  className={`border-2 border-dashed p-8 rounded ${
    dragActive ? "border-primary bg-primary/5" : "border-gray-300"
  }`}
>
  <p>Drag and drop images here or click to select</p>
  <Input type="file" multiple onChange={handleFileChange} />
</div>
```

---

## 📱 Responsive Design Notes

- Grid: 2 columns on mobile, 3 on tablet/desktop
- Full width on mobile, max-2xl on larger screens
- Touch-friendly button sizes
- Readable font sizes on all devices

---

## 🎯 Integration Checklist

Before using the component:

- [ ] `useProperties` hook is imported correctly
- [ ] Property ID is available from parent component
- [ ] UI components (Button, Input) are available
- [ ] Icons library (lucide-react) is installed
- [ ] Tailwind CSS is configured
- [ ] Backend upload endpoint is working
- [ ] Firebase is configured in backend

---

## 🚀 Ready to Use!

Copy the component code above and start using it in your property pages!

The component handles:
- ✅ File validation
- ✅ Size checking
- ✅ Preview generation
- ✅ Upload to backend
- ✅ Firebase storage via backend
- ✅ MongoDB saving
- ✅ Success/error messages
- ✅ Loading states
- ✅ User feedback

All in one simple component! 🎉

