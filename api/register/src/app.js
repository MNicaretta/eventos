require('dotenv').config({ path: __dirname + '/util/.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const RegisterController = require('./RegisterController');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/api/register', RegisterController.register);

app.listen(3000, () => console.log('running on port 3000'));
