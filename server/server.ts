import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import scansRoutes from "./routes/scans";
import featuresRoutes from "./routes/features";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins (standard browsers, mobile WebViews, PWA) for local development
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" })); // Support base64 images for scan captures
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request Logger Middleware for Diagnostics
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  if (req.method === "POST" || req.method === "PUT") {
    console.log("   Payload:", JSON.stringify(req.body).substring(0, 150));
  }
  next();
});

// Route Groups
app.use("/api/auth", authRoutes);
app.use("/api/scans", scansRoutes);
app.use("/api/features", featuresRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandle Server Error:", err);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  SkinScan AI Server listening on port ${PORT} `);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});
