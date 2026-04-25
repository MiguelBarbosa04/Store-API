import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database/db.js";
import { productRouter } from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Conectar ao MongoDB
connectDB();

// Routes
app.use("/api/products", productRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
});