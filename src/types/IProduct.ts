import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  nome: string;
  preco: number;
  quantidadeEmStock: number;
  descricao: string;
  createdAt: Date;
  updatedAt: Date;
}
