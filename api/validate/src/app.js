require('dotenv').config({ path: __dirname + '/util/.env' });

const express = require('express');
const cors = require('cors');
const ValidateController = require('./ValidateController');

const app = express();

app.use(cors());

app.get('/api/validate', ValidateController.validate);

app.listen(3000, () => console.log('running on port 3000'));
