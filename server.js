const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');

app.use(express.static(path.join(__dirname, 'public')));

//set up Handlebars.js as your app's template engine of choice:
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const routes = require('./controllers/');
