import { useState, useEffect, useRef } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import robotAnimation from "../assets/Robot.json";
import { propertyAPI } from "../lib/api";
import Fuse from "fuse.js";

// Comprehensive Intent Database with fuzzy matching support
const intentDatabase = [
  {
    intent: "greeting",
    patterns: [
      "hello", "hi", "hey", "greetings", "good morning", "good afternoon", 
      "good evening", "howdy", "sup", "what's up", "yo", "hola", "start"
    ],
    responses: [
      "Hello! 👋 I'm the WebGI Assistant. I help you find perfect properties with AI-powered matching, manage bookings, message owners, and list your properties. What brings you here today?",
      "Hi there! 👋 Welcome to WebGI! Your complete rental platform with 100+ properties, smart AI matching, direct messaging, and secure bookings. What can I help with?",
      "Hey! 👋 Welcome to WebGI - India's smarter rental marketplace! I can help with property search, AI recommendations, bookings, messaging owners, or listing your property. What's on your mind?"
    ]
  },
  {
    intent: "ai_recommendation",
    patterns: [
      "ai recommendation", "ai recommend", "how does ai work", "ai matching",
      "recommendation algorithm", "smart recommendations", "ai system",
      "how recommendations work", "property matching", "ai suggestions",
      "intelligent matching", "recommendation engine", "how ai matches",
      "ai features", "smart search", "personalized recommendations", "ml model"
    ],
    response: `🤖 **How WebGI AI Recommendations Work:**

**Hybrid Scoring Algorithm (0-100 Points):**

Our ML model analyzes each property and scores them:

1️⃣ **Price Match (25 points)**
   - Checks if property is within your budget
   - Closer to budget = Higher score
   - Considers price per person (capacity)

2️⃣ **Ratings & Reviews (30 points)** ⭐
   - Highly-rated properties score highest
   - Based on 0-5 star ratings
   - Recent reviews weighted more
   - Minimum 4+ stars gets full points

3️⃣ **Amenity Match (25 points)** 🏠
   - Checks for your required amenities
   - More matching amenities = Higher score
   - Weighs common amenities: WiFi, Food, AC, Parking
   - You select amenities, AI matches

4️⃣ **Availability/Vacancy (15 points)** 🔑
   - Properties with vacancies rank higher
   - Same-week availability bonus
   - Occupancy vs capacity considered

5️⃣ **Capacity Match (5 points)** 👥
   - Matches number of guests needed
   - Considers number of rooms/sharing type

**Total Score = 25+30+25+15+5 = 100 points**

**How the ML Model Works:**

📊 **Training Data:**
- 150+ rental properties in database
- Real user booking history
- Actual ratings and reviews
- Location data (10+ cities)
- Amenity combinations

🧠 **Algorithm Features:**
✅ Loads pre-trained best_model.pkl
✅ Uses Joblib for model serialization
✅ Pandas for data processing
✅ NumPy for numerical computations
✅ Real-time scoring on MongoDB data
✅ Falls back to formula if model unavailable

**Real-Time Processing:**

When you filter properties:
1. Frontend sends: City, budget, filters
2. ML server (Port 8001) receives request
3. Connects to MongoDB database
4. Scores ALL properties (0-100)
5. Sorts by score (highest first)
6. Returns top 100 recommendations
7. Saves results to recommendations.json
8. Frontend displays with match scores

**API Endpoint:**
GET https://webgi-1-w9du.onrender.com/recommend?city=Bangalore&max_budget=10000&top_k=100

**Response Includes:**
- Top K recommendations (scored)
- All scored properties (full list)
- Individual match scores
- MongoDB and Supabase data

**Smart Features:**

🔄 **Real-Time Updates**
- Changes filters → AI recalculates instantly
- No page refresh needed
- See scoring change in seconds

📚 **Learns Your Preferences**
- Tracks saved properties (favorites)
- Remembers filter history
- Improves suggestions over time
- User-specific recommendations

📍 **Multi-City Support**
- Bangalore, Hyderabad, Chennai, Mumbai, Pune, Delhi NCR
- Scores properties across all cities
- "All Cities" search available

**How to See Recommendations:**

1. Go to **Properties** page
2. Browse properties (all shown)
3. Check **"Top AI Recommendations"** panel (right sidebar)
4. Apply filters (price, amenities, type)
5. Watch AI recommendations update
6. See **ML Score** on each property card
7. Click to view high-scoring matches

**Best Practices:**

💡 **Get Better Matches:**
✅ Add multiple filters for precision
✅ Select your required amenities
✅ Set realistic budget range
✅ Choose property type
✅ Let AI learn from your saves

💡 **Pro Tips:**
✅ Use "Favorites" to show AI what you like
✅ Apply location filters to narrow down
✅ Check amenities carefully (25% of score!)
✅ High ratings matter (30% of score!)
✅ Budget stays important (25% of score!)

**Technology Stack:**

🛠️ **Backend ML Server:**
- Framework: FastAPI (Python)
- Database: MongoDB Atlas
- Model: Scikit-learn trained model
- Fallback: Formula-based scoring
- Caching: JSON file storage

🛠️ **Feature Engineering:**
Features: [Rating, Capacity, WiFi, AC, Parking]
Model: best_model.pkl (Pre-trained)

🛠️ **Frontend Integration:**
- React with Axios
- Real-time chart updates
- ML score display on cards
- Top recommendations panel
- City click analytics

**Scoring Example:**
Property: "Sky High PG, Bangalore"
- Price: ₹8,500 (Your budget: ₹10,000) = 24/25
- Rating: 4.8/5 = 28/30
- Amenities: WiFi✓, AC✓, Food✓ = 23/25
- Vacancy: 5 spots available = 14/15
- Capacity: Fits 4, you need 2 = 5/5
- TOTAL SCORE: 94/100 ✨

**Compare with:**
Property: "Budget Hostel"
- Price: ₹5,000 (Way below budget) = 12/25
- Rating: 3.2/5 = 18/30
- Amenities: Only WiFi = 8/25
- Vacancy: Full = 0/15
- Capacity: 30+ beds = 3/5
- TOTAL SCORE: 41/100

**Result:** Sky High PG ranked #1 (94 > 41) ✅

**Transparency:**
🔓 All scores calculated openly
🔓 See why each property scores
🔓 No hidden algorithm bias
🔓 Fair to all property owners
🔓 User-centric recommendations

**Questions?**
🤖 Ask about specific properties
💬 Message owners for clarification
⭐ Check reviews before booking
🤖 Let AI guide your search!`
  },
  {
    intent: "login_account",
    patterns: [
      "login", "sign in", "account", "password", "register", "sign up",
      "create account", "how to sign up", "how to login", "forgot password",
      "reset password", "account creation", "user account", "authentication",
      "verification", "email verification", "account issues", "can't login"
    ],
    response: `🔐 **Login & Account Help:**

**For New Users (Sign Up):**
1. Click the **"Account"** button (top right corner)
2. Select **"Sign Up"**
3. Enter your email address and create a password
4. Verify your email (check inbox/spam folder)
5. Complete your profile information
6. You're ready to go! 🎉

**For Existing Users (Sign In):**
1. Click the **"Account"** button
2. Select **"Sign In"**
3. Enter your registered email and password
4. Click "Login" - You're in! ✅

**Account Features Once Logged In:**
✅ Browse and save favorite properties
✅ List your own properties for rent
✅ Send booking requests to owners
✅ Message property owners directly
✅ Track all your bookings and requests
✅ Manage your profile and preferences
✅ Access personalized AI recommendations

**Troubleshooting:**
🔑 **Forgot Password?** Click "Forgot Password" on the login page
📧 **Email Not Verified?** Check your spam/junk folder
🔒 **Account Locked?** Contact our support team
❌ **Login Failed?** Double-check your email and password

Need help with anything specific? I'm here! 😊`
  },
  {
    intent: "booking",
    patterns: [
      "book", "booking", "reserve", "reservation", "how to book",
      "booking process", "book property", "make booking", "request booking",
      "booking steps", "schedule viewing", "property visit", "book a room",
      "rental process", "booking confirmation"
    ],
    response: `📅 **How to Book a Property on WebGI:**

**Step-by-Step Booking Guide:**

**Step 1: Login**
- Create an account or sign in to your existing account

**Step 2: Find Property**
- Browse properties on the Properties page
- Use AI recommendations for smart matches
- Apply filters (price, location, type, amenities)

**Step 3: View Details**
- Click on any property card
- Review property details, amenities, and pricing
- Check location and availability
- Read reviews from previous tenants

**Step 4: Request Booking**
- Click the **"Request Booking"** button
- Fill in your details:
  - Full name
  - Contact number
  - Preferred move-in date
  - Duration of stay
  - Special requirements (if any)

**Step 5: Wait for Approval**
- Property owner receives your request
- Owner reviews and responds within 24-48 hours
- You'll get a notification about approval/decline

**Step 6: Confirm & Complete**
- If approved, confirm your booking
- Arrange property viewing (if needed)
- Complete payment/documentation
- Move in! 🏠

**After Booking:**
✅ Message the owner for arrangements
✅ Schedule a property visit/viewing
✅ Complete the rental agreement
✅ Make payment as per terms
✅ Collect keys and move in!

**Tips for Successful Booking:**
💡 Book early for high-demand properties
💡 Provide complete and accurate information
💡 Be responsive to owner messages
💡 Ask questions before confirming

Need help finding the perfect property? Just ask! 😊`
  },
  {
    intent: "listing",
    patterns: [
      "list property", "upload property", "sell", "add property", "post property",
      "how to list", "listing process", "upload listing", "create listing",
      "property owner", "landlord", "rent out", "list my property",
      "add my home", "become owner", "property submission"
    ],
    response: `📋 **How to List Your Property on WebGI:**

**Step-by-Step Listing Guide:**

**Step 1: Login to Your Account**
- Sign in or create an account first
- Ensure your profile is complete

**Step 2: Navigate to Listing**
- Click **"List Your Property"** button (top right)
- You'll be directed to the listing form

**Step 3: Fill Basic Information**
📝 **Property Details:**
- Property name/title
- Detailed description (highlight unique features!)
- Full address with landmark
- City and area selection
- Property type: House, Apartment, PG, Hostel, Room, etc.

**Step 4: Set Pricing & Capacity**
💰 **Financial Details:**
- Monthly rent/price
- Security deposit (if applicable)
- Maintenance charges (if any)
- Total capacity (number of occupants)
- Currently available vacancies

**Step 5: Add Amenities**
🏠 **Select Available Facilities:**
- ✅ WiFi / High-Speed Internet
- ✅ Food / Meals Provided
- ✅ Air Conditioning (AC)
- ✅ Parking (2-wheeler/4-wheeler)
- ✅ Laundry Service
- ✅ Power Backup / Generator
- ✅ 24/7 Security
- ✅ CCTV Surveillance

**Step 6: Upload High-Quality Images**
📸 **Photo Guidelines:**
- Click **"Add Images"** button
- Upload multiple property photos (5-10 recommended)
- Include: Exterior, rooms, kitchen, bathroom, common areas
- Use good lighting and clear angles
- Images are securely stored in our system

**Step 7: Preview & Publish**
👀 **Final Review:**
- Preview your listing
- Check all details are correct
- Click **"Publish Property"**
- Your property goes live immediately! 🎉

**After Listing - What Happens Next:**
✅ Property appears in search results instantly
✅ Featured in AI recommendations to matched users
✅ Receives visibility from 50+ active users
✅ You get booking requests via dashboard
✅ Message interested renters directly
✅ Track views, favorites, and requests
✅ Edit/update listing anytime

**Tips for Great Listings:**
💡 Use clear, high-quality photos
💡 Write detailed, honest descriptions
💡 Highlight unique amenities and features
💡 Set competitive, fair pricing
💡 Respond quickly to booking requests
💡 Keep vacancy count updated

Ready to list your property and reach hundreds of renters? Let's get started! 🏠✨`
  },
  {
    intent: "pricing",
    patterns: [
      "price", "pricing", "cost", "how much", "budget", "afford", "expensive",
      "cheap", "price range", "rental cost", "monthly rent", "fees",
      "charges", "payment", "price filter"
    ],
    response: `💰 **Pricing Information on WebGI:**

**Price Range Overview:**
WebGI offers properties across various price points to fit every budget:

📊 **Budget Categories:**
- 💵 **Budget-Friendly**: ₹2,000 - ₹5,000/month
- 💵💵 **Mid-Range**: ₹5,000 - ₹12,000/month
- 💵💵💵 **Premium**: ₹12,000 - ₹20,000/month

**Average Pricing:**
🏠 Average property price on WebGI: **₹8,000 - ₹10,000/month**

**How to Find Properties in Your Budget:**

**Step 1:** Go to the **Properties** page
**Step 2:** Use the **"Price Range"** filter (left sidebar)
**Step 3:** Adjust the slider to your budget (₹0 - ₹20,000)
**Step 4:** Properties update automatically in real-time
**Step 5:** AI recommendations also respect your budget! 🤖

**Price Includes:**
✅ Monthly rent
✅ Basic amenities (varies by property)
✅ Some utilities (check property details)

**Additional Costs (Property-Specific):**
- Security deposit (usually 1-2 months rent)
- Maintenance charges
- Electricity/water (if not included)
- Internet/WiFi (if not included)

**Smart Budget Tips:**
💡 Use AI recommendations - they match your budget preferences
💡 Apply multiple filters (location + price + amenities)
💡 Compare similar properties in same area
💡 Negotiate with owners via direct messaging
💡 Check what's included in the rent
💡 Consider location vs. price trade-offs

**Special Features:**
🎯 Real-time price filtering
🎯 Sort by: Low to High, High to Low
🎯 AI considers your budget in recommendations
🎯 Transparent pricing - no hidden costs
🎯 Direct owner communication for negotiations

Looking for something specific within your budget? Tell me your price range and I'll guide you! 😊`
  },
  {
    intent: "location",
    patterns: [
      "location", "city", "area", "where", "cities", "locations",
      "bangalore", "hyderabad", "chennai", "mumbai", "delhi", "pune",
      "available cities", "which cities", "where available", "regions",
      "geographic", "places", "locality", "neighborhood"
    ],
    response: `📍 **Location & Cities on WebGI:**

**Available Cities:**
We have properties across multiple major cities in India! 🇮🇳

🏙️ **Popular Cities:**
- Bangalore (Bengaluru)
- Hyderabad
- Chennai
- Mumbai
- Pune
- Delhi NCR
- And more...

**How to Search by Location:**

**Method 1: City Selector (Top Menu)**
- Look at the top navigation bar
- Click on the **City Menu**
- Select your preferred city
- All properties filter automatically

**Method 2: AI Recommendations**
- AI considers your location preference
- Shows properties in your selected city
- Updates when you change cities

**Method 3: Search & Filters**
- Use the search bar to find specific areas
- Combine city + area filters
- Example: "Koramangala, Bangalore"

**Location-Based Features:**
✅ City-wise property browsing
✅ Area/locality filtering
✅ Distance from landmarks
✅ Proximity to offices/colleges
✅ Public transport connectivity
✅ Neighborhood information

**Property Distribution:**
Each city has multiple listings across different areas:
- IT hubs and tech parks
- University/college areas
- City centers and CBDs
- Residential neighborhoods
- Suburban localities

**Smart Location Tips:**
💡 Choose location based on your office/college
💡 Check public transport connectivity
💡 Consider commute time and distance
💡 Explore nearby amenities (markets, hospitals, etc.)
💡 Use AI recommendations for area-based matching

Looking for properties in a specific city or area? Just tell me and I'll help you search! 🗺️`
  },
  {
    intent: "property_count",
    patterns: [
      "how many properties", "total properties", "properties available",
      "number of properties", "property count", "how many listings",
      "total listings", "available properties", "properties count"
    ],
    response: `🏠 **Property Availability on WebGI:**

We have a **growing collection of properties** across multiple cities!

**Current Status:**
✅ **100+ active property listings**
✅ Properties across **10+ major cities**
✅ Multiple property types available
✅ New listings added daily!

**Property Types Distribution:**
🏢 **Apartments/Flats** - 30-40% of listings
🏠 **Independent Houses** - 20-25% of listings
🛏️ **PG (Paying Guest)** - 20-30% of listings
🏨 **Hostels** - 10-15% of listings
🏘️ **Shared Rooms** - 10-15% of listings

**Real-Time Updates:**
- Properties update constantly
- New listings added by owners daily
- Availability changes in real-time
- AI recommendations refresh automatically

**How to Explore:**
1. Go to the **Properties** page
2. Use filters to narrow down options
3. Check **AI Recommendations** for best matches
4. Sort by price, rating, or relevance

**Statistics:**
📊 Average 20-30 new listings per month
📊 Properties in 10+ cities
📊 1000+ verified users
📊 High-quality, curated listings

Want to see specific types of properties or in a particular location? Just ask! 😊`
  },
  {
    intent: "property_types",
    patterns: [
      "property types", "types of properties", "what properties", "property categories",
      "kinds of properties", "property options", "available types", "housing types",
      "accommodation types", "property varieties"
    ],
    response: `🏘️ **Property Types on WebGI:**

We offer a wide variety of accommodation types to suit every need:

**1. 🏢 Apartments/Flats**
- Modern apartments in residential complexes
- 1BHK, 2BHK, 3BHK options
- Amenities: Gym, security, parking
- Ideal for: Families, professionals

**2. 🏠 Independent Houses**
- Standalone houses with privacy
- Multiple rooms and floors
- Yard/garden space
- Ideal for: Families, groups

**3. 🛏️ PG (Paying Guest)**
- Furnished rooms with food
- Shared/private options
- Utilities included
- Ideal for: Students, working professionals

**4. 🏨 Hostels**
- Budget-friendly shared accommodation
- Common areas and facilities
- Social environment
- Ideal for: Students, backpackers

**5. 🚪 Shared Rooms**
- Cost-effective shared living
- 2-4 people per room
- Basic amenities
- Ideal for: Budget travelers, students

**How to Filter by Type:**
1. Go to **Properties** page
2. Use **"Property Type"** filter (left sidebar)
3. Select your preferred type(s)
4. Results update instantly!

**AI Recommendations:**
🤖 Our AI learns your preference and shows relevant property types

**Each Type Includes:**
- Detailed photos
- Amenity lists
- Pricing information
- Location details
- Owner contact

Looking for a specific property type? Tell me and I'll help you find it! 🏠✨`
  },
  {
    intent: "messaging",
    patterns: [
      "message", "messaging", "chat", "contact owner", "talk to owner",
      "send message", "direct message", "communication", "dm", "inbox",
      "contact", "reach out", "communicate"
    ],
    response: `💬 **Direct Messaging on WebGI:**

**How to Message Property Owners:**

**Step 1: Find Property**
- Browse properties or check AI recommendations
- Click on any property card to view details

**Step 2: Open Contact**
- Scroll to property details page
- Click the **"Contact Owner"** or **"Message Owner"** button

**Step 3: Send Message**
- Type your message in the chat box
- Include: Questions, booking interest, viewing request
- Click "Send"

**Step 4: Get Response**
- Owner receives instant notification
- Check your **Messages** section for replies
- Continue conversation in real-time

**What You Can Discuss:**
✅ Property availability and details
✅ Pricing and negotiation
✅ Schedule property viewing/visit
✅ Ask about specific amenities
✅ Clarify doubts and requirements
✅ Share documents (ID, proof, etc.)
✅ Finalize booking terms

**Messaging Features:**
🔔 Real-time notifications
💾 Conversation history saved
🔒 Secure and encrypted
📝 Professional communication platform
⚡ Instant delivery

**Safety Features:**
🛡️ All messages are secure
📜 Full conversation history tracked
⚠️ Report inappropriate messages
✅ Verified users only
🔐 Privacy protected

**Best Practices:**
💡 Be polite and professional
💡 Clearly state your requirements
💡 Ask specific questions
💡 Respond promptly to owner replies
💡 Share accurate information
💡 Keep communication on platform

Messages help you connect directly with owners for quick decisions! 📱✨`
  },
  {
    intent: "amenities",
    patterns: [
      "amenities", "facilities", "features", "what amenities", "available amenities",
      "services", "property features", "included facilities", "common amenities"
    ],
    response: `🏠 **Property Amenities on WebGI:**

**Common Amenities Available:**

**🌐 Connectivity:**
✅ WiFi / High-Speed Internet
✅ Cable TV / DTH
✅ Landline Phone

**❄️ Climate Control:**
✅ Air Conditioning (AC)
✅ Fans / Ventilation
✅ Heaters (in select properties)

**🍽️ Food & Kitchen:**
✅ Meals Provided (breakfast, lunch, dinner)
✅ Modular Kitchen
✅ Gas Connection
✅ Refrigerator
✅ Water Purifier / RO

**🚗 Parking:**
✅ 2-Wheeler Parking
✅ 4-Wheeler Parking
✅ Covered Parking
✅ Visitor Parking

**🧺 Utilities:**
✅ Laundry Service / Washing Machine
✅ 24/7 Water Supply
✅ Power Backup / Generator
✅ Housekeeping / Cleaning Service

**🔒 Security:**
✅ 24/7 Security Guard
✅ CCTV Surveillance
✅ Gated Community
✅ Secure Entry/Exit
✅ Intercom System

**🏋️ Recreation & Wellness:**
✅ Gym / Fitness Center
✅ Swimming Pool
✅ Park / Garden
✅ Common Lounge / TV Room
✅ Indoor Games Room

**How to Filter by Amenities:**
1. Go to **Properties** page
2. Use **"Amenities"** filter checkboxes
3. Select amenities you need
4. Properties matching your criteria appear
5. AI recommendations also consider amenities! 🤖

**Amenity-Based AI Matching:**
Our AI gives 25% weight to amenity matching, so if you filter by specific amenities, you'll get highly relevant recommendations!

Need properties with specific amenities? Just tell me! 😊`
  },
  {
    intent: "help",
    patterns: [
      "help", "assist", "support", "guide", "how to use", "features",
      "what can you do", "show features", "platform guide", "tutorial",
      "instructions", "how does it work", "explain", "documentation",
      "getting started", "start guide", "complete guide", "all features"
    ],
    response: `📚 **WebGI - Complete Platform Guide:**

🏠 **Browse & Discover Properties**
✅ Browse 100+ properties across 10+ cities
✅ Filter by: Type, Price (₹2K-₹20K), Location, Amenities
✅ View high-quality images and detailed descriptions
✅ Check ratings and reviews from previous tenants
✅ Save favorite properties for later

🤖 **AI-Powered Smart Recommendations**
✅ Hybrid scoring algorithm (0-100 match points)
✅ Considers: Price, Ratings, Amenities, Vacancy, Capacity
✅ Real-time updates when you change filters
✅ Learns from your browsing preferences
✅ Shows matching score for every property

📅 **Book Properties Instantly**
✅ Simple one-click booking request
✅ Owner responds within 24-48 hours
✅ Secure transaction process
✅ View booking status in real-time
✅ Track all your current and past bookings

💬 **Direct Messaging with Owners**
✅ Real-time chat with property owners
✅ Negotiate pricing and terms
✅ Schedule property viewings
✅ Share documents and ask questions
✅ Professional encrypted messaging

📋 **List Your Property in Minutes**
✅ Upload property details (name, type, price, capacity)
✅ Add 5-10 high-quality photos
✅ Select available amenities (8 options)
✅ Set pricing and vacancy count
✅ Specify rules and requirements
✅ Go live instantly to 1000+ users!

🔐 **Account & Profile Management**
✅ Create account with email verification
✅ View your saved properties (wishlist)
✅ Track all bookings (as renter or owner)
✅ Manage booking requests
✅ Update profile and preferences
✅ View message history

📊 **Property Types Available**
🏢 Apartments (1BHK-3BHK)
🏠 Independent Houses
🛏️ PG (Paying Guest - furnished)
🏨 Hostels (budget-friendly)
🚪 Shared Rooms (cost-effective)

🌍 **Cities We Cover**
Bangalore • Hyderabad • Chennai • Mumbai • Pune • Delhi NCR • And More

💰 **Amenities We Support**
WiFi • Food/Meals • AC • Parking • Laundry • Power Backup • Security • CCTV

**What Would You Like Help With?**
Ask about:
🤖 How AI recommendations work
📅 Step-by-step booking guide
💬 How to message owners
📋 How to list your property
🔐 Login & account help
💰 Pricing information
📍 Available locations
🎯 Specific property details`
  },
  {
    intent: "reviews_ratings",
    patterns: [
      "reviews", "ratings", "reviews system", "how ratings work", "property reviews",
      "user ratings", "feedback", "ratings system", "review process", "rate property",
      "property feedback", "tenant reviews", "see reviews"
    ],
    response: `⭐ **Reviews & Ratings System:**

**How Ratings Work:**
Each property has:
- ⭐ Star ratings (0-5 stars) from previous tenants
- 💬 Detailed written reviews and feedback
- 👥 Transparent rating history
- 📅 Review dates for context

**What Reviews Cover:**
✅ Overall living experience
✅ Owner responsiveness
✅ Cleanliness and maintenance
✅ Amenity quality
✅ Safety and security
✅ Value for money

**How to View Reviews:**
1. Click on any property card
2. Scroll to **"Tenant Reviews"** section
3. See all ratings and comments
4. Filter by recent reviews first
5. Read multiple perspectives

**How to Leave a Review (After Booking):**
1. Complete your booking/stay
2. Go to your **"Bookings"** dashboard
3. Find the completed booking
4. Click **"Leave Review"**
5. Rate 1-5 stars
6. Write detailed feedback
7. Submit (visible to all)

**AI Uses Reviews:**
🤖 Our AI gives 30% weight to ratings
✅ Higher-rated properties rank higher
✅ Your bookings will include top-rated matches
✅ Reviews help other users make decisions

**Trust & Safety:**
🛡️ All reviews are verified (from real renters)
✅ Fake reviews are removed
📜 Review history cannot be deleted
⚠️ Report inappropriate reviews
🔒 Rating system is transparent

Tips: Read multiple reviews, check dates, and look for balanced feedback!`
  },
  {
    intent: "favorites_wishlist",
    patterns: [
      "favorites", "saved", "wishlist", "favourite", "save property",
      "add to favorites", "my favorites", "saved properties", "bookmarks",
      "heart", "like property", "save for later"
    ],
    response: `❤️ **Favorite Properties & Wishlist:**

**How to Save Properties:**
1. Click the **Heart Icon** ❤️ on any property card
2. Or click **"Add to Favorites"** on details page
3. Property is instantly saved!
4. Heart icon turns filled/colored

**Access Your Saved Properties:**
📍 Click **"Favorites"** in the left sidebar
📍 See all your saved properties in one place
📍 Organized by date (newest first)
📍 View and sort your collection anytime

**Features of Saved Properties:**
✅ Keep properties you're interested in
✅ Quick access for later viewing
✅ Remove anytime by clicking heart again
✅ No limit on number of saves
✅ Syncs across devices (when logged in)
✅ Quick links to message owners

**How to Use Your Wishlist:**
💡 **Research Mode**: Save interesting properties to compare
💡 **Booking Ready**: When ready, click and book in seconds
💡 **Comparison**: Side-by-side compare different properties
💡 **Share**: Send favorite properties to friends
💡 **Price Track**: Monitor price changes over time

**Smart Features:**
🤖 AI learns from your favorites
🤖 Recommends similar properties you might like
📧 Get notifications when saved properties' prices change
🔔 Owner messages go to your inbox

Pro Tip: Save 3-5 properties to compare before booking! 💡`
  },
  {
    intent: "search_filter",
    patterns: [
      "search", "filter", "find property", "how to search", "advanced search",
      "search filters", "filter by", "refine search", "search options"
    ],
    response: `🔍 **Advanced Property Search & Filters:**

**Search Methods:**

**Method 1: Simple Search**
- Use the search bar at the top
- Enter city, property name, or amenity
- See results instantly

**Method 2: Advanced Filters (Left Sidebar)**

💰 **Price Filter**
- Drag slider: ₹2,000 to ₹20,000+
- Set minimum and maximum budget
- Real-time property updates

📍 **Location Filter**
- Select specific city from dropdown
- Or search by area/locality
- Show properties near landmarks

🏘️ **Property Type**
- Apartments
- Houses
- PG (Paying Guest)
- Hostels
- Shared Rooms

🛏️ **Capacity Filter**
- Filter by occupants needed
- 1 person, 2-3 people, 4-5, 6+ people

⭐ **Rating Filter**
- Show properties with 4+ stars
- 3+ stars, 2+ stars, etc.
- See only highly-rated properties

🏠 **Amenities Checkboxes** (Select multiple)
- WiFi ✓
- Food/Meals ✓
- Air Conditioning (AC) ✓
- Parking ✓
- Laundry Service ✓
- Power Backup ✓
- 24/7 Security ✓
- CCTV Surveillance ✓

📊 **Sorting Options**
- Sort by Price (Low to High)
- Sort by Price (High to Low)
- Sort by Rating (Highest First)
- Sort by Views (Most Popular)
- Sort by Newest (Latest Listed)

**Smart Combination:**
1. Select city (e.g., Bangalore)
2. Set budget (e.g., ₹6,000-₹10,000)
3. Select property type (e.g., PG)
4. Check amenities (WiFi + Food + AC)
5. View filtered results instantly!
6. AI recommendations update too! 🤖

**Search Tips:**
💡 Combine multiple filters for best results
💡 Use amenities filter to narrow down
💡 Check multiple price ranges to compare
💡 Let AI recommendations help you decide
💡 Save your favorite combinations

Advanced search = Better properties! 🎯`
  },
  {
    intent: "images_photos",
    patterns: [
      "images", "photos", "pictures", "upload images", "property photos",
      "image gallery", "view images", "high quality images", "image upload"
    ],
    response: `📸 **Property Images & Photo Gallery:**

**Viewing Property Photos:**

✅ **Property Details Page**
- Large main photo with slider
- Click to see full-screen view
- Swipe left/right to view next image
- Zoom in/out for details

✅ **Photo Gallery**
- See all images in organized grid
- Includes: Exterior, rooms, kitchen, bathroom, areas
- High-resolution quality (1080p+)
- Use ImageKit CDN for fast loading

**How to Upload Images (As Property Owner):**

**Step 1: Go to List Property**
- Click **"List Your Property"** button

**Step 2: Fill Property Details**
- Enter name, price, capacity, location
- Select amenities and features

**Step 3: Image Upload Section**
- Click **"Add Images"** button
- Or drag & drop images
- Select multiple files at once

**Step 4: Upload Quality**
- Images stored securely in ImageKit
- Auto-optimized for all devices
- Preserved quality (high-res)
- CDN-fast loading across India

**Photo Guidelines:**
📸 **Best Practices:**
✅ Minimum 5 images, ideally 8-10
✅ Use daylight for natural colors
✅ Clean and de-clutter before shooting
✅ Include: Exterior, rooms, kitchen, bathroom, common areas
✅ Landscape orientation (horizontal)
✅ High resolution (1MB+)

📸 **What to Photograph:**
1. **Exterior View** - Front of property
2. **Main Room** - Largest room/common area
3. **Bedroom(s)** - All bedrooms
4. **Kitchen** - Modern kitchen setup
5. **Bathroom** - Clean, well-lit
6. **Common Areas** - Living room, hallway
7. **Amenities** - WiFi, parking, garden
8. **Surroundings** - Neighborhood view

**Image Management:**
✅ Reorder photos by dragging
✅ Delete unwanted images
✅ Replace old photos with new ones
✅ Change cover/thumbnail image
✅ Add captions (optional)

**Pro Tips:**
💡 Better photos = More views and bookings!
💡 First image is your cover - make it count
💡 Professional looking photos get 3x more interest
💡 Show amenities in photos
💡 Update photos seasonally

🖼️ Our ImageKit integration ensures fast, reliable image delivery worldwide! 📸`
  },
  {
    intent: "payments_transaction",
    patterns: [
      "payment", "payments", "pay", "transaction", "price calculation",
      "total cost", "how much to pay", "payment process", "fees",
      "money", "cost", "expense", "charges"
    ],
    response: `💳 **Payments & Pricing on WebGI:**

**Transparent Pricing:**

✅ **What's Included in Price:**
- Monthly rent/property cost
- Basic amenities (as listed)
- Utilities (varies by property)
- Furnishing (if mentioned)

**Additional Costs (Property-Specific):**
- Security deposit (usually 1-2 months)
- Maintenance/facility charges
- Electricity/Water (if separate)
- Internet (if separate from WiFi)
- Parking (if charged separately)

**How Booking Price Works:**

1. **Select Property** → View price (₹X/month)
2. **Choose Dates** → Calculator shows total
   - Example: ₹8,000/month × 3 months = ₹24,000
3. **See Final Amount** → Booking total with breaks
4. **Send Request** → Owner approves
5. **Complete Payment** → After owner acceptance

**Payment Process (Step-by-Step):**

**Step 1: Booking Request**
- Fill: Check-in date, check-out date, guests
- See estimated total price
- Send request to owner

**Step 2: Owner Approval**
- Owner reviews your request
- Accepts or negotiates
- 24-48 hour response time

**Step 3: Payment Arrangement**
- Direct discussion with owner
- Decide payment method:
  💰 Bank transfer
  💳 Card payment
  📱 Digital wallets
  🏦 Check/Draft
  👥 Cash (in-person)

**Step 4: Confirmation**
- Payment made per agreement
- Booking confirmed
- Receive keys & access

**Security Deposit Details:**
🔒 **Purpose:**
- Security against property damage
- Refunded after stay if no damage
- Typically held in escrow

💰 **Amount:**
- Usually 1-2 months of rent
- Varies by property/owner
- Negotiate with owner

🔄 **Refund Process:**
- After checkout inspection
- 3-7 days to process
- Returned to your account

**Price Comparison Features:**
📊 **WebGI Tools:**
✅ Average rent in city: ₹8,000-₹10,000
✅ Price filter by budget
✅ Sort by price (low to high)
✅ Compare similar properties
✅ Negotiate with owners directly

**Pro Tips:**
💡 Negotiate with owners via messaging
💡 Look for bundled amenities to save
💡 Compare utility costs before booking
💡 Ask about seasonal discounts
💡 Check for combo offers (3+ months)

**Transparent = Fair Pricing for Everyone! 💼**`
  },
  {
    intent: "gender_preference",
    patterns: [
      "gender", "male", "female", "unisex", "girls only", "boys only",
      "gender preference", "gender filter", "shared room gender", "women only"
    ],
    response: `👥 **Gender Preference & House Rules:**

**Gender Preference Options:**

🙍 **Male Only**
- Property reserved exclusively for male occupants
- Common in shared PG accommodations
- Usually has male-only common areas

👩 **Female Only**
- Property reserved exclusively for female occupants
- Popular for student girls and working women
- Safe, dedicated facilities for women

🔄 **Unisex (Any Gender)**
- Open to anyone (male, female, couples, LGBTQ+)
- Most flexible option
- Mixed-gender properties

**How to Filter:**

1. Go to **Properties** page
2. Look for **"Gender Preference"** filter
3. Select your preference:
   - Male Only
   - Female Only
   - Unisex/Any
4. Results update instantly

**Why It Matters:**
✅ Comfort and safety
✅ Community preferences
✅ Shared facility compatibility
✅ Social environment
✅ Cultural/personal needs

**Sharing Types (Related):**

🛏️ **Single Room** - Only you
🛏️ **Double Sharing** - 2 people per room
🛏️ **Triple Sharing** - 3 people per room
🛏️ **4+ Sharing** - Large dormitory style

**Combined Preferences:**
Example: Female-only + Double Sharing
= 2 women share 1 room (female safe environment)

**Default Values:**
- Most properties default to "Unisex"
- Shared rooms often specify gender preference
- Private apartments usually unisex

**House Rules Often Include:**
⏰ Quiet hours (usually 10 PM - 8 AM)
👥 Guest policies
🚭 No smoking/drinking rules
🎉 Party restrictions
🧹 Cleaning expectations
🛏️ Bed time rules (in shared)
📱 Noise control
👗 Dress code (in some properties)

**How to View Rules:**

✅ Check **"House Rules"** section on property page
✅ Ask owner via **messaging** for clarification
✅ Discuss restrictions before booking
✅ Ensure compatibility with your lifestyle

**Safety First:**
🛡️ Gender preferences help create safe spaces
🛡️ Choose according to your comfort level
🛡️ Report any discrimination issues to support
🛡️ All genders deserve safe housing

**Pro Tip:** Review gender preference AND rules before booking! 👍`
  },
  {
    intent: "thankyou",
    patterns: [
      "thank you", "thanks", "thank", "appreciate", "helpful", "great",
      "awesome", "perfect", "excellent", "nice", "good job", "well done"
    ],
    responses: [
      "You're welcome! 😊 Feel free to ask if you have any other questions about WebGI, AI recommendations, booking, or listing properties. I'm here to help!",
      "Happy to help! 🙌 If you need anything else about properties, AI features, or how to use WebGI, just ask!",
      "My pleasure! 😊 Don't hesitate to reach out if you have more questions about WebGI. I'm always here!",
      "You're very welcome! 🎉 Let me know if there's anything else I can help you with on WebGI!"
    ]
  },
  {
    intent: "goodbye",
    patterns: [
      "bye", "goodbye", "see you", "later", "exit", "close", "quit",
      "farewell", "take care", "see ya", "catch you later"
    ],
    responses: [
      "Goodbye! 👋 Feel free to return anytime you need help with WebGI. Have a great day!",
      "See you later! 🙂 Come back anytime you need assistance with properties, bookings, or listings!",
      "Take care! 👋 I'll be here whenever you need help with WebGI. Happy house hunting!",
      "Bye! 😊 Best of luck with your property search. Return anytime you need assistance!"
    ]
  }
];

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

  // Detect user intent using fuzzy matching
  const detectIntent = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    // First try exact pattern matching for speed
    for (const intent of intentDatabase) {
      if (intent.patterns.some(pattern => lowerInput.includes(pattern))) {
        return intent;
      }
    }

    // If no exact match, use fuzzy matching
    const fuse = new Fuse(intentDatabase, {
      keys: ["patterns"],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
    });

    const results = fuse.search(userInput);
    
    if (results.length > 0) {
      return results[0].item;
    }

    return null;
  };

  // Generate response based on detected intent
  const generateResponse = (intent) => {
    if (!intent) {
      const fallbackSuggestions = [
        "That's a great question! 🤔 I can help with AI recommendations, bookings, listings, login, or property search. What interests you?",
        "I'm here to help! 👍 You can ask me about how AI works, logging in, finding properties, or listing your own.",
        "Thanks for asking! 📍 Would you like to know about AI recommendations, how to book, how to login, or how to list your property?",
        "That's interesting! 💡 I can explain our AI system, help with bookings, guide through login, or assist with listing.",
        "Great inquiry! 🎯 You can ask me about property availability, AI matching, login help, booking process, or anything about WebGI.",
      ];
      return fallbackSuggestions[Math.floor(Math.random() * fallbackSuggestions.length)];
    }

    // Return response - handle both single response and array of responses
    if (Array.isArray(intent.responses)) {
      return intent.responses[Math.floor(Math.random() * intent.responses.length)];
    } else if (intent.response) {
      return intent.response;
    } else {
      return "Thanks for your question! I'm here to help. Could you be more specific?";
    }
  };

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

    // Bot response with intelligent intent detection
    setTimeout(() => {
      const detectedIntent = detectIntent(inputValue);
      let botResponse = generateResponse(detectedIntent);

      // Enhance responses with real property stats if available
      if (propertyStats) {
        if (detectedIntent?.intent === "property_count") {
          botResponse = `🏠 **We currently have ${propertyStats.total} properties available on WebGI!**\n\n**Breakdown by type:**\n${Object.entries(propertyStats.byType)
            .map(([type, count]) => `• ${type}: ${count}`)
            .join("\n")}\n\n**Statistics:**\n📊 Average price: **₹${propertyStats.avgPrice}**\n🌍 Available across multiple cities\n\nUse filters to narrow down your search!`;
        } else if (detectedIntent?.intent === "property_types" && Object.keys(propertyStats.byType).length > 0) {
          botResponse = `Here are the property types we offer:\n\n${Object.entries(propertyStats.byType)
            .map(([type, count]) => `• **${type}**: ${count} available`)
            .join("\n")}\n\nEach property type has unique features. Filter by type on the properties page to explore!`;
        } else if (detectedIntent?.intent === "location" && propertyStats.byCity) {
          botResponse = `We have properties in the following locations:\n\n${Object.entries(propertyStats.byCity)
            .map(([city, count]) => `📍 **${city}**: ${count} properties`)
            .join("\n")}\n\nClick on any city from the menu bar to see properties there, or use our AI recommendations for smart matches!`;
        } else if (detectedIntent?.intent === "pricing") {
          botResponse = `💰 **Pricing Information:**\n\n**Average property price on WebGI: ₹${propertyStats.avgPrice}**\n\nWe have properties at various price points:\n✅ Budget-friendly options (₹2,000 - ₹5,000)\n✅ Mid-range properties (₹5,000 - ₹12,000)\n✅ Premium listings (₹12,000 - ₹20,000)\n\n**How to find properties in your budget:**\n1. Go to Properties page\n2. Use the "Price Range" filter on the left\n3. Adjust the slider to your budget\n4. Properties will update automatically\n5. AI recommendations also respect your budget!`;
        }
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
      {/* Floating Button - Small - Hidden on mobile, visible on md+ screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-300 group"
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

      {/* Chatbot Container - Large - Hidden on mobile, visible on md+ screens */}
      {isOpen && (
        <div className="hidden md:flex fixed bottom-20 right-6 z-50 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex-col border border-border animate-slide-up overflow-hidden">
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