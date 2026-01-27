import { useState, useCallback } from "react";
import api from "../lib/api";

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
      const response = await api.messages.send({
        bookingId,
        receiverId,
        content,
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
      const response = await api.messages.getBookingMessages(bookingId);
      if (!response.ok) {
        throw new Error(response.message || "Failed to fetch messages");
      }
      setMessages(response.data);
      return response.data;
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
      const response = await api.messages.getConversations();
      if (!response.ok) {
        throw new Error(response.message || "Failed to fetch conversations");
      }
      setConversations(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUnreadCount = useCallback(async () => {
    try {
      const response = await api.messages.getUnreadCount();
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
