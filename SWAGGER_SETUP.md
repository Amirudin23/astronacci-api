# Swagger Documentation Setup

Swagger/OpenAPI documentation has been added to the Astronacci Authentication API.

## Accessing the Documentation

Once your server is running, visit:

**http://localhost:3000/api-docs**

You'll see an interactive Swagger UI with:
- All API endpoints
- Request/response schemas
- Try-it-out functionality
- Authentication testing

## What's Included

### API Documentation

All endpoints are documented with:

1. **Endpoint Description**: What the endpoint does
2. **Request Schema**: Required and optional fields
3. **Response Schemas**: Success and error responses
4. **Examples**: Sample request/response payloads
5. **Authentication**: Security requirements

### Documented Endpoints

#### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

#### Profile Endpoints (Protected)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## Using Swagger UI

### 1. View Available Endpoints

Browse through the endpoints organized by tags:
- **Authentication**: Public auth endpoints
- **Profile**: Protected profile management

### 2. Test Endpoints

Each endpoint has a "Try it out" button that allows you to:

1. Click **"Try it out"**
2. Fill in request parameters
3. Click **"Execute"**
4. View the response

### 3. Authenticate Requests

For protected endpoints:

1. First, register or login to get a token
2. Click the **"Authorize"** button at the top
3. Enter your JWT token (prefix with "Bearer " or just the token)
4. Click **"Authorize"**
5. Now all protected endpoints will use this token

**Example Token Entry:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Or just:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Configuration

### Swagger Config Location

- **Config**: `config/swagger.js`
- **Documentation**: Inline in `routes/auth.js`
- **Integration**: `server.js`

### Customization

Edit `config/swagger.js` to customize:
- API info (title, version, description)
- Server URLs
- Tags and categories
- Security schemes

## Testing Workflow

### 1. Register a User

```
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "SecurePass123",
  "name": "Test User"
}
```

Copy the returned token.

### 2. Authorize

Click "Authorize" and paste the token.

### 3. Test Protected Endpoints

Now you can test:
- `GET /api/auth/profile` - Should return your user data
- `PUT /api/auth/profile` - Update your profile

### 4. Password Reset Flow

1. Use `POST /api/auth/forgot-password`
2. Copy the reset token from response
3. Use `POST /api/auth/reset-password` with the token

## OpenAPI Spec Export

You can export the OpenAPI specification:

Visit: **http://localhost:3000/api-docs/swagger.json**

This returns the complete OpenAPI 3.0 specification in JSON format.

## Integration with Other Tools

The OpenAPI spec can be imported into:

- **Postman**: Import the JSON spec
- **Insomnia**: Import the JSON spec
- **Code Generators**: Generate client SDKs
- **API Testing Tools**: Automated testing
- **Documentation Sites**: Host on docs sites

## Adding New Endpoints

To document new endpoints:

1. Add the endpoint to your route file
2. Add Swagger JSDoc comments above the route:

```javascript
/**
 * @swagger
 * /api/new-endpoint:
 *   post:
 *     summary: Description of endpoint
 *     tags: [TagName]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchemaName'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessSchema'
 */
router.post('/new-endpoint', controller.handler);
```

## Components and Schemas

All common schemas are defined in `config/swagger.js` under `components.schemas`:

- **User**: User object structure
- **AuthResponse**: Registration/login response
- **RegisterRequest**: Registration payload
- **LoginRequest**: Login payload
- **ForgotPasswordRequest**: Password reset request
- **ResetPasswordRequest**: Password reset confirmation
- **UpdateProfileRequest**: Profile update payload
- **SuccessResponse**: Generic success response
- **ErrorResponse**: Error response format

## Security Documentation

Bearer authentication is configured in Swagger:

```yaml
security:
  - bearerAuth: []
```

This adds an "Authorize" button to protected endpoints.

## Tips

1. **Keep it Updated**: Update Swagger docs when you change endpoints
2. **Use Examples**: Add realistic example values
3. **Document Errors**: Include all error response scenarios
4. **Test Regularly**: Use Swagger UI to test your changes
5. **Export Spec**: Keep a copy of the OpenAPI JSON spec

## Troubleshooting

### Swagger UI Not Loading

1. Make sure packages are installed: `npm install`
2. Check server is running
3. Clear browser cache
4. Check console for errors

### Endpoints Not Showing

1. Verify Swagger comments are correct
2. Check file paths in `swagger.js` `apis` array
3. Restart the server

### Authentication Not Working

1. Make sure you clicked "Authorize"
2. Token should be valid (not expired)
3. Format: Just the token or "Bearer TOKEN"

## Production Considerations

- Customize Swagger UI branding
- Add CORS for API docs if needed
- Consider restricting access to API docs in production
- Or host docs separately on a docs domain

## Additional Resources

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)

