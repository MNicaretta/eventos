require('dotenv').config({ path: __dirname + '/util/.env' });

const express = require('express');
const bodyParser = require('body-parser');
const LoginController = require('./LoginController');

const app = express();

app.use(bodyParser.json());

app.post('/api/login', LoginController.login);
app.post('/api/authenticate', LoginController.authenticate);

app.listen(3000, () => console.log('running on port 3000'));
