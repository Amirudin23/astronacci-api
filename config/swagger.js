const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Astronacci Authentication API",
      version: "1.0.0",
      description:
        "A complete Express.js authentication system with Firebase integration, JWT tokens, and password reset functionality.",
      contact: {
        name: "API Support",
        email: "support@astronacci.com",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.astronacci.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            uid: {
              type: "string",
              description: "Firebase user ID",
              example: "abc123def456",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
            name: {
              type: "string",
              description: "User full name",
              example: "John Doe",
            },
            phone: {
              type: "string",
              description: "User phone number",
              example: "+1234567890",
            },
            address: {
              type: "string",
              description: "User home address",
              example: "123 Main Street, City, State 12345",
            },
            photoPath: {
              type: "string",
              description: "Path to user profile photo",
              example: "/uploads/user_abc123_1234567890.jpg",
            },
            role: {
              type: "string",
              description: "User role",
              example: "user",
              enum: ["user", "admin"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation date",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update date",
            },
            lastLogin: {
              type: "string",
              format: "date-time",
              description: "Last login date",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/User",
                },
                token: {
                  type: "string",
                  description: "JWT token",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password (min 6 characters)",
              example: "SecurePassword123",
            },
            name: {
              type: "string",
              description: "User full name",
              example: "John Doe",
            },
            phone: {
              type: "string",
              description: "User phone number (optional)",
              example: "+1234567890",
            },
            address: {
              type: "string",
              description: "User home address (optional)",
              example: "123 Main Street, City, State 12345",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password",
              example: "SecurePassword123",
            },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["token", "newPassword"],
          properties: {
            token: {
              type: "string",
              description: "Password reset token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            newPassword: {
              type: "string",
              format: "password",
              description: "New password (min 6 characters)",
              example: "NewSecurePassword123",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "User full name",
              example: "Jane Doe",
            },
            phone: {
              type: "string",
              description: "User phone number",
              example: "+9876543210",
            },
            address: {
              type: "string",
              description: "User home address",
              example: "456 Oak Avenue, City, State 67890",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            error: {
              type: "string",
              description: "Detailed error (only in development)",
              example: "Detailed error message",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints",
      },
      {
        name: "Profile",
        description: "User profile management",
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
