/**
 * Image Utility Functions
 * Handles image loading with fallback strategy:
 * 1. Use uploaded property images
 * 2. Fallback to web placeholder
 * 3. Fallback to default placeholder
 */

// Web-based placeholder images (free, no authentication needed)
const WEB_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1502707993691-d53a97db7d93?w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1555321586-3aabf00f31fe?w=400&h=300&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1544457070-4ab266c5ea50?w=400&h=300&fit=crop&auto=format&q=80',
];

// Local placeholder (simple fallback)
const DEFAULT_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23E5E7EB" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="24" fill="%23999" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif"%3ENo Image Available%3C/text%3E%3C/svg%3E';

/**
 * Get image URL with fallback strategy
 * @param {Object} property - Property object with images array
 * @param {number} imageIndex - Index of image to get (default 0)
 * @returns {string} - Image URL with fallback
 */
export const getPropertyImageUrl = (property, imageIndex = 0) => {
  try {
    // Step 1: Try to use uploaded image from property.images array
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

    // Step 2: Fallback to web placeholder image (deterministic based on property ID)
    if (property?._id) {
      const hashCode = property._id.charCodeAt(0);
      const placeholderIndex = hashCode % WEB_PLACEHOLDERS.length;
      return WEB_PLACEHOLDERS[placeholderIndex];
    }

    // Step 3: Return default placeholder
    return DEFAULT_PLACEHOLDER;
  } catch (error) {
    console.warn('Error getting property image URL:', error);
    return DEFAULT_PLACEHOLDER;
  }
};

/**
 * Get all image URLs for a property with fallback
 * @param {Object} property - Property object
 * @returns {Array} - Array of image URLs
 */
export const getPropertyImageUrls = (property) => {
  const imageUrls = [];

  try {
    // Get uploaded images
    if (property?.images && Array.isArray(property.images)) {
      for (let i = 0; i < property.images.length; i++) {
        const image = property.images[i];
        const imageUrl = typeof image === 'string' ? image : image?.url;
        if (imageUrl && isValidUrl(imageUrl)) {
          imageUrls.push(imageUrl);
        }
      }
    }

    // If we have images, return them
    if (imageUrls.length > 0) {
      return imageUrls;
    }

    // Fallback: Add web placeholder
    const webPlaceholder = getPropertyImageUrl(property, 0);
    imageUrls.push(webPlaceholder);

    return imageUrls;
  } catch (error) {
    console.warn('Error getting property image URLs:', error);
    return [getPropertyImageUrl(property, 0)];
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
    // Check if it's a data URL or valid http/https URL
    if (url.startsWith('data:')) return true;
    
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Handle image loading error with fallback
 * @param {Event} e - Image error event
 * @param {string} fallbackUrl - URL to use as fallback
 */
export const handleImageError = (e, fallbackUrl = DEFAULT_PLACEHOLDER) => {
  if (e?.target && fallbackUrl) {
    e.target.src = fallbackUrl;
  }
};

/**
 * Generate a web image URL with text (useful for dynamic placeholders)
 * @param {string} text - Text to display on placeholder
 * @param {number} width - Width of image
 * @param {number} height - Height of image
 * @returns {string} - Placeholder image URL
 */
export const generatePlaceholderUrl = (text = 'Property', width = 400, height = 300) => {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};

/**
 * Get images array with proper fallback
 * Useful for image galleries/carousels
 * @param {Object} property - Property object
 * @param {Array} defaultImages - Array of default images to use as fallback
 * @returns {Array} - Array of images with fallback
 */
export const getPropertyGalleryImages = (property, defaultImages = null) => {
  try {
    const uploadedImages = getPropertyImageUrls(property);
    
    // If we have uploaded images, use them
    if (uploadedImages.length > 0 && uploadedImages[0] !== DEFAULT_PLACEHOLDER) {
      return uploadedImages;
    }

    // Fallback to provided default images
    if (defaultImages && Array.isArray(defaultImages) && defaultImages.length > 0) {
      return defaultImages;
    }

    // Final fallback: return single placeholder
    return [getPropertyImageUrl(property, 0)];
  } catch (error) {
    console.warn('Error getting property gallery images:', error);
    return defaultImages || [DEFAULT_PLACEHOLDER];
  }
};

/**
 * Create an img element with proper error handling
 * @param {Object} options - Configuration options
 * @returns {Object} - Object with src and onError props for img element
 */
export const getImageProps = (property, imageIndex = 0, fallbackUrl = null) => {
  const primaryUrl = getPropertyImageUrl(property, imageIndex);
  const fallback = fallbackUrl || DEFAULT_PLACEHOLDER;

  return {
    src: primaryUrl,
    onError: (e) => handleImageError(e, fallback),
  };
};
