import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const testConnection = async () => {
  try {
    console.log("A tentar conectar ao MongoDB...");
    console.log(`URI: ${process.env.MONGO_URI}`);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Conectado com sucesso!");

    // Fazer um ping
    const result = await mongoose.connection.db.admin().ping();
    console.log("Ping executado:", result);

    // Listar dbs
    const databases = await mongoose.connection.db.admin().listDatabases();
    console.log("Dbs disponíveis:", databases.databases.map(db => db.name));

    // Listar coleções na db atual
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Coleções na db 'Store':", collections.map(col => col.name));

    await mongoose.disconnect();
    console.log("Desconectado com sucesso!");

  } catch (error) {
    console.error("Erro:", error.message);
    process.exit(1);
  }
};

testConnection();
