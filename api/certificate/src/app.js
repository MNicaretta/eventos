require('dotenv').config({ path: __dirname + '/util/.env' });

const express = require('express');
const cors = require('cors');
const CertificateController = require('./CertificateController');
const authenticate = require('./util/authenticate');

const app = express();

app.use(cors());
app.use(authenticate);

app.get('/api/certificate/:eventId', CertificateController.certificate);

app.listen(3000, () => console.log('running on port 3000'));
