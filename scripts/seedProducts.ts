// Script de seed para popular a coleção `products` a partir de
// `src/data/products.json`.
// Passos:
// 1. Lê a variável de ambiente `MONGO_URI` (via dotenv)
// 2. Conecta ao MongoDB
// 3. Lê o ficheiro `products.json` e para cada produto:
//    - incrementa o contador `productId` (Counter) de forma atómica
//    - cria e guarda o documento do produto
// 4. Desconecta
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { Product } from "../src/models/Product.js";
import { Counter } from "../src/models/Counter.js";
import dotenv from "dotenv";

dotenv.config();

const seedProducts = async () => {
  try {
    // Conectar ao MongoDB usando MONGO_URI do .env
    await mongoose.connect(process.env.MONGO_URI!);

    // Possíveis localizações do ficheiro de dados (apenas um aqui)
    const candidatePaths = [
      path.join(process.cwd(), "src", "data", "products.json"),
    ];

    // Escolhe o primeiro caminho existente
    const filePath = candidatePaths.find((p) => fs.existsSync(p));

    if (!filePath) {
      console.error(
        "Ficheiro data/products.json não encontrado. Procurei em:\n  - " +
          candidatePaths.join("\n  - ")
      );
      process.exit(1);
    }

    console.log(`A usar o file: ${filePath}`);

    // Ler e parsear os produtos do ficheiro JSON
    const data = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(data);

    // Inserir cada produto, incrementando o contador `productId`
    for (const product of products) {
      // Incrementa o contador `productId` de forma atómica
      const counter = await Counter.findOneAndUpdate(
        { name: "productId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      // Criar o documento do produto usando o productId gerado
      const newProduct = new Product({
        productId: counter.value,
        ...product,
      });

      await newProduct.save();

      console.log(`Inserido: ${product.nome} (productId: ${counter.value})`);
    }

    // Desconectar ao terminar
    await mongoose.disconnect();
  } catch (error) {
    console.error("Erro no seed:", error);
    process.exit(1);
  }
};

seedProducts();