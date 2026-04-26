export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "storeapi",
    version: "1.0.0",
    description: "API para gestao de produtos",
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/health": {
      get: {
        summary: "Healthcheck da API",
        responses: {
          "200": { description: "API disponivel" },
        },
      },
    },
    "/api/products": {
      get: {
        summary: "Listar todos os produtos",
        responses: {
          "200": { description: "Lista de produtos" },
        },
      },
      post: {
        summary: "Criar novo produto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nome", "preco", "descricao"],
                properties: {
                  nome: { type: "string"},
                  preco: { type: "number"},
                  quantidadeEmStock: { type: "number"},
                  descricao: { type: "string"},
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Produto criado" },
          "400": { description: "Campos obrigatorios em falta" },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        summary: "Obter produto por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Produto encontrado" },
          "404": { description: "Produto nao encontrado" },
        },
      },
      put: {
        summary: "Atualizar produto por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  preco: { type: "number" },
                  quantidadeEmStock: { type: "number" },
                  descricao: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Produto atualizado" },
          "404": { description: "Produto nao encontrado" },
        },
      },
      delete: {
        summary: "Apagar produto por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Produto apagado" },
          "404": { description: "Produto nao encontrado" },
        },
      },
    },
  },
} as const;
