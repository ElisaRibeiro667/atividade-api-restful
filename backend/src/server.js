require("dotenv").config();
const app = require("./app");
const conectarBD = require("./config/db");

const PORT = process.env.PORT || 3001;

conectarBD()
  .then(() => app.listen(PORT, () => console.log(`API em http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("Falha ao ligar à base de dados:", err.message);
    process.exit(1);
  });
