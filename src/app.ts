import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./database/db.js";
import { openApiSpec } from "./docs/openapi.js";
import { productRouter } from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Conectar ao MongoDB
connectDB();

// Healthcheck
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/products", productRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
  console.log(`Swagger em http://localhost:${PORT}/docs`);
});