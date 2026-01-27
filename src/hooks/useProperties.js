import { useState, useCallback } from "react";
import { propertyAPI } from "../lib/api";

export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAllProperties(filters);
      setProperties(response.properties || []);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  });

  const getPropertyById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await propertyAPI.getPropertyById(id);
      setError(null);
      return response.property;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  });

  const createProperty = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await propertyAPI.createProperty(data);
      setError(null);
      return response.property;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  });

  const updateProperty = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const response = await propertyAPI.updateProperty(id, data);
      setError(null);
      return response.property;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  });

  const deleteProperty = useCallback(async (id) => {
    try {
      setLoading(true);
      await propertyAPI.deleteProperty(id);
      setProperties(properties.filter((p) => p._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  });

  const uploadImages = useCallback(async (propertyId, files) => {
    try {
      setLoading(true);
      const response = await propertyAPI.uploadImages(propertyId, files);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  });

  const searchProperties = useCallback(async (query) => {
    try {
      setLoading(true);
      const response = await propertyAPI.searchProperties(query);
      setProperties(response.properties || []);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  });

  const getSellerProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getSellerProperties();
      setProperties(response.properties || []);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  });

  return {
    properties,
    loading,
    error,
    fetchProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadImages,
    searchProperties,
    getSellerProperties,
  };
};
