# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Astronacci authentication system.

## Prerequisites

- A Google account
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "astronacci")
4. Click **"Continue"**
5. (Optional) Enable Google Analytics for your project
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

## Step 2: Enable Authentication

1. In your Firebase project dashboard, go to **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Create Firestore Database

1. In your Firebase project dashboard, go to **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"** or **"Start in test mode"** (for development)
4. Choose your preferred Cloud Firestore location
5. Click **"Enable"**

### Firestore Security Rules (Development)

For development, you can use these permissive rules. **DO NOT use in production!**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /password_resets/{resetId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Go to Firestore > Rules and paste the above rules.

## Step 4: Get Firebase Service Account Key

1. In your Firebase project dashboard, click the gear icon ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Go to the **"Service accounts"** tab
4. Click **"Generate new private key"**
5. A JSON file will be downloaded - this is your service account key
6. **IMPORTANT**: Keep this file secure and never commit it to version control!
7. Rename the downloaded file to `serviceAccountKey.json`
8. Move it to the `config/` folder in your project

Your project structure should look like:
```
astronacci/
├── config/
│   ├── firebase.js
│   └── serviceAccountKey.json  ← Place the downloaded JSON here
```

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env` if you haven't already:
   ```bash
   cp .env.example .env
   ```

2. Generate a strong JWT secret. You can use:
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Update your `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   
   JWT_SECRET=paste-your-generated-secret-here
   JWT_EXPIRES_IN=7d
   ```

   Since you're using the service account JSON file, you don't need to fill in the Firebase environment variables.

## Step 6: Enable Firestore Index (Optional)

If you get an error about missing indexes when querying users:

1. Go to Firestore > Indexes
2. Create a composite index on the `users` collection:
   - Collection ID: `users`
   - Fields: `email` (Ascending)
   - Query scope: Collection

## Step 7: Test Your Setup

1. Start your server:
   ```bash
   npm run dev
   ```

2. Test the registration endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "test123456",
       "name": "Test User"
     }'
   ```

3. You should see a success response with a user object and JWT token.

4. Verify in Firebase Console:
   - Check **Authentication** tab - you should see the new user
   - Check **Firestore** tab - you should see a document in the `users` collection

## Troubleshooting

### Error: "Failed to load credentials"
- Make sure `serviceAccountKey.json` is in the `config/` folder
- Check that the JSON file is valid
- Verify the file permissions

### Error: "Firebase initialization failed"
- Check that your service account key is valid
- Make sure all required fields are present in the JSON

### Error: "Email already exists"
- The user is already registered
- Try with a different email or check Firebase Authentication console

### Error: "Missing or insufficient permissions" in Firestore
- Check your Firestore security rules
- For development, use the permissive rules provided above
- For production, implement proper security rules

### Error: "Collection users does not exist"
- This is normal - Firestore creates collections automatically
- The first time you create a user, the collection will be created

## Production Considerations

1. **Security Rules**: Implement proper Firestore security rules
2. **Email Verification**: Enable email verification in Firebase Auth
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Monitoring**: Enable Firebase Analytics and Crashlytics
5. **Backups**: Set up Firestore backups
6. **Service Account**: Use separate service accounts for production

## Next Steps

- [ ] Implement email sending for password reset
- [ ] Add email verification
- [ ] Add role-based access control
- [ ] Add rate limiting
- [ ] Add logging
- [ ] Add testing

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

