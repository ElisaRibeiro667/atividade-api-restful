const mongoose = require("mongoose");

async function conectarBD() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI não está definida no .env");
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || "escola" });
  console.log("MongoDB Atlas ligado");
}

module.exports = conectarBD;
