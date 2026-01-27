const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: (data) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getCurrentUser: () =>
    apiCall("/auth/me", {
      method: "GET",
    }),

  updateProfile: (data) =>
    apiCall("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Property APIs
export const propertyAPI = {
  getAllProperties: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/properties?${params}`, {
      method: "GET",
    });
  },

  getPropertyById: (id) =>
    apiCall(`/properties/${id}`, {
      method: "GET",
    }),

  createProperty: (data) =>
    apiCall("/properties", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProperty: (id, data) =>
    apiCall(`/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProperty: (id) =>
    apiCall(`/properties/${id}`, {
      method: "DELETE",
    }),

  getSellerProperties: () =>
    apiCall("/properties/seller/my-properties", {
      method: "GET",
    }),

  uploadImages: (propertyId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const token = localStorage.getItem("token");
    return fetch(`${API_BASE_URL}/properties/${propertyId}/upload-images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((res) => res.json());
  },

  searchProperties: (query) =>
    apiCall(`/properties/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
    }),
};
