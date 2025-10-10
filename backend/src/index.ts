import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
// Swagger
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
// Configure CORS
const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({ origin: [corsOrigin, "http://localhost:5173"], credentials: true })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check
app.get("/", (req, res) => {
  res.send("Trello Clone API is running");
});

// Auth routes
import authRoutes from "./routes/auth.routes";
app.use("/api/auth", authRoutes);
// Boards routes
import boardsRoutes from "./routes/boards.routes";
app.use("/api/boards", boardsRoutes);
// Columns routes
import columnsRoutes from "./routes/columns.routes";
app.use("/api/columns", columnsRoutes);
// Cards routes
import cardsRoutes from "./routes/cards.routes";
app.use("/api/cards", cardsRoutes);
// Label system routes
import labelsRoutes from "./routes/labels.routes";
app.use("/api/labels", labelsRoutes);
// Card-Label assignment routes
import cardLabelsRoutes from "./routes/cardLabels.routes";
app.use("/api/card-labels", cardLabelsRoutes);
// BoardMembers routes
import boardMembersRoutes from "./routes/boardMembers.routes";
app.use("/api/board-members", boardMembersRoutes);
// Checklist item routes
import checklistsRoutes from "./routes/checklists.routes";
app.use("/api/checklists", checklistsRoutes);

// // Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trello Clone API",
      version: "1.0.0",
      description: "API documentation for Trello Clone backend",
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Serve Swagger UI at /api-docs and alias /api/docs
app.use(
  ["/api-docs", "/api/docs"],
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
// Serve raw OpenAPI JSON at /api-docs.json and alias /api/docs.json
app.get(["/api-docs.json", "/api/docs.json"], (req, res) =>
  res.json(swaggerSpec)
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Start server on all network interfaces
const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
