# WebGI Chatbot Training FAQ Document

## Table of Contents
1. [Greetings & Basic Interactions](#greetings--basic-interactions)
2. [Platform Overview](#platform-overview)
3. [User Account & Authentication](#user-account--authentication)
4. [Property Search & Discovery](#property-search--discovery)
5. [Property Details & Viewing](#property-details--viewing)
6. [Booking System](#booking-system)
7. [Property Listing & Management](#property-listing--management)
8. [Messaging & Communication](#messaging--communication)
9. [AI Recommendations](#ai-recommendations)
10. [Reviews & Ratings](#reviews--ratings)
11. [Payment & Pricing](#payment--pricing)
12. [Admin Features](#admin-features)
13. [Technical & Troubleshooting](#technical--troubleshooting)
14. [Safety & Trust](#safety--trust)
15. [Advanced Features](#advanced-features)

---

## Greetings & Basic Interactions

**Q: Hi**  
A: Hello! Welcome to WebGI - your trusted rental property discovery platform. I'm here to help you find verified hostels, PGs, apartments, and rental properties. How can I assist you today?

**Q: Hello**  
A: Hi there! I'm the WebGI assistant. Whether you're looking for a place to stay or want to list your property, I'm here to guide you. What would you like to know?

**Q: Hey**  
A: Hey! Welcome to WebGI. I can help you with property searches, bookings, listings, or any questions about our platform. What brings you here today?

**Q: Good morning/afternoon/evening**  
A: Good [morning/afternoon/evening]! Thank you for visiting WebGI. How can I make your property search or rental experience easier today?

**Q: What is WebGI?**  
A: WebGI is a comprehensive rental property platform that connects property owners with renters. We specialize in verified hostels, PGs (Paying Guest accommodations), apartments, villas, and houses. Our platform features AI-powered recommendations, direct messaging, secure bookings, and a trust-based verification system.

**Q: How can you help me?**  
A: I can assist you with:
- Finding properties based on your budget, location, and preferences
- Understanding how to book a property
- Guiding you through listing your property
- Explaining our AI recommendation system
- Answering questions about messaging sellers
- Troubleshooting account or booking issues
- Providing information about our trust and verification system

---

## Platform Overview

**Q: What types of properties are available on WebGI?**  
A: WebGI offers multiple property types including:
- Hostels
- PGs (Paying Guest accommodations)
- Apartments
- Villas
- Houses
- Other rental properties
Each property is verified and comes with transparent information, genuine reviews, and direct owner communication.

**Q: What makes WebGI different from other rental platforms?**  
A: WebGI stands out with:
1. **Verification-based trust system** - All properties and users are verified
2. **AI-powered recommendations** - Smart matching based on 5 key factors
3. **Direct communication** - Message property owners directly
4. **Transparent pricing** - No hidden fees, clear monthly rates
5. **Genuine reviews** - Only verified bookers can review
6. **Comprehensive filtering** - Advanced search by type, price, city, amenities

**Q: Is WebGI free to use?**  
A: Yes! Browsing properties, creating an account, messaging sellers, and viewing property details are completely free. Property owners can list their properties on the platform.

**Q: Which cities does WebGI cover?**  
A: WebGI covers properties across India. We have a "Popular Cities" section on our homepage that shows trending locations. You can search for properties in any city using our advanced filters and search bar.

**Q: How do I navigate the website?**  
A: Our main navigation includes:
- **Home** - Browse featured properties and popular cities
- **Properties** - View all listings with advanced filters
- **Create Property** - For property owners to list their rentals
- **Bookings** - Manage your booking requests
- **Messages** - Communicate with property owners
- **Profile** - Update your account information

---

## User Account & Authentication

**Q: How do I create an account?**  
A: To register on WebGI:
1. Click on "Register" in the navigation
2. Provide your name, email, and password
3. Set up security questions for account recovery
4. Submit the form
You'll receive a JWT token that keeps you logged in for 7 days.

**Q: What information do I need to register?**  
A: Registration requires:
- Full name
- Email address
- Password
- Security questions (for account recovery)
After registration, you can add additional details like phone number, address, city, state, postal code, and bio in your profile.

**Q: How do I log in?**  
A: Click "Login" in the navigation, enter your registered email and password, then submit. Your session will remain active for 7 days using a secure JWT token.

**Q: I forgot my password. How do I reset it?**  
A: Use the password reset feature:
1. Click "Forgot Password" on the login page
2. Answer your security questions correctly
3. Set a new password
Your security questions were set during registration.

**Q: How do I update my profile?**  
A: Go to your Profile section and update:
- Phone number
- Address
- City, state, postal code
- Bio/About section
These details help property owners know more about you when you send booking requests.

**Q: Can I delete my account?**  
A: Account deletion can be done by contacting our admin team. For security reasons, only admins can permanently remove user accounts and associated data.

**Q: What are the different user types?**  
A: WebGI has three user types:
1. **Regular Users** - Can browse, book, message, and review properties
2. **Property Owners** - Can list properties, manage bookings, upload photos, edit listings
3. **Admins** - Have full control over users, properties, and system settings

---

## Property Search & Discovery

**Q: How do I search for properties?**  
A: You can search in multiple ways:
1. Use the search bar in the navigation for quick text-based lookup
2. Visit the Properties page for advanced filtering
3. Browse property type cards on the homepage (Hostels, PGs, Others)
4. Click on popular cities to see properties in those locations

**Q: What filters are available?**  
A: Our advanced filters include:
- **Property Type** - Hostel, PG, or Others
- **Price Range** - Set minimum and maximum budget
- **City** - Select specific locations
- **Amenities** - Filter by facilities like WiFi, parking, laundry, etc.
Results update dynamically as you apply filters.

**Q: How do I filter by price?**  
A: On the Properties page:
1. Enter minimum price in the first box
2. Enter maximum price in the second box
3. Press Enter or click the filter button
Prices are displayed in rupees per month.

**Q: Can I search for properties in a specific city?**  
A: Yes! Use the city filter on the Properties page or click on any city from our "Popular Cities" section on the homepage. We track which cities are most popular to help you find trending locations.

**Q: What amenities can I filter by?**  
A: You can filter by common amenities such as:
- WiFi
- Parking
- Laundry facilities
- Air conditioning
- Kitchen access
- Security features
And more - use the amenities checkboxes in the filter section.

**Q: How do property recommendations work?**  
A: Our AI recommendation engine analyzes 5 key factors:
- **Budget Match (25%)** - How well the price fits your budget
- **Location Proximity (20%)** - Distance to your preferred areas
- **Amenity Preferences (20%)** - Matches your desired facilities
- **Availability (20%)** - Current vacancy status
- **Trust Score (15%)** - Verification and review ratings
The system learns from your browsing history to provide personalized suggestions.

---

## Property Details & Viewing

**Q: What information is shown on a property listing?**  
A: Each property card displays:
- Property images
- Price per month
- Location (city and address)
- Property type (Hostel/PG/Other)
- Quick stats (bedrooms, bathrooms, sq ft)
- Amenities
- Owner information
- Average rating
- Number of reviews

**Q: How do I view full property details?**  
A: Click on any property card to open the detailed view. You'll see:
- Complete image gallery with navigation arrows
- Full description
- Complete amenities list
- Property rules and requirements
- Owner contact information
- All reviews and ratings
- Booking options (if you're not the owner)

**Q: Can I see photos before booking?**  
A: Absolutely! Every property has an image gallery. Click through the photos using navigation arrows to see all available images of the property.

**Q: What if I'm viewing my own property?**  
A: If you're the property owner, instead of booking options, you'll see an info box saying "This is your property" with a link to manage it from your properties dashboard.

**Q: What are property rules and requirements?**  
A: Property rules are guidelines set by the owner (like quiet hours, no smoking, etc.). Requirements might include documents needed for booking (ID proof, employment details, etc.). These are clearly listed on each property page.

**Q: How are properties verified?**  
A: WebGI implements a verification-based trust system where properties and owners are verified before listing. This includes checking property ownership, authenticity of photos, and owner identity to ensure trustworthy accommodations.

---

## Booking System

**Q: How do I book a property?**  
A: To book a property:
1. Go to the property detail page
2. Click the "Book Property" button
3. Select your check-in and check-out dates
4. Enter the number of guests
5. Review the total price calculation
6. Submit your booking request
The property owner will receive your request and can respond.

**Q: Can I book my own property?**  
A: No, the system prevents property owners from booking their own listings. You'll see a message indicating "This is your property" instead of booking options.

**Q: Can I book a property for past dates?**  
A: No, the system validates that check-in dates must be in the future. You cannot select dates that have already passed.

**Q: What happens after I submit a booking request?**  
A: Your booking request is sent to the property owner with all details including:
- Selected dates
- Number of guests
- Your profile information
- Total calculated price
The owner can view your request and respond. You can track your bookings in the "My Bookings" section.

**Q: How is the total price calculated?**  
A: The total price is calculated based on:
- Monthly rental price
- Number of months/days selected
- Number of guests (if applicable)
You'll see the breakdown before confirming your booking.

**Q: Where can I see my bookings?**  
A: Go to "My Bookings" in the navigation to view all your booking requests, their status, and property details.

**Q: Can I cancel a booking?**  
A: Booking cancellation policies depend on the property owner. Contact the owner through our messaging system to discuss cancellations.

**Q: Do I need to complete my profile before booking?**  
A: While you can browse without a complete profile, having detailed profile information (phone, address, etc.) helps property owners feel confident about your booking request.

---

## Property Listing & Management

**Q: How do I list my property on WebGI?**  
A: To list your property:
1. Ensure you're logged in
2. Click "Create Property" in the navigation
3. Fill in all required details (title, description, price, type, location, etc.)
4. Add amenities and rules
5. Upload property photos
6. Submit your listing
Your property will be available for renters to view and book.

**Q: What information is required to list a property?**  
A: You need to provide:
- Property title and description
- Price per month (in rupees)
- Property type (Hostel/PG/Other)
- Number of bedrooms and bathrooms
- Square footage
- Complete address (street, city, state, zip code)
- Amenities (comma-separated)
- Property rules and document requirements
- Availability status
- Property photos

**Q: How many photos can I upload?**  
A: You can upload multiple photos to showcase your property. Use the photo upload feature accessible from "Your Properties" dashboard. Images are stored securely via ImageKit cloud storage.

**Q: How do I upload photos to my property?**  
A: From "Your Properties" page:
1. Find your property listing
2. Click "Upload Photos"
3. A modal will show current images
4. Click the upload area or drag and drop new images
5. Preview selected images
6. Submit to upload
You'll see progress notifications and success messages.

**Q: How do I edit my property details?**  
A: Go to "Your Properties", find your listing, and click "Edit". You can modify:
- Title and description
- Price
- Property type
- Bedroom/bathroom count
- Square footage
- Address and location
- Amenities
- Availability status
Changes are saved immediately and reflected across the platform.

**Q: Can I delete my property listing?**  
A: Yes, from "Your Properties" page, click the delete button on the property you want to remove. This will permanently remove the listing from the platform.

**Q: How do I see who wants to book my property?**  
A: Booking requests from renters appear in your dashboard. You'll receive notifications and can view all booking details including renter information, dates, and guest count.

**Q: What is a property ID?**  
A: Each property gets a unique ID when listed. This ID is displayed on your property card in "Your Properties" and helps track and manage your listings.

**Q: Can I list multiple properties?**  
A: Yes! There's no limit to the number of properties you can list on WebGI. Each property will appear in your "Your Properties" dashboard.

**Q: How do I know how many people viewed my property?**  
A: Each property card in "Your Properties" shows a view count, indicating how many times renters have viewed your listing.

---

## Messaging & Communication

**Q: How do I message a property owner?**  
A: You can message property owners in two ways:
1. From the property detail page - click "Message Seller"
2. Through the "Messages" section in navigation for direct messages
Messages automatically include property context (property name and price).

**Q: What information is shown in messages?**  
A: Each message conversation displays:
- Property name and price per month (for context)
- Message timestamps
- Sender information
- Real-time message updates (auto-refresh every 3 seconds)

**Q: How often do messages update?**  
A: The messaging system auto-refreshes every 3 seconds to load new messages in real-time, ensuring you don't miss any responses.

**Q: Can I message multiple property owners?**  
A: Yes! You can have separate conversations with different property owners. Each conversation is tracked separately in your Messages section.

**Q: Do property owners see my contact information when I message them?**  
A: Property owners can see your profile information including any details you've added (name, email, phone if provided). This helps facilitate trust and communication.

**Q: How do I know if I have new messages?**  
A: Check the "Messages" section in your navigation. The real-time refresh ensures you'll see new messages within 3 seconds of them being sent.

**Q: Can I send messages about booking details?**  
A: Yes! Messages can include booking queries, property questions, availability checks, or any communication needed between renters and property owners.

---

## AI Recommendations

**Q: How does the AI recommendation system work?**  
A: Our AI engine uses machine learning to match you with properties based on 5 weighted factors:
1. **Budget Match (25%)** - Properties within your price range
2. **Location Proximity (20%)** - Properties near your preferred locations
3. **Amenity Preferences (20%)** - Facilities you've shown interest in
4. **Availability (20%)** - Properties with current vacancies
5. **Trust Score (15%)** - Verified properties with good reviews

**Q: What is the ML server?**  
A: We run a separate Python-based machine learning server that processes your browsing history, preferences, and behavior to generate personalized property recommendations through our backend API.

**Q: How does WebGI learn my preferences?**  
A: The system tracks:
- Properties you view
- Filters you apply
- Cities you search in
- Amenities you select
- Your budget range
- Booking patterns
This data helps refine recommendations over time.

**Q: Can I see my AI recommendations?**  
A: Yes! The homepage features an AI recommendation showcase section displaying properties specifically matched to your preferences based on our intelligent algorithm.

**Q: Does the AI recommendation improve over time?**  
A: Absolutely! The more you use WebGI - browsing properties, applying filters, messaging owners - the better the AI understands your preferences and provides more accurate recommendations.

**Q: What is a Trust Score?**  
A: Trust Score (15% of recommendation weight) combines:
- Property verification status
- Owner verification
- Average review ratings
- Number of successful bookings
- Response rate to messages
Higher trust scores indicate more reliable properties.

---

## Reviews & Ratings

**Q: How do I leave a review?**  
A: Only users who have booked a property can leave reviews. After your booking, you can rate the property from 1-5 stars and write detailed feedback about your experience.

**Q: Can anyone leave a review?**  
A: No, to prevent fake reviews, only verified bookers who have actually stayed at the property can submit reviews. This ensures authentic feedback.

**Q: Where can I see reviews?**  
A: Reviews are displayed on each property's detail page. You'll see individual reviews with ratings, reviewer names, and written feedback, plus the overall average rating.

**Q: What can I include in my review?**  
A: Your review can cover:
- Overall experience
- Property condition
- Amenities quality
- Owner responsiveness
- Cleanliness
- Value for money
- Location convenience
- Any other relevant feedback

**Q: Can property owners respond to reviews?**  
A: Property owners can see all reviews about their listings in their dashboard. This feedback helps them improve their properties and services.

**Q: How is the average rating calculated?**  
A: The average rating is calculated from all reviews a property has received. It's displayed prominently on property cards and detail pages as a star rating out of 5.

**Q: Can I edit or delete my review?**  
A: Review editing and deletion policies depend on platform settings. Contact our support team if you need to modify a submitted review.

---

## Payment & Pricing

**Q: How is pricing displayed?**  
A: All prices are shown in Indian Rupees (₹) per month. This is clearly indicated on every property card and detail page.

**Q: Are there any hidden fees?**  
A: No! WebGI believes in transparent pricing. The monthly rent displayed is what the property owner is charging. Any additional fees (security deposit, maintenance, etc.) will be mentioned in the property description.

**Q: How do I pay for a booking?**  
A: Payment terms are arranged directly with the property owner. After your booking request is accepted, you'll coordinate payment details with the owner through our messaging system.

**Q: Can I negotiate the price?**  
A: You can communicate with property owners through our messaging system to discuss pricing, but the listed price is set by the owner.

**Q: What currency is used?**  
A: All transactions and pricing on WebGI are in Indian Rupees (₹).

**Q: Is there a booking fee?**  
A: WebGI does not charge users a booking fee. The platform facilitates connections between renters and property owners.

---

## Admin Features

**Q: What is the admin dashboard?**  
A: The admin panel provides comprehensive platform oversight with:
- Total users count
- Total properties listed
- Total bookings made
- Total messages sent
- User management with search
- Property management across the platform
- City click analytics

**Q: What can admins do?**  
A: Admins have full control to:
- View all users with search capability
- Delete users and their associated data
- View all properties across the platform
- Edit or delete any property listing
- Access city click statistics
- Export analytics as CSV
- Monitor platform activity

**Q: What are city click analytics?**  
A: WebGI tracks which cities users click on to understand property demand by location. Admins can view these statistics and export them as CSV files for analysis.

**Q: How do admins manage users?**  
A: The admin panel has a user management section where admins can search for specific users, view all user accounts, and delete users if necessary (removing all associated data).

**Q: Can admins edit any property?**  
A: Yes, admins have permission to edit or delete any property listing on the platform for moderation and quality control purposes.

---

## Technical & Troubleshooting

**Q: Why can't I see my uploaded images?**  
A: If images aren't appearing:
1. Ensure upload was successful (check for success toast notification)
2. Refresh the property page
3. Check that images are in supported formats (JPG, PNG, AVIF)
4. Verify your internet connection
Images are stored on ImageKit cloud and should load quickly.

**Q: My login session expired. What do I do?**  
A: JWT tokens expire after 7 days for security. Simply log in again with your email and password to continue using the platform.

**Q: I'm getting an error when submitting a form. What's wrong?**  
A: Check for:
- All required fields filled in
- Valid email format
- Password meeting requirements
- Date selections (check-in can't be in past)
- Proper number formats for price/capacity
Error messages will show which field needs correction.

**Q: The website isn't loading properly on my phone**  
A: WebGI is fully responsive and works on all devices. Try:
1. Clearing your browser cache
2. Updating your browser to the latest version
3. Checking your internet connection
4. Using a modern browser (Chrome, Firefox, Safari, Edge)

**Q: How do I enable notifications?**  
A: Notifications appear as toast messages for:
- Successful uploads
- Booking confirmations
- Form errors
- Message sent confirmations
These are automatic and don't require setup.

**Q: Images are loading slowly**  
A: WebGI uses optimized image formats (AVIF, JPG) and lazy loading for performance. Slow loading might be due to:
- Internet connection speed
- Large property image galleries
- Server location distance
Images are served via CDN for fast global access.

**Q: Can I use WebGI on different browsers?**  
A: Yes! WebGI works on all modern browsers including Chrome, Firefox, Safari, and Edge. The platform is tested for cross-browser compatibility.

**Q: What happens if I lose internet connection?**  
A: Your JWT token is stored locally, so you'll remain logged in. However, you'll need an active connection to:
- Load property listings
- Send messages
- Submit bookings
- Upload images

**Q: How do I report a bug?**  
A: Contact our support team through the contact information in the footer or use the messaging system to report technical issues.

---

## Safety & Trust

**Q: How does WebGI ensure property listings are legitimate?**  
A: We implement a verification-based trust system:
- Owner identity verification
- Property ownership verification
- Photo authenticity checks
- Review system with verified bookers only
- Trust score calculation
This prevents fraudulent listings.

**Q: Is my personal information safe?**  
A: Yes! WebGI uses:
- Secure JWT authentication
- Password hashing before storage
- Proper CORS configuration
- User ID validation for all operations
- Secure data transmission
Your data is protected in MongoDB Atlas cloud.

**Q: Can property owners see my password?**  
A: No! Passwords are hashed before being stored in the database. Even admins cannot see your actual password - only you know it.

**Q: How do I know if a property owner is trustworthy?**  
A: Check:
- Property trust score (part of AI recommendations)
- Number and quality of reviews
- Owner response rate to messages
- How long the property has been listed
- Detailed property information and photos

**Q: What if I encounter a suspicious listing?**  
A: Report it to our admin team immediately through the contact information in the footer. Admins can investigate and remove suspicious properties.

**Q: Can I verify property ownership before booking?**  
A: WebGI verifies property ownership during the listing process. Additionally, you can message the owner to ask questions and request additional verification before booking.

**Q: How are security questions used?**  
A: Security questions set during registration are used for password recovery. Only you know the answers, providing an additional security layer for your account.

**Q: What data does WebGI store about me?**  
A: WebGI stores:
- Profile information you provide
- Booking history
- Messages sent/received
- Properties you've viewed (for AI recommendations)
- Reviews you've written
- City click data (anonymous analytics)

---

## Advanced Features

**Q: What is the chatbot feature?**  
A: WebGI has an AI chatbot assistant (that's me!) available on every page in the bottom-right corner. I can:
- Answer questions about properties
- Guide you through the platform
- Help with bookings and listings
- Provide assistance with features
- Troubleshoot issues

**Q: Can I move the chatbot?**  
A: Yes! The chatbot is draggable. You can:
- Drag it by the header to move it anywhere on the page
- Right-click to see "Move Bot" option
- Close it when not needed
- Reopen it anytime by clicking the bot icon

**Q: What is the back button functionality?**  
A: On property listings, the back button navigates to the home page instead of the previous page, providing a better user experience for property browsing.

**Q: How does the search bar work?**  
A: The search bar in the navigation allows quick text-based property lookup. Type your query and press Enter to find matching properties across the platform.

**Q: What are the footer links?**  
A: The footer includes:
- **Quick Links**: Home, Hostels, PGs, Rental Rooms
- **Account**: Login/Register, My Bookings, My Properties, Messages
- **Contact**: Email (mailto link), Phone (tel link), Bangalore address
All links are fully functional and route to appropriate pages.

**Q: Can I export data from WebGI?**  
A: Admins can export city click analytics as CSV. Other data export features depend on your user type and permissions.

**Q: What technology does WebGI use?**  
A: WebGI is built with:
- **Frontend**: React with Vite, Tailwind CSS, ShadCN UI
- **Backend**: Node.js with Express, RESTful APIs
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Image Storage**: ImageKit cloud service
- **Deployment**: Frontend on CDN, Backend on Render, Database on MongoDB Atlas

**Q: How does lazy loading work?**  
A: Images on property listings use lazy loading, meaning they load only when you scroll to them. This improves initial page load speed and overall performance.

**Q: What is the property capacity?**  
A: Property capacity refers to the maximum number of guests/tenants the property can accommodate. This is shown on property cards along with available vacancies.

**Q: Can I filter by available vacancies?**  
A: The availability filter shows properties with current vacancies. Properties with no vacancies are marked as unavailable in the system.

**Q: What are the quick stats on property cards?**  
A: Quick stats display:
- Number of bedrooms
- Number of bathrooms
- Square footage
- Property type
These help you quickly assess if a property meets your needs.

**Q: How do hover effects work?**  
A: Property cards, buttons, and interactive elements have hover states that provide visual feedback when you mouse over them, enhancing the user experience.

**Q: What is the hamburger menu?**  
A: On mobile devices, the main navigation collapses into a hamburger menu (three horizontal lines) for space efficiency while maintaining full functionality.

**Q: Can I see view counts for properties?**  
A: Property owners can see view counts for their listings in the "Your Properties" dashboard. This shows how many times renters have viewed the property.

**Q: What happens when I apply multiple filters?**  
A: Results update dynamically as you apply filters. You can combine property type, price range, city, and amenities filters to narrow down your search precisely.

**Q: How does the Enter key work with filters?**  
A: When entering price ranges, pressing Enter submits the filter automatically without needing to click a button, making the search process faster.

**Q: What is MongoDB Atlas?**  
A: MongoDB Atlas is the cloud hosting service where WebGI's database is stored securely. It ensures reliable data storage and fast access from anywhere in the world.

**Q: What are environment variables?**  
A: Environment variables securely connect WebGI's frontend, backend, and database services. They store sensitive configuration data like API keys and database URLs.

**Q: Can WebGI handle increased traffic?**  
A: Yes! The architecture is designed to scale. The frontend CDN, Render backend, and MongoDB Atlas can handle growing user numbers and property listings.

**Q: What is the difference between comma-separated amenities and checkboxes?**  
A: When listing a property, you enter amenities as comma-separated text (e.g., "WiFi, Parking, Laundry"). When searching, you use checkboxes to filter by these amenities.

**Q: How does the platform prevent crashes?**  
A: WebGI uses error boundaries, try-catch blocks, and validation to handle errors gracefully. If something goes wrong, you'll see a meaningful error message instead of a crash.

**Q: What is the API base URL?**  
A: The API base URL points to the deployed backend on Render. All frontend requests for data go through this URL using RESTful conventions.

**Q: What are HTTP methods used in WebGI?**  
A: Standard HTTP methods:
- **GET** - Retrieve data (view properties, messages)
- **POST** - Create data (register, create property, send message)
- **PUT** - Update data (edit property, update profile)
- **DELETE** - Remove data (delete property, remove user)

**Q: How are images organized in ImageKit?**  
A: Images are organized in folders by property ID. Each property has its own folder containing all uploaded photos, making management and retrieval efficient.

---

## Contact & Support

**Q: How do I contact WebGI support?**  
A: You can reach us through:
- **Email**: Use the mailto link in the footer
- **Phone**: Use the tel link in the footer
- **Address**: Bangalore, India (full address in footer)
- **Chatbot**: Ask me anything right here!

**Q: Where is WebGI located?**  
A: WebGI is based in Bangalore, India. Our contact details are available in the footer of every page.

**Q: Can I provide feedback about the platform?**  
A: Yes! We welcome feedback. Contact us through the email or phone in the footer, or message our admin team to share suggestions for improvements.

**Q: Is there a mobile app?**  
A: Currently, WebGI is a fully responsive web platform that works perfectly on mobile browsers. You can access all features from your phone's browser.

**Q: What are the platform's future plans?**  
A: WebGI's future-ready architecture allows for easy expansion including:
- New property types
- Additional features
- Enhanced AI recommendations
- Improved messaging
- More analytics tools
The modular design supports continuous improvement.

---

## Miscellaneous

**Q: What is the favicon?**  
A: The WebGI favicon (small icon in browser tabs) displays our house logo, making it easy to identify the WebGI tab when you have multiple tabs open.

**Q: Can I bookmark properties?**  
A: While there isn't a dedicated bookmark feature currently, you can message the seller to express interest, which saves the conversation in your Messages section for easy reference.

**Q: How long do JWT tokens last?**  
A: JWT authentication tokens last for 7 days. After that, you'll need to log in again for security purposes.

**Q: What is React Router?**  
A: React Router provides seamless page transitions on WebGI. When you navigate between pages, the experience is smooth without full page reloads.

**Q: Can I use WebGI in different languages?**  
A: Currently, WebGI is available in English. Language support may expand based on user demand.

**Q: What makes a "popular city"?**  
A: Popular cities are determined by user click analytics. Cities with the most user interest and property views are featured in the Popular Cities section.

**Q: How often is data updated?**  
A: Property data, messages, and bookings update in real-time. The messaging system auto-refreshes every 3 seconds. City analytics and statistics are continuously tracked.

**Q: Can I list commercial properties?**  
A: WebGI currently focuses on residential rentals (hostels, PGs, apartments, villas, houses). For other property types, use the "Other Properties" category.

**Q: What file formats are supported for images?**  
A: Supported image formats include JPG, PNG, and AVIF. WebGI optimizes images for fast loading while maintaining quality.

**Q: Is there a limit to property descriptions?**  
A: While there's no strict character limit, property descriptions should be comprehensive yet concise, covering all important details about the property.

**Q: Can multiple users manage the same property?**  
A: Each property is linked to the owner who created the listing. Only that owner can edit, upload photos, or delete the property.

**Q: What happens to my data if I delete a property?**  
A: When a property is deleted, the listing is removed from the platform. Associated bookings and messages may be retained for record-keeping purposes.

**Q: How do I switch between being a renter and a property owner?**  
A: You don't need to switch! The same account allows you to both rent properties and list your own properties. Your role is determined by which features you use.

**Q: What is the difference between Direct Messages and booking messages?**  
A: Both show property context and are stored in the messaging system. Booking messages are specifically sent when requesting to book a property, while direct messages can be sent anytime from the property page.

**Q: Can I see who viewed my property?**  
A: Property owners can see the total view count but not individual viewer identities for privacy reasons.

**Q: What validation is done on forms?**  
A: Forms validate:
- Required fields are filled
- Email format is correct
- Dates are logical (check-in not in past)
- Numbers are in valid ranges
- Text meets minimum length requirements
Error messages guide you to fix any issues.

**Q: How does WebGI handle concurrent bookings?**  
A: Property availability is tracked in real-time. If multiple users try to book the same dates, the property owner can manage requests in the order received.

**Q: Can I integrate WebGI with other services?**  
A: WebGI's RESTful API architecture allows for potential integrations. Contact our development team for API access and integration possibilities.

**Q: What is ShadCN UI?**  
A: ShadCN UI is the component library used for WebGI's consistent, modern design. It provides the building blocks for buttons, forms, cards, and other interface elements.

**Q: Why is the primary color blue?**  
A: The primary blue (#3b82f6) with accent yellow (#fbbf24) creates a trustworthy, professional appearance that's easy on the eyes and accessible.

**Q: What is Sonner?**  
A: Sonner is the toast notification library that shows success messages, errors, and other feedback. You'll see these as small pop-ups when you perform actions.

**Q: Can I download property information?**  
A: While there isn't a direct download feature for property details, you can view all information on the property page and contact the owner for additional documentation.

**Q: How do I know if my booking was successful?**  
A: You'll receive a success toast notification immediately after submitting a booking. The booking also appears in your "My Bookings" section with all details.

**Q: What is rate limiting?**  
A: API rate limiting ensures fair usage and platform stability. If you make too many requests too quickly, you might be temporarily slowed down to protect server resources.

**Q: Can I undo a property deletion?**  
A: Property deletions are permanent. Make sure you want to remove a listing before confirming deletion.

**Q: How secure is the messaging system?**  
A: Messages are transmitted securely and stored in the database with proper access controls. Only participants in a conversation can view its messages.

**Q: What is CORS?**  
A: CORS (Cross-Origin Resource Sharing) is properly configured to allow secure communication between WebGI's frontend and backend while preventing unauthorized access.

**Q: Can I customize my profile picture?**  
A: Profile customization features may be expanded in future updates. Currently, focus on completing your profile details for better trust with property owners.

---

**Bot Closing Responses:**

**Q: Thank you / Thanks**  
A: You're very welcome! If you have any other questions about finding a property, listing your rental, or using WebGI's features, I'm here to help anytime!

**Q: Bye / Goodbye**  
A: Goodbye! Happy property hunting on WebGI. Feel free to come back if you need any assistance. Have a great day!

**Q: That's all / No more questions**  
A: Perfect! I'm glad I could help. Remember, I'm always here if you need anything else. Enjoy using WebGI!

---

*This training document covers comprehensive scenarios from basic greetings to complex platform features. The chatbot should respond naturally, providing relevant information while maintaining a helpful, friendly tone. Responses should be concise yet informative, guiding users to the right features or information they need.*
