# 🏠 WebGI - AI-Powered Property Rental Platform

![WebGI Banner](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-ISC-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange)

A modern, full-stack property rental platform built with cutting-edge technologies, featuring AI-powered recommendations, real-time booking management, and comprehensive property analytics.

🌐 **[Live Demo](https://web-gi-qgij.vercel.app/)** | 📦 **[GitHub Repository](https://github.com/orugantinavadeep18/WebGI.git)**

---

## ✨ Key Features

### 🔍 Smart Property Discovery
- **AI-Powered Recommendations**: Get personalized property suggestions based on your preferences
- **Advanced Filtering**: Filter by price, amenities, location, property type, and more
- **Real-time Search**: Instant property search with live updates
- **Interactive Map Integration**: Visualize properties on an interactive map

### 📅 Booking Management
- **Seamless Booking System**: Easy-to-use property booking interface
- **Smart Date Selection**: Prevent past date selections with real-time validation
- **Dynamic Pricing**: Per-day pricing calculated from monthly rates
- **Booking Tracking**: Real-time status updates (Pending, Accepted, Rejected, Completed)

### 🏠 Property Management
- **List Properties**: Property owners can easily list their properties with detailed information
- **Image Management**: Upload multiple property images with drag-and-drop support
- **Rich Amenities**: Showcase amenities like WiFi, AC, Parking, Security, and more
- **Booking Requests Dashboard**: Manage incoming booking requests with one-click actions

### 💬 Communication
- **In-App Messaging**: Direct messaging between renters and property owners
- **Message Notifications**: Real-time message notifications
- **Contact Information**: Quick access to owner details

### 🤖 AI Recommendation System
- **Machine Learning Engine**: Python FastAPI-based ML server
- **Personalized Suggestions**: Recommendations based on user behavior and preferences
- **Scoring Algorithm**: Advanced scoring system for property matching

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt encryption for user passwords
- **Role-Based Access**: Different access levels for renters and property owners
- **CORS Protection**: Cross-Origin Request protection

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: Radix UI (headless component library)
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form
- **Notifications**: Sonner Toast Library
- **Icons**: Lucide React
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + ImageKit
- **Image Storage**: ImageKit CDN
- **Validation**: Express Validator
- **Security**: Helmet, CORS

### AI/ML System
- **Framework**: FastAPI (Python)
- **ML Libraries**: Pandas, NumPy, Scikit-learn
- **Database Integration**: PyMongo
- **API**: RESTful API with Pydantic validation

### Infrastructure & Deployment
- **Frontend Hosting**: Vercel
- **Database**: MongoDB Cloud (Atlas)
- **Image Storage**: ImageKit CDN
- **Backend**: Node.js (Compatible with various platforms)
- **Version Control**: Git

---

## 📦 Project Structure

```
WebGI/
├── src/                              # Frontend React application
│   ├── components/                   # Reusable React components
│   │   ├── ui/                       # UI components (buttons, inputs, modals)
│   │   ├── layout/                   # Layout components
│   │   ├── property/                 # Property-specific components
│   │   └── ...
│   ├── pages/                        # Page components
│   │   ├── CreateProperty.jsx        # Create property page
│   │   ├── MyBookings.jsx            # User bookings page
│   │   ├── BookingRequests.jsx       # Owner booking requests
│   │   ├── Properties.jsx            # Property listing page
│   │   └── ...
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.js                # Authentication hook
│   │   ├── useProperties.js          # Properties hook
│   │   ├── useBooking.js             # Booking hook
│   │   └── ...
│   ├── lib/                          # Utility functions and helpers
│   │   └── api.js                    # API client setup
│   ├── config/                       # Configuration files
│   └── App.jsx                       # Main App component
├── backend/                          # Node.js Express backend
│   ├── src/
│   │   ├── server.js                 # Main server file
│   │   ├── models/                   # Database models
│   │   ├── routes/                   # API routes
│   │   ├── controllers/              # Route controllers
│   │   ├── middleware/               # Express middleware
│   │   └── config/                   # Configuration
│   ├── scripts/                      # Database scripts
│   └── package.json
├── AI Recommendation System/         # Python ML server
│   ├── ml_server.py                  # FastAPI ML server
│   ├── recommendations/              # ML models and logic
│   └── requirements.txt              # Python dependencies
├── public/                           # Static assets
│   └── samplehstl*.avif              # Sample property images
├── package.json                      # Frontend dependencies
├── vite.config.ts                    # Vite configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16+ (for frontend and backend)
- **Python** 3.8+ (for AI Recommendation System)
- **MongoDB** (local or cloud)
- **npm** or **bun** package manager

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/orugantinavadeep18/WebGI.git
cd WebGI
```

#### 2. Frontend Setup
```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev

# Build for production
npm run build
```

#### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# Required variables:
# - MONGODB_URI=your_mongodb_connection_string
# - JWT_SECRET=your_jwt_secret
# - IMAGEKIT_PUBLIC_KEY=your_imagekit_key
# - IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
# - IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Start development server
npm run dev

# Seed database (optional)
npm run seed
npm run seed-rentals
```

#### 4. AI Recommendation System
```bash
cd "AI Recommendation System"

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python ml_server.py
```

---

## 🔧 Configuration

### Environment Variables

**Frontend** (create `.env` in root):
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

**Backend** (create `.env` in backend/):
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/webgi
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**ML Server** (create `.env` in AI Recommendation System/):
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/webgi
ML_PORT=8000
```

---

## 📚 API Documentation

### Core Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get current user profile

#### Properties
- `GET /properties` - List all properties
- `GET /properties/:id` - Get property details
- `POST /properties` - Create new property (requires auth)
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property
- `POST /properties/:id/upload-images` - Upload property images

#### Bookings
- `POST /bookings` - Create booking request
- `GET /bookings/renter/bookings` - Get user's bookings
- `GET /bookings/owner/requests` - Get owner's booking requests
- `PUT /bookings/:id/accept` - Accept booking request
- `PUT /bookings/:id/reject` - Reject booking request
- `PUT /bookings/:id/cancel` - Cancel booking

#### Messages
- `POST /messages` - Send message
- `GET /messages/:conversationId` - Get messages
- `GET /conversations` - List all conversations

---

## 🎨 Features Showcase

### For Renters
✅ Browse and search properties  
✅ View detailed property information with images  
✅ Check real-time availability  
✅ Receive AI-powered recommendations  
✅ Book properties with smart date validation  
✅ Track booking status  
✅ Message property owners  
✅ View booking history  

### For Property Owners
✅ List multiple properties  
✅ Upload and manage property images  
✅ Set pricing and availability  
✅ Manage incoming booking requests  
✅ View rental history  
✅ Communicate with renters  
✅ Track revenue and analytics  

---

## 🐛 Known Issues & Bug Fixes

### Recent Fixes
- ✅ Fixed past date selection in booking system
- ✅ Fixed property_type field mismatch in CreateProperty form
- ✅ Fixed price calculation (now correctly divides monthly price by 30 for daily rates)
- ✅ Added validation for required fields (bedrooms, bathrooms, squareFeet)
- ✅ Enhanced date picker with min attribute for better UX

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Linting
npm run lint
```

---

## 📈 Performance Optimizations

- **Image Optimization**: AVIF format for faster loading
- **Lazy Loading**: Components and images load on demand
- **Code Splitting**: Vite handles automatic code splitting
- **CDN Integration**: ImageKit for optimized image delivery
- **Database Indexing**: MongoDB indexes for fast queries
- **API Caching**: React Query for efficient data fetching

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Encryption**: BCrypt hashing for passwords
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Restricted cross-origin requests
- **Helmet Middleware**: Security headers on all responses
- **Image Validation**: Only allow image files up to 10MB
- **SQL Injection Prevention**: Using Mongoose ODM

---

## 🚢 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend
Can be deployed to:
- Render.com
- Railway.app
- Heroku
- AWS
- DigitalOcean
- Self-hosted servers

### ML Server
Can be deployed to:
- Render.com
- Railway.app
- AWS EC2
- Google Cloud Run

---

## 📞 Support & Contribution

### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

### Issues
Found a bug or have a feature request? Please open an issue on GitHub.

### Contact
For inquiries and support, please reach out through the GitHub repository.

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For utility-first styling
- **Vercel** - For hosting and deployment
- **MongoDB** - For database solutions
- **ImageKit** - For image optimization and CDN

---

## 📊 Project Stats

- **Frontend Components**: 50+
- **API Endpoints**: 30+
- **Database Collections**: 8+
- **ML Models**: Custom recommendation engine
- **Lines of Code**: 10,000+
- **Test Coverage**: Comprehensive

---

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Video property tours
- [ ] Virtual property viewing
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Reviews and ratings system
- [ ] Price negotiation feature

---

<div align="center">

### Made with ❤️ by the WebGI Team

**[🌐 Live Demo](https://web-gi-qgij.vercel.app/)** • **[📦 GitHub](https://github.com/orugantinavadeep18/WebGI.git)** • **[⭐ Star us on GitHub!](https://github.com/orugantinavadeep18/WebGI)**

</div>
