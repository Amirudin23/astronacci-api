# Project Structure

```
astronacci/
│
├── config/                          # Configuration files
│   ├── firebase.js                  # Firebase Admin SDK initialization
│   └── serviceAccountKey.json       # Firebase credentials (gitignored)
│
├── controllers/                     # Business logic controllers
│   └── authController.js           # Authentication operations
│       ├── register()              # User registration
│       ├── login()                 # User login
│       ├── forgotPassword()        # Password reset request
│       ├── resetPassword()         # Password reset with token
│       ├── getProfile()            # Get user profile
│       └── updateProfile()         # Update user profile
│
├── middleware/                      # Express middleware
│   └── auth.js                     # Authentication middleware
│       ├── verifyToken()           # JWT token verification
│       └── authorize()             # Role-based authorization
│
├── routes/                          # API routes
│   └── auth.js                     # Authentication routes
│       ├── POST /register          # Public
│       ├── POST /login             # Public
│       ├── POST /forgot-password   # Public
│       ├── POST /reset-password    # Public
│       ├── GET /profile            # Protected
│       └── PUT /profile            # Protected
│
├── node_modules/                    # Dependencies
│
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
│
├── API_TESTING.md                  # Testing guide with curl examples
├── FIREBASE_SETUP.md               # Firebase configuration guide
├── README.md                       # Main documentation
├── PROJECT_STRUCTURE.md            # This file
│
├── package.json                    # Dependencies and scripts
├── package-lock.json               # Lock file
│
└── server.js                       # Express app entry point
    ├── Express app setup
    ├── Middleware configuration
    └── Route registration
```

## File Descriptions

### Configuration Files

- **config/firebase.js**: Initializes Firebase Admin SDK with service account credentials
- **config/serviceAccountKey.json**: Firebase service account key (must be added by user)

### Controllers

- **controllers/authController.js**: Contains all authentication business logic:
  - Validates input
  - Hashes passwords
  - Manages Firebase Auth and Firestore
  - Generates and verifies JWT tokens
  - Handles error responses

### Middleware

- **middleware/auth.js**: Request validation middleware:
  - `verifyToken`: Extracts and verifies JWT from Authorization header
  - `authorize`: Checks user roles for authorization

### Routes

- **routes/auth.js**: Defines API endpoints and connects them to controllers

### Main Files

- **server.js**: Express application setup and configuration
- **package.json**: Project metadata and dependencies
- **.env**: Environment variables (secrets, credentials)
- **.env.example**: Template for environment variables
- **.gitignore**: Files to exclude from version control

## Data Flow

```
Request → Routes → Middleware → Controller → Firebase → Response
                          ↓
                    Verify Token
                          ↓
                    Check Permissions
                          ↓
                    Execute Logic
```

## Firebase Collections

### users
Stores user profile data:
```javascript
{
  uid: string,
  email: string,
  name: string,
  phone: string,
  password: string, // hashed
  role: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLogin: timestamp
}
```

### password_resets
Stores password reset tokens:
```javascript
{
  uid: string,
  token: string,
  expiresAt: timestamp,
  used: boolean,
  createdAt: timestamp
}
```

## Dependencies

### Production
- **express**: Web framework
- **firebase-admin**: Firebase Admin SDK
- **jsonwebtoken**: JWT token generation/verification
- **bcryptjs**: Password hashing
- **dotenv**: Environment variable management

### Development
- **nodemon**: Auto-restart during development

## API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password` | No | Reset password with token |
| GET | `/api/auth/profile` | Yes | Get user profile |
| PUT | `/api/auth/profile` | Yes | Update user profile |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development/production |
| `JWT_SECRET` | JWT signing secret | random hex string |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `FIREBASE_PROJECT_ID` | Firebase project ID | your-project-id |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | email@project.iam |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Private key string |

## Getting Started

1. Install dependencies: `npm install`
2. Set up Firebase: See `FIREBASE_SETUP.md`
3. Configure environment: Copy `.env.example` to `.env`
4. Start server: `npm run dev`
5. Test API: See `API_TESTING.md`

## Next Steps for Enhancement

- [ ] Add email service integration
- [ ] Implement email verification
- [ ] Add role-based access control
- [ ] Add rate limiting
- [ ] Add request validation
- [ ] Add comprehensive logging
- [ ] Add unit and integration tests
- [ ] Add CORS configuration
- [ ] Add request/response logging
- [ ] Add health check endpoint
- [ ] Add API documentation (Swagger)

