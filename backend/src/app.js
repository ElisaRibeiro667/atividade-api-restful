const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensagem: "API de Alunos a funcionar", rotas: ["/alunos", "/cursos"] });
});
app.use("/alunos", require("./routes/alunos"));
app.use("/cursos", require("./routes/cursos"));

app.use((_req, res) => res.status(404).json({ erro: "Rota não encontrada" }));

// Tratamento central de erros
app.use((err, _req, res, _next) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ erro: err.message });
  }
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

module.exports = app;
