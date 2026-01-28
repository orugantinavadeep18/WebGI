import { useState, useEffect, useRef } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import robotAnimation from "../assets/Robot.json";
import { propertyAPI } from "../lib/api";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm the WebGI Assistant. I can help you with:\n• 🏠 Property information & browsing\n• 💰 Pricing & budget planning\n• 📍 Location-based queries\n• 🤖 How AI recommendations work\n• 🔐 Login & account help\n• 📅 Booking assistance\n• 📋 Listing your properties\n\nWhat can I help you with?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef(null);
  const lottieRef = useRef(null);
  const animationRef = useRef(null);
  const [propertyStats, setPropertyStats] = useState(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch property stats on mount
  useEffect(() => {
    const fetchPropertyStats = async () => {
      try {
        const response = await propertyAPI.getAllProperties();
        if (response && response.properties) {
          const properties = response.properties;
          setPropertyStats({
            total: properties.length,
            byType: properties.reduce((acc, prop) => {
              acc[prop.propertyType] = (acc[prop.propertyType] || 0) + 1;
              return acc;
            }, {}),
            byCity: properties.reduce((acc, prop) => {
              acc[prop.city] = (acc[prop.city] || 0) + 1;
              return acc;
            }, {}),
            avgPrice: properties.length > 0 
              ? (properties.reduce((sum, prop) => sum + (prop.price || 0), 0) / properties.length).toFixed(2)
              : 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch property stats:", error);
      }
    };

    fetchPropertyStats();
  }, []);

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

    // Bot response with database integration
    setTimeout(() => {
      const userMessage = inputValue.toLowerCase();
      let botResponse;

      // AI Recommendations query
      if (
        userMessage.includes("ai recommend") ||
        userMessage.includes("how does ai work") ||
        userMessage.includes("recommendation algorithm") ||
        userMessage.includes("ai matching") ||
        userMessage.includes("top ai recommendation")
      ) {
        botResponse = `🤖 **How AI Recommendations Work:**\n\nOur advanced AI recommendation system uses a **hybrid scoring algorithm** that considers:\n\n1. **Price Match (25%)** - Matches your budget preferences\n2. **Ratings & Reviews (30%)** - Shows highly-rated properties\n3. **Amenities Match (25%)** - Finds properties with your desired amenities\n4. **Availability (15%)** - Prioritizes properties with open vacancies\n5. **Capacity (5%)** - Matches your occupancy needs\n\n**Smart Features:**\n✨ Learns from your search history\n✨ Updates based on filters you apply\n✨ Shows matching score (0-100)\n✨ Displays properties from multiple cities\n✨ Considers your location preferences\n\nTry applying filters and watch the recommendations update in real-time! They appear in the "Top AI Recommendations" panel on the properties page.`;
      }
      // Login/Account query
      else if (
        userMessage.includes("login") ||
        userMessage.includes("sign in") ||
        userMessage.includes("account") ||
        userMessage.includes("password") ||
        userMessage.includes("register") ||
        userMessage.includes("create account") ||
        userMessage.includes("how to sign up")
      ) {
        botResponse = `🔐 **Login & Account Help:**\n\n**For New Users:**\n1. Click "Account" button (top right)\n2. Click "Sign Up"\n3. Enter your email and password\n4. Verify your email\n5. Complete your profile\n\n**For Existing Users:**\n1. Click "Account" button\n2. Click "Sign In"\n3. Enter your email and password\n4. You're logged in!\n\n**Account Features Once Logged In:**\n✅ Browse and save properties\n✅ List your own properties\n✅ Make booking requests\n✅ Send messages to property owners\n✅ Track your bookings\n✅ Manage your profile\n\n**Having Issues?**\n• Forgot password? Click "Forgot Password" on login\n• Email not verified? Check your spam folder\n• Account locked? Contact support\n\nReady to get started?`;
      }
      // Properties count query
      else if (
        userMessage.includes("how many properties") ||
        userMessage.includes("total properties") ||
        userMessage.includes("properties available") ||
        (userMessage.includes("how many") && userMessage.includes("property"))
      ) {
        botResponse = propertyStats
          ? `We currently have **${propertyStats.total} properties** available on WebGI! 🏠\n\n**Breakdown by type:**\n${Object.entries(propertyStats.byType)
              .map(([type, count]) => `• ${type}: ${count}`)
              .join("\n")}\n\n**Statistics:**\n📊 Average price: **₹${propertyStats.avgPrice}**\n🌍 Available across multiple cities\n\nUse filters to narrow down your search!`
          : "We have multiple properties available! Let me fetch the latest count for you...";
      }
      // Property types query
      else if (
        userMessage.includes("property type") ||
        userMessage.includes("types of properties") ||
        userMessage.includes("what properties") ||
        userMessage.includes("property categories")
      ) {
        botResponse = propertyStats
          ? `Here are the property types we offer:\n\n${Object.entries(propertyStats.byType)
              .map(([type, count]) => `• **${type}**: ${count} available`)
              .join("\n")}\n\nEach property type has unique features. Filter by type on the properties page to explore!`
          : "We offer various property types including apartments, houses, villas, hostels, and more!";
      }
      // Location-based query
      else if (
        userMessage.includes("location") ||
        userMessage.includes("city") ||
        userMessage.includes("area") ||
        userMessage.includes("where") ||
        userMessage.includes("cities") ||
        userMessage.includes("bangalore") ||
        userMessage.includes("hyderabad") ||
        userMessage.includes("chennai")
      ) {
        botResponse = propertyStats && propertyStats.byCity
          ? `We have properties in the following locations:\n\n${Object.entries(propertyStats.byCity)
              .map(([city, count]) => `📍 **${city}**: ${count} properties`)
              .join("\n")}\n\nClick on any city from the menu bar to see properties there, or use our AI recommendations for smart matches!`
          : "We have properties across multiple cities. Use the city selector at the top to browse properties in your preferred location!";
      }
      // Price query
      else if (
        userMessage.includes("price") ||
        userMessage.includes("cost") ||
        userMessage.includes("afford") ||
        userMessage.includes("budget") ||
        userMessage.includes("how much")
      ) {
        botResponse = propertyStats
          ? `💰 **Pricing Information:**\n\nAverage property price on WebGI: **₹${propertyStats.avgPrice}**\n\nWe have properties at various price points:\n✅ Budget-friendly options\n✅ Mid-range properties\n✅ Premium listings\n\n**How to find properties in your budget:**\n1. Go to Properties page\n2. Use the "Price Range" filter on the left\n3. Adjust the slider to your budget\n4. Properties will update automatically\n5. AI recommendations also respect your budget!\n\nTip: The new price range is **₹0 - ₹20,000** for easier filtering!`
          : "We have properties at various price points to fit different budgets. Use the price filter on the properties page!";
      }
      // Booking query
      else if (
        userMessage.includes("book") ||
        userMessage.includes("reserve") ||
        userMessage.includes("booking")
      ) {
        botResponse =
          `📅 **How to Book a Property:**\n\n**Step-by-Step Guide:**\n1. **Login** - Create an account if you don't have one\n2. **Browse** - Explore properties or use AI recommendations\n3. **Click Property** - Open the property details\n4. **Check Details** - Review amenities, price, location\n5. **Send Request** - Click "Request Booking"\n6. **Fill Info** - Provide your details and move-in date\n7. **Wait** - Owner will approve or decline\n8. **Confirm** - Once approved, complete the booking\n\n**After Booking:**\n✅ Message the owner\n✅ Arrange viewing\n✅ Complete transaction\n✅ Move in!\n\n**Need help finding a property?** I can help you search!`;
      }
      // Upload/Sell query
      else if (
        userMessage.includes("upload") ||
        userMessage.includes("sell") ||
        userMessage.includes("list") ||
        userMessage.includes("add property") ||
        userMessage.includes("post property")
      ) {
        botResponse =
          `📋 **How to List Your Property:**\n\n**Step-by-Step:**\n1. **Login** - Sign in to your account\n2. **Go to "List Your Property"** button (top right)\n3. **Fill Basic Info:**\n   - Property name & description\n   - Location & address\n   - Property type (house, apartment, hostel, etc.)\n4. **Add Details:**\n   - Price per month\n   - Capacity\n   - Available vacancies\n5. **Add Amenities:**\n   - WiFi, Food, AC, Parking\n   - Laundry, Power Backup, Security, CCTV\n6. **Upload Images:**\n   - Click "Add Images"\n   - Upload property photos\n   - Our system stores them securely\n7. **Preview & Publish** - Review and go live!\n\n**After Listing:**\n📊 Appear in search results\n🤖 Featured in AI recommendations\n💬 Receive booking requests\n📧 Message interested renters\n\nYour property reaches 50+ renters immediately!`;
      }
      // Messages/Communication
      else if (
        userMessage.includes("message") ||
        userMessage.includes("chat") ||
        userMessage.includes("contact")
      ) {
        botResponse =
          `💬 **Direct Messaging:**\n\n**How to Message:**\n1. **Click on any AI Recommendation** - Navigate to property details\n2. **Click "Contact Owner"** button\n3. **Send Message** - Type your message\n4. **Instant Notification** - Owner receives alert\n5. **Get Response** - Check Messages section\n\n**What You Can Do:**\n✅ Ask about property availability\n✅ Negotiate prices\n✅ Schedule viewings\n✅ Ask questions about amenities\n✅ Share documents\n\n**Safety Features:**\n🔒 All messages are secure\n📝 Conversation history tracked\n⚠️ Report inappropriate messages\n✨ Professional communication platform\n\nMessages are perfect for quick negotiations!`;
      }
      // Help/Features
      else if (
        userMessage.includes("help") ||
        userMessage.includes("feature") ||
        userMessage.includes("how do") ||
        userMessage.includes("what can")
      ) {
        botResponse =
          `📚 **WebGI Features & Help:**\n\n**🏠 Browse Properties:**\n✅ Filter by type, price, location\n✅ View AI recommendations\n✅ Save favorites\n✅ Check amenities\n\n**🤖 Smart AI System:**\n✅ Personalized recommendations\n✅ Matches based on preferences\n✅ Updates with filters\n✅ Scoring algorithm (0-100)\n\n**📋 Manage Listings:**\n✅ Create property listings\n✅ Upload images\n✅ Set pricing\n✅ Track bookings\n\n**💬 Communication:**\n✅ Message property owners\n✅ Negotiate deals\n✅ Schedule viewings\n✅ Secure conversations\n\n**👤 Account:**\n✅ Create & manage profile\n✅ Track bookings\n✅ View saved properties\n✅ Manage messages\n\n**Any Specific Topic?**\nAsk me about AI recommendations, login, booking, or listing!`;
      }
      // Thank you
      else if (userMessage.includes("thank")) {
        botResponse =
          `You're welcome! 😊 Feel free to ask if you have any other questions about WebGI, AI recommendations, booking, or listing properties. I'm here to help!`;
      }
      // Default helpful response with context
      else {
        const suggestions = [
          "That's a great question! 🤔 I can help with AI recommendations, bookings, listings, login, or property search. What interests you?",
          "I'm here to help! 👍 You can ask me about how AI works, logging in, finding properties, or listing your own.",
          "Thanks for asking! 📍 Would you like to know about AI recommendations, how to book, how to login, or how to list your property?",
          "That's interesting! 💡 I can explain our AI system, help with bookings, guide through login, or assist with listing.",
          "Great inquiry! 🎯 You can ask me about property availability, AI matching, login help, booking process, or anything about WebGI.",
        ];

        botResponse =
          suggestions[Math.floor(Math.random() * suggestions.length)];
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
      {/* Floating Button - Small */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-300 group"
        title={isOpen ? "Close chat" : "Open chat"}
        style={{ background: "none", border: "none", padding: 0 }}
      >
        {isOpen ? (
          <div className="w-14 h-14 rounded-full shadow-lg bg-white border-2 border-primary flex items-center justify-center text-primary hover:scale-110 transition-transform">
            <X className="w-5 h-5" />
          </div>
        ) : (
          <>
            <div 
              ref={lottieRef} 
              style={{ 
                width: "180px", 
                height: "180px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: "pointer"
              }}
            />
            {/* Idle Message Tooltip */}
            <div className="absolute bottom-24 right-0 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-primary">
              👋 Hi! I'm WebGI Assistant
            </div>
          </>
        )}
      </button>

      {/* Chatbot Container - Large */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col border border-border animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white p-5 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">WebGI Assistant</h3>
                <p className="text-sm text-white/80">
                  {isLoading ? "⏳ Typing..." : "✅ Online - Always here to help"}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={chatMessagesRef}
            className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "bg-primary text-white rounded-br-none shadow-md"
                      : "bg-white text-foreground border border-border rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  <span className={`text-xs opacity-70 mt-2 block ${
                    message.sender === "user" ? "text-white/80" : ""
                  }`}>
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
                <div className="bg-white text-foreground border border-border px-4 py-3 rounded-lg rounded-bl-none shadow-sm">
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
            className="p-4 border-t border-border bg-white"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about properties, booking, or features..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || inputValue.trim() === ""}
                className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="px-4 py-3 text-center text-xs text-muted-foreground bg-gray-50 border-t border-border">
            💡 Tip: Ask about property count, types, locations, or booking process
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
