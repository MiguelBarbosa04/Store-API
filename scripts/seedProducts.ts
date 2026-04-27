import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { Product } from "../src/models/Product.js";
import { Counter } from "../src/models/Counter.js";
import dotenv from "dotenv";

dotenv.config();

const seedProducts = async () => {
  try {
     await mongoose.connect(process.env.MONGO_URI!);

    const candidatePaths = [
      path.join(process.cwd(), "src", "data", "products.json"),
    ];

    const filePath = candidatePaths.find((p) => fs.existsSync(p));

    if (!filePath) {
      console.error(
        "Ficheiro data/products.json não encontrado. Procurei em:\n  - " +
          candidatePaths.join("\n  - ")
      );
      process.exit(1);
    }

    console.log(`A usar o file: ${filePath}`);

    const data = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(data);

    for (const product of products) {    

      const counter = await Counter.findOneAndUpdate(
        { name: "productId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      const newProduct = new Product({
        productId: counter.value,
        ...product
      });

      await newProduct.save();

      console.log(`Inserido: ${product.nome} (productId: ${counter.value})`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Erro no seed:", error);
    process.exit(1);
  }
};

seedProducts();