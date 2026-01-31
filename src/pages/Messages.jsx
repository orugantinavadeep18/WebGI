import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { formatDistanceToNow } from "date-fns";
import { Send, MessageCircle, ArrowLeft, Loader2 } from "lucide-react";
import { apiCall } from "@/lib/api";
import { toast } from "sonner";

export default function Messages() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const {
    conversations,
    messages,
    loading,
    sendMessage,
    getConversations,
    getBookingMessages,
  } = useMessages();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [directMessages, setDirectMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }
    loadConversations();
  }, [user, authLoading, navigate]);

  // If sellerId is provided, load direct messages with that seller
  useEffect(() => {
    if (sellerId && user) {
      loadDirectMessages();
      // Set up auto-refresh every 3 seconds
      const interval = setInterval(() => {
        loadDirectMessages();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sellerId, user]);

  const loadConversations = async () => {
    try {
      await getConversations();
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadDirectMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await apiCall(`/messages/direct/${sellerId}`, {
        method: "GET",
      });
      if (response && response.messages) {
        setDirectMessages(response.messages);
      } else if (Array.isArray(response)) {
        setDirectMessages(response);
      } else {
        setDirectMessages([]);
      }
    } catch (error) {
      console.error("Failed to load direct messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    try {
      await getBookingMessages(conversation.bookingId);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    try {
      if (sellerId) {
        // Send direct message
        try {
          const response = await apiCall("/messages/direct/send", {
            method: "POST",
            body: JSON.stringify({
              receiverId: sellerId,
              content: messageText,
            }),
          });
          if (response && response.data) {
            setMessageText("");
            // Reload direct messages
            await loadDirectMessages();
            toast.success("Message sent!");
          }
        } catch (error) {
          console.error("Error sending direct message:", error);
          toast.error(error.message || "Failed to send message");
        }
      } else if (selectedConversation) {
        // Send booking-based message
        await sendMessage(selectedConversation.bookingId, selectedConversation.otherPartyId, messageText);
        setMessageText("");
        // Refresh messages
        await getBookingMessages(selectedConversation.bookingId);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Please log in to view messages.</p>
        </div>
      </Layout>
    );
  }

  // Direct message view (from PropertyDetail)
  if (sellerId) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold">Message Seller</h1>
          </div>

          {/* Messages Card */}
          <Card className="flex flex-col h-[600px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : directMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                directMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender === user.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === user.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === user.id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={isSending}
                />
                <Button
                  type="submit"
                  disabled={isSending || !messageText.trim()}
                  size="icon"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </Card>

          {/* Safety Info */}
          <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Safety Tip:</strong> Always meet in person before making any commitments. Never share personal financial details online.
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  // Conversation list view
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="border rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gray-50 p-4 border-b">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading && conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.bookingId}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.bookingId === conversation.bookingId
                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium truncate">
                          {conversation.property?.title || "Property"}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(conversation.lastMessageTime), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
              {/* Chat Header */}
              <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    {selectedConversation.property?.title || "Property"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Status: {selectedConversation.bookingStatus || "Active"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading && messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender === user?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === user?.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        {message.sender !== user?.id && (
                          <p className="text-xs font-semibold mb-1 opacity-80">
                            {selectedConversation.otherPartyId === message.sender
                              ? "Them"
                              : "You"}
                          </p>
                        )}
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === user?.id
                              ? "text-blue-100"
                              : "text-gray-600"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t p-4 flex gap-2"
              >
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isSending || !messageText.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ) : (
            <div className="md:col-span-2 border rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
