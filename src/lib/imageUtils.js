/**
 * Image Utility Functions - Professional Image Management
 * Strategy:
 * 1. ONLY use uploaded property images (from ImageKit or local uploads)
 * 2. If no images exist, show "No Preview Available" message
 * 3. NO online/web placeholders - only professional uploaded content
 * 4. New properties without uploads will show "No Preview"
 */

// SVG placeholder for "No Preview" message
const NO_PREVIEW_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23F3F4F6" width="400" height="300"/%3E%3Ctext x="50%" y="45%" font-size="16" font-weight="bold" fill="%23374151" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif"%3ENo Preview Available%3C/text%3E%3Ctext x="50%" y="60%" font-size="12" fill="%23666" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif"%3EImages will be available after upload%3C/text%3E%3C/svg%3E';

/**
 * Get image URL - ONLY from uploaded images
 * @param {Object} property - Property object with images array
 * @param {number} imageIndex - Index of image to get (default 0)
 * @returns {string} - Image URL or "No Preview" placeholder
 */
export const getPropertyImageUrl = (property, imageIndex = 0) => {
  try {
    // ONLY use uploaded images
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      const image = property.images[imageIndex];
      if (image) {
        // Handle both string URL and object with url property
        const imageUrl = typeof image === 'string' ? image : image?.url;
        if (imageUrl && isValidUrl(imageUrl)) {
          return imageUrl;
        }
      }
    }

    // No images: Return "No Preview Available" placeholder
    return NO_PREVIEW_PLACEHOLDER;
  } catch (error) {
    console.warn('Error getting property image URL:', error);
    return DEFAULT_PLACEHOLDER;
  }
};

/**
 * Get all image URLs for a property - ONLY uploaded images
 * @param {Object} property - Property object
 * @returns {Array} - Array of image URLs or empty array if no images
 */
export const getPropertyImageUrls = (property) => {
  const imageUrls = [];

  try {
    // Get ONLY uploaded images
    if (property?.images && Array.isArray(property.images)) {
      for (let i = 0; i < property.images.length; i++) {
        const image = property.images[i];
        const imageUrl = typeof image === 'string' ? image : image?.url;
        if (imageUrl && isValidUrl(imageUrl)) {
          imageUrls.push(imageUrl);
        }
      }
    }

    // Return uploaded images if available, otherwise empty array
    return imageUrls.length > 0 ? imageUrls : [];
  } catch (error) {
    console.warn('Error getting property image URLs:', error);
    return [];
  }
};

/**
 * Validate if URL is valid and accessible
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is valid
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Check if it's a data URL
    if (url.startsWith('data:')) return true;
    
    // Check if it's a relative path (starts with / or ./)
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) return true;
    
    // Check if it's an absolute URL
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Handle image loading error - show "No Preview"
 * @param {Event} e - Image error event
 * @param {string} fallbackUrl - URL to use as fallback
 */
export const handleImageError = (e, fallbackUrl = NO_PREVIEW_PLACEHOLDER) => {
  if (e?.target && fallbackUrl) {
    e.target.src = fallbackUrl;
  }
};

/**
 * Generate a web image URL with text (for dynamic placeholders)
 * NOTE: This function should NOT be used - only uploaded images allowed
 * @deprecated Use uploaded images only
 */
export const generatePlaceholderUrl = (text = 'Property', width = 400, height = 300) => {
  console.warn('⚠️ generatePlaceholderUrl should not be used - only use uploaded images');
  return NO_PREVIEW_PLACEHOLDER;
};

/**
 * Get images array with NO fallback placeholders
 * Returns ONLY uploaded images
 * @param {Object} property - Property object
 * @param {Array} defaultImages - Not used - keeping for compatibility
 * @returns {Array} - Array of uploaded images or empty array
 */
export const getPropertyGalleryImages = (property, defaultImages = null) => {
  try {
    const uploadedImages = getPropertyImageUrls(property);
    
    // Return ONLY uploaded images if available
    if (uploadedImages && uploadedImages.length > 0) {
      return uploadedImages;
    }

    // No uploaded images: return empty array
    return [];
  } catch (error) {
    console.warn('Error getting property gallery images:', error);
    return [];
  }
};

/**
 * Create an img element with proper error handling
 * Shows "No Preview" if image fails to load
 * @param {Object} options - Configuration options
 * @returns {Object} - Object with src and onError props for img element
 */
export const getImageProps = (property, imageIndex = 0, fallbackUrl = null) => {
  const primaryUrl = getPropertyImageUrl(property, imageIndex);
  // Always fallback to NO_PREVIEW_PLACEHOLDER (never online images)
  const fallback = NO_PREVIEW_PLACEHOLDER;

  return {
    src: primaryUrl,
    onError: (e) => handleImageError(e, fallback),
  };
};
