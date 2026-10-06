// Documentação OpenAPI 3.0 da API (servida em /api-docs)
const idParam = {
  name: "id",
  in: "path",
  required: true,
  description: "ID do documento (ObjectId do MongoDB)",
  schema: { type: "string", example: "66f1a2b3c4d5e6f7a8b9c0d1" },
};

const erro = (descricao) => ({
  description: descricao,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Erro" } } },
});

const json = (ref) => ({ "application/json": { schema: { $ref: ref } } });
const jsonLista = (ref) => ({
  "application/json": { schema: { type: "array", items: { $ref: ref } } },
});

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "API de Alunos e Cursos",
    version: "1.0.0",
    description: "API RESTful (Node.js + Express + MongoDB Atlas) para gerir alunos e cursos.",
  },
  servers: [{ url: "/", description: "Servidor atual" }],
  tags: [{ name: "Alunos" }, { name: "Cursos" }],
  paths: {
    "/alunos": {
      get: {
        tags: ["Alunos"],
        summary: "Listar todos os alunos",
        responses: { 200: { description: "Lista de alunos", content: jsonLista("#/components/schemas/Aluno") } },
      },
      post: {
        tags: ["Alunos"],
        summary: "Criar um aluno",
        requestBody: { required: true, content: json("#/components/schemas/AlunoInput") },
        responses: {
          201: { description: "Aluno criado", content: json("#/components/schemas/Aluno") },
          400: erro("Dados inválidos ou curso inexistente"),
        },
      },
    },
    "/alunos/{id}": {
      get: {
        tags: ["Alunos"],
        summary: "Obter um aluno por ID",
        parameters: [idParam],
        responses: {
          200: { description: "Aluno encontrado", content: json("#/components/schemas/Aluno") },
          400: erro("ID inválido"),
          404: erro("Aluno não encontrado"),
        },
      },
      put: {
        tags: ["Alunos"],
        summary: "Substituir/atualizar um aluno",
        parameters: [idParam],
        requestBody: { required: true, content: json("#/components/schemas/AlunoInput") },
        responses: {
          200: { description: "Aluno atualizado", content: json("#/components/schemas/Aluno") },
          400: erro("Dados ou ID inválidos"),
          404: erro("Aluno não encontrado"),
        },
      },
      patch: {
        tags: ["Alunos"],
        summary: "Atualizar parcialmente um aluno",
        parameters: [idParam],
        requestBody: { required: true, content: json("#/components/schemas/AlunoInput") },
        responses: {
          200: { description: "Aluno atualizado", content: json("#/components/schemas/Aluno") },
          400: erro("Dados ou ID inválidos"),
          404: erro("Aluno não encontrado"),
        },
      },
      delete: {
        tags: ["Alunos"],
        summary: "Apagar um aluno",
        parameters: [idParam],
        responses: {
          200: { description: "Aluno apagado" },
          400: erro("ID inválido"),
          404: erro("Aluno não encontrado"),
        },
      },
    },
    "/cursos": {
      get: {
        tags: ["Cursos"],
        summary: "Listar todos os cursos",
        responses: { 200: { description: "Lista de cursos", content: jsonLista("#/components/schemas/Curso") } },
      },
      post: {
        tags: ["Cursos"],
        summary: "Criar um curso",
        requestBody: { required: true, content: json("#/components/schemas/CursoInput") },
        responses: {
          201: { description: "Curso criado", content: json("#/components/schemas/Curso") },
          400: erro("Dados inválidos"),
        },
      },
    },
    "/cursos/{id}": {
      get: {
        tags: ["Cursos"],
        summary: "Obter um curso por ID",
        parameters: [idParam],
        responses: {
          200: { description: "Curso encontrado", content: json("#/components/schemas/Curso") },
          400: erro("ID inválido"),
          404: erro("Curso não encontrado"),
        },
      },
      put: {
        tags: ["Cursos"],
        summary: "Atualizar um curso",
        parameters: [idParam],
        requestBody: { required: true, content: json("#/components/schemas/CursoInput") },
        responses: {
          200: { description: "Curso atualizado", content: json("#/components/schemas/Curso") },
          400: erro("Dados ou ID inválidos"),
          404: erro("Curso não encontrado"),
        },
      },
      delete: {
        tags: ["Cursos"],
        summary: "Apagar um curso",
        parameters: [idParam],
        responses: {
          200: { description: "Curso apagado" },
          400: erro("ID inválido"),
          404: erro("Curso não encontrado"),
          409: erro("Existem alunos associados ao curso"),
        },
      },
    },
  },
  components: {
    schemas: {
      Aluno: {
        type: "object",
        properties: {
          id: { type: "string", example: "66f1a2b3c4d5e6f7a8b9c0d1" },
          nome: { type: "string", example: "Ana" },
          apelido: { type: "string", example: "Silva" },
          idCurso: { type: "string", description: "ID do curso", example: "66f1a2b3c4d5e6f7a8b9c0d2" },
          anoCurricular: { type: "integer", minimum: 1, maximum: 5, example: 2 },
        },
      },
      AlunoInput: {
        type: "object",
        required: ["nome", "apelido", "idCurso", "anoCurricular"],
        properties: {
          nome: { type: "string", example: "Ana" },
          apelido: { type: "string", example: "Silva" },
          idCurso: { type: "string", description: "ID de um curso existente", example: "66f1a2b3c4d5e6f7a8b9c0d2" },
          anoCurricular: { type: "integer", minimum: 1, maximum: 5, example: 2 },
        },
      },
      Curso: {
        type: "object",
        properties: {
          id: { type: "string", example: "66f1a2b3c4d5e6f7a8b9c0d2" },
          nomeDoCurso: { type: "string", example: "Engenharia Informática" },
        },
      },
      CursoInput: {
        type: "object",
        required: ["nomeDoCurso"],
        properties: { nomeDoCurso: { type: "string", example: "Engenharia Informática" } },
      },
      Erro: {
        type: "object",
        properties: { erro: { type: "string", example: "Aluno não encontrado" } },
      },
    },
  },
};
