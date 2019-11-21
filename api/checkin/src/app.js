require('dotenv').config({ path: __dirname + '/util/.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const CheckinController = require('./CheckinController');
const authenticate = require('./util/authenticate');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(authenticate);

app.put('/api/checkin/:eventId', CheckinController.checkin);

app.listen(3000, () => console.log('running on port 3000'));
