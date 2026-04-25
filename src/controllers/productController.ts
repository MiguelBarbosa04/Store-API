import type { Request, Response } from "express";
import { Product } from "../models/Product.js";
import type { IProduct } from "../types/IProduct.js";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

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

    if (!nome || !preco || !descricao) {
      res.status(400).json({ error: "Campos obrigatórios: nome, preco, descricao" });
      return;
    }

    const novoProduct = new Product({
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

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome, preco, quantidadeEmStock, descricao } = req.body;

    const produtoAtualizado = await Product.findByIdAndUpdate(
      id,
      { nome, preco, quantidadeEmStock, descricao },
      { new: true, runValidators: true }
    );

    if (!produtoAtualizado) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const produtoDeletado = await Product.findByIdAndDelete(id);

    if (!produtoDeletado) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    res.status(200).json({ mensagem: "Produto apagado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar produto" });
  }
};
