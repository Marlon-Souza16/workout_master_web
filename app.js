const axios = require('axios');
const express = require('express');
const bodyParser = require("body-parser");
const _ = require('lodash');
const ejs = require('ejs');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');
const User = require('./models/Users');
const Workout = require('./models/Workout');
const bcrypt = require('bcrypt');
let currentUser;

sequelize.sync({ alter: true }).then(() => {
  console.log('Banco de dados sincronizado!');
});

const app = express();
app.use(express.json())
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

app.get("/home", function (req, res) {
  res.render("home", { currentUser });
});

app.get("/myRoutine", async function (req, res) {
  try {
    currentUser = await User.findOne({
      where: { email: 'marlondesouzajlle@hotmail.com' },
      include: {
        model: Workout,
        required: false
      }
    });

    if (currentUser) {
      const groupedExercises = _.groupBy(currentUser.Workouts, 'day');
      res.render("myroutine", { userLoggedIn: true, currentUser, groupedExercises });
    } else {
      res.render("myroutine", { userLoggedIn: false, currentUser: null, groupedExercises: {} });
    }
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    res.status(500).send('Erro ao buscar o usuário');
  }
});

app.post('/myRoutine/addExercise', async (req, res) => {
  const { day, name, muscleGroup, description, imageUrl, videoUrl } = req.body;

  try {
    const currentUser = await User.findOne({ where: { email: 'marlondesouzajlle@hotmail.com' } });

    if (currentUser) {
      const newExercise = await Workout.create({
        user_id: currentUser.id,
        day,
        name,
        muscle_group: muscleGroup,
        description,
        image_url: imageUrl,
        video_url: videoUrl
      });

      res.redirect('/myRoutine');
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao adicionar exercício:', error);
    res.status(500).send('Erro ao adicionar exercício');
  }
});

app.post('/myRoutine/deleteExercise', async (req, res) => {
  const { exerciseId } = req.body;

  try {
    const currentUser = await User.findOne({ where: { email: 'marlondesouzajlle@hotmail.com' } });

    if (currentUser) {
      const exerciseToDelete = await Workout.findOne({ where: { id: exerciseId, user_id: currentUser.id } });

      if (exerciseToDelete) {
        await exerciseToDelete.destroy();
        res.redirect('/myRoutine');
      } else {
        res.status(404).send('Exercício não encontrado');
      }
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao deletar exercício:', error);
    res.status(500).send('Erro ao deletar exercício');
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
    currentUser = await User.findOne({ where: { email: 'marlondesouzajlle@hotmail.com' } });
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

// Rota para processar o upload de imagem do perfil
app.post('/profile/uploadImage', upload.single('profile_image'), async (req, res) => {
  try {
    const currentUser = await User.findOne({ where: { email: 'marlondesouzajlle@hotmail.com' } });

    if (!currentUser) {
      return res.status(404).send('Usuário não encontrado');
    }

    if (req.file) {
      const profile_image = `/uploads/${req.file.filename}`;
      currentUser.profile_image = profile_image;
      await currentUser.save();
    }

    res.redirect('/profile');
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    res.status(500).send('Erro ao fazer upload da imagem');
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: hashedPassword, cpf, profile_image, has_workout_routine: false });
    res.redirect("/");
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).send("Erro ao registrar usuário");
  }
});

// Rota para processar o login do usuário
app.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.redirect('/profile');
      } else {
        res.status(401).send('<p>Senha incorreta. <a href="/reset-password">Clique aqui</a> para redefinir sua senha.</p>');
      }
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao processar o login:', error);
    res.status(500).send('Erro ao processar o login');
  }
});

// Rota para a página de redefinição de senha
app.get('/reset-password', (req, res) => {
  res.render('reset-password');
});

// Rota para processar a redefinição de senha
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.send('Senha redefinida com sucesso. <a href="/">Clique aqui</a> para fazer login.');
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    res.status(500).send('Erro ao redefinir a senha');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
