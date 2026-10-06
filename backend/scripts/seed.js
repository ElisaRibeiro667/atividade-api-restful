// Migra os dados de mock-data/bd.json para o MongoDB Atlas.
// ATENÇÃO: apaga o conteúdo atual das coleções alunos e cursos.
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Curso = require("../src/models/Curso");
const Aluno = require("../src/models/Aluno");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || "escola",
  });

  const bd = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../mock-data/bd.json"), "utf8")
  );

  await Aluno.deleteMany({});
  await Curso.deleteMany({});

  // guarda a correspondência id antigo (número) -> novo _id (ObjectId)
  const mapaCursos = {};
  for (const c of bd.cursos) {
    const doc = await Curso.create({ nomeDoCurso: c.nomeDoCurso });
    mapaCursos[c.id] = doc._id;
  }

  const alunos = bd.alunos.map((a) => ({
    nome: a.nome,
    apelido: a.apelido,
    idCurso: mapaCursos[a.idCurso],
    anoCurricular: a.anoCurricular,
  }));
  await Aluno.insertMany(alunos);

  console.log(`Migrados ${bd.cursos.length} cursos e ${alunos.length} alunos`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Erro na migração:", err.message);
  process.exit(1);
});
