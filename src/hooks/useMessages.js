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
      // Refresh messages
      await getBookingMessages(bookingId);
      return response.message || response;
    } catch (err) {
      console.error("sendMessage error:", err);
      const errorMsg = err.message || "Failed to send message";
      setError(errorMsg);
      throw new Error(errorMsg);
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
      // Handle both { messages: [...] } and [ ... ] response formats
      const messagesData = response.messages || response || [];
      setMessages(messagesData);
      return messagesData;
    } catch (err) {
      console.error("getBookingMessages error:", err);
      const errorMsg = err.message || "Failed to fetch messages";
      setError(errorMsg);
      throw new Error(errorMsg);
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
      // Handle both { conversations: [...] } and [ ... ] response formats
      const conversationsData = response?.conversations || response?.data || response || [];
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
      const count = response.count || 0;
      setUnreadCount(count);
      return count;
    } catch (err) {
      console.error("getUnreadCount error:", err);
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
