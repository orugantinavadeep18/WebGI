import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

export const useSavedProperties = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = user ? `saved_${user._id}` : null;

  // Load saved properties from localStorage
  useEffect(() => {
    if (!STORAGE_KEY) {
      setLoading(false);
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSavedProperties(new Set(saved));
    } catch (error) {
      console.error("Error loading saved properties:", error);
      setSavedProperties(new Set());
    }
    setLoading(false);
  }, [STORAGE_KEY]);

  // Toggle save for a property
  const toggleSave = useCallback(
    (propertyId) => {
      if (!STORAGE_KEY) return;

      setSavedProperties((prev) => {
        const newSaved = new Set(prev);
        if (newSaved.has(propertyId)) {
          newSaved.delete(propertyId);
        } else {
          newSaved.add(propertyId);
        }

        // Persist to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSaved)));
        return newSaved;
      });
    },
    [STORAGE_KEY]
  );

  // Check if property is saved
  const isSaved = useCallback(
    (propertyId) => {
      return savedProperties.has(propertyId);
    },
    [savedProperties]
  );

  // Get all saved property IDs
  const getSavedIds = useCallback(() => {
    return Array.from(savedProperties);
  }, [savedProperties]);

  // Remove a specific property
  const removeSaved = useCallback(
    (propertyId) => {
      if (!STORAGE_KEY) return;

      setSavedProperties((prev) => {
        const newSaved = new Set(prev);
        newSaved.delete(propertyId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSaved)));
        return newSaved;
      });
    },
    [STORAGE_KEY]
  );

  // Clear all saved
  const clearAll = useCallback(() => {
    if (!STORAGE_KEY) return;
    setSavedProperties(new Set());
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }, [STORAGE_KEY]);

  return {
    savedProperties,
    loading,
    toggleSave,
    isSaved,
    getSavedIds,
    removeSaved,
    clearAll,
  };
};
