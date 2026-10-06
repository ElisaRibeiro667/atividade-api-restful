const mongoose = require("mongoose");

const cursoSchema = new mongoose.Schema(
  { nomeDoCurso: { type: String, required: true, trim: true } },
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

module.exports = mongoose.model("Curso", cursoSchema);
