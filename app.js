const axios = require('axios');
const express = require('express');
const bodyParser = require("body-parser");
const _ = require('lodash')

const ejs = require('ejs');

let entry = [];

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", function (req, res) {
    res.render("home");
});

app.get("./help.ejs", function (req, res) {
  res.render("help");
});



const PORT = process.env.PORT || 3000; // Defina a porta desejada ou use 3000 como padrão

app.listen(PORT, function() {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
