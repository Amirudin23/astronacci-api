# Quick Start Guide

Get your Express authentication API running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Express.js
- Firebase Admin SDK
- JWT library
- bcryptjs for password hashing
- Other dependencies

## Step 2: Set Up Firebase

### Option A: Using Service Account JSON (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select a project
3. Click ⚙️ (Settings) → Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Rename it to `serviceAccountKey.json`
7. Move it to the `config/` folder

### Option B: Using Environment Variables

1. Copy values from Firebase Console
2. Update `.env` file with your credentials

See `FIREBASE_SETUP.md` for detailed instructions.

## Step 3: Configure Environment

The `.env` file is already set up with a generated JWT secret. You just need to add Firebase credentials.

If using Option A (service account JSON), you're done! No need to edit `.env`.

If using Option B, edit `.env` and add:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Step 4: Enable Firebase Services

1. Go to Firebase Console → Authentication
2. Enable "Email/Password" sign-in method

3. Go to Firebase Console → Firestore Database
4. Create database in production or test mode

## Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
Server is running on http://localhost:3000
API Documentation available at http://localhost:3000/api-docs
```

## Step 6: Explore API Documentation

Visit **http://localhost:3000/api-docs** to access the interactive Swagger UI!

You can:
- Browse all endpoints
- Test endpoints directly
- View request/response examples
- Authorize with JWT tokens

## Step 7: Test the API

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "name": "Test User"
  }'
```

Save the returned token for the next steps!

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

### Get Profile (Protected)

Replace `YOUR_TOKEN` with the actual token from register/login:

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## That's It! 🎉

Your authentication API is up and running!

## Next Steps

- 📖 Read `README.md` for complete documentation
- 🧪 See `API_TESTING.md` for more test examples
- 🔧 See `PROJECT_STRUCTURE.md` for code overview
- 🔥 Configure Firebase production rules (see `FIREBASE_SETUP.md`)

## Common Issues

### "Firebase initialization failed"
- Make sure `serviceAccountKey.json` is in the `config/` folder
- Or check your `.env` Firebase credentials

### "Email already exists"
- Try with a different email address

### "Missing or insufficient permissions"
- Check Firestore security rules in Firebase Console
- For development, use test mode or permissive rules

### Port already in use
```bash
# Change PORT in .env to another port (e.g., 3001)
# Or kill the process using port 3000
```

## Production Checklist

Before deploying:

- [ ] Change JWT_SECRET in `.env`
- [ ] Enable proper Firestore security rules
- [ ] Remove reset token from forgot-password response
- [ ] Add email service for password reset
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Add CORS configuration
- [ ] Set NODE_ENV=production
- [ ] Add monitoring and logging

## Need Help?

- Check `README.md` for detailed documentation
- See `API_TESTING.md` for testing examples
- Review `FIREBASE_SETUP.md` for Firebase configuration
- See `SWAGGER_SETUP.md` for Swagger documentation guide
- Check the console for error messages

