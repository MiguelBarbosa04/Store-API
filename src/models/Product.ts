import mongoose from "mongoose";
import type { IProduct } from "../types/IProduct.js";

const productSchema = new mongoose.Schema<IProduct>(
  {
      productId: {
      type: Number,
      required: true,
      unique: true,
      immutable: true,
    },
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    preco: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: (v: number) => Number.isInteger(v * 100),
      message: "Preço deve ter no máximo 2 casas decimais",
    },
    },
    quantidadeEmStock: {
      type: Number,
      min: 0,
      default: 0,
        validate: {
      validator: Number.isInteger,
      message: "Quantidade deve ser um número inteiro",
  },
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
