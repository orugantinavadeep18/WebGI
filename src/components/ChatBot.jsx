import { useState, useEffect, useRef } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import robotAnimation from "../assets/Robot.json";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! How can I help you today? I'm here to assist with your real estate inquiries.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef(null);
  const lottieRef = useRef(null);
  const animationRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Load Lottie animation
  useEffect(() => {
    const loadLottie = async () => {
      try {
        const lottie = (await import("lottie-web")).default;

        if (lottieRef.current && !animationRef.current) {
          animationRef.current = lottie.loadAnimation({
            container: lottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: robotAnimation,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid meet",
              clearCanvas: false,
            },
          });
        }
      } catch (error) {
        console.log("Lottie animation failed to load:", error);
      }
    };

    loadLottie();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (inputValue.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    // Bot response with better context
    setTimeout(() => {
      const userMessage = inputValue.toLowerCase();
      let botResponse;

      // Smart responses based on user input
      if (
        userMessage.includes("price") ||
        userMessage.includes("cost") ||
        userMessage.includes("rent")
      ) {
        botResponse =
          "I can help you with pricing information! What property type are you interested in?";
      } else if (
        userMessage.includes("location") ||
        userMessage.includes("city") ||
        userMessage.includes("area")
      ) {
        botResponse =
          "We have properties across multiple cities. Which area interests you most?";
      } else if (
        userMessage.includes("help") ||
        userMessage.includes("assistant")
      ) {
        botResponse =
          "I'm here to help! You can ask me about properties, prices, locations, or any other real estate questions.";
      } else if (userMessage.includes("thank")) {
        botResponse =
          "You're welcome! Feel free to ask if you have any other questions.";
      } else {
        const botResponses = [
          "That's a great question! Let me help you with that.",
          "I understand. Here's what I can suggest for you.",
          "Thanks for asking! I'd be happy to assist with that.",
          "I can definitely help you with that. What else would you like to know?",
          "That's interesting! Let me provide you with more information.",
          "I'm here to help! Could you tell me more details?",
          "Great inquiry! Let me assist you with that matter.",
        ];

        botResponse =
          botResponses[Math.floor(Math.random() * botResponses.length)];
      }

      const newBotMessage = {
        id: messages.length + 3,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity duration-300"
        title={isOpen ? "Close chat" : "Open chat"}
        style={{ background: "none", border: "none", padding: 0 }}
      >
        {isOpen ? (
          <div className="w-16 h-16 rounded-full shadow-lg bg-white border-2 border-primary flex items-center justify-center text-primary hover:scale-110 transition-transform">
            <X className="w-6 h-6" />
          </div>
        ) : (
          <div 
            ref={lottieRef} 
            style={{ 
              width: "384px", 
              height: "384px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              cursor: "pointer"
            }}
          />
        )}
      </button>

      {/* Chatbot Container */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col border border-border animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">WebGI Assistant</h3>
                <p className="text-sm text-white/80">
                  {isLoading ? "Typing..." : "Online - Always here to help"}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={chatMessagesRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-foreground border border-border rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-foreground border border-border px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-border bg-white rounded-b-lg"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || inputValue.trim() === ""}
                className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="px-4 py-2 text-center text-xs text-muted-foreground bg-gray-50 border-t border-border">
            Powered by WebGI
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
