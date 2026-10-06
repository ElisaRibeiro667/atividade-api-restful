const Curso = require("../models/Curso");
const Aluno = require("../models/Aluno");

exports.listar = async (_req, res, next) => {
  try {
    res.json(await Curso.find());
  } catch (e) { next(e); }
};

exports.obter = async (req, res, next) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ erro: "Curso não encontrado" });
    res.json(curso);
  } catch (e) { next(e); }
};

exports.criar = async (req, res, next) => {
  try {
    const curso = await Curso.create({ nomeDoCurso: req.body.nomeDoCurso });
    res.status(201).json(curso);
  } catch (e) { next(e); }
};

exports.atualizar = async (req, res, next) => {
  try {
    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      { nomeDoCurso: req.body.nomeDoCurso },
      { new: true, runValidators: true }
    );
    if (!curso) return res.status(404).json({ erro: "Curso não encontrado" });
    res.json(curso);
  } catch (e) { next(e); }
};

exports.apagar = async (req, res, next) => {
  try {
    if (await Aluno.exists({ idCurso: req.params.id })) {
      return res.status(409).json({ erro: "Não é possível apagar: existem alunos neste curso" });
    }
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) return res.status(404).json({ erro: "Curso não encontrado" });
    res.json({});
  } catch (e) { next(e); }
};
