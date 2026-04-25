import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

export const productRouter = Router();

// GET /products - Listar todos os produtos
productRouter.get("/", getAllProducts);

// GET /products/:id - Obter um produto por ID
productRouter.get("/:id", getProductById);

// POST /products - Criar um novo produto
productRouter.post("/", createProduct);

// PUT /products/:id - Atualizar um produto
productRouter.put("/:id", updateProduct);

// DELETE /products/:id - Apagar um produto
productRouter.delete("/:id", deleteProduct);
