const Aluno = require("../models/Aluno");
const Curso = require("../models/Curso");

const CAMPOS = ["nome", "apelido", "idCurso", "anoCurricular"];

function extrairCampos(body) {
  const dados = {};
  for (const campo of CAMPOS) {
    if (body[campo] !== undefined) dados[campo] = body[campo];
  }
  return dados;
}

async function cursoExiste(idCurso) {
  if (idCurso === undefined) return true;
  try {
    return !!(await Curso.exists({ _id: idCurso }));
  } catch {
    return false;
  }
}

exports.listar = async (_req, res, next) => {
  try {
    res.json(await Aluno.find());
  } catch (e) { next(e); }
};

exports.obter = async (req, res, next) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });
    res.json(aluno);
  } catch (e) { next(e); }
};

exports.criar = async (req, res, next) => {
  try {
    const dados = extrairCampos(req.body);
    if (!(await cursoExiste(dados.idCurso))) {
      return res.status(400).json({ erro: "idCurso inválido ou inexistente" });
    }
    const aluno = await Aluno.create(dados);
    res.status(201).json(aluno);
  } catch (e) { next(e); }
};

// PUT substitui o aluno; PATCH atualiza só os campos enviados
function atualizar(req, res, next) {
  return (async () => {
    try {
      const dados = extrairCampos(req.body);
      if (!(await cursoExiste(dados.idCurso))) {
        return res.status(400).json({ erro: "idCurso inválido ou inexistente" });
      }
      const aluno = await Aluno.findByIdAndUpdate(req.params.id, dados, {
        new: true,
        runValidators: true,
      });
      if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });
      res.json(aluno);
    } catch (e) { next(e); }
  })();
}
exports.substituir = atualizar;
exports.atualizar = atualizar;

exports.apagar = async (req, res, next) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });
    res.json({});
  } catch (e) { next(e); }
};
