const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://webgi-2-vpru.onrender.com/api";

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Always add token if available, unless explicitly disabled
  if (token && options.headers?.["Authorization"] !== "none") {
    headers.Authorization = `Bearer ${token}`;
    console.log(`✓ Token added to request for ${endpoint}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        // Don't redirect - let the component handle it
        const error = new Error("Unauthorized - Token expired or invalid");
        error.status = 401;
        throw error;
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
    apiCall(`/rentals/${id}`, {
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

  // Booking endpoints
  bookings: {
    create: (bookingData) =>
      apiCall("/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      }),
    getOwnerRequests: () =>
      apiCall("/bookings/owner/requests", {
        method: "GET",
      }),
    getRenterBookings: () =>
      apiCall("/bookings/renter/bookings", {
        method: "GET",
      }),
    getBooking: (bookingId) =>
      apiCall(`/bookings/${bookingId}`, {
        method: "GET",
      }),
    accept: (bookingId) =>
      apiCall(`/bookings/${bookingId}/accept`, {
        method: "PUT",
      }),
    reject: (bookingId) =>
      apiCall(`/bookings/${bookingId}/reject`, {
        method: "PUT",
      }),
    cancel: (bookingId) =>
      apiCall(`/bookings/${bookingId}/cancel`, {
        method: "PUT",
      }),
  },

  // Messaging endpoints
  messages: {
    send: (messageData) =>
      apiCall("/messages", {
        method: "POST",
        body: JSON.stringify(messageData),
      }),
    getBookingMessages: (bookingId) =>
      apiCall(`/messages/booking/${bookingId}`, {
        method: "GET",
      }),
    getConversations: () =>
      apiCall("/messages/conversations/all", {
        method: "GET",
      }),
    getUnreadCount: () =>
      apiCall("/messages/unread/count", {
        method: "GET",
      }),
  },
};
