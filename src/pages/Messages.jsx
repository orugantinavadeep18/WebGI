import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { formatDistanceToNow } from "date-fns";
import { Send, MessageCircle } from "lucide-react";

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    conversations,
    messages,
    loading,
    sendMessage,
    getConversations,
    getBookingMessages,
  } = useMessages();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    try {
      await getConversations();
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    try {
      await getBookingMessages(conversation.booking._id);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      const receiverId = selectedConversation.booking.propertyOwner === user.id
        ? selectedConversation.booking.renter
        : selectedConversation.booking.propertyOwner;

      await sendMessage(selectedConversation.booking._id, receiverId, messageText);
      setMessageText("");
      // Refresh messages
      await getBookingMessages(selectedConversation.booking._id);
    } catch (error) {
      console.error("Failed to send message:", error);
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
                    key={conversation.booking._id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.booking._id === conversation.booking._id
                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium truncate">
                          {conversation.booking.property?.title || "Property"}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.lastMessage?.createdAt
                        ? formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                            addSuffix: true,
                          })
                        : "No messages"}
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
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="font-semibold">
                  {selectedConversation.booking.property?.title || "Property"}
                </h2>
                <p className="text-sm text-gray-600">
                  Booking: {new Date(selectedConversation.booking.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender === user.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === user.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === user.id
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
