# WebGI Backend - Express.js API Server

This is the backend server for the WebGI Real Estate Platform built with Node.js, Express, and MongoDB.

## Features

- **User Authentication** - Register, login, and profile management
- **JWT-based Authorization** - Secure token-based authentication
- **Property Management** - CRUD operations for real estate properties
- **Image Upload** - Upload property images to Firebase Cloud Storage
- **Search & Filter** - Advanced search with multiple filters
- **Role-based Access** - Different permissions for buyers and sellers
- **MongoDB** - Data persistence with MongoDB Atlas
- **CORS Support** - Cross-origin requests enabled for frontend integration

## Prerequisites

- Node.js 16+ 
- npm, yarn, or bun
- MongoDB Atlas account (free tier available)
- Firebase project with Cloud Storage enabled

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
   - MongoDB Atlas URI
   - Firebase service account details
   - JWT secret
   - Frontend URL (for CORS)

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Property Endpoints
- `GET /api/properties` - List all properties with filters
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create a new property (sellers only)
- `PUT /api/properties/:id` - Update property (sellers only)
- `DELETE /api/properties/:id` - Delete property (sellers only)
- `POST /api/properties/:id/upload-images` - Upload property images
- `GET /api/properties/seller/my-properties` - Get seller's properties
- `GET /api/properties/search` - Search properties by query

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── firebase.js      # Firebase setup
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── propertyController.js # Property operations
│   ├── middleware/
│   │   └── auth.js          # JWT verification & authorization
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Property.js      # Property schema
│   ├── routes/
│   │   ├── auth.js          # Auth routes
│   │   └── properties.js    # Property routes
│   └── server.js            # Express app setup
├── .env                     # Environment variables (not in git)
├── .env.example            # Example environment variables
├── package.json
└── README.md
```

## Environment Variables

Required environment variables in `.env`:

```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webgi

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Firebase
FIREBASE_PROJECT_ID=project_id
FIREBASE_STORAGE_BUCKET=bucket_name.appspot.com
FIREBASE_PRIVATE_KEY=private_key
FIREBASE_CLIENT_EMAIL=email@projectid.iam.gserviceaccount.com

# CORS
FRONTEND_URL=http://localhost:5173
```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB object modeling
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **firebase-admin** - Firebase Admin SDK
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-validator** - Request validation
- **dotenv** - Environment variables

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "buyer" | "seller",
  phone: String,
  profileImage: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  bio: String,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Property
```javascript
{
  title: String,
  description: String,
  price: Number,
  propertyType: "apartment" | "house" | "villa" | "land" | "commercial",
  bedrooms: Number,
  bathrooms: Number,
  squareFeet: Number,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  latitude: Number,
  longitude: Number,
  images: [{ url: String, uploadedAt: Date }],
  amenities: [String],
  seller: ObjectId (User),
  status: "available" | "sold" | "pending",
  featured: Boolean,
  views: Number,
  ratings: [{ userId: ObjectId, rating: Number, comment: String }],
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns standardized error responses:

```javascript
{
  success: false,
  message: "Error description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- CORS configuration
- Helmet.js security headers
- Input validation with express-validator
- Protected image upload with file type validation

## Firebase Setup

1. Create a Firebase project
2. Enable Cloud Storage
3. Create a service account and download JSON
4. Add the service account details to `.env`

Images are stored in: `properties/{propertyId}/{randomName}`

## Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB Atlas cluster is running
- Verify connection string is correct
- Check IP whitelist settings

### Firebase Upload Failed
- Verify service account has Cloud Storage permissions
- Check Firebase bucket name
- Ensure private key is properly formatted

### Authentication Issues
- Check JWT_SECRET is set
- Verify token format: `Bearer {token}`
- Check token expiration

## License

MIT

## Support

For issues and questions, please contact the development team.
