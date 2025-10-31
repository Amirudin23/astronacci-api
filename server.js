require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
// Initialize Firebase Admin
require("./config/firebase");
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// CORS Middleware - Must be before routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - serve uploaded images
app.use("/uploads", express.static("uploads"));

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Astronacci API Documentation",
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Express API" });
});

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is accessible on http://10.107.181.238:${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
  console.log(
    `API Documentation available at http://10.107.181.238:${PORT}/api-docs`
  );
});
