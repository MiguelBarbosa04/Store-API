import type { Request, Response } from "express";
import { Product } from "../models/Product.js";
import { Counter } from "../models/Counter.js";
import type { IProduct } from "../types/IProduct.js";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
   const products = await Product.find().sort({ productId: 1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ productId: Number(id) });

    if (!product) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao procurar produto" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nome, preco, quantidadeEmStock, descricao } = req.body;

    if (!nome || preco == null || !descricao) {
      res.status(400).json({ error: "Campos obrigatórios: nome, preco, descricao" });
      return;
    }

    const counter = await Counter.findOneAndUpdate(
  { name: "productId" },
  { $inc: { value: 1 } },
  { new: true, upsert: true }
);

    const novoProduct = new Product({
      productId: counter.value,
      nome,
      preco,
      quantidadeEmStock: quantidadeEmStock || 0,
      descricao,
    });

    await novoProduct.save();
    res.status(201).json(novoProduct);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ productId: Number(id) });

    if (!product) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    const { nome, preco, quantidadeEmStock, descricao } = req.body;

    if (nome !== undefined) product.nome = nome;
    if (preco !== undefined) product.preco = preco;
    if (quantidadeEmStock !== undefined) product.quantidadeEmStock = quantidadeEmStock;
    if (descricao !== undefined) product.descricao = descricao;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const produtoDeletado = await Product.findOneAndDelete({
      productId: Number(id),
    });

    if (!produtoDeletado) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    res.status(200).json({ mensagem: "Produto apagado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar produto" });
  }
};

