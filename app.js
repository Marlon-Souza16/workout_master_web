const axios = require('axios');
const express = require('express');
const bodyParser = require("body-parser");
const _ = require('lodash');

const ejs = require('ejs');

let entry = [];

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/home", function (req, res) {
    res.render("home");
});

app.get("/myRoutine", function (req, res) {

  const currentUser = {
    workoutRoutine: [
      { 
        day: 'Segunda', 
        exercises: [
          { 
            name: 'Supino', 
            muscleGroup: 'Peito', 
            description: 'Descrição do exercício de supino.',
            videoUrl: 'url_do_video'
          },
          { 
            name: 'Flexão', 
            muscleGroup: 'Peito', 
            description: 'Descrição do exercício de flexão.',
            videoUrl: 'url_do_video'
          }
        ]
      },
      { 
        day: 'Terça', 
        exercises: [
          { 
            name: 'Remada', 
            muscleGroup: 'Costas', 
            description: 'Descrição do exercício de remada.',
            videoUrl: 'url_do_video'
          },
          { 
            name: 'Barra fixa', 
            muscleGroup: 'Costas', 
            description: 'Descrição do exercício de barra fixa.',
            videoUrl: 'url_do_video'
          }
        ]
      }
    ]
  };
  
  const groupedExercises = {};
  currentUser.workoutRoutine.forEach(exercise => {
    if (!groupedExercises[exercise.day]) {
      groupedExercises[exercise.day] = [];
    }
    groupedExercises[exercise.day].push(exercise);
  });
  
  res.render("myroutine", { userLoggedIn: true, currentUser: currentUser, groupedExercises: groupedExercises }); 
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

app.get("/profile", function (req, res) {
  const currentUser = {
    image: '/images/foto_perfil.png', 
    name: 'Marlon de Souza',
    email: 'marlondesouzajlle@hotmail.com',
    cpf: '123.456.789-00', // cpf ficticio,
    hasWorkoutRoutine: true
  };
  
  res.render("profile", { currentUser: currentUser }); 
});

const PORT = process.env.PORT || 3000; 

app.listen(PORT, function() {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
