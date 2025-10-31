# Astronacci - Express Authentication API

A complete Express.js authentication system with Firebase integration, JWT tokens, and password reset functionality.

## Features

- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Authentication
- ✅ Password Reset (Forgot Password)
- ✅ Protected Routes Middleware
- ✅ Firebase Authentication & Firestore Integration
- ✅ Password Hashing with bcrypt
- ✅ User Profile Management
- ✅ **Swagger/OpenAPI Documentation** 🆕

## Tech Stack

- **Express.js** - Web framework
- **Firebase Admin SDK** - Authentication & Firestore
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment configuration
- **Swagger UI** - Interactive API documentation

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd astronacci
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   You need to set up Firebase Admin SDK. There are two ways:

   **Option 1: Using Service Account JSON (Recommended)**
   
   1. Go to [Firebase Console](https://console.firebase.google.com/)
   2. Select your project or create a new one
   3. Go to Project Settings > Service Accounts
   4. Click "Generate New Private Key"
   5. Save the JSON file as `config/serviceAccountKey.json`

   **Option 2: Using Environment Variables**
   
   1. Get your Firebase credentials from Firebase Console
   2. Update `.env` file with:
      ```
      FIREBASE_PROJECT_ID=your-project-id
      FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
      FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
      ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   - `JWT_SECRET` - Generate a strong secret key
   - `JWT_EXPIRES_IN` - Token expiration time (default: 7d)
   - Firebase credentials (if using environment variables)

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access Swagger Documentation**
   
   Visit: **http://localhost:3000/api-docs**
   
   You can interactively test all API endpoints!

## API Documentation

**Swagger UI**: http://localhost:3000/api-docs

The interactive Swagger UI provides:
- Complete API documentation
- Try-it-out functionality
- Request/response examples
- Authentication testing
- OpenAPI spec export

See [SWAGGER_SETUP.md](SWAGGER_SETUP.md) for detailed usage instructions.

## API Endpoints

### Authentication Routes

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "+1234567890", // optional
  "address": "123 Main Street, City, State 12345" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "uid": "firebase-uid",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "address": "123 Main Street, City, State 12345",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "uid": "firebase-uid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "jwt-token-here"
  }
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If email exists, password reset link has been sent"
}
```

**Note:** In development mode, the reset token is returned in the response. Remove this in production!

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "firebase-uid",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "address": "123 Main Street, City, State 12345",
      "role": "user"
    }
  }
}
```

#### Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+9876543210",
  "address": "456 Oak Avenue, City, State 67890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "uid": "firebase-uid",
      "email": "user@example.com",
      "name": "Jane Doe",
      "phone": "+9876543210",
      "address": "456 Oak Avenue, City, State 67890",
      "role": "user"
    }
  }
}
```

## Authentication Middleware

To protect your routes, use the `verifyToken` middleware:

```javascript
const { verifyToken } = require('./middleware/auth');

// Protect a single route
app.get('/protected-route', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Protect multiple routes
router.use('/api/protected', verifyToken);
```

## Firebase Firestore Collections

The application creates/uses the following collections:

### `users`
Stores user profile data:
- `uid` (string) - Firebase Auth UID
- `email` (string)
- `name` (string)
- `phone` (string)
- `address` (string) - User home address
- `password` (string) - Hashed password
- `role` (string) - User role
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `lastLogin` (timestamp)

### `password_resets`
Stores password reset tokens:
- `uid` (string)
- `token` (string)
- `expiresAt` (timestamp)
- `used` (boolean)
- `createdAt` (timestamp)

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Additional error details (in development mode)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Never commit Firebase service account key** - Already in `.gitignore`
3. **Change JWT_SECRET** - Use a strong, random secret key
4. **Remove reset token from response** - In production, don't return reset tokens
5. **Add email service** - Implement actual email sending for password reset
6. **Add rate limiting** - Prevent brute force attacks
7. **Add CORS** - Configure proper CORS settings
8. **Use HTTPS** - Always use HTTPS in production

## Adding Email Service

To send actual password reset emails, you can integrate services like:
- [SendGrid](https://sendgrid.com/)
- [Mailgun](https://www.mailgun.com/)
- [AWS SES](https://aws.amazon.com/ses/)
- [Nodemailer](https://nodemailer.com/)

Example with Nodemailer:
```bash
npm install nodemailer
```

Then update the `forgotPassword` function in `controllers/authController.js` to send emails.

## Project Structure

```
astronacci/
├── config/
│   ├── firebase.js                 # Firebase Admin configuration
│   └── serviceAccountKey.json     # Firebase credentials (gitignored)
├── controllers/
│   └── authController.js          # Auth business logic
├── middleware/
│   └── auth.js                    # JWT verification middleware
├── routes/
│   └── auth.js                    # Auth routes
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── server.js                      # Express app entry point
├── package.json                   # Dependencies
└── README.md                      # This file
```

## License

ISC

