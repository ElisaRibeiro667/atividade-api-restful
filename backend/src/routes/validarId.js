const mongoose = require("mongoose");

// Usado com router.param("id", validarId)
module.exports = (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }
  next();
};
