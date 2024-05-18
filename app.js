const axios = require('axios');
const express = require('express');
const bodyParser = require("body-parser");
const _ = require('lodash');
const ejs = require('ejs');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Adicionado para verificar a existência da pasta
const sequelize = require('./config/database');
const User = require('./models/Users');
const Workout = require('./models/Workout');

sequelize.sync({ force: false }).then(() => {
  console.log('Banco de dados sincronizado!');
});

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Verifica se a pasta uploads existe, caso contrário, cria
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

let entry = [];

app.get("/home", function (req, res) {
    res.render("home");
});

app.get("/myRoutine", async function (req, res) {
  try {
    const currentUser = await User.findOne({ where: { email: 'marlondesouzajlle@hotmail.com' }, include: Workout });
    if (currentUser) {
      const groupedExercises = _.groupBy(currentUser.Workout, 'day');
      res.render("myroutine", { userLoggedIn: true, currentUser, groupedExercises });
    } else {
      res.render("myroutine", { userLoggedIn: false, currentUser: null, groupedExercises: {} });
    }
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    res.status(500).send('Erro ao buscar o usuário');
  }
});

app.get("/", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/help", function (req, res) {
  res.render("help");
});

app.get("/profile", async function (req, res) {
  try {
    const currentUser = await User.findOne({ where: { email: 'marlondesouzajlle@hotmail.com' } });
    if (currentUser) {
      res.render("profile", { currentUser });
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    res.status(500).send('Erro ao buscar o usuário');
  }
});

// Rota para processar a pergunta do usuário
app.post('/processar-resposta', async (req, res) => {
  const userInput = req.body.userInput;
  const api_key = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userInput }],
    }, {
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json'
      }
    });

    const botResponse = response.data.choices[0].message.content;

    res.send(`<div><strong>Você:</strong> ${userInput}</div><div><strong>Bot:</strong> ${botResponse}</div><a href="/help">Voltar</a>`);

  } catch (error) {
    console.error('Erro ao chamar a API da OpenAI:', error);
    res.send('Houve um erro ao processar sua pergunta. Por favor, tente novamente.');
  }
});

// Rota para registrar novos usuários
app.post("/register", upload.single('profile_image'), async (req, res) => {
  const { name, email, password, cpf } = req.body;
  const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send("Usuário já cadastrado");
    }

    const newUser = await User.create({ name, email, password, cpf, profile_image, has_workout_routine: false });
    res.redirect("/login");
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).send("Erro ao registrar usuário");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
