const express = require("express");
const fs = require("fs");
const https = require("https");
const { Pool, Client } = require("pg");
require("dotenv").config();
const app = express();
app.use(express.json());
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  connectionTimeoutMillis: 5000, // Timeout for establishing a connection
});

const cors = require("cors");
app.use(cors());
app.get("/alunos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alunos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/alunos", async (req, res) => {
  const { name, email, phone, grade } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO alunos (name, email, phone, grade) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, grade]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, grade } = req.body;
  try {
    const result = await pool.query(
      "UPDATE alunos SET name=$1, email=$2, phone=$3, grade=$4 WHERE id=$5 RETURNING *",
      [name, email, phone, grade, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM alunos WHERE id=$1", [id]);
    res.json({ message: "Aluno removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const certPath = "/opt/ssl/certificado.crt";
const keyPath = "/opt/ssl/certificado.key";
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  https.createServer(options, app).listen(3000, () => {
    console.log("Servidor HTTPS rodando na porta 3000");
  });
} else {
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 sem HTTPS.");
  });
}
