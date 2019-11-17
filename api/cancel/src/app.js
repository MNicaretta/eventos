require('dotenv').config({ path: __dirname + '/util/.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const CancelController = require('./CancelController');
const authenticate = require('./util/authenticate');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(authenticate);

app.get('/api/registrations', CancelController.getRegistrations);
app.post('/api/cancel', CancelController.cancel);

app.listen(3000, () => console.log('running on port 3000'));
