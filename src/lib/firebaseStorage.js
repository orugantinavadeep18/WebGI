/**
 * ImageKit Upload Utilities (Backend API)
 * 
 * NOTE: Images are uploaded through the backend API which handles ImageKit integration.
 * This keeps the ImageKit private key secure and provides better security.
 * 
 * Usage:
 * const updatedProperty = await uploadImagesToProperty(propertyId, files);
 */

import { propertyAPI } from "./api";

/**
 * Upload multiple files to a property via backend API (which uses ImageKit)
 * @param {string} propertyId - The property ID
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<Object>} - Updated property with new images
 */
export const uploadImagesToProperty = async (propertyId, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    return await propertyAPI.uploadImages(propertyId, formData);
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

/**
 * Delete an image from a property
 * @param {string} propertyId - The property ID
 * @param {string} imageId - The image index to delete
 * @returns {Promise<Object>} - Updated property
 */
export const deletePropertyImage = async (propertyId, imageId) => {
  try {
    return await propertyAPI.deleteImage(propertyId, imageId);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

/**
 * Generate image URL with transformations (ImageKit CDN)
 * @param {string} url - The original ImageKit URL
 * @param {Object} transforms - Transformation options (width, height, quality)
 * @returns {string} - Transformed URL
 */
export const getImageURL = (url, transforms = {}) => {
  if (!url) return "";
  
  // If URL already has transformations, return as is
  if (url.includes("/tr:")) return url;
  
  const { width, height, quality = 80 } = transforms;
  const baseUrl = url.split("/tr:")[0]; // Remove any existing transforms
  
  let transformString = `q-${quality}`;
  if (width && height) transformString += `,w-${width},h-${height}`;
  else if (width) transformString += `,w-${width}`;
  else if (height) transformString += `,h-${height}`;
  
  // Insert transformation into ImageKit URL
  const parts = baseUrl.split("/");
  const domainIndex = 3; // https://ik.imagekit.io/xxx/path -> insert at index 3
  return `${parts.slice(0, domainIndex).join("/")}/tr:${transformString}/${parts.slice(domainIndex).join("/")}`;
};

// DEPRECATED FUNCTIONS - Kept for backward compatibility
export const uploadFileToFirebase = async () => {
  throw new Error("uploadFileToFirebase is deprecated. Use uploadImagesToProperty instead.");
};

export const uploadMultipleFilesToFirebase = async () => {
  throw new Error("uploadMultipleFilesToFirebase is deprecated. Use uploadImagesToProperty instead.");
};

export const deleteFileFromFirebase = async () => {
  throw new Error("deleteFileFromFirebase is deprecated. Use deletePropertyImage instead.");
};

export const getFileDownloadURL = async () => {
  throw new Error("getFileDownloadURL is deprecated. ImageKit URLs work directly.");
};
