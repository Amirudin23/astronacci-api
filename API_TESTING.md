# API Testing Guide

This guide provides curl commands to test all authentication endpoints.

## Prerequisites

1. Server should be running: `npm run dev`
2. Firebase should be configured (see `FIREBASE_SETUP.md`)
3. Generate a JWT secret for testing:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Base URL

```
http://localhost:3000
```

## Test Users

Save these variables (replace with actual values after registration):

```bash
export AUTH_TOKEN="your-jwt-token-here"
export TEST_EMAIL="test@example.com"
export TEST_PASSWORD="TestPassword123"
```

## Test Endpoints

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Test User",
    "phone": "+1234567890"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "uid": "...",
      "email": "test@example.com",
      "name": "Test User",
      "phone": "+1234567890",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token:**
```bash
export AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "uid": "...",
      "email": "test@example.com",
      "name": "Test User",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Profile (Protected Route)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "...",
      "email": "test@example.com",
      "name": "Test User",
      "phone": "+1234567890",
      "role": "user",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

### 4. Update Profile (Protected Route)

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test User",
    "phone": "+9876543210"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "uid": "...",
      "email": "test@example.com",
      "name": "Updated Test User",
      "phone": "+9876543210",
      "role": "user"
    }
  }
}
```

### 5. Forgot Password

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "If email exists, password reset link has been sent",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // only in development
}
```

**Save the reset token:**
```bash
export RESET_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 6. Reset Password

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "newPassword": "NewTestPassword123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 7. Try Login with New Password

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "NewTestPassword123"
  }'
```

Should succeed.

### 8. Try Login with Old Password

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Error Testing

### Test Invalid Token

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer invalid-token-here"
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### Test Missing Token

```bash
curl -X GET http://localhost:3000/api/auth/profile
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

### Test Registration with Existing Email

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Duplicate User"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### Test Login with Wrong Password

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Test Missing Required Fields

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Email, password, and name are required"
}
```

## Automated Testing Script

You can create a test script to run all tests automatically:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
EMAIL="test@example.com"
PASSWORD="TestPassword123"

echo "Testing Register..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"name\": \"Test User\"}")

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | sed 's/"token":"\(.*\)"/\1/')
echo "Token: $TOKEN"

echo "Testing Get Profile..."
curl -s -X GET $BASE_URL/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq

echo "Testing Update Profile..."
curl -s -X PUT $BASE_URL/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated User"}' | jq

echo "Testing Forgot Password..."
FORGOT_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}")

RESET_TOKEN=$(echo $FORGOT_RESPONSE | grep -o '"resetToken":"[^"]*"' | sed 's/"resetToken":"\(.*\)"/\1/')
echo "Reset Token: $RESET_TOKEN"

echo "Testing Reset Password..."
curl -s -X POST $BASE_URL/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$RESET_TOKEN\", \"newPassword\": \"NewPassword123\"}" | jq

echo "Testing Login with New Password..."
curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"NewPassword123\"}" | jq

echo "Tests completed!"
```

Save this as `test-api.sh`, make it executable (`chmod +x test-api.sh`), and run:
```bash
./test-api.sh
```

## Using Postman

If you prefer a GUI, you can import these endpoints into Postman:

1. Create a new collection "Astronacci Auth"
2. Create environment variables:
   - `base_url`: `http://localhost:3000`
   - `auth_token`: (will be set automatically)

3. Create requests:
   - POST Register → Set auth_token from response
   - POST Login → Update auth_token from response
   - GET Profile → Use Bearer Token: `{{auth_token}}`
   - PUT Profile → Use Bearer Token: `{{auth_token}}`
   - POST Forgot Password
   - POST Reset Password

## Verification in Firebase Console

After running tests, verify in Firebase Console:

1. **Authentication Tab**: Should show registered users
2. **Firestore Tab**:
   - `users` collection with user documents
   - `password_resets` collection with reset tokens

## Production Testing

Before deploying to production:

1. ✅ Test all endpoints
2. ✅ Verify JWT tokens expire correctly
3. ✅ Test password reset flow
4. ✅ Verify Firebase security rules
5. ✅ Remove reset token from response (in production)
6. ✅ Test with invalid/expired tokens
7. ✅ Load test with multiple concurrent requests

