const mongoose = require("mongoose");

const alunoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    apelido: { type: String, required: true, trim: true },
    idCurso: { type: mongoose.Schema.Types.ObjectId, ref: "Curso", required: true },
    anoCurricular: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Aluno", alunoSchema);
