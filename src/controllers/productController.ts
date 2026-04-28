import type { Request, Response } from "express";
import { Product } from "../models/Product.js";
import { Counter } from "../models/Counter.js";
import { parseProductId } from "../utils/parseProductId.js";

/**
 * GET /products
 * Retorna a lista completa de produtos, ordenada por `productId`.
 * Respostas:
 *  - 200: array de produtos
 *  - 500: erro do servidor
 */
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

/**
 * GET /products/:id
 * Obtém um produto pelo seu `productId` (inteiro positivo).
 * Valida o `id` e retorna 400 em caso de formato inválido.
 * Respostas:
 *  - 200: objeto do produto
 *  - 400: ID inválido
 *  - 404: produto não encontrado
 *  - 500: erro do servidor
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseProductId(req.params.id);

    // Validação do parâmetro `id` (deve ser inteiro positivo)
    if (productId === null) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    // Procurar produto na BD pelo campo `productId`
    const product = await Product.findOne({ productId });

    if (!product) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao procurar produto" });
  }
};

/**
 * POST /products
 * Cria um novo produto. O `productId` é gerado automaticamente
 * através do documento `Counter` (campo `value` incrementado).
 * Valida os campos do corpo do pedido e retorna 400 se estiverem inválidos.
 * Respostas:
 *  - 201: produto criado
 *  - 400: campos inválidos
 *  - 500: erro do servidor / erro ao gerar ID
 */
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nome, preco, quantidadeEmStock, descricao } = req.body;

    // Validação mínima dos campos obrigatórios
    if (
      !nome || typeof nome !== "string" ||
      preco == null || typeof preco !== "number" ||
      !descricao || typeof descricao !== "string"
    ) {
      res.status(400).json({ error: "Campos inválidos" });
      return;
    }

    // Incrementar e obter o próximo productId de forma atómica
    const counter = await Counter.findOneAndUpdate(
      { name: "productId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    // Construir o documento do produto
    const novoProduct = new Product({
      productId: counter.value,
      nome,
      preco,
      quantidadeEmStock: Number(quantidadeEmStock) || 0,
      descricao,
    });

    // Se por algum motivo o counter não existir, tratar como erro
    if (!counter) {
      res.status(500).json({ error: "Erro ao gerar ID do produto" });
      return;
    }

    await novoProduct.save();
    res.status(201).json(novoProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};


/**
 * PUT /products/:id
 * Atualiza um produto existente. Valida o `id` e procura o documento;
 * aplica apenas os campos enviados no corpo do pedido.
 * Respostas:
 *  - 200: produto atualizado
 *  - 400: ID inválido
 *  - 404: produto não encontrado
 *  - 500: erro do servidor
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseProductId(req.params.id);

    if (productId === null) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    // Procurar o produto pelo `productId`
    const product = await Product.findOne({ productId});

    if (!product) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    // Atualizar apenas os campos presentes no corpo do pedido
    const { nome, preco, quantidadeEmStock, descricao } = req.body;

    if (nome !== undefined) product.nome = nome;
    if (preco !== undefined) product.preco = preco;
    if (quantidadeEmStock !== undefined) product.quantidadeEmStock = quantidadeEmStock;
    if (descricao !== undefined) product.descricao = descricao;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

/**
 * DELETE /products/:id
 * Apaga um produto com o `productId` fornecido.
 * Respostas:
 *  - 200: confirmação de eliminação
 *  - 400: ID inválido
 *  - 404: produto não encontrado
 *  - 500: erro do servidor
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseProductId(req.params.id);

    if (productId === null) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    // Apagar o documento correspondente ao `productId`
    const produtoDeletado = await Product.findOneAndDelete({productId});

    if (!produtoDeletado) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    res.status(200).json({ mensagem: "Produto apagado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao apagar produto" });
  }
};

