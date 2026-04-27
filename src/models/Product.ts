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
    },
    quantidadeEmStock: {
      type: Number,
      min: 0,
      default: 0,
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
