// Modelo `Product` — esquema Mongoose para produtos.
// Campos principais:
// - productId: número único e imutável, gerado pelo `Counter` (não editável)
// - nome: nome do produto (string)
// - preco: preço em unidades monetárias (número com até 2 casas decimais)
// - quantidadeEmStock: stock disponível (inteiro não-negativo)
// - descricao: descrição do produto (string)
import mongoose from "mongoose";
import type { IProduct } from "../types/IProduct.js";

const productSchema = new mongoose.Schema<IProduct>(
  {
    // Identificador sequencial do produto — gerado externamente
    productId: {
      type: Number,
      required: true,
      unique: true,
      immutable: true,
    },
    // Nome do produto
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    // Preço: validação para até 2 casas decimais
    preco: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        // Multiplica por 100 e verifica se é inteiro
        validator: (v: number) => Number.isInteger(v * 100),
        message: "Preço deve ter no máximo 2 casas decimais",
      },
    },
    // Quantidade em stock: inteiro não-negativo
    quantidadeEmStock: {
      type: Number,
      min: 0,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Quantidade deve ser um número inteiro",
      },
    },
    // Descrição do produto
    descricao: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    // Adiciona os campos `createdAt` e `updatedAt`
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
