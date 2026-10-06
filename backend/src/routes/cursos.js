const router = require("express").Router();
const c = require("../controllers/cursosController");

router.param("id", require("./validarId"));

router.get("/", c.listar);
router.post("/", c.criar);
router.get("/:id", c.obter);
router.put("/:id", c.atualizar);
router.delete("/:id", c.apagar);

module.exports = router;
