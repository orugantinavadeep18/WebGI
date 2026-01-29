import { useState, useCallback } from "react";
import { apiCall } from "../lib/api";

export const useMessages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const sendMessage = useCallback(async (bookingId, receiverId, content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall("/messages", {
        method: "POST",
        body: JSON.stringify({
          bookingId,
          receiverId,
          content,
        }),
      });
      if (!response.ok) {
        throw new Error(response.message || "Failed to send message");
      }
      // Refresh messages
      await getBookingMessages(bookingId);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingMessages = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(`/messages/booking/${bookingId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(response.message || "Failed to fetch messages");
      }
      // Handle both { messages: [...] } and [ ... ] response formats
      const messagesData = response.data.messages || response.data || [];
      setMessages(messagesData);
      return messagesData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall("/messages/conversations/all", {
        method: "GET",
      });
      
      // Check if response has success flag
      if (response && response.success === false) {
        throw new Error(response.message || "Failed to fetch conversations");
      }
      
      // Handle both { conversations: [...] } and [ ... ] response formats
      const conversationsData = response?.conversations || response?.data || [];
      setConversations(conversationsData);
      return conversationsData;
    } catch (err) {
      console.error("Error in getConversations:", err);
      setError(err.message || "Failed to load conversations");
      // Return empty array instead of throwing
      setConversations([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getUnreadCount = useCallback(async () => {
    try {
      const response = await apiCall("/messages/unread/count", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(response.message || "Failed to fetch unread count");
      }
      setUnreadCount(response.data.count);
      return response.data.count;
    } catch (err) {
      setError(err.message);
      return 0;
    }
  }, []);

  return {
    loading,
    error,
    messages,
    conversations,
    unreadCount,
    sendMessage,
    getBookingMessages,
    getConversations,
    getUnreadCount,
  };
};
