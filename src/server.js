require("dotenv").config()
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const app = express();

// Configuração do CORS somente para https://chatgpt.com/
const corsOptions = {
  origin: ["http://127.0.0.1:5500","http://localhost:3000"],
  methods: "GET,POST",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Configuração do multer para armazenamento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Diretório onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rota para upload de imagens e vídeos
app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.json({ 
      message: "Upload feito com sucesso!", 
      fileUrl: `uploads/${req.file.filename}` 
    });
  } else {
    res.status(400).json({ error: "Falha no upload!" });
  }
});

// Configuração da rota estática para servir arquivos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Inicialização do servidor
const PORT =8000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
